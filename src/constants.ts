
// --- FESTIVAL & EVENT CONFIGURATION ---
export interface FestivalConfig {
    id: string;
    name: string;
    greeting: string;
    offer: string;
    offerCode: string; // e.g., 'DIWALI20'
    colors: { from: string; to: string; text: string };
    icons: string[]; // Floating emojis
    isActive: boolean; // Computed at runtime
}

const CURRENT_DATE = new Date();

// Helper to check if today matches a specific day/month
const isDate = (d: number, m: number) => CURRENT_DATE.getDate() === d && CURRENT_DATE.getMonth() === m - 1;

export const GET_ACTIVE_FESTIVAL = (): FestivalConfig | null => {
    // 1. Republic Day (Jan 26)
    if (isDate(26, 1)) return {
        id: 'REPUBLIC_DAY',
        name: 'Republic Day',
        greeting: 'Happy Republic Day! 🇮🇳',
        offer: 'Free Delivery on Orders above ₹999',
        offerCode: 'JAIHIND',
        colors: { from: 'from-orange-500', to: 'to-green-600', text: 'text-blue-800' },
        icons: ['🇮🇳', '🪷', '🕌', '🏏', '✨', '🐅', '🫡', '🇮🇳'],
        isActive: true
    };

    // 2. Holi (March 14, 2025 - approx)
    if (isDate(14, 3)) return {
        id: 'HOLI',
        name: 'Holi',
        greeting: 'Happy Holi! 🎨',
        offer: 'Flat 20% OFF on Sweet Pickles',
        offerCode: 'HOLIHAI',
        colors: { from: 'from-pink-500', to: 'to-purple-600', text: 'text-pink-700' },
        icons: ['🎨', '🔫', '🎈', '💧', '🌈', '💜', '🖌️'],
        isActive: true
    };

    // 3. Diwali (Oct 20, 2025 - approx)
    if (isDate(20, 10)) return {
        id: 'DIWALI',
        name: 'Diwali',
        greeting: 'Happy Diwali! 🪔',
        offer: 'Free Gift Box with Family Packs',
        offerCode: 'LAXMI',
        colors: { from: 'from-amber-500', to: 'to-red-600', text: 'text-amber-900' },
        icons: ['🪔', '✨', '🎇', '🧨', '🍬', '🕉️', '🕯️'],
        isActive: true
    };

    // 4. Valentine's Day (Feb 14)
    if (isDate(14, 2)) return {
        id: 'VALENTINE',
        name: "Valentine's Day",
        greeting: 'Share the Love ❤️',
        offer: 'Buy 1 Get 1 on Sweet Mango',
        offerCode: 'LOVE25',
        colors: { from: 'from-red-500', to: 'to-pink-500', text: 'text-red-800' },
        icons: ['❤️', '🌹', '💑', '🍫', '💌', '🧸', '💘'],
        isActive: true
    };

    // 5. Christmas (Dec 25)
    if (isDate(25, 12)) return {
        id: 'CHRISTMAS',
        name: "Christmas",
        greeting: 'Merry Christmas! 🎄',
        offer: 'Holiday Special: 15% OFF',
        offerCode: 'SANTA',
        colors: { from: 'from-red-600', to: 'to-green-700', text: 'text-red-900' },
        icons: ['🎄', '🎅', '❄️', '⛄', '🎁', '🔔', '🦌'],
        isActive: true
    };



    // --- DEMO MODE: Winter Special (Active) ---
    if (isDate(27, 1)) return {
        id: 'WINTER_FEST',
        name: 'Winter Season Special',
        greeting: 'Winter Delights! ❄️',
        offer: 'Limited Time: Free Shipping Today!',
        offerCode: 'WINTER25',
        colors: { from: 'from-blue-400', to: 'to-indigo-600', text: 'text-blue-900' },
        icons: ['❄️', '⛄', '🧤', '☕', '🧣', '🌬️', '🧥', '🧊'],
        isActive: true
    };

    return null;
};

export const BRAND_CONFIG = {
    PARENT_BRAND: "Bhojnamrit Foods",
    PRODUCT_BRAND: "बाबा जी",
    WHATSAPP_NUMBER: "917754865997",
    UPI_ID: "7754865997@kotak811",
    DELIVERY_AREA: "Prayagraj Only (प्रयागराज)",
    INSTAGRAM_URL: "https://www.instagram.com/babajiachar/",
    LOGO_URL: "/images/logo.jpg",
    EMAIL: "mailbabajiachar@gmail.com",
    QR_IMAGE: "/images/payment_qr_new.jpg",
    BANK_DETAILS: {
        ACCOUNT_NO: "6050917404",
        IFSC: "KKBK0005076",
        BRANCH: "ALLAHABAD-CHOWK"
    }
};

