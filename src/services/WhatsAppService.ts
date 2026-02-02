
// WhatsApp Service for Babaji Achar
// Acts as the bridge between the App and the WhatsApp API Provider (Interakt/Wati/Meta)

import type { Order } from '../types';

// Configuration
const WA_CONFIG = {
  PROVIDER: "MOCKED", // Change to 'INTERAKT', 'WATI', etc.
  API_KEY: "YOUR_API_KEY_HERE",
  ENDPOINT: "https://api.yourprovider.com/v1/send",
  WEBSITE_LINK: "https://babaji-achar.vercel.app"
};

/**
 * 📅 FESTIVAL & SEASONAL CALENDAR
 * Auto-detects the mood based on Month/Date.
 */
const getSeasonalContext = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const date = now.getDate();

  // 1. FESTIVALS (Approximate dates, can be refined annually)
  if (month === 0 && date >= 13 && date <= 15) return 'SANKRANTI'; // Makar Sankranti
  if (month === 2 && date >= 20 && date <= 25) return 'HOLI'; // Holi (March)
  if (month === 7 && date >= 10 && date <= 20) return 'RAKHI'; // Raksha Bandhan (August)
  if (month === 9 || month === 10) return 'DIWALI_SEASON'; // Oct-Nov (Festive)

  // 2. SEASONS
  if (month >= 4 && month <= 6) return 'SUMMER_MANGO'; // May-July (Aam ka Season)
  if (month === 11 || month === 0 || month === 1) return 'WINTER'; // Dec-Feb (Gajar/Gobi)

  return 'DEFAULT';
};

/**
 * 🤪 DYNAMIC COPY LIBRARY
 * Mixes Sarcasm + Festivals + Seasons
 */
const TEMPLATES = {
  DEFAULT: [
    "Oye! Achar cart mein sad raha hai. Jaldi order kar le, varna main kha jaunga! 😋🥭",
    "Bhai, relationship status: Complicated. But Achar status: PENDING? Aisa kaise chalega? 😂",
    "Karela kadwa hai, par hamara discount mitha hai! 5% OFF le aur order khatam kar! 🎟️",
    "Arre Boss! Intezaar ka fal mitha hota hai, par intezaar ka achar khatta ho jata hai! Order now! ⏳",
    "Did you forget your pickle? Or are you on a diet? (Jhoot mat bolna!) 🤥🍕",
    "Mummy naraz hogi agar khana bina achar ke khaya toh. Risk mat le, order complete kar! 😡🛑"
  ],
  SANKRANTI: [
    "🪁 Kai Po Che! Patang udani hai toh energy chahiye. Achar ke saath paratha khao aur ud jaao!",
    "Til-Gud ghul gaye, par aapka order atak gaya? Sankranti special discount, jaldi order karo! 🌞"
  ],
  HOLI: [
    "🎨 Bura na mano Holi hai! Par bura maan jaunga agar cart abandon kiya toh! 🔫",
    "Rang barse, bheegi chunar... aur Achar tarse aapki plate par! Order complete karo bhai! 🌈"
  ],
  RAKHI: [
    "🎁 Rakhi pe behen ko paise diye? Ab khud ke liye Achar le lo! (Self-care is important) 😂",
    "Is Rakhi, gift something chatpata! Complete your order for the perfect family gift."
  ],
  DIWALI_SEASON: [
    "🪔 Diwali ki safai ho gayi? Ab pet pooja ka socho! Patakha nahi, Achar phodo! 💥",
    "Bonus mila kya? Thoda yahan bhi kharch kar do! Best Diwali Gift: Babaji Ka Achar. 🎁"
  ],
  SUMMER_MANGO: [
    "🌞 Garmi aa gayi! Kacha Aam (Keri) ka season hai. Stock khatam hone se pehle le lo! 🥭",
    "Dhoop mein sookh raha hai Aam... Cart mein mat sukhao apna order! Jaldi check out karo."
  ],
  WINTER: [
    "❄️ Thand mein Gajar-Gobi ka Achar nahi khaya toh kya kiya? Winter essentials waiting in cart! 🥕",
    "Razai mein baith ke order karo, hum ghar pohcha denge. Mast spicy achar for chilly nights! 🥶"
  ]
};

const getSmartMessage = () => {
  const context = getSeasonalContext();
  // @ts-ignore - Index access
  const list = TEMPLATES[context] || TEMPLATES['DEFAULT'];
  const index = Math.floor(Math.random() * list.length);

  // 30% chance to mix DEFAULT sarcasm even during seasons to keep it fresh
  if (context !== 'DEFAULT' && Math.random() > 0.7) {
    const defaultList = TEMPLATES['DEFAULT'];
    return defaultList[Math.floor(Math.random() * defaultList.length)];
  }

  return list[index];
};

export const WhatsAppService = {

  /**
   * Trigger 0: Welcome Bot (Auto-Reply to 'Hi')
   */
  sendWelcomeMessage: async (phone: string, userName: string = "Foodie") => {
    console.group('%c[WhatsApp Bot] 👋 Trigger: Welcome Message', 'color: #00BAF2; font-weight: bold; font-size: 12px');
    console.log(`To: ${phone}`);
    console.log(`Msg: "Namaste ${userName}! 🙏 Welcome to Babaji Achar. Ghar ka swaad, bas ek click door!"`);
    console.log(`Link: ${WA_CONFIG.WEBSITE_LINK}`);
    console.groupEnd();
  },

  /**
   * Trigger 1: Order Confirmation (Polite & Professional)
   */
  sendOrderConfirmation: async (order: Order) => {
    console.group('%c[WhatsApp Bot] 🟢 Trigger: Order Confirmation', 'color: #25D366; font-weight: bold; font-size: 12px');
    console.log(`To: ${order.customerDetails.phone}`);
    console.log(`Msg: "🎉 *Order Confirmed!* 🎉%0a%0aHello ${order.customerDetails.fullName},%0aYour order #${order.id} has been successfully placed and confirmed! We're excited for you to enjoy Babaji Achar!%0a%0a*Order Details:*%0a🛒 Items: ${order.items.map(item => `${item.productName} x ${item.quantity}`).join(', ')}%0a%0a💳 *Payment:* ${order.paymentMethod}%0a✅ *Payment:* Completed%0a%0a*Shipping Details:*%0a👤 Name: ${order.customerDetails.fullName}%0a📱 Phone: ${order.customerDetails.phone}%0a📍 Address: ${order.customerDetails.street}, ${order.customerDetails.city}, ${order.customerDetails.pincode}%0a%0a📝 *Note:* Main aapko payment screenshot pradan krta/karti hoon. (I will share payment screenshot).%0a%0a----------------------------------%0a*Total Amount:* ₹${order.totalAmount}%0a----------------------------------`);
    console.groupEnd();
  },

  /**
   * Trigger 2: Abandoned Cart Recovery (Smart Seasonal Mode) 📅
   */
  sendCartRecovery: async (phone: string, cartTotal: number) => {
    const smartMsg = getSmartMessage();
    const currentSeason = getSeasonalContext();

    console.group(`%c[WhatsApp Bot] 🟠 Trigger: Cart Recovery (${currentSeason} Mode)`, 'color: #FF9900; font-weight: bold; font-size: 12px');
    console.log(`Target: ${phone}`);
    console.log(`Value: ₹${cartTotal}`);
    console.log(`🤖 Smart Msg: "${smartMsg}"`);
    console.groupEnd();
  }
};
