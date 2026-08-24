/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useMemo, useRef, useState } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TelegramService } from "@/services/telegram.service";
import { formatUAPhoneNumber } from "@/lib/phoneMask";

export default function CheckoutPage() {
  const mounted = useMounted();
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tag, setTag] = useState("@");
  const [success, setSuccess] = useState(false);
  
  const tagRef = useRef<HTMLInputElement>(null);
  const prefix = "@";
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (!newValue.startsWith("@")) {
      newValue = prefix + newValue.slice(prefix.length).replace(prefix, "");
    }
    setTag(newValue);
  };

  const fixCursorPosition = () => {
    const input = tagRef.current;
    if (!input) return;

    if (input.selectionStart !== null && input.selectionStart < prefix.length) {
      input.setSelectionRange(prefix.length, prefix.length);
    }
  };

  const totalPrice = cart.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0,
  );

  const canSubmit = useMemo(() => {
    const digitsOnly = phone.replace(/\D/g, "");
    return (
      cart.length > 0 && 
      name.trim().length >= 2 && 
      digitsOnly.length === 12
    );
  }, [cart.length, name, phone]);

  if (!mounted) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Оформлення замовлення</h1>
        <div className="mt-6 border border-white/10 bg-transparent p-6">
          <div className="text-[10px] uppercase tracking-[3px] text-white/50">Завантаження...</div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Оформлення замовлення</h1>
        <div className="mt-6 border border-white/10 bg-transparent p-10 text-center">
          <div className="font-fraktur text-4xl text-white">Успішно 🎉</div>
          <div className="mt-4 text-[10px] uppercase tracking-[2px] text-white/60 leading-relaxed">
            Твоє замовлення прийнято! Ми зв&apos;яжемося з тобою у Telegram.
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/catalog" className="border border-white/20 text-white/60 hover:text-white hover:border-white px-8 py-3 text-[10px] uppercase tracking-[3px] transition-all">
              В каталог
            </a>
            <a href="/" className="bg-white text-black px-8 py-3 text-[10px] uppercase tracking-[3px] hover:bg-white/90 transition-all">
              На головну
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 sm:px-12 md:px-[70px] py-16 min-h-screen">
      <h1 className="font-fraktur text-4xl md:text-6xl text-white">Оформлення замовлення</h1>

      {cart.length === 0 ? (
        <div className="mt-10 border border-white/10 p-16 text-center">
          <div className="font-fraktur text-2xl text-white/40">Твій кошик порожній</div>
          <div className="mt-6">
            <a className="border border-white/20 text-white/40 hover:text-white hover:border-white px-8 py-3 text-[10px] uppercase tracking-[3px] transition-all" href="/catalog">
              Перейти до каталогу
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 border border-white/10 p-6 sm:p-10">
            <div className="text-[10px] uppercase tracking-[3px] text-white/50 mb-8">Твої дані</div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-[2px] text-white/40">Ім&apos;я</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Олександр"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-[2px] text-white/40">Телефон</div>
                <Input
                  value={phone}
                  type="tel"
                  onChange={(e) => setPhone(formatUAPhoneNumber(e.target.value))}
                  placeholder="+38 (099) 000-00-00"
                  maxLength={19}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-[2px] text-white/40">Telegram (Нікнейм)</div>
                <Input
                  ref={tagRef}
                  value={tag}
                  onChange={handleTagChange}
                  onClick={fixCursorPosition}
                  onKeyDown={fixCursorPosition}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="mt-10">
              <button
                className="w-full border border-white/20 bg-transparent text-white py-4 text-[10px] uppercase tracking-[3px] hover:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canSubmit}
                onClick={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/order`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name,
                        phone,
                        telegram: tag,
                        items: cart.map(item => ({
                          productId: item.id,
                          name: item.name,
                          size: (item as { size?: string }).size || 'Не вказано',
                          quantity: item.quantity,
                          price: item.price
                        })), 
                        totalPrice
                      })
                    });
                    
                    const data = await res.json();
                    
                    if (data.paymentUrl) {
                      window.location.href = data.paymentUrl;
                    } else {
                      setSuccess(true);
                      clearCart();
                    }
                  } catch(e) {
                    console.error('Order Error:', e);
                  }
                }}
              >
                Оформити замовлення та оплатити
              </button>
            </div>
          </div>

          <div className="border border-white/10 p-6 sm:p-10 sticky top-24">
            <div className="text-[10px] uppercase tracking-[3px] text-white/50 mb-8">Ваше замовлення</div>

            <div className="flex flex-col gap-6">
              {cart.map(({ id, name, price, quantity, size }) => {
                return (
                  <div
                    key={`${id}-${size}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="text-sm text-white/70 font-light leading-relaxed">
                      {name} <span className="text-white/30 text-xs ml-1">× {quantity}</span>
                      {size && size !== 'Не вказано' && <div className="text-[10px] uppercase tracking-[1px] text-white/40 mt-1">Розмір: {size}</div>}
                    </div>
                    <div className="font-fraktur text-lg text-white">{price * quantity} ₴</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[3px] text-white/50">Разом</div>
                <div className="font-fraktur text-3xl text-white">{totalPrice} ₴</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}