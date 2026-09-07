import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Farm,
  Crop,
  Activity,
  Reminder,
  WeatherData,
  ExpenseItem,
  ActiveTab,
  ActivityStatus,
  CropStatus,
  SoilType,
  UserRole,
  AuthMode,
  ProductListing,
  Order,
  CartItem,
  DeliveryStatus,
  OrderAddress,
  OrderItem,
  OrderReview
} from '../types';
import {
  INITIAL_USER,
  DEFAULT_REGISTERED_ACCOUNTS,
  INITIAL_FARMS,
  INITIAL_CROPS,
  INITIAL_ACTIVITIES,
  INITIAL_WEATHER,
  INITIAL_EXPENSES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS
} from '../data/mockData';
import { evaluateDeterministicRules } from '../utils/ruleEngine';
import confetti from 'canvas-confetti';

interface FarmContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User;
  isAuthenticated: boolean;
  registeredAccounts: User[];
  updateUserProfile: (data: Partial<User>) => void;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: UserRole;
    roleTitle?: string;
    region?: string;
    farmSizeAcre?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoUser: (userId: string) => void;
  switchAccount: (userId: string) => void;
  removeAccount: (userId: string) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  resetPasswordWithOtp: (emailOrPhone: string, newPass: string) => { success: boolean; error?: string };
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthMode;
  setAuthModalMode: (mode: AuthMode) => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  farms: Farm[];
  selectedFarmId: string;
  setSelectedFarmId: (id: string) => void;
  selectedFarm: Farm | undefined;
  addFarm: (farm: Omit<Farm, 'id' | 'userId' | 'createdAt'>) => void;
  updateFarm: (id: string, farm: Partial<Farm>) => void;
  deleteFarm: (id: string) => void;
  crops: Crop[];
  addCrop: (crop: Omit<Crop, 'id' | 'createdAt'>) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivityStatus: (id: string, status: ActivityStatus) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  weather: WeatherData;
  setWeatherScenario: (scenario: 'rainy' | 'sunny' | 'heatwave' | 'windy' | 'monsoon') => void;
  reminders: Reminder[];
  unreadRemindersCount: number;
  markReminderAsRead: (id: string) => void;
  markAllRemindersAsRead: () => void;
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  resetToSampleData: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAddCropModalOpen: boolean;
  setIsAddCropModalOpen: (open: boolean) => void;
  isAddFarmModalOpen: boolean;
  setIsAddFarmModalOpen: (open: boolean) => void;
  isAddActivityModalOpen: boolean;
  setIsAddActivityModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  preselectedCropForModal?: string;
  setPreselectedCropForModal: (name: string | undefined) => void;

  // Marketplace & Farmer Harvests
  products: ProductListing[];
  addProductListing: (data: Omit<ProductListing, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProductListing: (id: string, data: Partial<ProductListing>) => void;
  deleteProductListing: (id: string) => void;
  toggleStockStatus: (id: string) => void;
  editingProduct: ProductListing | null;
  setEditingProduct: (prod: ProductListing | null) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: ProductListing, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders & Fulfillment
  orders: Order[];
  createOrder: (orderData: {
    customerAddress: OrderAddress;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
    items: OrderItem[];
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: DeliveryStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Customer Feedback & Farmer Replies
  addOrderReview: (orderId: string, review: Omit<OrderReview, 'id' | 'createdAt'>) => void;
  replyToOrderReview: (orderId: string, replyText: string) => void;

  // Modals
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutDirectProduct: ProductListing | null;
  setCheckoutDirectProduct: (prod: ProductListing | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  feedbackOrderId: string | null;
  setFeedbackOrderId: (id: string | null) => void;
  isPostHarvestModalOpen: boolean;
  setIsPostHarvestModalOpen: (open: boolean) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'agropulse_app_';

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or fallback to defaults
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return 'landing';
  });

  const [registeredAccounts, setRegisteredAccounts] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}registered_accounts`);
    if (!saved) return DEFAULT_REGISTERED_ACCOUNTS;
    try {
      const parsed: User[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(u => u.id));
      const missingDefaults = DEFAULT_REGISTERED_ACCOUNTS.filter(d => !existingIds.has(d.id));
      return missingDefaults.length > 0 ? [...parsed, ...missingDefaults] : parsed;
    } catch {
      return DEFAULT_REGISTERED_ACCOUNTS;
    }
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}user`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.region?.includes('Indore') || parsed.region?.includes('Madhya Pradesh')) {
          localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}user`);
          return INITIAL_USER;
        }
        return parsed;
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}auth_status`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('LOGIN');

  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}farms`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacyIndore = Array.isArray(parsed) && parsed.some((f: Farm) =>
          f.location?.includes('Indore') || f.location?.includes('Narmada') || f.location?.includes('Malwa')
        );
        if (hasLegacyIndore) {
          localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}farms`);
          return INITIAL_FARMS;
        }
        return parsed;
      } catch {
        return INITIAL_FARMS;
      }
    }
    return INITIAL_FARMS;
  });

  const [selectedFarmId, setSelectedFarmId] = useState<string>(() => {
    return farms[0]?.id || 'farm_01';
  });

  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}crops`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacyCotton = Array.isArray(parsed) && parsed.some((c: Crop) =>
          c.cropName?.toLowerCase().includes('cotton')
        );
        if (hasLegacyCotton) {
          localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}crops`);
          return INITIAL_CROPS;
        }
        return parsed;
      } catch {
        return INITIAL_CROPS;
      }
    }
    return INITIAL_CROPS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [weather, setWeather] = useState<WeatherData>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}weather`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.location?.includes('Indore') || parsed.location?.includes('Delhi') || parsed.location?.includes('M.P.')) {
          localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}weather`);
          return INITIAL_WEATHER;
        }
        return parsed;
      } catch {
        return INITIAL_WEATHER;
      }
    }
    return INITIAL_WEATHER;
  });

  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const currentFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
        const cityCandidate = currentFarm?.location
          ? currentFarm.location.split(/[,(]/)[0].replace(/District/i, '').trim()
          : 'Ranchi';
        const targetCity = cityCandidate || 'Ranchi';
        const res = await fetch(`http://localhost:5000/api/weather?city=${encodeURIComponent(targetCity)}`);
        if (!res.ok) throw new Error('Weather request failed');
        const data = await res.json();
        if (data?.success && data?.weather) {
          setWeather(data.weather);
        }
      } catch {
        setWeather(INITIAL_WEATHER);
      }
    };

    fetchLiveWeather();
  }, [selectedFarmId, farms]);

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [readReminderIds, setReadReminderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}read_reminders`);
    return saved ? JSON.parse(saved) : [];
  });

  // Products / Harvest Listings State
  const [products, setProducts] = useState<ProductListing[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutDirectProduct, setCheckoutDirectProduct] = useState<ProductListing | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductListing | null>(null);
  const [isPostHarvestModalOpen, setIsPostHarvestModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [isAddFarmModalOpen, setIsAddFarmModalOpen] = useState(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [preselectedCropForModal, setPreselectedCropForModal] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}registered_accounts`, JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}auth_status`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}farms`, JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}crops`, JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}activities`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}weather`, JSON.stringify(weather));
  }, [weather]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}read_reminders`, JSON.stringify(readReminderIds));
  }, [readReminderIds]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const openAuthModal = (mode: AuthMode = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Authentication Handlers
  const login = async (emailOrPhone: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');
    const foundUser = registeredAccounts.find(u => {
      if (u.email.toLowerCase() === cleanInput) return true;
      if (cleanDigits.length >= 6) {
        const uDigits = u.phone.replace(/\D/g, '');
        return uDigits.endsWith(cleanDigits) || uDigits === cleanDigits;
      }
      return false;
    });

    if (!foundUser) {
      return { success: false, error: 'No account found matching this email or phone. Please sign up.' };
    }

    if (password && foundUser.password && foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }

    const updatedUser: User = {
      ...foundUser,
      lastLoginAt: new Date().toLocaleString()
    };

    setUser(updatedUser);
    setIsAuthenticated(true);
    setRegisteredAccounts(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setIsAuthModalOpen(false);

    if (updatedUser.role === 'CUSTOMER') {
      setActiveTab('marketplace');
    } else if (updatedUser.role === 'DEALER') {
      setActiveTab('orders');
    } else {
      setActiveTab('dashboard');
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // benign
    }

    showToast(`Welcome back, ${updatedUser.name}! Signed in as ${updatedUser.roleTitle || 'Farmer'}.`);
    return { success: true };
  };

  const signup = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role?: UserRole;
    roleTitle?: string;
    region?: string;
    farmSizeAcre?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = registeredAccounts.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const roleNameMap: Record<UserRole, string> = {
      FARM_OWNER: 'Lead Cultivator & Farm Owner',
      AGRONOMIST: 'Senior Agronomist & Crop Consultant',
      FIELD_MANAGER: 'Field Operations & Machinery Manager',
      RESEARCHER: 'Agricultural Scientist / Researcher',
      TENANT_FARMER: 'Cultivator & Tenant Producer',
      CUSTOMER: 'Direct Agro Consumer & Buyer',
      DEALER: 'Authorized Input & Equipment Dealer'
    };

    const assignedRole = data.role || 'FARM_OWNER';
    const assignedRoleTitle = data.roleTitle || roleNameMap[assignedRole];

    const getRoleAvatarBg = (r: UserRole) => {
      switch (r) {
        case 'CUSTOMER': return 'bg-lime-700';
        case 'DEALER': return 'bg-amber-800';
        case 'AGRONOMIST': return 'bg-teal-700';
        case 'FIELD_MANAGER': return 'bg-amber-700';
        default: return 'bg-emerald-700';
      }
    };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      password: data.password || 'Password@123',
      role: assignedRole,
      roleTitle: assignedRoleTitle,
      region: data.region || 'Ranchi, Jharkhand',
      preferredLanguage: 'English',
      avatarBg: getRoleAvatarBg(assignedRole),
      farmSizeAcre: data.farmSizeAcre || 5.0,
      primaryCropInterest: assignedRole === 'CUSTOMER' ? 'Fresh Vegetables & Produce' : 'Wheat, Tomato, Pulses',
      lastLoginAt: new Date().toLocaleString(),
      isEmailVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRegisteredAccounts(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // benign
    }

    showToast(`Account created successfully! Welcome to AGRITECH, ${newUser.name}.`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('You have signed out. Explore as guest or sign back in anytime.');
  };

  const loginAsDemoUser = (userId: string) => {
    const demo = registeredAccounts.find(u => u.id === userId) || DEFAULT_REGISTERED_ACCOUNTS.find(u => u.id === userId);
    if (demo) {
      const updatedUser: User = {
        ...demo,
        lastLoginAt: new Date().toLocaleString()
      };
      setUser(updatedUser);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);

      if (updatedUser.role === 'CUSTOMER') {
        setActiveTab('marketplace');
      } else if (updatedUser.role === 'DEALER') {
        setActiveTab('orders');
      } else {
        setActiveTab('dashboard');
      }

      showToast(`Signed in as ${updatedUser.name} (${updatedUser.roleTitle || 'Cultivator'}).`);
    }
  };

  const switchAccount = (userId: string) => {
    const target = registeredAccounts.find(u => u.id === userId);
    if (target) {
      setUser(target);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);

      if (target.role === 'CUSTOMER') {
        setActiveTab('marketplace');
      } else if (target.role === 'DEALER') {
        setActiveTab('orders');
      } else {
        setActiveTab('dashboard');
      }

      showToast(`Switched active profile to ${target.name} (${target.roleTitle || 'Cultivator'}).`);
    }
  };

  const removeAccount = (userId: string) => {
    if (registeredAccounts.length <= 1) {
      showToast('Cannot remove the only registered account.');
      return;
    }
    setRegisteredAccounts(prev => prev.filter(u => u.id !== userId));
    if (user.id === userId) {
      const nextUser = registeredAccounts.find(u => u.id !== userId) || DEFAULT_REGISTERED_ACCOUNTS[0];
      setUser(nextUser);
    }
    showToast('Account removed from this device.');
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    if (user.password && user.password !== oldPass) {
      return { success: false, error: 'Current password does not match.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    const updatedUser = { ...user, password: newPass };
    setUser(updatedUser);
    setRegisteredAccounts(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    showToast('Password updated securely.');
    return { success: true };
  };

  const resetPasswordWithOtp = (emailOrPhone: string, newPass: string): { success: boolean; error?: string } => {
    const clean = emailOrPhone.trim().toLowerCase();
    const target = registeredAccounts.find(
      u => u.email.toLowerCase() === clean || u.phone.replace(/[\s+-]/g, '').includes(clean.replace(/[\s+-]/g, ''))
    );
    if (!target) {
      return { success: false, error: 'No account found with this email or phone.' };
    }
    const updatedUser = { ...target, password: newPass, lastLoginAt: new Date().toLocaleString() };
    setUser(updatedUser);
    setIsAuthenticated(true);
    setRegisteredAccounts(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setIsAuthModalOpen(false);
    showToast(`Password reset successfully! Logged in as ${updatedUser.name}.`);
    return { success: true };
  };

  const selectedFarm = useMemo(() => {
    return farms.find(f => f.id === selectedFarmId) || farms[0];
  }, [farms, selectedFarmId]);

  // Evaluate deterministic rules whenever state updates
  const reminders = useMemo(() => {
    const rawReminders = evaluateDeterministicRules(farms, crops, activities, weather, user.id);
    return rawReminders.map(rem => ({
      ...rem,
      isRead: readReminderIds.includes(rem.id)
    }));
  }, [farms, crops, activities, weather, user.id, readReminderIds]);

  const unreadRemindersCount = useMemo(() => {
    return reminders.filter(r => !r.isRead).length;
  }, [reminders]);

  const markReminderAsRead = (id: string) => {
    if (!readReminderIds.includes(id)) {
      setReadReminderIds(prev => [...prev, id]);
    }
  };

  const markAllRemindersAsRead = () => {
    const allIds = reminders.map(r => r.id);
    setReadReminderIds(allIds);
    showToast('All notifications marked as read.');
  };

  // CRUD for Farms
  const addFarm = (data: Omit<Farm, 'id' | 'userId' | 'createdAt'>) => {
    const newFarm: Farm = {
      ...data,
      id: `farm_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFarms(prev => [...prev, newFarm]);
    setSelectedFarmId(newFarm.id);
    showToast(`Farm plot "${newFarm.farmName}" added successfully.`);
  };

  const updateFarm = (id: string, data: Partial<Farm>) => {
    setFarms(prev => prev.map(f => (f.id === id ? { ...f, ...data } : f)));
    showToast('Farm plot updated.');
  };

  const deleteFarm = (id: string) => {
    const farmToDelete = farms.find(f => f.id === id);
    const linkedCropIds = crops.filter(c => c.farmId === id).map(c => c.id);
    setFarms(prev => prev.filter(f => f.id !== id));
    setCrops(prev => prev.filter(c => c.farmId !== id));
    setActivities(prev => prev.filter(a => a.farmId !== id && !linkedCropIds.includes(a.cropId)));
    setExpenses(prev => prev.filter(e => e.farmId !== id));
    if (selectedFarmId === id) {
      const remaining = farms.filter(f => f.id !== id);
      if (remaining.length > 0) setSelectedFarmId(remaining[0].id);
    }
    showToast(`Farm "${farmToDelete?.farmName || ''}" and its associated crop cycles removed.`);
  };

  // CRUD for Crops
  const addCrop = (data: Omit<Crop, 'id' | 'createdAt'>) => {
    const newCrop: Crop = {
      ...data,
      id: `crop_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCrops(prev => [...prev, newCrop]);
    showToast(`Crop cycle "${newCrop.cropName}" registered.`);
  };

  const updateCrop = (id: string, data: Partial<Crop>) => {
    setCrops(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    showToast('Crop cycle updated.');
  };

  const deleteCrop = (id: string) => {
    setCrops(prev => prev.filter(c => c.id !== id));
    setActivities(prev => prev.filter(a => a.cropId !== id));
    setExpenses(prev => prev.filter(e => e.cropId !== id));
    showToast('Crop cycle and linked schedules deleted.');
  };

  // CRUD for Activities
  const addActivity = (data: Omit<Activity, 'id' | 'createdAt'>) => {
    const newAct: Activity = {
      ...data,
      id: `act_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [newAct, ...prev]);
    showToast(`Activity "${newAct.title}" scheduled.`);
  };

  const updateActivityStatus = (id: string, status: ActivityStatus) => {
    setActivities(prev =>
      prev.map(a => {
        if (a.id === id) {
          const isCompleted = status === 'COMPLETED';
          if (isCompleted) {
            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#2D6A4F', '#74C69D', '#84CC16', '#FBBF24']
              });
            } catch (e) {
              // benign fallback
            }
          }
          return {
            ...a,
            status,
            completedDate: isCompleted ? new Date().toISOString().split('T')[0] : null
          };
        }
        return a;
      })
    );
    showToast(status === 'COMPLETED' ? 'Task marked as Completed!' : `Task status set to ${status}.`);
  };

  const updateActivity = (id: string, data: Partial<Activity>) => {
    setActivities(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
    showToast('Activity updated.');
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('Activity removed.');
  };

  // Weather Scenarios for Testing Deterministic Rules
  const setWeatherScenario = (scenario: 'rainy' | 'sunny' | 'heatwave' | 'windy' | 'monsoon') => {
    if (scenario === 'rainy' || scenario === 'monsoon') {
      setWeather({
        ...INITIAL_WEATHER,
        currentTemp: 26,
        feelsLike: 27,
        humidity: 88,
        rainProbability: 85,
        rainfall24hMm: 28.5,
        windSpeedKmH: 18,
        condition: 'Continuous Monsoon Showers',
        spraySuitability: 'UNSUITABLE',
        irrigationRecommendation: 'SKIP_RAIN_PREDICTED'
      });
      showToast('Simulation: Heavy Monsoon Rain active (Triggers Spray & Irrigation Advisories)');
    } else if (scenario === 'sunny') {
      setWeather({
        ...INITIAL_WEATHER,
        currentTemp: 30,
        feelsLike: 31,
        humidity: 45,
        rainProbability: 5,
        rainfall24hMm: 0,
        windSpeedKmH: 9,
        condition: 'Clear & Sunny',
        spraySuitability: 'OPTIMAL',
        irrigationRecommendation: 'PROCEED'
      });
      showToast('Simulation: Clear Sunny Day active (Favorable spraying window)');
    } else if (scenario === 'heatwave') {
      setWeather({
        ...INITIAL_WEATHER,
        currentTemp: 40,
        feelsLike: 43,
        humidity: 30,
        rainProbability: 0,
        rainfall24hMm: 0,
        windSpeedKmH: 15,
        condition: 'Extreme Heatwave',
        spraySuitability: 'CAUTION',
        irrigationRecommendation: 'PROCEED'
      });
      showToast('Simulation: Heatwave 40°C active (Triggers Heat Stress Advisory)');
    } else if (scenario === 'windy') {
      setWeather({
        ...INITIAL_WEATHER,
        currentTemp: 28,
        humidity: 50,
        rainProbability: 15,
        windSpeedKmH: 34,
        condition: 'Strong Gusty Winds',
        spraySuitability: 'UNSUITABLE',
        irrigationRecommendation: 'PROCEED'
      });
      showToast('Simulation: High Winds (34 km/h) active');
    }
  };

  // Expenses
  const addExpense = (data: Omit<ExpenseItem, 'id' | 'createdAt'>) => {
    const newExp: ExpenseItem = {
      ...data,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense of ₹${newExp.amount} recorded.`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense item deleted.');
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      setRegisteredAccounts(accs => accs.map(a => (a.id === updated.id ? updated : a)));
      return updated;
    });
    showToast('Profile information saved.');
  };

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.pricePerUnit * item.quantity, 0);
  }, [cart]);

  // Product / Harvest Listing Handlers
  const addProductListing = (data: Omit<ProductListing, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProd: ProductListing = {
      ...data,
      id: `prod_jh_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Harvest listing "${newProd.cropName}" posted to Jharkhand Marketplace.`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // benign
    }
  };

  const updateProductListing = (id: string, data: Partial<ProductListing>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
    showToast('Produce listing updated.');
  };

  const deleteProductListing = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(c => c.product.id !== id));
    showToast('Produce listing removed from marketplace.');
  };

  const toggleStockStatus = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStatus = p.stockStatus === 'OUT_OF_STOCK' ? 'IN_STOCK' : 'OUT_OF_STOCK';
          return { ...p, stockStatus: newStatus };
        }
        return p;
      })
    );
    showToast('Stock availability updated.');
  };

  // Shopping Cart Handlers
  const addToCart = (product: ProductListing, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.availableQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.availableQuantity) }];
    });
    showToast(`Added ${quantity} ${product.unit} of ${product.cropName} to Cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Handlers
  const createOrder = async (orderData: {
    customerAddress: OrderAddress;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
    items: OrderItem[];
  }): Promise<Order> => {
    const subtotal = orderData.items.reduce((acc, it) => acc + it.subtotal, 0);
    const deliveryFee = 40;
    const totalAmount = subtotal + deliveryFee;

    const primaryFarmerId = orderData.items[0]?.farmerId || user.id;
    const primaryFarmerName = orderData.items[0]?.farmerName || 'Jharkhand Cultivator';
    const primaryFarmerLocation = orderData.items[0]?.farmerLocation || 'Ranchi';

    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 2);
    const estDateStr = estDate.toISOString().split('T')[0];

    const orderId = `ORD-JH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: user.id,
      customerName: orderData.customerAddress.fullName || user.name,
      customerPhone: orderData.customerAddress.phone || user.phone,
      deliveryAddress: orderData.customerAddress,
      farmerId: primaryFarmerId,
      farmerName: primaryFarmerName,
      farmerPhone: '+91 94311 55678',
      farmerLocation: primaryFarmerLocation,
      items: orderData.items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      paymentId: orderData.paymentMethod === 'COD' ? undefined : `PAY-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryStatus: 'ORDER_PLACED',
      timeline: [
        {
          status: 'ORDER_PLACED',
          label: 'Order Placed',
          timestamp: formattedNow,
          location: `${orderData.customerAddress.district}, Jharkhand`,
          note: `Customer direct order confirmed via ${orderData.paymentMethod}`,
          completed: true
        },
        {
          status: 'FARMER_ACCEPTED',
          label: 'Farmer Accepted',
          timestamp: 'Pending',
          location: `${primaryFarmerLocation}, Jharkhand`,
          note: 'Farmer confirmation of harvest & dispatch readiness',
          completed: false
        },
        {
          status: 'PACKED',
          label: 'Packed at Farm',
          timestamp: 'Pending',
          location: `${primaryFarmerLocation}, Jharkhand`,
          note: 'Produce sanitized, weighed & eco-packed',
          completed: false
        },
        {
          status: 'PICKED_UP',
          label: 'Picked Up',
          timestamp: 'Pending',
          location: 'Regional Farm Hub Dispatch',
          note: 'AgriTech logistics collection from farm gate',
          completed: false
        },
        {
          status: 'IN_TRANSIT',
          label: 'In Transit',
          timestamp: 'Pending',
          location: 'Jharkhand Cold-Line Route',
          note: 'In transit to customer delivery district',
          completed: false
        },
        {
          status: 'OUT_FOR_DELIVERY',
          label: 'Out for Delivery',
          timestamp: 'Pending',
          location: `${orderData.customerAddress.district} Hub`,
          note: 'Courier vehicle dispatched to destination',
          completed: false
        },
        {
          status: 'DELIVERED',
          label: 'Delivered',
          timestamp: 'Pending',
          location: `${orderData.customerAddress.street}, ${orderData.customerAddress.district}`,
          note: 'Fresh doorstep handover to customer',
          completed: false
        }
      ],
      estimatedDeliveryDate: estDateStr,
      createdAt: formattedNow,
      updatedAt: formattedNow
    };

    // Deduct stock from products
    setProducts(prevProds =>
      prevProds.map(prod => {
        const matchingItem = orderData.items.find(it => it.productId === prod.id);
        if (matchingItem) {
          const newQty = Math.max(0, prod.availableQuantity - matchingItem.quantity);
          return {
            ...prod,
            availableQuantity: newQty,
            stockStatus: newQty === 0 ? 'OUT_OF_STOCK' : newQty < 20 ? 'LOW_STOCK' : 'IN_STOCK'
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setCheckoutDirectProduct(null);
    setIsCheckoutModalOpen(false);

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      // benign
    }

    showToast(`Order #${newOrder.id} confirmed! Direct fresh dispatch from ${primaryFarmerName}.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: DeliveryStatus, note?: string) => {
    const now = new Date();
    const formattedNow = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const milestonesOrder: DeliveryStatus[] = [
          'ORDER_PLACED',
          'FARMER_ACCEPTED',
          'PACKED',
          'PICKED_UP',
          'IN_TRANSIT',
          'OUT_FOR_DELIVERY',
          'DELIVERED'
        ];
        const targetIdx = milestonesOrder.indexOf(status);

        const updatedTimeline = ord.timeline.map((m, idx) => {
          if (m.status === status) {
            return {
              ...m,
              completed: true,
              timestamp: formattedNow,
              note: note || m.note
            };
          }
          if (idx <= targetIdx) {
            return {
              ...m,
              completed: true,
              timestamp: m.timestamp === 'Pending' ? formattedNow : m.timestamp
            };
          }
          return m;
        });

        const isDelivered = status === 'DELIVERED';
        return {
          ...ord,
          deliveryStatus: status,
          timeline: updatedTimeline,
          paymentStatus: isDelivered && ord.paymentMethod === 'COD' ? 'PAID' : ord.paymentStatus,
          updatedAt: formattedNow
        };
      })
    );

    if (status === 'DELIVERED') {
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      } catch {
        // benign
      }
    }

    showToast(`Order #${orderId} milestone updated: ${status.replace(/_/g, ' ')}`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          deliveryStatus: 'CANCELLED',
          updatedAt: new Date().toLocaleString()
        };
      })
    );
    showToast(`Order #${orderId} has been cancelled.`);
  };

  // Feedback Handlers
  const addOrderReview = (orderId: string, reviewData: Omit<OrderReview, 'id' | 'createdAt'>) => {
    const newRev: OrderReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toLocaleString()
    };

    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, review: newRev } : ord))
    );

    // Update product rating and review count
    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === reviewData.productId) {
          const newCount = prod.reviewCount + 1;
          const newRating = Number(((prod.rating * prod.reviewCount + reviewData.rating) / newCount).toFixed(1));
          return { ...prod, rating: newRating, reviewCount: newCount };
        }
        return prod;
      })
    );

    setFeedbackOrderId(null);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // benign
    }
    showToast('Review & rating submitted! Thank you for supporting Jharkhand cultivators.');
  };

  const replyToOrderReview = (orderId: string, replyText: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId && ord.review) {
          return {
            ...ord,
            review: {
              ...ord.review,
              farmerReply: {
                text: replyText,
                repliedAt: new Date().toLocaleString(),
                farmerName: user.name
              }
            }
          };
        }
        return ord;
      })
    );
    showToast('Reply posted to customer feedback.');
  };

  const resetToSampleData = () => {
    setUser(INITIAL_USER);
    setRegisteredAccounts(DEFAULT_REGISTERED_ACCOUNTS);
    setIsAuthenticated(true);
    setFarms(INITIAL_FARMS);
    setSelectedFarmId(INITIAL_FARMS[0].id);
    setCrops(INITIAL_CROPS);
    setActivities(INITIAL_ACTIVITIES);
    setWeather(INITIAL_WEATHER);
    setExpenses(INITIAL_EXPENSES);
    setReadReminderIds([]);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    showToast('App data reset to default demo dataset.');
  };

  return (
    <FarmContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        isAuthenticated,
        registeredAccounts,
        updateUserProfile,
        login,
        signup,
        logout,
        loginAsDemoUser,
        switchAccount,
        removeAccount,
        changePassword,
        resetPasswordWithOtp,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        farms,
        selectedFarmId,
        setSelectedFarmId,
        selectedFarm,
        addFarm,
        updateFarm,
        deleteFarm,
        crops,
        addCrop,
        updateCrop,
        deleteCrop,
        activities,
        addActivity,
        updateActivityStatus,
        updateActivity,
        deleteActivity,
        weather,
        setWeatherScenario,
        reminders,
        unreadRemindersCount,
        markReminderAsRead,
        markAllRemindersAsRead,
        expenses,
        addExpense,
        deleteExpense,
        resetToSampleData,
        toastMessage,
        showToast,
        isAddCropModalOpen,
        setIsAddCropModalOpen,
        isAddFarmModalOpen,
        setIsAddFarmModalOpen,
        isAddActivityModalOpen,
        setIsAddActivityModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        preselectedCropForModal,
        setPreselectedCropForModal,
        // Marketplace & Farmer Harvests
        products,
        addProductListing,
        updateProductListing,
        deleteProductListing,
        toggleStockStatus,
        editingProduct,
        setEditingProduct,
        // Cart
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        // Orders & Fulfillment
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        // Feedback & Replies
        addOrderReview,
        replyToOrderReview,
        // Modals
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutDirectProduct,
        setCheckoutDirectProduct,
        trackingOrderId,
        setTrackingOrderId,
        feedbackOrderId,
        setFeedbackOrderId,
        isPostHarvestModalOpen,
        setIsPostHarvestModalOpen
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

