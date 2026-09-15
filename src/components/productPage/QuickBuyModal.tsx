"use client";

import { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://holydripbackend-production.up.railway.app";
    fetch(`${apiUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user) {
          setUserId(user.id);
          setName((prev) => prev || user.name || "");
          setPhone((prev) => prev || user.phone || "");
          if (user.address) {
            try {
              if (user.address.startsWith("{")) {
                const parsed = JSON.parse(user.address);
                const full = [parsed.city, parsed.post, parsed.zip].filter(Boolean).join(", ");
                setAddress((prev) => prev || full);
              } else {
                setAddress((prev) => prev || user.address);
              }
            } catch {
              setAddress((prev) => prev || user.address);
            }
          }
        }
      })
      .catch(() => {});
  }, [isOpen]);

  const nameWords = name.trim().split(/\s+/).filter(Boolean);
  const canSubmit = nameWords.length >= 2 && name.trim().length >= 5 && phone.replace(/\D/g, "").length === 12 && address.trim().length >= 5 && size;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://holydripbackend-production.up.railway.app'}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || undefined,
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
            image: product.images?.[0] || ''
          }],
          totalPrice: product.price
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Помилка при створенні замовлення');
        setLoading(false);
        return;
      }

      if (userId) {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://holydripbackend-production.up.railway.app'}/user/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone, address })
          }).catch(() => {});
        }
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch(e) {
      console.error(e);
      alert('Помилка зʼєднання з сервером');
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
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">
                  ПІБ (Прізвище, Ім&apos;я, По батькові) *
                </label>
                <Input 
                  value={name} onChange={e => setName(e.target.value)} 
                  placeholder="Шевченко Тарас Григорович" 
                  className="bg-transparent border-white/20 text-white placeholder:text-white/20"
                />
                {name.trim().length > 0 && nameWords.length < 2 && (
                  <span className="text-red-400 text-[10px] mt-1 block">Вкажіть щонайменше прізвище та ім&apos;я</span>
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">{t("phone")} *</label>
                <Input 
                  value={phone} onChange={e => setPhone(formatUAPhoneNumber(e.target.value))} 
                  placeholder="+38 (099) 000-00-00" maxLength={19}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/20"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[3px] text-white/40 mb-2 block">Місто, Відділення НП *</label>
                <Input 
                  value={address} onChange={e => setAddress(e.target.value)} 
                  placeholder="м. Київ, Відділення №1" 
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
