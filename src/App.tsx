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
    <div>
    hello</div>
   
  );
};

const App: React.FC = () => (
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
);

export default App;

