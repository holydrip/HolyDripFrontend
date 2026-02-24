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
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Завантаження...</div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Оформлення замовлення</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="text-lg font-semibold">Успішно 🎉</div>
          <div className="mt-2 text-sm text-gray-600">
            Твоє замовлення прийнято! Ми зв'яжемося з тобою у Telegram.
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/catalog">
              <Button variant="secondary" className="cursor-pointer">В каталог</Button>
            </a>
            <a href="/">
              <Button className="cursor-pointer">На головну</Button>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold">Оформлення замовлення</h1>

      {cart.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="text-sm font-medium">Твій кошик порожній</div>
          <div className="mt-3">
            <a className="text-sm text-gray-700 underline" href="/catalog">
              Перейти до каталогу
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Твої дані</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-gray-600">Ім'я</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Олександр"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600">Телефон</div>
                <Input
                  value={phone}
                  type="tel"
                  onChange={(e) => setPhone(formatUAPhoneNumber(e.target.value))}
                  placeholder="+38 (099) 000-00-00"
                  maxLength={19}
                />
              </div>
              <div>
                <div className="text-xs text-gray-600">Telegram (Нікнейм)</div>
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

            <div className="mt-6">
              <Button
                className="w-full cursor-pointer"
                disabled={!canSubmit}
                onClick={async () => {
                  await TelegramService.order({
                    name,
                    phone,
                    telegram: tag,
                    items: cart.map(item => ({
                      name: `${item.name} (x${item.quantity})`,
                      size: (item as any).size || 'Не вказано'
                    })), 
                    totalPrice
                  });
                  clearCart();
                  setSuccess(true);
                }}
              >
                Оформити замовлення
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Ваше замовлення</div>

            <div className="mt-4 space-y-3">
              {cart.map(({ id, name, price, quantity }) => {
                return (
                  <div
                    key={id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="text-gray-700">
                      {name} <span className="text-gray-400">× {quantity}</span>
                    </div>
                    <div className="font-medium">{price * quantity} ₴</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Разом</div>
                <div className="text-lg font-semibold">{totalPrice} ₴</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}