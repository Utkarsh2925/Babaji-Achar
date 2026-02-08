// Deployed: 2026-02-04 00:22 IST - Force Update 2
// DEPLOYMENT: 2026-02-04 10:35 - PRODUCTION LAUNCH
import React, { useState, useEffect, useMemo } from 'react';
import organicBadge from './assets/organic_badge_final.png';
import {
  ShoppingCart, User as UserIcon, ChevronRight, Instagram, Trash2, CheckCircle2,
  ArrowLeft, MapPin, Plus, Minus, Globe, ShieldCheck, Search, Sparkles, Star, Leaf,
  MessageCircle, Package, XCircle, LogIn, Settings, Phone, ArrowRight, Shield,
  ImageIcon, Mail, Camera
} from 'lucide-react';
// import { PaymentService } from './services/PaymentService';
import { WhatsAppService } from './services/WhatsAppService';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { UserProfileService } from './services/UserProfileService';
// Firebase Auth Imports
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from './firebase.config';
import { BRAND_CONFIG, INITIAL_PRODUCTS, GET_ACTIVE_FESTIVAL, UI_TEXT } from './constants';
import type { Product, CartItem, Order, OrderStatus, User, Review } from './types';

// --- COMPONENTS ---

// Global Image Component with Fallback Logic
const ImageWithFallback = ({ src, alt, className = "", fallbackSrc = BRAND_CONFIG.LOGO_URL, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className} bg-stone-100`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <ImageIcon className="text-stone-300" size={24} />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setHasError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
};

// --- ICONS ---
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);


import { NotificationProvider, useNotification } from './components/Notifications';
import Analytics from './components/Analytics';
import { ConfigService } from './services/ConfigService';
import AdminDashboard from './components/Admin/AdminDashboard';
import LocateStores from './components/LocateStores';
import type { Store } from './types';
// Firebase imports - UNCOMMENT after configuring firebase.config.ts
// import { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP, sendEmailMagicLink } from './firebaseAuth';
// import type { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';


import LegalPage from './components/Legal/LegalPage';


const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// --- ANIMATION LAYER ---
import { updateAnimations } from './animations/initAnimations';


const AppContent: React.FC = () => {
  const { addToast } = useNotification();

  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [view, setView] = useState<'HOME' | 'DETAILS' | 'CART' | 'CHECKOUT' | 'SUCCESS' | 'PROFILE' | 'EDIT_PROFILE' | 'LOGIN' | 'ADMIN' | 'STORES' | 'PRIVACY' | 'REFUND' | 'TERMS' | 'DISCLAIMER'>('HOME');
  // Removed paymentProofType as requested

  type Coupon = { code: string; type: 'FLAT' | 'PERCENTAGE'; value: number; freeDelivery?: boolean; description?: string; };
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Initialize Animations (Visual Layer - Route Aware)
  useEffect(() => {
    updateAnimations(view);
  }, [view]);
  const [viewStack, setViewStack] = useState<string[]>(['HOME']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [stores, setStores] = useState<Store[]>([]);

  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');

  // Checkout Form State (Replacing direct DOM access)
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPin, setCheckoutPin] = useState('');

  // Marketing Consent (default: true for better UX)
  const [marketingConsent, setMarketingConsent] = useState({
    whatsapp: true,
    email: true,
    sms: true
  });

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Firebase Auth state - UNCOMMENT after configuring Firebase
  // const [otpSent, setOtpSent] = useState(false);
  // const [otpCode, setOtpCode] = useState('');
  // const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  // const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  // const [isVerifying, setIsVerifying] = useState(false);



  // --- STATE ---
  const [offersEnabled, setOffersEnabled] = useState(true);

  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    address: {
      house: '',
      area: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  // --- AUTO-COUPON LOGIC ---
  useEffect(() => {
    // Subscribe to Config
    const unsubscribe = ConfigService.subscribeToOffersStatus(setOffersEnabled);
    return () => unsubscribe();
  }, []);

  // Auto-apply 5% discount for first-time users (calculated dynamically from Firebase orders)
  useEffect(() => {
    if (view === 'CHECKOUT' && !appliedCoupon && loginPhone.length === 10 && offersEnabled) {
      // Check if user has any previous orders in Firebase
      const userOrders = orders.filter(o => o.customerDetails.phone === loginPhone);

      if (userOrders.length === 0) {
        // First-time user → Apply 5% welcome discount
        console.log('First-time user detected, applying 5% discount');
        setAppliedCoupon({
          code: 'WELCOME5',
          type: 'PERCENTAGE',
          value: 5,
          description: 'First Order Discount'
        });
      } else {
        console.log(`Returning user with ${userOrders.length} previous orders, no discount`);
      }
    }
  }, [view, loginPhone, orders, appliedCoupon, offersEnabled]);

  // Initialize checkout form state when entering CHECKOUT view
  useEffect(() => {
    if (view === 'CHECKOUT') {
      // Initialize with user data if available
      if (user?.name && !checkoutName) {
        setCheckoutName(user.name);
      }
      // Initialize address from profile if available
      if (profileData.address?.house && !checkoutAddress) {
        const addr = `${profileData.address.house}, ${profileData.address.area}, ${profileData.address.city}`;
        setCheckoutAddress(addr);
      }
      if (profileData.address?.pincode && !checkoutPin) {
        setCheckoutPin(profileData.address.pincode);
      }
    }
  }, [view, user, profileData, checkoutName, checkoutAddress, checkoutPin]);

  const t = UI_TEXT[lang];
  const festival = useMemo(() => GET_ACTIVE_FESTIVAL(), []);

  // --- RAZORPAY HANDLER ---
  const handleRazorpayPayment = async (finalAmount: number, customerDetails: any) => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 1. Create Razorpay Order (Server)
      console.log("Creating Razorpay order for amount:", finalAmount);
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          receipt: "BABAJI_" + Date.now(),
        }),
      });

      if (!orderRes.ok) {
        throw new Error(`Server error creating order: ${orderRes.status}`);
      }

      const orderData = await orderRes.json();
      console.log("Razorpay Order ID:", orderData.id);

      // 2. Create "Pending" Order Object
      const pendingOrder: Order = {
        id: `Order #${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: 'Pending_Payment', // Initial Status
        items: cart,
        totalAmount: finalAmount,
        customerDetails: customerDetails,
        paymentMethod: 'Online',
        paymentStatus: 'Pending',
        utrNumber: '',
        razorpayOrderId: orderData.id,
        razorpayPaymentId: null,
        marketingConsent: marketingConsent
      };

      // 3. Save to Firebase (BEFORE Payment) -> Requirement STEP 1
      console.log('Saving Pending Order to Firebase...');
      await OrderService.createOrder(pendingOrder);

      // Update local state temporarily
      setCurrentOrder(pendingOrder);

      // 4. Get Razorpay Key ID
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) throw new Error("Payment config missing");

      // 5. Open Checkout
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Baba Ji Achar",
        description: "Authentic Homemade Taste",
        image: "https://babaji-achar.vercel.app/organic_badge_final.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 6. Payment Success (Client Side)
          console.log("Payment success:", response);

          // UPDATE LOCAL UI ONLY (Webhook handles DB + Bot)
          // We just mark it as "Processing" or check verify for security
          // But valid truth is Webhook.

          // Call verify just to be sure on frontend (optional but good for UX)
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          // Update local object for Success Page
          const successOrder = {
            ...pendingOrder,
            status: 'Paid' as OrderStatus,
            paymentStatus: 'Paid',
            razorpayPaymentId: response.razorpay_payment_id
          };

          setCurrentOrder(successOrder);
          setOrders([successOrder, ...orders]);
          setCart([]);
          localStorage.setItem('bj_orders', JSON.stringify([successOrder, ...orders]));

          // DO NOT CALL NOTIFICATION BOT HERE (User requirement Step 3)
          // NotificationService.sendOrderConfirmation(pendingOrder);  <-- REMOVED

          navigate('SUCCESS');
        },
        prefill: {
          name: customerDetails.fullName,
          contact: customerDetails.phone,
        },
        theme: {
          color: "#ea580c",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert("Payment initiation failed. Please try again.");
    }
  };

  const [isCodLoading, setIsCodLoading] = useState(false);
  /* SYNC TRACKING STATE */
  const [syncStatus, setSyncStatus] = useState<'PENDING' | 'SAVED' | 'FAILED'>('PENDING');
  const [syncError, setSyncError] = useState<string>('');

  // --- PRODUCTION COD HANDLER (FINAL) ---
  const executeCODOrder = (finalAmount: number, customerDetails: any) => {
    if (isCodLoading) return; // Prevent double clicks

    setIsCodLoading(true);
    console.log('🟡 COD: Starting order process...');

    try {
      // Create COD Order with proper structure
      const newOrder: Order = {
        id: `Order #${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: 'Pending',
        items: cart,
        totalAmount: finalAmount,
        customerDetails: customerDetails,
        paymentMethod: 'COD',
        paymentStatus: 'Cash on Delivery',
        utrNumber: 'COD',
        razorpayOrderId: null,
        razorpayPaymentId: null,
        marketingConsent: marketingConsent
      };

      console.log('🟡 COD: Order object created:', newOrder);

      // Save to Firebase (With Tracking & Auth Check)
      console.log('🟡 COD: Attempting Firebase save...');

      // Reset Sync State
      setSyncStatus('PENDING');
      setSyncError('');

      // Fallback Auth Check & REST Sync
      const syncWithRestApi = async () => {
        try {
          // 1. AUTH CHECK
          if (!auth.currentUser) {
            console.log('🟡 COD: Authenticating...');
            await signInAnonymously(auth);
          }
          console.log('✅ COD: Auth OK, Preparing REST Request...');

          // 2. GET TOKEN
          const token = await auth.currentUser?.getIdToken();
          if (!token) throw new Error('Failed to get Auth Token');

          // 3. REST API WRITE (Multi-Region Retry)
          // Try the configured URL first, then fallbacks
          // 3. REST API WRITE (Multi-Region Retry)
          // Try the confirmed Singapore URL first
          const candidateUrls = [
            "https://babaji-achar-default-rtdb.asia-southeast1.firebasedatabase.app", // Singapore (CONFIRMED)
            "https://babaji-achar-default-rtdb.firebaseio.com", // Default
            "https://babaji-achar.firebaseio.com", // Legacy
            "https://babaji-achar-default-rtdb.asia-south1.firebasedatabase.app" // Mumbai
          ];

          let success = false;
          let lastError = '';

          for (const dbUrl of candidateUrls) {
            try {
              const url = `${dbUrl}/orders.json?auth=${token}`;
              console.log(`🟡 COD: Trying DB URL: ${dbUrl}`);

              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...newOrder,
                  firebaseId: 'pending_rest_update',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })
              });

              if (response.ok) {
                const data = await response.json();
                console.log('✅ COD: REST Sync Success!');
                console.log('✅ Working Database URL:', dbUrl);
                console.log('✅ Order ID:', data.name);
                setSyncStatus('SAVED');
                success = true;
                break;
              } else {
                console.warn(`⚠️ Failed URL ${dbUrl}: ${response.status}`);
                // If 404/401, try next. If 200, done.
                if (response.status === 401) throw new Error("Permission Denied (Auth)");
                lastError = `${response.status} ${response.statusText}`;
              }
            } catch (err: any) {
              console.warn(`⚠️ Error connecting to ${dbUrl}`, err);
            }
          }

          if (!success) {
            throw new Error(`Sync Failed on all URLs. Last Error: ${lastError}`);
          }

        } catch (e: any) {
          console.error('❌ COD: Firebase Sync Failed', e);
          setSyncStatus('FAILED');
          setSyncError(e.message || 'Unknown Error');
        }
      };

      // Trigger Background Save
      syncWithRestApi();

      console.log('✅ COD: Proceeding immediately...');
      // console.log('✅ COD: Firebase save successful!');

      // Update local state
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      setCurrentOrder(newOrder);
      setCart([]);
      localStorage.setItem('bj_orders', JSON.stringify(updatedOrders));
      console.log('✅ COD: Local state updated');

      // Send WhatsApp confirmation (background, non-blocking)
      setTimeout(() => {
        try {
          WhatsAppService.sendOrderConfirmation(newOrder);
          console.log('✅ COD: WhatsApp sent');
        } catch (e) {
          console.error('⚠️ COD: WhatsApp failed:', e);
        }

        // Send automated notification via Communication Bot
        try {
          NotificationService.sendPaymentStatus(newOrder);
          console.log('✅ COD: Notification sent');
        } catch (e) {
          console.error('⚠️ COD: Notification failed:', e);
        }
      }, 100);

      // Navigate to success
      console.log('✅ COD: Navigating to success...');
      setView('SUCCESS');
      setViewStack([...viewStack, 'SUCCESS']);
      window.scrollTo(0, 0);
      console.log('✅ COD: Complete!');

    } catch (err: any) {
      console.error('❌ COD: Error caught:', err);
      // Only show user-friendly error message
      alert(err.message || 'Unable to place order. Please check your internet connection.');
    } finally {
      setIsCodLoading(false);
      console.log('🟡 COD: Loading state reset');
    }
  };



  /* DEBUG STATE */
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    // 0. Ensure Local Auth for Guest Users (Required for Firebase Writes if Rules are "auth != null")
    if (!auth.currentUser) {
      signInAnonymously(auth)
        .then((cred) => console.log('👤 Guest authenticated silently:', cred.user.uid))
        .catch((e) => console.error('❌ Guest Auth Failed:', e));
    }

    // 1. Subscribe to Firebase Orders (real-time sync)
    // 1. Subscribe to Firebase Orders (SDK - Realtime)
    const unsubscribeOrders = OrderService.subscribeToOrders(
      (firebaseOrders) => {
        if (firebaseOrders.length > 0) {
          console.log('✅ SDK: Received orders:', firebaseOrders.length);
          setOrders(firebaseOrders);
          setFirebaseError(null);
          localStorage.setItem('bj_orders', JSON.stringify(firebaseOrders));
        } else {
          // SDK returned empty. Could be wrong DB URL. Try REST Fallback.
          console.log('⚠️ SDK found 0 orders. Initiating Multi-Region Discovery...');
          discoverOrdersFromRegions();
        }
      },
      (error) => {
        setFirebaseError(error.message);
        // On error, also try discovery
        discoverOrdersFromRegions();
      }
    );

    // Multi-Region Discovery Function
    const discoverOrdersFromRegions = async () => {
      const regions = [
        "https://babaji-achar-default-rtdb.firebaseio.com",      // US Central
        "https://babaji-achar.firebaseio.com",                   // Legacy
        "https://babaji-achar-default-rtdb.asia-southeast1.firebasedatabase.app", // Singapore
        "https://babaji-achar-default-rtdb.asia-south1.firebasedatabase.app"      // Mumbai
      ];

      for (const url of regions) {
        try {
          // We can read public data or use auth token if needed
          // For admin panel usage, we ideally use the token.
          // However, if the user is anonymous/guest, rules might block 'list' but allow 'read' if we knew IDs.
          // But here we are admin/owner checking orders.
          const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
          const fetchUrl = token ? `${url}/orders.json?auth=${token}` : `${url}/orders.json`;

          const res = await fetch(fetchUrl);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              console.log(`✅ FOUND DATA at: ${url}`);
              // Convert Map to Array
              const ordersList = Object.keys(data).map(key => ({
                ...data[key],
                firebaseId: key
              })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

              if (ordersList.length > 0) {
                console.log(`✅ Recovered ${ordersList.length} orders via REST.`);
                setOrders(ordersList);
                setFirebaseError(null);
                // If this URL works, we should probably record it or alert the user
                return; // Stop after finding data
              }
            }
          }
        } catch (e) {
          console.warn(`Discovery failed for ${url}`, e);
        }
      }
    };

    // 2. Load user and stores from localStorage
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem('bj_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          if (parsedUser?.phone) setLoginPhone(String(parsedUser.phone));
        }
      } catch (e) { console.error("Failed to load user", e); }

      try {
        const savedStores = localStorage.getItem('bj_stores');
        if (savedStores) setStores(JSON.parse(savedStores as string));
      } catch (e) { console.error("Failed to load stores", e); }
    };

    loadData();

    // Real-time Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bj_orders' || e.key === 'bj_stores' || e.key === 'bj_user') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    try {
      const savedProducts = localStorage.getItem('bj_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedProducts = INITIAL_PRODUCTS.map(initProd => {
            const savedProd = parsed.find((p: any) => p.id === initProd.id);
            if (savedProd) {
              const mergedVariants = initProd.variants.map(initVar => {
                const savedVar = savedProd.variants?.find((v: any) => v.id === initVar.id);
                return savedVar ? { ...initVar, stock: savedVar.stock } : initVar;
              });
              return { ...initProd, variants: mergedVariants };
            }
            return initProd;
          });
          setProducts(mergedProducts);
        }
      }
    } catch (e) { console.error("Failed to load products", e); }

    // 2. Extended Hydration (Cart, Lang, Coupon, Stack)
    try {
      const savedCart = localStorage.getItem('bj_cart');
      if (savedCart) setCart(JSON.parse(savedCart as string));
    } catch (e) { console.error("Failed to load cart", e); }

    try {
      const savedLang = localStorage.getItem('bj_lang') as 'hi' | 'en';
      if (savedLang) setLang(savedLang);
    } catch (e) { console.error("Failed to load lang", e); }



    // REMOVED: localStorage coupon cache to force fresh calculation on every checkout
    // Coupon is now calculated dynamically based on Firebase order history

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribeOrders();
    };
  }, []);

  // Load user profile from Firebase
  useEffect(() => {
    if (user?.phone) {
      UserProfileService.getProfile(user.phone).then(profile => {
        if (profile) {
          setProfileData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            gender: profile.gender || '',
            address: profile.address || {
              house: '',
              area: '',
              city: '',
              state: '',
              pincode: ''
            }
          });
        }
      });
    }
  }, [user]);

  // --- PERSISTENCE OBSERVERS ---
  useEffect(() => { localStorage.setItem('bj_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bj_lang', lang); }, [lang]);
  // REMOVED viewStack persistence to prevent navigation loops
  // REMOVED: Coupon localStorage persistence
  // Coupon is now calculated fresh on every checkout based on Firebase order history
  // This prevents old coupon codes (like FIRST10) from persisting in browser storage

  const updateProductVariant = (productId: string, variantId: string, newStock: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updatedVariants = p.variants.map(v => {
          if (v.id === variantId) {
            return { ...v, stock: newStock };
          }
          return v;
        });
        return { ...p, variants: updatedVariants };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('bj_products', JSON.stringify(updatedProducts));
  };

  const addStore = (store: Store) => {
    const updated = [...stores, store];
    setStores(updated);
    localStorage.setItem('bj_stores', JSON.stringify(updated));
  };

  const deleteStore = (id: string) => {
    const updated = stores.filter(s => s.id !== id);
    setStores(updated);
    localStorage.setItem('bj_stores', JSON.stringify(updated));
  };

  const navigate = (newView: any) => {
    setViewStack(prev => [...prev, newView]);
    setView(newView);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      const newStack = [...viewStack];
      newStack.pop();
      const lastView: any = newStack[newStack.length - 1];
      setViewStack(newStack);
      setView(lastView);
      window.scrollTo(0, 0);
    } else {
      setView('HOME');
      window.scrollTo(0, 0);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (order && (order as any).firebaseId) {
      try {
        await OrderService.updateOrderStatus((order as any).firebaseId, newStatus);
      } catch (error) {
        console.error('Failed to update order in Firebase:', error);
      }
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const order = orders.find(o => o.id === orderId);
    if (order && (order as any).firebaseId) {
      try {
        await OrderService.deleteOrder((order as any).firebaseId);
      } catch (error) {
        console.error('Failed to delete order from Firebase:', error);
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Special handling for 'Bharwa Lal Mirch' shortcut
      if (selectedCategory === 'RedChilliLink') {
        return p.id === 'red-chilli-pickle-01';
      }
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const visibility = (user?.role === 'ADMIN') ? true : p.isActive;
      return matchesCategory && matchesSearch && visibility;
    });
  }, [selectedCategory, searchQuery, lang, products, user]);



  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        // Map Google User to App User
        const newUser: User = {
          id: user.uid,
          name: user.displayName || 'Valued Customer',
          role: 'USER',
          phone: user.email || 'Google User', // Fallback for phone
          email: user.email || undefined
        };

        setUser(newUser);
        localStorage.setItem('bj_user', JSON.stringify(newUser));
        addToast('success', 'Welcome!', `Signed in as ${newUser.name}`);
        navigate('HOME');
      }
    } catch (error: any) {
      console.error("Google Sign-In Error", error);
      addToast('error', 'Login Failed', error.message || 'Could not sign in with Google');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone) return addToast('error', 'Required', 'Please enter your phone number or email');

    // Check for admin bypass
    if (loginPhone === '0000' && loginName === 'Vandita') {
      try {
        // Authenticate anonymously to ensure Firebase Database access (if rules require auth)
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Admin Firebase Auth failed", err);
      }

      const adminUser: User = { id: 'admin-01', name: 'Super Admin', role: 'ADMIN', phone: '0000' };
      setUser(adminUser);
      localStorage.setItem('bj_user', JSON.stringify(adminUser));
      navigate('PROFILE');
      return;
    }

    // Validation for email or 10-digit mobile number
    const isEmail = loginPhone.includes('@');
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isEmail && !phoneRegex.test(loginPhone)) {
      return addToast('error', 'Invalid Phone', 'Please enter a valid 10-digit mobile number.');
    }

    if (isEmail && !emailRegex.test(loginPhone)) {
      return addToast('error', 'Invalid Email', 'Please enter a valid email address.');
    }

    const newUser: User = { id: `u-${Date.now()}`, name: loginName || 'Valued Customer', role: 'USER', phone: loginPhone };
    setUser(newUser);
    localStorage.setItem('bj_user', JSON.stringify(newUser));
    navigate('HOME');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bj_user');
    setCart([]);
    navigate('HOME');
  };

  const isVerifiedBuyer = (productId: string) => {
    if (!user) return false;
    return orders.some(o =>
      o.customerDetails.phone === user.phone &&
      o.items.some(item => item.productId === productId)
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !user) return;
    if (!reviewText.trim()) return alert(lang === 'hi' ? "कृपया अपनी समीक्षा लिखें" : "Please write your review");

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewText,
      date: new Date().toISOString()
    };

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const reviews = p.reviews ? [newReview, ...p.reviews] : [newReview];
        return { ...p, reviews };
      }
      return p;
    });

    setProducts(updatedProducts);
    setSelectedProduct({ ...selectedProduct, reviews: selectedProduct.reviews ? [newReview, ...selectedProduct.reviews] : [newReview] });
    localStorage.setItem('bj_products', JSON.stringify(updatedProducts));
    setReviewText('');
    setReviewRating(5);
  };

  // Save user profile
  const handleSaveProfile = async () => {
    if (!user?.phone) {
      alert(lang === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      return;
    }

    // Validation
    if (!profileData.fullName.trim()) {
      alert(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      alert(lang === 'hi' ? 'कृपया मान्य ईमेल दर्ज करें' : 'Please enter a valid email');
      return;
    }
    if (profileData.address.pincode && !/^\d{6}$/.test(profileData.address.pincode)) {
      alert(lang === 'hi' ? 'पिन कोड 6 अंकों का होना चाहिए' : 'Pincode must be 6 digits');
      return;
    }

    try {
      await UserProfileService.saveProfile({
        phone: user.phone,
        fullName: profileData.fullName,
        email: profileData.email,
        gender: profileData.gender,
        address: profileData.address
      });

      // Update local user state
      setUser({
        ...user,
        name: profileData.fullName || user.name,
        email: profileData.email,
        gender: profileData.gender,
        address: profileData.address
      });

      addToast(lang === 'hi' ? 'प्रोफाइल सफलतापूर्वक सहेजा गया!' : 'Profile saved successfully!', 'success');
      setView('PROFILE');
    } catch (error) {
      console.error('Error saving profile:', error);
      addToast(lang === 'hi' ? 'प्रोफाइल सहेजने में विफल' : 'Failed to save profile', 'error');
    }
  };



  const generateWhatsAppLink = (order: Order) => {
    const items = order.items.map(i => `- ${i.productName} (${i.size}) x${i.quantity}`).join('\n');
    const message = `*${BRAND_CONFIG.PRODUCT_BRAND} - NEW ORDER*\n` +
      `Order ID: ${order.id}\n` +
      `Customer: ${order.customerDetails.fullName}\n` +
      `Address: ${order.customerDetails.street}, Prayagraj\n` +
      `Total: ₹${order.totalAmount}\n` +
      `${order.utrNumber === 'Will Share Screenshot' ? 'Payment Proof: I will share payment screenshot' : `UTR: ${order.utrNumber}`}\n\n` +
      `*Items:*\n${items}`;
    return `https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // const generateSupportWhatsAppLink = (topic: string) => {
  //   const message = `Namaste! I need help with ${topic} on the Baba Ji Achar platform. My name is ${user?.name || 'Guest'}.`;
  //   return `https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  // };



  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending_Payment': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Payment_Received': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Packed': return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };



  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartValues = useMemo(() => {
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

    // No bulk discount on 1kg packs anymore
    let bulkDiscount = 0;

    // Percentage/Flat/FreeDelivery logic
    const couponDiscount = appliedCoupon ? (
      appliedCoupon.type === 'PERCENTAGE'
        ? Math.round(cartSubtotal * (appliedCoupon.value / 100))
        : appliedCoupon.value
    ) : 0;

    // Total Discount
    const totalDiscount = bulkDiscount + couponDiscount;

    // Free Delivery > ₹999 OR Coupon override
    const isFreeDelivery = cartSubtotal > 999 || appliedCoupon?.freeDelivery === true;
    const deliveryFee = isFreeDelivery ? 0 : 50;

    const finalTotal = cartSubtotal - totalDiscount + deliveryFee;

    // Maintain compatibility with isBulkDiscount name for generic check, but return breakdown
    return { totalQty, bulkDiscount, couponDiscount, totalDiscount, isFreeDelivery, deliveryFee, finalTotal, isBulkDiscount: bulkDiscount > 0 };
  }, [cart, cartSubtotal, appliedCoupon]);

  const categories = [
    { id: 'All', label: t.all },
    { id: 'RedChilliLink', label: lang === 'hi' ? 'भरवा लाल मिर्च' : 'Bharwa Lal Mirch' },
    { id: 'Mix', label: t.mix },
    { id: 'Mango', label: t.mango },
    { id: 'Aawla', label: t.aawla },
    { id: 'Kathal', label: t.kathal },
    { id: 'Suran', label: t.suran },
    { id: 'Lemon', label: t.lemon },
    { id: 'Chilli', label: t.chilli }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-200">
      <Analytics />
      {/* FESTIVAL TOP BANNER */}
      {/* FESTIVAL TOP BANNER */}
      {/* FESTIVAL TOP BANNER */}
      {/* FESTIVAL TOP BANNER */}
      {offersEnabled && festival && (
        <div
          className="w-full py-3 text-white flex items-center justify-center gap-3 shadow-xl relative z-[60] overflow-hidden"
          style={{
            backgroundColor: festival.id === 'ADMIN_BDAY' ? '#581c87' : '#0f766e',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Floating Offer Icons (Restricted to Banner) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            {festival.icons.map((icon, i) => (
              <span key={i} className="absolute text-orange-200/20 animate-pulse pointer-events-none transition-all duration-1000" style={{
                top: `${(i * 13) % 80}%`,
                left: `${(i * 17) % 95}%`,
                fontSize: i % 2 === 0 ? '1.2rem' : '0.8rem',
                animationDuration: `${2 + (i % 3)}s`
              }}>{icon}</span>
            ))}
          </div>

          <span className="text-2xl animate-bounce relative z-10">{festival.icons[0]}</span>
          <p className="font-bold text-sm sm:text-base tracking-wide flex items-center gap-2 relative z-10">
            <span>{festival.greeting}</span>
            <span className="opacity-60 hidden sm:inline">|</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-white font-medium border border-white/20 shadow-sm">{festival.offer}</span>
            <span className="font-black ml-1 bg-yellow-400 text-purple-900 px-2 rounded uppercase text-xs sm:text-sm shadow-sm ring-2 ring-yellow-400/50">Code: {festival.offerCode}</span>
          </p>
          <span className="text-2xl animate-bounce relative z-10">{festival.icons[1]}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b-2 border-amber-100/60 shadow-2xl shadow-amber-900/5 relative overflow-hidden">

        {/* Floating Culinary Doodles - ALWAYS VEGETABLES (As requested) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70 select-none overflow-hidden">
          {['🌶️', '🍋', '🧄', '🥬', '🌿', '🎋', '🍅', '🧂', '🥜', '🧅', '🥕', '🥭'].map((icon, i) => (
            <div key={i} className={`absolute animate-[float_${4 + (i % 5)}s_ease-in-out_infinite] text-${i % 3 === 0 ? '3xl' : '2xl'} opacity-${i % 2 === 0 ? '80' : '60'}`} style={{
              top: `${(i * 23) % 90}%`,
              left: `${(i * 19) % 90}%`,
              animationDelay: `${i * 200}ms`
            }}>
              {icon}
            </div>
          ))}

          {/* Extra Background Sparkles */}
          <div className="absolute top-1/4 left-[40%] animate-pulse opacity-50"><Sparkles size={24} className="text-amber-500" /></div>
          <div className="absolute top-3/4 right-[40%] animate-pulse opacity-50 delay-700"><Sparkles size={24} className="text-orange-500" /></div>
        </div>



        <div className="max-w-7xl mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between relative">
            {/* 1. Left: Logo & Brand (Mobile) */}
            <div className="flex items-center gap-3 z-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-amber-200 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 bg-white flex-shrink-0" onClick={() => navigate('HOME')}>
                <ImageWithFallback src={BRAND_CONFIG.LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
              </div>
              {/* Mobile Brand Name (Visible only on small screens) */}
              <div className="block lg:hidden leading-none">
                <h1 className="hindi-font text-2xl font-black text-amber-900 tracking-tight">{BRAND_CONFIG.PRODUCT_BRAND}</h1>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest opacity-80">{BRAND_CONFIG.PARENT_BRAND}</p>
              </div>
            </div>

            {/* 2. Center: Brand Name (Desktop Only - Absolute Center) */}
            <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none z-10">
              <div className="text-center">
                <h1 className="hindi-font text-3xl sm:text-5xl font-black text-amber-900 tracking-tight leading-none drop-shadow-sm">{BRAND_CONFIG.PRODUCT_BRAND}</h1>
                <p className="text-xs sm:text-sm text-amber-700 font-bold uppercase tracking-widest opacity-80 mt-1">{BRAND_CONFIG.PARENT_BRAND}</p>
              </div>
            </div>

            {/* 3. Right: Actions */}
            <div className="flex-shrink-0 flex items-center gap-3 sm:gap-4 z-20">
              <button
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl text-stone-700 hover:bg-amber-900 hover:text-white transition-all shadow-md border-2 border-stone-100"
              >
                <Globe size={24} className={lang === 'hi' ? "text-amber-600 group-hover:text-white" : "text-stone-700 group-hover:text-white"} />
                <span className="hidden lg:inline font-bold text-sm leading-none">{lang === 'hi' ? 'EN' : 'हिंदी'}</span>
              </button>

              <button onClick={() => navigate('STORES')} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-white rounded-xl text-stone-700 hover:bg-amber-900 hover:text-white transition-all shadow-md border-2 border-stone-100">
                <MapPin size={24} className="text-amber-600 group-hover:text-white" />
                <span className="hidden lg:inline font-bold text-sm leading-none">Locate</span>
              </button>

              <button onClick={() => navigate('CART')} className="relative p-2.5 sm:p-3 bg-white rounded-xl text-stone-700 hover:bg-amber-900 hover:text-white transition-all shadow-md border-2 border-stone-100">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <button onClick={() => navigate('PROFILE')} className="p-2.5 sm:p-3 bg-white rounded-xl text-stone-700 hover:bg-amber-900 hover:text-white transition-all shadow-md border-2 border-stone-100 flex items-center gap-2">
                  <UserIcon size={24} />
                </button>
              ) : (
                <button onClick={() => navigate('LOGIN')} className="p-2.5 sm:p-3 bg-white rounded-xl text-stone-700 hover:bg-amber-900 hover:text-white transition-all shadow-md border-2 border-stone-100">
                  <LogIn size={24} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white text-sm sm:text-base font-black text-center py-3 uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-inner relative z-40 overflow-hidden whitespace-nowrap flex">
        <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around gap-20">
          <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> 🚚 Free Delivery above ₹999</span>
          {offersEnabled && <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> 🏷️ 1st Order? Use FIRST5 for 5% OFF</span>}
          <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> {t.serving}</span>
        </div>
        <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around gap-20" aria-hidden="true">
          <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> 🚚 Free Delivery above ₹999</span>
          {offersEnabled && <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> 🏷️ 1st Order? Use FIRST5 for 5% OFF</span>}
          <span className="flex items-center gap-4"><Sparkles size={14} className="text-amber-400" /> {t.serving}</span>
        </div>
      </div>

      <main className="flex-grow">
        {view === 'LOGIN' && (

          <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-700">
            {/* Full Screen Background with strong overlay */}
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1590505677187-f9615628d068?w=1600" className="w-full h-full object-cover" alt="Heritage Background" loading="lazy" />
              <div className="absolute inset-0 bg-orange-950/80 backdrop-blur-sm"></div>
            </div>

            {/* Close Button */}
            <div className="absolute top-6 right-6 z-50">
              <button onClick={() => navigate('HOME')} className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white/80 font-bold hover:bg-white hover:text-orange-900 transition-all border border-white/20 hover:border-white shadow-lg">
                <span className="uppercase text-xs tracking-widest group-hover:block hidden">Close</span>
                <XCircle size={24} />
              </button>
            </div>

            {/* Centered Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white/20 animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"></div>

              <div className="p-8 sm:p-12 md:p-16 flex flex-col gap-10">
                {/* Header Section */}
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-orange-100 shadow-xl overflow-hidden mb-6">
                    <ImageWithFallback src={BRAND_CONFIG.LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-5 py-2 rounded-full text-orange-800 text-xs font-black uppercase tracking-[0.2em] border border-orange-200"><Shield size={14} className="text-orange-600" /> Secure Gateway</div>
                    <h3 className="hindi-font font-black text-orange-950 tracking-tight leading-none flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-4">
                      <span className="text-5xl sm:text-6xl">{t.login}</span>
                      <span className="text-4xl sm:text-5xl text-stone-300 font-light hidden sm:block">/</span>
                      <span className="text-5xl sm:text-6xl">{t.signup}</span>
                    </h3>
                  </div>
                </div>

                {/* reCAPTCHA Container */}
                <div id="recaptcha-container"></div>

                {/* Form Section */}
                <form onSubmit={(e) => {
                  handleLogin(e);
                  const isEmail = loginPhone.includes('@');
                  // Auth redirects and toasts removed as requested
                  if (isEmail) {
                    // console.log("Silent Magic Link Logic");
                  } else {
                    // console.log("Silent OTP Logic");
                  }
                }} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-stone-500 uppercase tracking-widest ml-4 flex items-center gap-2"><Phone size={16} className="text-orange-600" /> Mobile or Email</label>
                      <div className="relative group">
                        <input
                          type="text"
                          placeholder="98765 43210 or email@example.com"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                          className="w-full px-6 py-5 bg-stone-100 border-2 border-stone-200 rounded-3xl focus:border-orange-500 focus:bg-white focus:shadow-xl outline-none transition-all font-black text-xl sm:text-2xl text-orange-950 placeholder-stone-300 tracking-wider text-center"
                          required
                          autoFocus
                        />
                        {/^\d+$/.test(loginPhone) && loginPhone.length > 0 && (
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg hidden sm:block">+91</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black text-stone-500 uppercase tracking-widest ml-4 flex items-center gap-2"><UserIcon size={16} className="text-orange-600" /> Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Kumar"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        className="w-full px-6 py-5 bg-stone-100 border-2 border-stone-200 rounded-3xl focus:border-orange-500 focus:bg-white focus:shadow-xl outline-none transition-all font-bold text-xl sm:text-2xl text-orange-950 placeholder-stone-300 text-center"
                        required
                      />
                    </div>
                  </div>


                  <button type="submit" className="w-full h-20 bg-orange-50 text-orange-900 border-4 border-orange-100 rounded-3xl font-black text-2xl sm:text-3xl shadow-xl flex items-center justify-center gap-3 transition-all hover:bg-orange-100 hover:border-orange-300 hover:scale-[1.02] active:scale-95 active:translate-y-1 whitespace-nowrap group">
                    Proceed <ArrowRight size={28} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Google Sign In Separator */}
                  <div className="flex items-center gap-4 my-2">
                    <div className="h-px bg-stone-200 flex-grow"></div>
                    <span className="text-stone-400 font-bold uppercase text-sm">OR</span>
                    <div className="h-px bg-stone-200 flex-grow"></div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-16 bg-white text-stone-600 border-2 border-stone-200 rounded-3xl font-bold text-lg sm:text-xl shadow-md flex items-center justify-center gap-3 transition-all hover:bg-stone-50 hover:border-stone-300 active:scale-95"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" loading="lazy" />
                    Sign in with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {view === 'EDIT_PROFILE' && (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              {/* Header Removed as requested */}

              {/* Profile Picture Upload */}
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center border-4 border-orange-200 overflow-hidden">
                    {user?.name ? (
                      <span className="text-4xl font-bold text-orange-900">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserIcon size={48} className="text-orange-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-all">
                    <Camera size={20} />
                  </button>
                </div>
                <p className="text-sm text-stone-500 mt-3">
                  {lang === 'hi' ? 'प्रोफाइल फोटो जल्द आ रहा है' : 'Profile photo coming soon'}
                </p>
              </div>

              {/* Profile Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    placeholder={lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    {lang === 'hi' ? 'ईमेल' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    placeholder={lang === 'hi' ? 'आपका ईमेल' : 'Your email'}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    {lang === 'hi' ? 'लिंग' : 'Gender'}
                  </label>
                  <select
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">{lang === 'hi' ? 'चुनें' : 'Select'}</option>
                    <option value="male">{lang === 'hi' ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{lang === 'hi' ? 'महिला' : 'Female'}</option>
                    <option value="other">{lang === 'hi' ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>

                {/* Address Section */}
                <div className="border-t-2 border-stone-100 pt-6">
                  <h3 className="text-lg font-bold text-stone-800 mb-4">
                    {lang === 'hi' ? 'पता' : 'Address'}
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={profileData.address.house}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, house: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                      placeholder={lang === 'hi' ? 'मकान/फ्लैट नंबर' : 'House/Flat No.'}
                    />

                    <input
                      type="text"
                      value={profileData.address.area}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, area: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                      placeholder={lang === 'hi' ? 'इलाका/गली' : 'Area/Street'}
                    />

                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, city: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                      placeholder={lang === 'hi' ? 'शहर' : 'City'}
                    />

                    <select
                      value={profileData.address.state}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, state: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none bg-white"
                    >
                      <option value="">{lang === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                      {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={profileData.address.pincode}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        address: { ...profileData.address, pincode: e.target.value }
                      })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-orange-500 focus:outline-none"
                      placeholder={lang === 'hi' ? 'पिन कोड' : 'Pincode'}
                      maxLength={6}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#6b360e] active:scale-95 transition-all"
                >
                  {lang === 'hi' ? 'सहेजें' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'HOME' && (
          <div className="animate-in fade-in duration-1000">
            <div className="relative h-[75vh] sm:h-[85vh] bg-stone-950 overflow-hidden">
              <ImageWithFallback
                src="/images/hero_update.png"
                alt="Babaji Achar Premium Organic Spices and Pickles"
                className="w-full h-full object-cover opacity-90 scale-105 animate-subtle-parallax"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDFB] via-transparent to-black/30"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-6 sm:space-y-10">
                <div className="space-y-4 sm:space-y-6 max-w-5xl">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-amber-200 text-sm sm:text-base font-black uppercase tracking-[0.2em] mb-4"><Leaf size={16} className="text-green-400" /> 100% Natural • Heritage</div>
                  <h1 className="hindi-font text-5xl sm:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl tracking-tight leading-none uppercase whitespace-nowrap mb-2">
                    {BRAND_CONFIG.PRODUCT_BRAND} <span className="text-orange-500 italic ml-2">अचार</span>
                  </h1>
                  <p className="text-base sm:text-3xl text-stone-200 font-medium max-w-2xl mx-auto leading-relaxed hindi-font px-4">पीढ़ियों की परंपरा से बना शुद्ध देसी अचार</p>
                  <h2 className="text-[11px] sm:text-sm text-amber-200/50 font-black uppercase tracking-[0.3em] max-w-4xl mx-auto mt-6 leading-none whitespace-nowrap">
                    100% Organic Traditional Natural Pickles by Bhojnamrit Foods | Made in Prayagraj
                  </h2>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-xl items-center px-4">
                  <div className="relative w-full group shadow-2xl rounded-2xl overflow-hidden">
                    <input type="text" placeholder={t.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-6 py-4 sm:py-5 rounded-2xl border-none text-stone-900 text-base sm:text-lg outline-none" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  </div>
                  <button onClick={() => document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">{t.orderNow} <ChevronRight size={20} /></button>
                </div>
              </div>
            </div>

            <div className="sticky top-[72px] sm:top-[89px] z-40 bg-white/60 backdrop-blur-xl border-b border-orange-100/50 py-4 sm:py-6 overflow-x-auto no-scrollbar">
              <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 flex gap-3 sm:gap-5 whitespace-nowrap justify-start lg:justify-center">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-black border-2 transition-all ${selectedCategory === cat.id ? 'bg-orange-700 border-orange-700 text-white shadow-lg' : 'bg-white border-orange-50 text-orange-900'}`}>{cat.label}</button>
                ))}
              </div>
            </div>

            <section id="grid" className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 py-12 sm:py-20 relative overflow-hidden">



              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 xl:gap-12 relative z-10">
                {filteredProducts.map(p => {
                  const inStockVariant = p.variants.find(v => v.stock > 0) || p.variants[0];
                  const isAllOutOfStock = p.variants.every(v => v.stock <= 0);

                  return (
                    <div key={p.id} className="group bg-white/95 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-lg border border-amber-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-amber-300 p-2">
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer" onClick={() => { setSelectedProduct(p); setActiveImage(null); setSelectedVariantId(inStockVariant.id); navigate('DETAILS'); }}>
                        <ImageWithFallback
                          src={p.mainImage}
                          alt={`${p.name[lang]} - 100% Organic Traditional Achar`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-amber-600 text-white shadow-lg px-3 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest">{p.category}</span>
                        </div>

                        {/* 100% Natural Stamp */}
                        <div className="absolute top-2 right-2 z-10 opacity-90 rotate-12 drop-shadow-lg">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                            <img src={organicBadge} alt="100% Organic" className="w-full h-full object-contain animate-pulse-slow filter drop-shadow-md" loading="lazy" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex-grow mb-4">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-amber-950 mb-2 leading-tight group-hover:text-amber-700 transition-colors">{p.name[lang]}</h3>
                          <p className="text-sm sm:text-base text-stone-600 line-clamp-2 font-medium leading-relaxed">{p.description[lang]}</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            {!isAllOutOfStock && <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-900">₹{inStockVariant.mrp}</span>}
                            <span className="text-sm sm:text-base text-stone-500 font-bold bg-stone-100 px-3 py-1.5 rounded-lg">{inStockVariant.size}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              disabled={isAllOutOfStock}
                              aria-label={`Add ${p.name[lang]} to cart`}
                              onClick={(e) => { e.stopPropagation(); if (!user) return navigate('LOGIN'); setCart(prev => [...prev, { productId: p.id, variantId: inStockVariant.id, quantity: 1, productName: p.name[lang], size: inStockVariant.size, price: inStockVariant.mrp, image: p.mainImage }]); alert('Added to cart!'); }}
                              className={`py-6 sm:py-8 rounded-2xl text-xl sm:text-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm ${isAllOutOfStock ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-2 border-stone-200' : 'bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300'}`}
                            >
                              <ShoppingCart size={24} />
                              {isAllOutOfStock ? 'Sold Out' : 'Add'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAllOutOfStock) {
                                  const msg = `Hello Babaji Achar, I want to request an order for "${p.name[lang]}" (${inStockVariant.size}). It is currently out of stock. Please notify me when it's available!`;
                                  window.open(`https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                                } else {
                                  setSelectedProduct(p);
                                  setActiveImage(null);
                                  setSelectedVariantId(inStockVariant.id);
                                  navigate('DETAILS');
                                }
                              }}
                              className="bg-amber-50 border-2 border-amber-200 text-amber-900 py-6 sm:py-8 rounded-2xl text-xl sm:text-2xl font-black hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3"
                            >
                              {isAllOutOfStock ? (lang === 'hi' ? 'निवेदन भेजें' : 'Request Order') : 'Buy Now'} <ChevronRight size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-white py-20 border-t border-orange-50">
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="hindi-font text-4xl sm:text-5xl font-black text-orange-950 mb-8">Bhojnamrit Foods: Preserving Indian Culinary Traditions</h2>
                    <div className="space-y-6 text-lg text-stone-600 font-medium leading-relaxed">
                      <p>At <strong className="text-orange-900">Bhojnamrit Foods</strong>, we believe in the sanctity of food. <strong className="text-orange-900">Babaji Achar</strong> was born from a desire to bring the authentic, sun-dried flavors of home back to every table across India.</p>
                      <p>Unlike mass-produced alternatives, our <strong className="text-orange-900">natural pickles</strong> are made in small batches in <strong className="text-orange-900">Prayagraj</strong>, using 100% organic ingredients sourced directly from local farmers. We use no preservatives or synthetic chemicals—only time-honored traditional Indian achar recipes passed down through generations.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-600 mb-4 shadow-sm"><Shield size={32} /></div>
                      <h3 className="font-black text-orange-950 mb-2">100% Organic</h3>
                      <p className="text-sm text-stone-500 font-bold">No Chemicals or Preservatives</p>
                    </div>
                    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-600 mb-4 shadow-sm"><Sparkles size={32} /></div>
                      <h3 className="font-black text-orange-950 mb-2">Handmade</h3>
                      <p className="text-sm text-stone-500 font-bold">Traditional Small Batches</p>
                    </div>
                    <div className="bg-green-50 p-8 rounded-3xl border border-green-100 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm"><Leaf size={32} /></div>
                      <h3 className="font-black text-orange-950 mb-2">Natural</h3>
                      <p className="text-sm text-stone-500 font-bold">Pure Desi Ingredients</p>
                    </div>
                    <div className="bg-orange-900 p-8 rounded-3xl text-white flex flex-col items-center text-center shadow-xl">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-4"><MapPin size={32} /></div>
                      <h3 className="font-black mb-2">Prayagraj</h3>
                      <p className="text-sm text-white/80 font-bold">Heart of Heritage</p>
                    </div>
                  </div>
                </div>

                <div className="mt-20 pt-20 border-t border-stone-100">
                  <h2 className="text-center hindi-font text-4xl sm:text-5xl font-black text-orange-950 mb-16">Why Choose Babaji Achar?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                      <div className="text-4xl">💎</div>
                      <h3 className="text-xl font-black text-orange-900 uppercase tracking-widest">Heritage Recipes</h3>
                      <p className="text-stone-500 font-medium">Authentic Banarasi and Traditional UP recipes preserved for modern health-conscious families.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl">🚜</div>
                      <h3 className="text-xl font-black text-orange-900 uppercase tracking-widest">Organic Sourcing</h3>
                      <p className="text-stone-500 font-medium">We source our mangoes, chillies, and spices directly from organic farms in Uttar Pradesh.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl">🥣</div>
                      <h3 className="text-xl font-black text-orange-900 uppercase tracking-widest">Small Batch Promise</h3>
                      <p className="text-stone-500 font-medium">Every jar of Babaji Achar is packed by hand to ensure the highest quality and taste consistency.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'STORES' && <LocateStores stores={stores} onBack={goBack} />}

        {view === 'DETAILS' && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 animate-in slide-in-from-right duration-500">
            <button onClick={goBack} className="flex items-center gap-2 text-orange-900 mb-6 sm:mb-12 font-black uppercase text-sm tracking-widest hover:gap-3 transition-all">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-50"><ArrowLeft size={18} /></div>
              {t.back}
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
              <div className="space-y-6 sm:space-y-10 max-w-md mx-auto lg:max-w-none">
                <div className="relative rounded-3xl sm:rounded-[3rem] overflow-hidden border-4 border-white bg-white aspect-square shadow-xl w-3/5 lg:w-1/2 mx-auto p-4">
                  <ImageWithFallback src={activeImage || selectedProduct.mainImage} alt={selectedProduct.name[lang]} className="w-full h-full object-contain rounded-2xl sm:rounded-[2rem]" />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div onClick={() => setActiveImage(selectedProduct.mainImage)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border-2 shadow-sm transition-all ${(!activeImage || activeImage === selectedProduct.mainImage) ? 'border-orange-600 scale-105' : 'border-white'}`}>
                    <ImageWithFallback src={selectedProduct.mainImage} alt="Main" className="w-full h-full object-contain" />
                  </div>
                  {selectedProduct.galleryImages.map((img, i) => (
                    <div key={i} onClick={() => setActiveImage(img)} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border-2 shadow-sm transition-all ${activeImage === img ? 'border-orange-600 scale-105' : 'border-white'}`}>
                      <ImageWithFallback src={img} alt={`Gallery ${i}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col py-4">
                <div className="flex items-center mb-4"><span className="bg-orange-700 text-white text-sm font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-md">100% Natural Heritage</span></div>
                <h1 className="hindi-font text-4xl sm:text-6xl lg:text-7xl font-black text-orange-950 mb-6 leading-tight">{selectedProduct.name[lang]}</h1>
                <p className="text-xl sm:text-3xl text-orange-700 italic font-black mb-8 hindi-font">"{selectedProduct.tagline[lang]}"</p>
                <p className="text-lg sm:text-2xl text-stone-600 mb-12 leading-relaxed font-bold">{selectedProduct.description[lang]}</p>

                <div className="mb-12">
                  <h3 className="font-black text-orange-950 mb-6 uppercase tracking-[0.2em] text-lg flex items-center gap-3">Select Pack Size</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProduct.variants.map(v => (
                      <button key={v.id} onClick={() => setSelectedVariantId(v.id)} className={`h-24 sm:h-28 w-full rounded-2xl sm:rounded-3xl border-4 transition-all flex flex-col items-center justify-center ${selectedVariantId === v.id ? 'border-orange-700 bg-orange-700 text-white shadow-md' : 'border-orange-50 bg-white text-orange-950'}`}>
                        <span className="font-black text-xl sm:text-2xl mb-1">{v.size}</span>
                        {v.stock > 0 && <span className={`font-black text-lg sm:text-xl ${selectedVariantId === v.id ? 'text-amber-200' : 'text-orange-700'}`}>₹{v.mrp}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6 mb-12">
                  <div className="flex items-center border-4 border-orange-100 h-24 sm:h-28 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-32 h-full hover:bg-orange-50 text-orange-900 border-r-2 border-orange-100"><Minus size={40} className="mx-auto" /></button>
                    <span className="flex-grow text-center font-black text-5xl text-orange-950">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-32 h-full hover:bg-orange-50 text-orange-900 border-l-2 border-orange-100"><Plus size={40} className="mx-auto" /></button>
                  </div>

                  {/* Action Buttons - Side by Side to match Pack Size buttons */}
                  {/* Action Buttons - Side by Side to match Pack Size buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled={(selectedProduct.variants.find(x => x.id === selectedVariantId)?.stock ?? 0) <= 0}
                      onClick={() => { if (!user) return navigate('LOGIN'); const v = selectedProduct.variants.find(x => x.id === selectedVariantId); if (v) { setCart(prev => [...prev, { productId: selectedProduct.id, variantId: v.id, quantity: qty, productName: selectedProduct.name[lang], size: v.size, price: v.mrp, image: activeImage || selectedProduct.mainImage }]); alert('Added to cart!'); } }}
                      className={`h-24 sm:h-28 border-4 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-2 active:scale-95 transition-all whitespace-nowrap ${(selectedProduct.variants.find(x => x.id === selectedVariantId)?.stock ?? 0) <= 0 ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed' : 'bg-white text-orange-950 border-orange-200 hover:bg-orange-50 hover:border-orange-300'}`}
                    >
                      <ShoppingCart size={32} /> {(selectedProduct.variants.find(x => x.id === selectedVariantId)?.stock ?? 0) <= 0 ? (lang === 'hi' ? 'स्टॉक खत्म' : 'Out of Stock') : t.add}
                    </button>
                    <button
                      onClick={() => {
                        const v = selectedProduct.variants.find(x => x.id === selectedVariantId);
                        if (!v) return;
                        if (v.stock <= 0) {
                          const msg = `Hello Babaji Achar, I want to request an order for "${selectedProduct.name[lang]}" (${v.size}). It is currently out of stock. Please notify me when it's available!`;
                          window.open(`https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                          return;
                        }
                        if (!user) return navigate('LOGIN');
                        setCart(prev => [...prev, { productId: selectedProduct.id, variantId: v.id, quantity: qty, productName: selectedProduct.name[lang], size: v.size, price: v.mrp, image: activeImage || selectedProduct.mainImage }]);
                        navigate('CHECKOUT');
                      }}
                      className={`h-24 sm:h-28 border-4 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl shadow-lg flex flex-col sm:flex-row items-center justify-center gap-2 active:scale-95 transition-all whitespace-nowrap ${(selectedProduct.variants.find(x => x.id === selectedVariantId)?.stock ?? 0) <= 0 ? 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200' : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100 hover:border-orange-300'}`}
                    >
                      {(selectedProduct.variants.find(x => x.id === selectedVariantId)?.stock ?? 0) <= 0 ? (lang === 'hi' ? 'निवेदन भेजें' : 'Request Order') : t.orderNow} <ArrowRight size={32} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Description & Ingredients Section - NEW */}
            <div className="mt-16 sm:mt-24 border-t border-orange-100 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
                <div className="space-y-6">
                  <h3 className="hindi-font text-3xl font-black text-orange-950 flex items-center gap-3">
                    <span className="text-4xl">📝</span> {lang === 'hi' ? 'उत्पाद विवरण' : 'Product Description'}
                  </h3>
                  <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 shadow-inner">
                    <p className="text-lg text-stone-700 leading-relaxed font-medium">
                      {selectedProduct.description[lang]}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-orange-800 shadow-sm border border-orange-100">🚫 No Preservatives</span>
                      <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-orange-800 shadow-sm border border-orange-100">☀️ Sun Dried</span>
                      <span className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-orange-800 shadow-sm border border-orange-100">🖐️ Hand Made</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="hindi-font text-3xl font-black text-orange-950 flex items-center gap-3">
                    <span className="text-4xl">🌿</span> {lang === 'hi' ? 'सामग्री' : 'Ingredients'}
                  </h3>
                  <div className="bg-white p-8 rounded-[2rem] border-2 border-green-100 shadow-md">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProduct.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-stone-700 font-bold">
                          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>


            {/* Customer Reviews Section */}
            <div className="mt-20 sm:mt-32 pt-16 border-t border-orange-100">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                  <h2 className="hindi-font text-4xl sm:text-6xl font-black text-orange-950">{t.reviews}</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                    <Star className="text-amber-500 fill-amber-500" size={20} />
                    <span className="font-black text-xl text-orange-950">
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0
                        ? (selectedProduct.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedProduct.reviews.length).toFixed(1)
                        : "5.0"}
                    </span>
                    <span className="text-stone-400 font-bold">({selectedProduct.reviews?.length || 0})</span>
                  </div>
                </div>

                {/* Review Form (Only for Verified Buyers) */}
                {user && isVerifiedBuyer(selectedProduct.id) && (
                  <div className="bg-white p-6 sm:p-10 rounded-3xl border-2 border-orange-100 shadow-xl mb-16 animate-in slide-in-from-bottom duration-500">
                    <h3 className="hindi-font text-2xl sm:text-3xl font-black text-orange-950 mb-6 flex items-center gap-3">
                      <MessageCircle size={28} className="text-orange-700" /> {t.writeReview}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div>
                        <label className="text-sm font-black text-stone-400 uppercase tracking-widest mb-3 block">{t.rating}</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="transition-transform active:scale-90"
                            >
                              <Star
                                size={32}
                                className={`${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'} transition-colors`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-black text-stone-400 uppercase tracking-widest mb-3 block">{t.comment}</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full p-6 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-orange-600 font-medium text-lg min-h-[120px] shadow-inner"
                          placeholder="Tell us what you liked about this pickle..."
                          required
                        />
                      </div>
                      <button type="submit" className="bg-orange-800 text-white px-10 py-4 rounded-xl font-black text-lg shadow-lg hover:bg-orange-950 active:scale-95 transition-all w-full sm:w-auto">
                        {t.submitReview}
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-8">
                  {!selectedProduct.reviews || selectedProduct.reviews.length === 0 ? (
                    <div className="text-center py-16 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                      <Star size={40} className="mx-auto text-stone-200 mb-4" />
                      <p className="text-stone-400 font-bold">{t.noReviews}</p>
                    </div>
                  ) : (
                    selectedProduct.reviews.map(review => (
                      <div key={review.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-orange-50 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-800 text-sm">
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-orange-950">{review.userName}</p>
                                <div className="flex items-center gap-1">
                                  <ShieldCheck size={14} className="text-green-600" />
                                  <span className="text-sm font-black text-green-600 uppercase tracking-widest">{t.verifiedBuyer}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'} />
                              ))}
                            </div>
                            <span className="text-sm text-stone-400 font-bold">{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-stone-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'CART' && (
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 animate-in fade-in duration-500">
            <button onClick={goBack} className="flex items-center gap-2 text-orange-900 mb-6 font-black uppercase text-sm tracking-widest"><ArrowLeft size={18} /> {t.back}</button>
            <h1 className="hindi-font text-4xl sm:text-6xl font-black text-orange-950 mb-8 sm:mb-12">{t.cart}</h1>
            {cart.length === 0 ? (
              <div className="text-center py-16 sm:py-32 bg-white rounded-3xl border border-dashed border-orange-100 shadow-sm"><p className="text-stone-400 font-bold text-lg mb-8">{t.cartEmpty}</p><button onClick={() => setView('HOME')} className="bg-orange-800 text-white px-10 py-4 rounded-xl font-black shadow-md">{t.startShopping}</button></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-orange-50 shadow-sm">
                      <ImageWithFallback src={item.image} alt={item.productName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-50 border border-orange-50 shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-black text-lg sm:text-xl text-orange-950">{item.productName}</h4>
                        <p className="text-sm font-bold text-stone-400 uppercase">{item.size}</p>
                        <p className="text-orange-700 font-black text-lg">₹{item.price * item.quantity}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              const newCart = [...cart];
                              if (newCart[i].quantity > 1) {
                                newCart[i].quantity -= 1;
                                setCart(newCart);
                              }
                            }}
                            className="w-8 h-8 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 flex items-center justify-center font-bold"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-black text-orange-950">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const newCart = [...cart];
                              newCart[i].quantity += 1;
                              setCart(newCart);
                            }}
                            className="w-8 h-8 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 flex items-center justify-center font-bold"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="p-3 text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-950 text-white p-8 rounded-3xl shadow-xl h-fit">
                  <h3 className="text-stone-400 text-sm font-black uppercase tracking-widest mb-6">{t.orderSummary}</h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-base"><span>{t.subtotal}</span><span className="font-bold">₹{cartSubtotal}</span></div>

                    {/* No bulk discount anymore */}
                    {cartValues.couponDiscount > 0 && (
                      <div className="flex justify-between text-base text-green-400">
                        <span>{t.coupon} ({appliedCoupon?.code})</span>
                        <span className="font-bold">-₹{cartValues.couponDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base">
                      <span>{t.deliveryCharges}</span>
                      {cartValues.isFreeDelivery ? (
                        <span className="font-bold text-green-400">FREE (Orders &gt; ₹999)</span>
                      ) : (
                        <span className="font-bold">₹50</span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-between text-2xl font-black text-amber-500">
                      <span>{t.total}</span>
                      <span>₹{cartValues.finalTotal}</span>
                    </div>
                  </div>
                  {cartValues.bulkDiscount === 0 && (
                    <p className="text-xs text-stone-400 mb-4 text-center">{t.tipBulk}</p>
                  )}
                  <button onClick={() => navigate('CHECKOUT')} className="w-full bg-white text-orange-950 py-4 rounded-xl font-black shadow-lg active:scale-95 transition-all">{t.checkout}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'CHECKOUT' && (
          <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 animate-in fade-in duration-500">
            <button onClick={goBack} className="flex items-center gap-2 text-orange-900 mb-6 font-black uppercase text-sm tracking-widest"><ArrowLeft size={18} /> {t.back}</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
              <div className="space-y-8">
                <div><h1 className="hindi-font text-4xl sm:text-6xl font-black text-orange-950 mb-4">{t.checkout}</h1><p className="text-stone-500 font-bold">{t.completeDetails}</p></div>
                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-orange-100 shadow-xl space-y-6 sm:space-y-8">
                  <div className="space-y-4">
                    <h3 className="hindi-font text-xl sm:text-2xl font-black text-orange-900 flex items-center gap-2"><MapPin size={24} /> {t.address}</h3>
                    <input type="text" placeholder={t.name} className="w-full p-4 sm:p-5 bg-stone-50 rounded-xl border border-orange-50 outline-none focus:border-orange-500 font-bold" id="c-name" value={checkoutName} onChange={(e) => setCheckoutName(e.target.value)} required />
                    <input type="text" placeholder={t.address} className="w-full p-4 sm:p-5 bg-stone-50 rounded-xl border border-orange-50 outline-none focus:border-orange-500 font-bold" id="c-addr" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4"><input type="text" placeholder={t.cityPlaceholder} className="w-full p-4 sm:p-5 bg-stone-50 rounded-xl border border-orange-50 outline-none focus:border-orange-500 font-bold" defaultValue="Prayagraj" readOnly /><input type="text" placeholder={t.pincodePlaceholder} className="w-full p-4 sm:p-5 bg-stone-50 rounded-xl border border-orange-50 outline-none focus:border-orange-500 font-bold" id="c-pin" value={checkoutPin} onChange={(e) => setCheckoutPin(e.target.value)} required /></div>
                    <input
                      type="tel"
                      placeholder={t.phone}
                      className="w-full p-4 sm:p-5 bg-stone-50 rounded-xl border border-orange-50 outline-none focus:border-orange-500 font-bold"
                      id="c-phone"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4 pt-6 sm:pt-8 border-t border-dashed border-orange-100">
                    <h3 className="font-black text-stone-400 uppercase tracking-widest mb-6 text-sm">{t.orderPreview}</h3>
                    <div className="space-y-4 mb-6">
                      {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-base sm:text-lg font-bold text-stone-600 border-b border-stone-200 pb-2">
                          <span>{item.productName} (x{item.quantity})</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>


                    <div className="space-y-2 mb-4 text-sm font-bold text-stone-500 border-t border-dashed border-stone-200 pt-4">
                      <div className="flex justify-between"><span>{t.subtotal}</span><span>₹{cartSubtotal}</span></div>

                      <div className="flex justify-between">
                        <span>{t.deliveryCharges}</span>
                        {cartValues.isFreeDelivery ? <span className="text-green-600">FREE</span> : <span>₹50</span>}
                      </div>

                      {cartValues.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600 items-center">
                          <div className="flex items-center gap-2">
                            <span>{t.coupon} ({appliedCoupon?.code})</span>
                            <button onClick={() => { setAppliedCoupon(null); }} className="bg-red-50 text-red-500 text-[10px] font-black uppercase px-2 py-0.5 rounded hover:bg-red-100 transition-colors">Remove</button>
                          </div>
                          <span>-₹{cartValues.couponDiscount}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-2xl font-black text-orange-950 pt-4 border-t-2 border-stone-200"><span>{t.total}</span><span>₹{cartValues.finalTotal}</span></div>

                    {/* Marketing Consent Checkbox */}
                    <div className="mt-6 pt-6 border-t border-dashed border-orange-100">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={marketingConsent.whatsapp}
                          onChange={(e) => setMarketingConsent({ ...marketingConsent, whatsapp: e.target.checked })}
                          className="mt-1 w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-stone-600 font-medium leading-relaxed">
                          I agree to receive order updates and offers from <strong>Baba Ji Achar</strong> on WhatsApp.
                          <br />
                          <span className="text-xs text-stone-400 hindi-font">मैं बाबा जी अचार से व्हाट्सएप पर अपडेट और ऑफर प्राप्त करने के लिए सहमत हूं।</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-10 rounded-3xl h-fit border border-stone-100 shadow-xl">
                <h3 className="hindi-font text-xl sm:text-2xl font-black text-orange-900 flex items-center gap-2 mb-6"><ShieldCheck size={24} /> {t.paymentMethod || "Secure Payment"}</h3>

                {/* Secure Payment Block */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mb-8 text-center">
                  <p className="text-stone-500 font-bold mb-6 text-sm">Select a payment method to complete your order safely.</p>

                  {/* Razorpay Button */}
                  <button onClick={() => {
                    if (!checkoutName || !checkoutAddress || !checkoutPin || !loginPhone) {
                      return alert("Please fill all Shipping details first.");
                    }
                    if (loginPhone.length !== 10) return alert("Please enter a valid 10-digit phone number");

                    handleRazorpayPayment(cartValues.finalTotal, { fullName: checkoutName, phone: loginPhone, street: checkoutAddress, city: 'Prayagraj', state: 'UP', pincode: checkoutPin });

                  }} className="w-full bg-[#3395ff] text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-[#2b84e6] active:scale-95 transition-all flex items-center justify-center gap-3 mb-4 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">Pay ₹{cartValues.finalTotal} <ArrowRight size={20} /></span>
                  </button>

                  {/* Cash on Delivery (COD) Button */}
                  <button
                    disabled={isCodLoading}
                    onClick={async (e) => {
                      e.preventDefault();

                      // Validation
                      if (!checkoutName || !checkoutAddress || !checkoutPin || !loginPhone) {
                        alert("Please fill all required fields");
                        return;
                      }
                      if (loginPhone.length !== 10) {
                        alert("Please enter a valid 10-digit phone number");
                        return;
                      }

                      // Execute COD Order
                      await executeCODOrder(cartValues.finalTotal, {
                        fullName: checkoutName,
                        phone: loginPhone,
                        street: checkoutAddress,
                        city: 'Prayagraj',
                        state: 'UP',
                        pincode: checkoutPin
                      });

                    }} className={`w-full bg-yellow-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-yellow-600 active:scale-95 transition-all flex items-center justify-center gap-3 mb-4 group relative overflow-hidden ${isCodLoading ? 'opacity-75 cursor-not-allowed' : ''}`}>

                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      {isCodLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          💵 {lang === 'hi' ? 'कैश ऑन डिलीवरी' : 'Cash on Delivery'}
                        </>
                      )}
                    </span>
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-stone-400 grayscale opacity-60">
                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Shield size={12} /> 100% Secure</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">|</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">PCI DSS Compliant</span>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <div className="bg-white border border-stone-200 px-3 py-1 rounded text-[10px] font-bold text-stone-600">UPI</div>
                    <div className="bg-white border border-stone-200 px-3 py-1 rounded text-[10px] font-bold text-stone-600">Cards</div>
                    <div className="bg-white border border-stone-200 px-3 py-1 rounded text-[10px] font-bold text-stone-600">NetBanking</div>
                    <div className="bg-white border border-stone-200 px-3 py-1 rounded text-[10px] font-bold text-stone-600">Wallets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {
          view === 'SUCCESS' && currentOrder && (
            <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in zoom-in duration-500">
              <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border-4 border-orange-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-500"></div>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><CheckCircle2 size={48} className="text-green-600" /></div>
                <h2 className="hindi-font text-4xl sm:text-5xl font-black text-orange-950 mb-4">Order Placed!</h2>
                <p className="text-stone-500 font-medium mb-8">Thank you {user?.name}. We have received your order request.</p>
                <div className="bg-orange-50 p-6 rounded-2xl mb-8 border border-orange-100">
                  <p className="text-sm font-black uppercase tracking-widest text-orange-400 mb-2">Order ID</p>
                  <p className="text-2xl font-black text-orange-900 font-mono tracking-wider mb-4">{currentOrder.id}</p>


                </div>

                {/* Security Note */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
                  <p className="text-red-700 font-bold text-sm leading-relaxed mb-2">
                    ⚠️ Important: It is mandatory to send WhatsApp confirmation for security and authenticity verification.
                  </p>
                  <p className="text-red-700 font-bold text-sm leading-relaxed hindi-font">
                    ⚠️ महत्वपूर्ण: सुरक्षा और प्रमाणिकता के लिए व्हाट्सएप पर पुष्टि भेजना अनिवार्य है।
                  </p>
                </div>

                <div className="space-y-4">
                  <a href={generateWhatsAppLink(currentOrder)} target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2"><WhatsAppIcon /> Send to WhatsApp</a>
                  <button onClick={() => { setCurrentOrder(null); setView('HOME'); }} className="w-full bg-stone-100 text-stone-600 py-4 rounded-xl font-bold hover:bg-stone-200 transition-all text-lg">Continue Shopping</button>
                  <p className="text-sm text-stone-400 font-bold mt-4">* Sending to WhatsApp is mandatory for fast processing</p>
                </div>
              </div>
            </div>
          )
        }

        {
          view === 'PROFILE' && user && (
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 animate-in slide-in-from-right duration-500">
              <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-orange-900 mb-8 font-black uppercase text-sm tracking-widest"><ArrowLeft size={18} /> Home</button>

              <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4 space-y-6">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-xl text-center">
                    <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black text-orange-800">{user.name.charAt(0)}</div>
                    <h2 className="text-xl font-black text-orange-950">{user.name}</h2>
                    <p className="text-base font-bold text-stone-400 mb-6">{user.phone}</p>
                    <div className="space-y-3">
                      <button onClick={() => setView('EDIT_PROFILE')} className="w-full py-3 bg-orange-50 text-orange-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Settings size={16} /> Edit Profile</button>
                      <button onClick={handleLogout} className="w-full py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 transition-colors"><LogIn size={16} className="rotate-180" /> Logout</button>
                    </div>
                  </div>
                  {user.role === 'ADMIN' && (
                    <div className="bg-orange-900 p-6 sm:p-8 rounded-3xl shadow-xl text-white">
                      <h3 className="flex items-center gap-2 font-black mb-4"><ShieldCheck size={20} className="text-amber-400" /> Admin Panel</h3>
                      <p className="text-xs text-orange-200 mb-6 font-medium">Manage orders and store settings.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 p-3 rounded-xl text-center"><p className="text-2xl font-black text-amber-400">{orders.length}</p><p className="text-xs uppercase tracking-wider">Orders</p></div>
                        <div className="bg-white/10 p-3 rounded-xl text-center"><p className="text-2xl font-black text-amber-400">₹{orders.reduce((a, b) => a + b.totalAmount, 0)}</p><p className="text-xs uppercase tracking-wider">Revenue</p></div>
                      </div>
                      <button onClick={() => setView('ADMIN')} className="w-full mt-6 py-3 bg-white text-orange-950 rounded-xl font-black text-sm hover:bg-amber-50 transition-colors">Open Dashboard</button>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="flex-grow space-y-8 sm:space-y-12">
                  <div>
                    <h3 className="hindi-font text-3xl font-black text-orange-950 mb-6 sm:mb-8 flex items-center gap-3"><Package size={28} className="text-orange-700" /> My Orders</h3>

                    {orders.filter(o => o.customerDetails.phone === user.phone).length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-200"><p className="text-stone-400 font-bold">No orders found.</p></div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {orders.filter(o => o.customerDetails.phone === user.phone).map(order => (
                          <div key={order.id} className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-stone-100">
                              <div>
                                <p className="font-black text-lg text-orange-950">#{order.id}</p>
                                <p className="text-sm font-bold text-stone-400">{new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString()}</p>
                              </div>
                              <div className={`px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-base font-medium text-stone-600">
                                  <span>{item.productName} x{item.quantity} ({item.size})</span>
                                  <span className="font-bold">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-stone-100 gap-4">
                              <p className="font-black text-xl text-orange-900">Total: ₹{order.totalAmount}</p>
                              <a href={generateWhatsAppLink(order)} target="_blank" rel="noreferrer" className="text-sm font-black text-[#25D366] hover:underline flex items-center gap-1"><WhatsAppIcon size={16} /> Track on WhatsApp</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {
          view === 'ADMIN' && user?.role === 'ADMIN' && (
            <AdminDashboard
              orders={orders}
              products={products}
              stores={stores}
              updateOrderStatus={updateOrderStatus}
              deleteOrder={deleteOrder}
              onUpdateStock={updateProductVariant}
              onAddStore={addStore}
              onDeleteStore={deleteStore}
              onLogout={() => {
                setUser(null);
                localStorage.removeItem('bj_user');
                navigate('HOME');
              }}
              onNavigateHome={() => navigate('HOME')}
              firebaseError={firebaseError} // PASS ERROR HERE
            />)}
        {
          (view === 'PRIVACY' || view === 'REFUND' || view === 'TERMS' || view === 'DISCLAIMER') && (
            <LegalPage type={view} onBack={goBack} />
          )
        }

      </main >

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-stone-950 text-stone-300 mt-20 sm:mt-32">
        {/* Newsletter Section */}
        <div className="bg-orange-900 py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h3 className="hindi-font text-3xl sm:text-5xl font-black text-amber-100 mb-4">स्वाद जो दिल जीत ले</h3>
            <p className="text-orange-200 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium">Join our family to get exclusive offers, new flavor alerts, and traditional recipes delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input type="email" placeholder="Enter your email address" className="bg-white/10 backdrop-blur-sm border-2 border-orange-400/30 text-white placeholder-orange-200 px-6 py-3 rounded-xl focus:border-amber-300 outline-none flex-grow font-bold" />
              <button className="bg-amber-100 text-orange-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-colors shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        {/* Main Footer Content - Strict Horizontal Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-stone-800 bg-stone-950/20 backdrop-blur-xl shrink-0">
          {/* Section 1: Brand & Identity (Top Row) */}
          <div className="mb-20">
            <div className="flex flex-col space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('HOME')}>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-all duration-500">
                  <span className="font-black text-2xl">B</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="hindi-font text-3xl font-black text-amber-100 leading-none">{BRAND_CONFIG.PRODUCT_BRAND}</h2>
                  <span className="text-xs text-stone-500 font-bold uppercase tracking-[0.2em] mt-1">Authentic Tradition</span>
                </div>
              </div>
              <p className="text-stone-400 text-sm font-medium leading-relaxed max-w-2xl">
                Handcrafted with love in Prayagraj. We bring you the authentic taste of Indian heritage using 100% organic ingredients and traditional sun-drying methods.
              </p>
              <div className="flex gap-4">
                <a href={BRAND_CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-pink-500 hover:border-pink-500/50 transition-all"><Instagram size={20} /></a>
                <a href={`https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-green-500 hover:border-green-500/50 transition-all"><WhatsAppIcon size={20} /></a>
              </div>
            </div>
          </div>

          {/* Section 2: 3-Column Parallel Grid - STRICTLY FORCED SIDE-BY-SIDE */}
          <div className="grid grid-cols-3 gap-4 sm:gap-12 lg:gap-16 items-start">

            {/* Column 1: Navigation */}
            <div className="flex flex-col w-full">
              <h4 className="flex items-center gap-2 sm:gap-4 text-amber-100 font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[8px] sm:text-xs mb-8 whitespace-nowrap">
                <span className="h-px bg-stone-800/60 flex-grow min-w-[10px] sm:max-w-[40px]"></span>
                <span className="shrink-0">NAVIGATION</span>
                <span className="h-px bg-stone-800/60 flex-grow"></span>
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base font-bold text-stone-400">
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('HOME')}>Home</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('HOME')}>Our Shop</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('STORES')}>Store Locator</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer italic"><a href="/sitemap.xml">Sitemap</a></li>
              </ul>
            </div>

            {/* Column 2: Legal & Policy */}
            <div className="flex flex-col w-full border-l border-stone-800/30 pl-4 sm:pl-10 lg:pl-12">
              <h4 className="flex items-center gap-2 sm:gap-4 text-amber-100 font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[8px] sm:text-xs mb-8 whitespace-nowrap">
                <span className="h-px bg-stone-800/60 flex-grow min-w-[10px] sm:max-w-[40px]"></span>
                <span className="shrink-0">LEGAL</span>
                <span className="h-px bg-stone-800/60 flex-grow"></span>
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base font-bold text-stone-400">
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('PRIVACY')}>Privacy Policy</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('REFUND')}>Refund Policy</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('TERMS')}>Terms & Conditions</li>
                <li className="hover:text-amber-400 transition-colors cursor-pointer" onClick={() => navigate('DISCLAIMER')}>Disclaimer</li>
              </ul>
            </div>

            {/* Column 3: Keep in Touch */}
            <div className="flex flex-col w-full border-l border-stone-800/30 pl-4 sm:pl-10 lg:pl-12">
              <h4 className="flex items-center gap-2 sm:gap-4 text-amber-100 font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[8px] sm:text-xs mb-8 whitespace-nowrap">
                <span className="h-px bg-stone-800/60 flex-grow min-w-[10px] sm:max-w-[40px]"></span>
                <span className="shrink-0">KEEP IN TOUCH</span>
                <span className="h-px bg-stone-800/60 flex-grow"></span>
              </h4>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 text-stone-300 group overflow-hidden">
                  <Mail size={14} className="text-orange-600 shrink-0 sm:w-[16px] sm:h-[16px]" />
                  <span className="text-[10px] sm:text-sm font-black group-hover:text-amber-400 transition-colors cursor-pointer truncate">{BRAND_CONFIG.EMAIL}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-stone-300 overflow-hidden">
                  <Phone size={14} className="text-orange-600 shrink-0 sm:w-[16px] sm:h-[16px]" />
                  <span className="text-[10px] sm:text-sm font-black truncate">+91 {BRAND_CONFIG.WHATSAPP_NUMBER}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-stone-400 overflow-hidden">
                  <MapPin size={14} className="text-stone-600 shrink-0 sm:w-[16px] sm:h-[16px]" />
                  <span className="text-[10px] sm:text-sm font-bold leading-tight truncate">Prayagraj, UP, India</span>
                </div>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-stone-900/40 rounded-lg border border-stone-800/50 text-[7px] sm:text-[9px] font-black text-stone-500 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Secure UPI</div>
                <div className="px-2 py-1 bg-stone-900/40 rounded-lg border border-stone-800/50 text-[7px] sm:text-[9px] font-black text-stone-500 uppercase tracking-[0.1em] sm:tracking-[0.2em]">Small Batch</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-900 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm font-bold text-center md:text-left">
              &copy; {new Date().getFullYear()} {BRAND_CONFIG.PARENT_BRAND}. <span className="text-stone-700 mx-2">|</span> All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-stone-500 text-sm font-bold">
              Made with <Star size={12} className="text-amber-600 fill-amber-600" /> in India
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${BRAND_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Namaste! I'm interested in Baba Ji Achar products. Can you please help me?")}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform hover:shadow-green-900/30 active:scale-95 flex items-center gap-3 group border-4 border-white animate-in zoom-in duration-500"
      >
        <WhatsAppIcon size={32} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-sm">Chat with us</span>
      </a>
    </div >
  );
};

const App: React.FC = () => (
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
);

export default App;
