import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatUAPhoneNumber } from "@/lib/phoneMask";
import type { Product } from "@/lib/types";

import { useTranslation } from "@/hooks/useTranslation";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  size: string | null;
}

export function QuickBuyModal({ isOpen, onClose, product, size }: Props) {
  const { t } = useTranslation("QuickBuy");
  const { t: tProduct } = useTranslation("Product");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = name.trim().length >= 2 && phone.replace(/\D/g, "").length === 12 && address.trim().length > 5 && size;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          telegram: '@1clickbuy',
          address: address,
          items: [{
            productId: product.id,
            name: product.name,
            size: size,
            quantity: 1,
            price: product.price,
            image: product.images[0]
          }],
          totalPrice: product.price
        })
      });
      
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-transparent border border-white/[0.07] p-8 flex flex-col gap-6 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <div className="flex flex-col gap-2">
              <h2 className={`font-fraktur text-3xl text-white`}>{tProduct("quick_buy")}</h2>
              <p className="text-white/40 text-sm font-light">
                {product.name} ({size || tProduct("choose_size")}) — {product.price} ₴
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("name")}</label>
                <Input 
                  value={name} onChange={e => setName(e.target.value)} 
                  placeholder="Олександр" 
                  className="bg-transparent border-white/20 text-white placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("phone")}</label>
                <Input 
                  value={phone} onChange={e => setPhone(formatUAPhoneNumber(e.target.value))} 
                  placeholder="+38 (099) 000-00-00" maxLength={19}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">Місто, Відділення НП</label>
                <Input 
                  value={address} onChange={e => setAddress(e.target.value)} 
                  placeholder="Київ, НП №1" 
                  className="bg-transparent border-white/20 text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              className="w-full border border-white/20 text-white py-4 text-[10px] uppercase tracking-[3px] hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("redirecting") : t("pay")}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
