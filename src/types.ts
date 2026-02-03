export interface Product {
    id: string;
    category: string;
    name: {
        hi: string;
        en: string;
    };
    description: {
        hi: string;
        en: string;
    };
    tagline: {
        hi: string;
        en: string;
    };
    mainImage: string;
    galleryImages: string[];
    ingredients: string[];
    isFeatured: boolean;
    isActive: boolean;
    variants: Variant[];
    reviews?: Review[];
    isSpecialOffer?: boolean;
    offerLabel?: {
        hi: string;
        en: string;
    };
}

export interface Variant {
    id: string;
    size: string;
    mrp: number;
    stock: number;
}

export interface CartItem {
    productId: string;
    variantId: string;
    quantity: number;
    productName: string;
    size: string;
    price: number;
    image: string;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Pending_Verification' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Pending_Payment' | 'Payment_Received' | 'Packed';

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    items: CartItem[];
    totalAmount: number;
    customerDetails: Address;
    paymentMethod: string;
    utrNumber: string;
}

export interface Address {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

export interface User {
    id: string;
    name: string;
    role: 'ADMIN' | 'USER';
    phone: string;
    email?: string;
    gender?: 'male' | 'female' | 'other' | '';
    address?: {
        house: string;
        area: string;
        city: string;
        state: string;
        pincode: string;
    };
}


export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Store {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    isActive: boolean;
}
