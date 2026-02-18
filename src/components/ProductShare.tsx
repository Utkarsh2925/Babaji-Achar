import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Product } from '../types';

interface ProductShareProps {
    product: Product;
    lang: 'hi' | 'en';
}

const ProductShare: React.FC<ProductShareProps> = ({ product, lang }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Deep Link URL
        const shareUrl = `${window.location.origin}?product=${product.id}`;

        const shareData = {
            title: `Babaji Achar - ${product.name[lang]}`,
            text: `Check out this authentic ${product.name[lang]} from Babaji Achar! 100% Organic & Handmade.`,
            url: shareUrl
        };

        try {
            // 1. Try Native Web Share API (Mobile/Supported Browsers)
            if ((navigator as any).share) {
                await (navigator as any).share(shareData);
            } else {
                // 2. Fallback to Clipboard
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Share failed:', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`
        group relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300
        border shadow-sm hover:shadow-md
        ${copied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-orange-100 text-orange-900 hover:border-orange-200 hover:bg-orange-50'
                }
      `}
            aria-label="Share Product"
        >
            <div className={`transition-transform duration-300 ${copied ? 'scale-0' : 'scale-100'}`}>
                <Share2 size={18} className="stroke-[2.5]" />
            </div>

            {/* Success Check Icon Overlay */}
            <div className={`absolute left-5 transition-transform duration-300 ${copied ? 'scale-100' : 'scale-0'}`}>
                <Check size={18} className="stroke-[3]" />
            </div>

            <span className="font-black uppercase text-xs tracking-[0.15em]">
                {copied ? 'Copied' : 'Share'}
            </span>
        </button>
    );
};

export default ProductShare;
