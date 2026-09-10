const express = require('express');
const router = express.Router();

const DEFAULT_CITY = 'Ranchi';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const getCompassDirection = (degrees = 0) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  const label = directions[index];
  return `${label} ${Math.round(degrees)}°`;
};

const getRainChance = (items = []) => {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + (item.pop || 0), 0);
  return Math.min(100, Math.round((total / items.length) * 100));
};

const buildWeatherData = (current, forecast, cityName) => {
  const upcomingItems = forecast?.list || [];
  const rainChance = getRainChance(upcomingItems);
  const rainVolume = upcomingItems.reduce((sum, item) => {
    const rainAmount = item.rain?.['3h'] || 0;
    return sum + rainAmount;
  }, 0);

  const hourly = upcomingItems.slice(0, 6).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
    rainProb: Math.min(100, Math.round((item.pop || 0) * 100)),
    condition: item.weather?.[0]?.main || 'Cloudy',
    icon: item.weather?.[0]?.main || 'Cloud'
  }));

  const uniqueDays = [];
  const seenDates = new Set();

  upcomingItems.forEach(item => {
    const dateKey = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (seenDates.has(dateKey)) return;
    seenDates.add(dateKey);

    const itemsForDay = upcomingItems.filter(entry => {
      const entryDateKey = new Date(entry.dt * 1000).toISOString().split('T')[0];
      return entryDateKey === dateKey;
    });

    const dailyMax = Math.max(...itemsForDay.map(it => it.main.temp_max ?? it.main.temp));
    const dailyMin = Math.min(...itemsForDay.map(it => it.main.temp_min ?? it.main.temp));
    const rainfall = itemsForDay.reduce((sum, entry) => sum + (entry.rain?.['3h'] || 0), 0);

    uniqueDays.push({
      date: dateKey,
      dayName: new Date(dateKey).toLocaleDateString('en-US', { weekday: 'short' }),
      tempMax: Math.round(dailyMax),
      tempMin: Math.round(dailyMin),
      humidity: Math.round(itemsForDay.reduce((sum, entry) => sum + entry.main.humidity, 0) / itemsForDay.length),
      rainProbability: getRainChance(itemsForDay),
      rainfallMm: Number(rainfall.toFixed(1)),
      windSpeedKmH: Math.round((itemsForDay.reduce((sum, entry) => sum + (entry.wind?.speed || 0), 0) / itemsForDay.length) * 3.6),
      uvIndex: Math.min(11, Math.max(1, Math.round((Math.max(...itemsForDay.map(it => it.main.temp)) - 15) / 3 + 4))),
      condition: itemsForDay[0]?.weather?.[0]?.main || 'Cloudy',
      icon: itemsForDay[0]?.weather?.[0]?.main || 'Cloud',
      advisoryText: rainfall > 10 ? 'Heavy rain likely; postpone spray applications.' : 'Weather conditions are mostly stable for fieldwork.'
    });
  });

  const humidity = current.main?.humidity ?? 60;
  const spraySuitability = rainChance >= 60 ? 'UNSUITABLE' : rainChance >= 35 ? 'CAUTION' : 'OPTIMAL';
  const irrigationRecommendation = rainChance >= 65 ? 'SKIP_RAIN_PREDICTED' : (current.main?.temp ?? 28) > 35 ? 'REDUCE' : 'PROCEED';

  return {
    location: `${cityName || current.name}, ${current.sys?.country || 'IN'}`,
    currentTemp: Math.round(current.main?.temp ?? 0),
    feelsLike: Math.round(current.main?.feels_like ?? 0),
    humidity,
    rainProbability: rainChance,
    rainfall24hMm: Number(rainVolume.toFixed(1)),
    windSpeedKmH: Math.round((current.wind?.speed || 0) * 3.6),
    windDirection: getCompassDirection(current.wind?.deg || 0),
    uvIndex: Math.min(11, Math.max(1, Math.round((current.main?.temp ?? 28) / 6 + 2))),
    soilMoisturePercent: Math.min(100, Math.max(0, Math.round((humidity + rainChance) / 2))),
    condition: current.weather?.[0]?.description || 'Partly cloudy',
    spraySuitability,
    irrigationRecommendation,
    hourly,
    forecast: uniqueDays.slice(0, 5),
    lastUpdated: new Date().toISOString()
  };
};


router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  let rawCity = (req.query.city || DEFAULT_CITY).toString();
  // If city contains comma like "Ranchi, Jharkhand", extract primary city
  const city = rawCity.split(',')[0].trim();

  if (!WEATHER_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'WEATHER_API_KEY is missing. Add it to backend/.env'
    });
  }

  try {
    let currentUrl;
    let forecastUrl;
    let locationLabel = city;

    if (lat && lon && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon))) {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${WEATHER_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${WEATHER_API_KEY}&units=metric&cnt=40`;
    } else {
      currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&cnt=40`;
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      const errorText = await Promise.all([
        currentResponse.text(),
        forecastResponse.text()
      ]).catch(() => ['Weather API error']);
      throw new Error(`Weather API request failed: ${errorText.join(' | ')}`);
    }

    const [current, forecast] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    const weather = buildWeatherData(current, forecast, current.name || locationLabel);

    return res.json({ success: true, weather });
  } catch (error) {
    console.error('Weather fetch failed:', error.message);
    return res.status(502).json({
      success: false,
      error: 'Unable to fetch live weather data.',
      details: error.message
    });
  }
});

module.exports = router;