/**
 * RELIABILITY UPDATE:
 * Google Drive links are often blocked. Switched to high-performance Unsplash URLs 
 * that are optimized for e-commerce performance.
 */

export const INITIAL_PRODUCTS = [
    {
        id: "mixed-pickle-01",
        category: "Mix",
        name: { hi: "मिश्रित अचार", en: "Mixed Pickle" },
        description: {
            hi: "विभिन्न मौसमी सब्जियों और मसालों का बेहतरीन मिश्रण। शुद्ध सरसों के तेल में निर्मित।",
            en: "Baba Ji Mix Pickle from Bhojnamrit Foods is a colorful Prayagraj famous achar made with raw mango, lemon, carrot, and green chilli. This 100% organic achar brings a perfect balance of spice and tang, representing natural achar from Prayagraj."
        },
        tagline: { hi: "पीढ़ियों की परंपरा से बना शुद्ध देसी अचार", en: "Pure Traditional Homemade Pickle" },
        mainImage: "/images/mixed_replacement.jpg",
        galleryImages: [
            "/images/mixed_replacement.jpg",
            "/images/mixed.jpg",
            "https://images.unsplash.com/photo-1589135340945-df939bcbf41e?q=80&w=800&auto=format&fit=crop"
        ],
        ingredients: ["Raw Mango", "Carrot", "Lemon", "Green Chilli", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: true,
        isActive: true,
        variants: [
            { id: "v-100", size: "100g", mrp: 30, stock: 100 },
            { id: "v-250", size: "250g", mrp: 100, stock: 50 },
            { id: "v-500", size: "500g", mrp: 180, stock: 30 },
            { id: "v-1kg", size: "1kg", mrp: 340, stock: 15 }
        ]
    },
    {
        id: "aawla-pickle-01",
        category: "Aawla",
        name: { hi: "आंवला का अचार", en: "Aawla Pickle" },
        description: {
            hi: "सेहत और स्वाद से भरपूर आंवला का पारंपरिक अचार। विटामिन-सी का खजाना।",
            en: "Baba Ji Awla Pickle from Bhojnamrit Foods is a traditional Prayagraj famous achar made from fresh amla and pure mustard oil. This 100% organic achar offers a balanced tangy flavor and represents the natural achar heritage of Prayagraj."
        },
        tagline: { hi: "सेहत और स्वाद का अनोखा संगम", en: "A Perfect Blend of Health and Taste" },
        mainImage: "/images/aawla_update.jpg",
        galleryImages: ["/images/aawla_update.jpg", "/images/aawla.jpg"],
        ingredients: ["Fresh Amla", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: true,
        isActive: true,
        variants: [
            { id: "v-250", size: "250g", mrp: 180, stock: 30 },
            { id: "v-500", size: "500g", mrp: 350, stock: 25 }
        ]
    },
    {
        id: "kathal-pickle-01",
        category: "Kathal",
        name: { hi: "कटहल का अचार", en: "Kathal Pickle" },
        description: {
            hi: "मसालेदार और चटपटा कटहल का अचार। मां के हाथों जैसा असली देसी स्वाद।",
            en: "Baba Ji Kathal Pickle by Bhojnamrit Foods is a rare Prayagraj famous achar made from raw jackfruit with visible natural texture. This 100% organic achar is slow-marinated in mustard oil, offering a rich natural achar taste from Prayagraj."
        },
        tagline: { hi: "स्वाद जो आपको बचपन की याद दिला दे", en: "Taste That Takes You Back Home" },
        mainImage: "/images/kathal_update.jpg",
        galleryImages: ["/images/kathal_update.jpg", "/images/kathal.jpg"],
        ingredients: ["Raw Jackfruit", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: true,
        isActive: true,
        variants: [
            { id: "v-250", size: "250g", mrp: 150, stock: 20 },
            { id: "v-500", size: "500g", mrp: 280, stock: 15 },
            { id: "v-1kg", size: "1kg", mrp: 540, stock: 10 }
        ]
    },
    {
        id: "red-chilli-pickle-01",
        category: "Chilli",
        name: { hi: "बनारसी भरवा लाल मिर्च", en: "Banarasi Red Chilli" },
        description: {
            hi: "बनारस की मशहूर भरवा लाल मिर्च। मोटे मसालों और अमचूर का भरपूर स्वाद।",
            en: "Baba Ji Lal Bharwa Mirch Pickle by Bhojnamrit Foods is a bold and authentic Prayagraj famous achar, made using traditional methods. This 100% organic achar is prepared with hand-selected red chillies and pure mustard oil, delivering a rich, natural achar taste rooted in Prayagraj."
        },
        tagline: { hi: "बनारस का विश्व प्रसिद्ध स्वाद", en: "The World-Famous Taste of Banaras" },
        mainImage: "/images/red_chilli_update.jpg",
        galleryImages: ["/images/red_chilli_update.jpg", "/images/red-chilli.jpg"],
        ingredients: ["Fresh Red Stuffed Chillies", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: true,
        isActive: true,
        variants: [
            { id: "v-250", size: "250g", mrp: 190, stock: 25 },
            { id: "v-500", size: "500g", mrp: 360, stock: 20 },
            { id: "v-1kg", size: "1kg", mrp: 700, stock: 10 }
        ]
    },
    {
        id: "suran-pickle-01",
        category: "Suran",
        name: { hi: "सूरन (जिमीकंद) का अचार", en: "Suran (Yam) Pickle" },
        description: {
            hi: "देसी सूरन और शुद्ध मसालों से बना पारंपरिक अचार। स्वास्थ्य के लिए लाभदायक।",
            en: "Baba Ji Suran Pickle by Bhojnamrit Foods is a hearty Prayagraj famous achar made from fresh elephant foot yam. Preserved in mustard oil, this 100% organic achar reflects the natural achar legacy of Prayagraj."
        },
        tagline: { hi: "स्वाद और सेहत का खजाना", en: "Treasure of Taste and Health" },
        mainImage: "/images/suran_update.jpg",
        galleryImages: ["/images/suran_update.jpg", "/images/suran.jpg", "https://images.unsplash.com/photo-1620556106606-d089100867a5?auto=format&fit=crop&q=80"],
        ingredients: ["Fresh Suran", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: true,
        isActive: true,
        variants: [
            { id: "v-250", size: "250g", mrp: 150, stock: 50 },
            { id: "v-500", size: "500g", mrp: 280, stock: 30 }
        ]
    },
    {
        id: "swadam-pack-combo",
        category: "Special",
        name: { hi: "स्वादम पैक (Grand Combo)", en: "Swadam Pack (Grand Combo)" },
        description: {
            hi: "हमारे सभी 7 शानदार अचारों का एक अनूठा संगम (80 ग्राम प्रत्येक)। स्वाद का असली महाकुंभ!",
            en: "A grand collection of all 7 premium flavors (80g each). A true treasure chest of taste!"
        },
        tagline: { hi: "एक पैक में पूरा स्वाद", en: "All Flavors in One Pack" },
        mainImage: "/images/swadam_update_final.jpg",
        galleryImages: ["/images/swadam_update_final.jpg"],
        ingredients: ["Mixed", "Mango", "Aawla", "Kathal", "Lemon", "Red Chilli", "Green Chilli"],
        isFeatured: true,
        isActive: true,
        isSpecialOffer: true,
        offerLabel: { hi: "धमाका ऑफर", en: "Grand Offer" },
        variants: [
            { id: "v-combo", size: "Combo (7 x 80g)", mrp: 499, stock: 100 }
        ]
    },
    {
        id: "mango-pickle-01",
        category: "Mango",
        name: { hi: "आम का अचार", en: "Mango Pickle" },
        description: {
            hi: "कच्चे आम और शुद्ध सरसों के तेल का लाजवाब संगम। असली बनारसी स्वाद।",
            en: "Authentic green mangoes preserved in pure mustard oil."
        },
        tagline: { hi: "सदाबहार आम का स्वाद", en: "Evergreen Taste of Mango" },
        mainImage: "/images/mango_replacement.jpg",
        galleryImages: ["/images/mango_replacement.jpg", "/images/mango.jpg"],
        ingredients: ["Green Mango", "Mustard Oil", "Turmeric", "Hing", "Red Chilli"],
        isFeatured: false,
        isActive: true,
        variants: [
            { id: "v1", size: "250g", mrp: 120, stock: 40 },
            { id: "v2", size: "500g", mrp: 220, stock: 25 }
        ]
    },
    {
        id: "lemon-pickle-01",
        category: "Lemon",
        name: { hi: "नींबू का अचार", en: "Lemon Pickle" },
        description: {
            hi: "खट्टा-मीठा नींबू का अचार। बिना तेल के तैयार।",
            en: "Sweet and sour lemon pickle, oil-free."
        },
        tagline: { hi: "चटपटा और पाचक", en: "Tangy and Digestive" },
        mainImage: "/images/lemon_update.jpg",
        galleryImages: ["/images/lemon_update.jpg", "/images/new_lemon.jpg"],
        ingredients: ["Lemon", "Ajwain", "Black Salt"],
        isFeatured: false,
        isActive: true,
        variants: [
            { id: "v1", size: "250g", mrp: 110, stock: 45 },
            { id: "v2", size: "500g", mrp: 200, stock: 25 }
        ]
    },
    {
        id: "green-chilli-pickle-01",
        category: "Chilli",
        name: { hi: "हरी मिर्च का अचार", en: "Green Chilli Pickle" },
        description: {
            hi: "तीखी और चटपटी हरी मिर्च का अचार। ताजा हरी मिर्च से बना।",
            en: "Baba Ji Hari Mirch Pickle from Bhojnamrit Foods is a spicy Prayagraj famous achar prepared using fresh green chillies. This 100% organic achar delivers a strong natural achar flavor inspired by Prayagraj traditions."
        },
        tagline: { hi: "तीखा और लजीज", en: "Spicy and Delicious" },
        mainImage: "/images/green_chilli.jpg",
        galleryImages: ["/images/green_chilli.jpg"],
        ingredients: ["Fresh Green Chillies", "Mustard Oil", "Fennel Seeds", "Yellow Mustard Seeds", "Fenugreek Seeds", "Nigella Seeds", "Turmeric Powder", "Red Chilli Powder", "Asafoetida", "Iodized Salt"],
        isFeatured: false,
        isActive: true,
        variants: [
            { id: "v1", size: "250g", mrp: 140, stock: 30 },
            { id: "v2", size: "500g", mrp: 260, stock: 20 }
        ]
    },
    {
        id: "green-chilli-pickle-01",
        category: "Chilli",
        name: { hi: "हरी मिर्च का अचार", en: "Green Chilli Pickle" },
        description: {
            hi: "तीखा और चटपटा हरी मिर्च का अचार।",
            en: "Spicy and pungent green chilli pickle."
        },
        tagline: { hi: "हर खाने में तीखापन", en: "Spiciness in Every Meal" },
        mainImage: "/images/green_chilli_update.jpg",
        galleryImages: ["/images/green_chilli_update.jpg", "/images/new_mix.jpg", "https://images.unsplash.com/photo-1589669916111-3668079df95d?auto=format&fit=crop&q=80"],
        ingredients: ["Green Chilli", "Lemon Juice", "Salt", "Mustard Oil"],
        isFeatured: false,
        isActive: true,
        variants: [
            { id: "v-250", size: "250g", mrp: 100, stock: 60 },
            { id: "v-500", size: "500g", mrp: 180, stock: 30 },
            { id: "v-1kg", size: "1kg", mrp: 320, stock: 20 }
        ]
    }
];

export const UI_TEXT = {
    hi: {
        home: "होम", shop: "दुकान", cart: "कार्ट", checkout: "चेकआउट", back: "वापस", add: "कार्ट में जोड़ें",
        orderNow: "अभी आर्डर करें", serving: "केवल प्रयागराज में डिलीवरी", delivery: "डिलीवरी", total: "कुल राशि",
        address: "पता", name: "पूरा नाम", phone: "फोन नंबर", utr: "UTR / ट्रांजैक्शन ID", search: "अचार खोजें...",
        all: "सभी", mix: "मिश्रित", mango: "आम", aawla: "आंवला", kathal: "कटहल", lemon: "नींबू", chilli: "मिर्च", special: "खास ऑफर",
        login: "लॉगिन", signup: "साइन अप", account: "खाता", logout: "लॉगआउट",
        reviews: "ग्राहक समीक्षा", writeReview: "अपनी समीक्षा लिखें", submitReview: "समीक्षा सबमिट करें", noReviews: "अभी तक कोई समीक्षा नहीं है।", verifiedBuyer: "सत्यापित खरीदार", rating: "रेटिंग", comment: "टिप्पणी",
        trackOrder: "ऑर्डर ट्रैकिंग", adminPanel: "एडमिन डैशबोर्ड", manageOrders: "ऑर्डर प्रबंधित करें", updateStatus: "स्थिति बदलें",
        suran: "सूरन (जिमीकंद)",
        // Checkout & Payment
        scanToPay: "भुगतान करें (Pay Now)", orPayViaApp: "या ऐप से भुगतान करें",
        paymentVerification: "भुगतान सत्यापन", txnId: "UTR / ट्रांजैक्शन ID",
        txnPlaceholder: "जैसे 4352xxxxxxxx", txnRequired: "* ऑटो-वेरिफिकेशन के लिए आवश्यक",
        paytm: "Paytm", phonepe: "PhonePe", gpay: "GPay",
        confirmOrder: "ऑर्डर कन्फर्म करें",
        orderPreview: "ऑर्डर विवरण", subtotal: "उप-योग", deliveryCharges: "डिलीवरी शुल्क",
        bulkSavings: "बचत",
        mobileNo: "मोबाइल नंबर", upiId: "UPI आईडी",
        sendScreenshot: "या स्क्रीनशॉट भेजें",
        screenshotNote: "* अगर UTR उपलब्ध नहीं है तो व्हाट्सएप पर स्क्रीनशॉट भेजें",
        // Cart & Forms
        completeDetails: "अपना विवरण नीचे भरें",
        cityPlaceholder: "शहर (प्रयागराज)", pincodePlaceholder: "पिन कोड",
        orderSummary: "ऑर्डर का सारांश",
        cartEmpty: "आपकी कार्ट खाली है", startShopping: "खरीदारी शुरू करें",
        tipBulk: "सुझाव: पहले ऑर्डर पर 5% की छूट पाएं!",
        coupon: "कूपन",
        // New Instructions
        paymentInstructionHeader: "भुगतान निर्देश (Payment Instructions)",
        paymentInstructionBody: "कृपया मोबाइल नंबर 9555809329 पर भुगतान करें। भुगतान करने से पहले नाम 'Utkarsh' सत्यापित करें। नीचे दिए गए ऐप लिंक केवल ऐप खोलने के लिए हैं।",
        paymentCheckbox: "मैंने अपना भुगतान पूरा कर लिया है, और मैं भुगतान के प्रमाण के रूप में स्क्रीनशॉट साझा करूंगा।",
    },
    en: {
        home: "Home", shop: "Shop", cart: "Cart", checkout: "Checkout", back: "Back", add: "Add to Cart",
        orderNow: "Order Now", serving: "Delivery only in Prayagraj", delivery: "Delivery", total: "Total Amount",
        address: "Address", name: "Full Name", phone: "Phone Number", utr: "UTR / Transaction ID", search: "Search Pickles...",
        all: "All", mix: "Mixed", mango: "Mango", aawla: "Aawla", kathal: "Kathal", lemon: "Lemon", chilli: "Chilli", special: "Special Offers",
        login: "Login", signup: "Sign Up", account: "Account", logout: "Logout",
        reviews: "Customer Reviews", writeReview: "Write your review", submitReview: "Submit Review", noReviews: "No reviews yet.", verifiedBuyer: "Verified Buyer", rating: "Rating", comment: "Comment",
        trackOrder: "Order Tracking", adminPanel: "Admin Dashboard", manageOrders: "Manage Orders", updateStatus: "Update Status",
        suran: "Suran (Yam)",
        // Checkout & Payment
        scanToPay: "Pay Now", orPayViaApp: "Or Pay via App",
        paymentVerification: "Payment Verification", txnId: "Transaction ID / UTR No.",
        txnPlaceholder: "e.g. 4352xxxxxxxx", txnRequired: "* Required for auto-verification",
        paytm: "Paytm", phonepe: "PhonePe", gpay: "GPay",
        confirmOrder: "Confirm & Place Order",
        orderPreview: "Order Preview", subtotal: "Subtotal", deliveryCharges: "Delivery Charges",
        bulkSavings: "Bulk Savings",
        mobileNo: "Mobile No.", upiId: "UPI ID",
        sendScreenshot: "Or Send Screenshot",
        screenshotNote: "* Share proof on WhatsApp if UTR is unavailable",
        // Cart & Forms
        completeDetails: "Complete your order details below",
        cityPlaceholder: "City (Prayagraj)", pincodePlaceholder: "Pincode",
        orderSummary: "Order Summary",
        cartEmpty: "Your cart is empty", startShopping: "Start Shopping",
        tipBulk: "Tip: Get 5% OFF on your first order!",
        coupon: "Coupon",
        // New Instructions
        paymentInstructionHeader: "Payment Instructions",
        paymentInstructionBody: "Pay on Mobile No: 9555809329. Verify Name: 'Utkarsh' before paying. App links below are for quick launch only.",
        paymentCheckbox: "I have completed my payment, and I will share screenshot as proof of payment.",
    }
};
