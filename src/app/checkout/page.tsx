/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useMemo, useState } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "../../context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const mounted = useMounted();

  // ✅ Subscribe to real state so UI rerenders on changes
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  const totalPrice = cart.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0,
  );

  const canSubmit = useMemo(() => {
    return (
      cart.length > 0 && name.trim().length >= 2 && phone.trim().length >= 6
    );
  }, [cart.length, name, phone]);

  if (!mounted) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading checkout...</div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="text-lg font-semibold">Success 🎉</div>
          <div className="mt-2 text-sm text-gray-600">
            Your order has been placed.
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <a href="/catalog">
              <Button variant="secondary">Back to catalog</Button>
            </a>
            <a href="/">
              <Button>Home</Button>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-10">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {cart.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="text-sm font-medium">Cart is empty</div>
          <div className="mt-3">
            <a className="text-sm text-gray-700 underline" href="/catalog">
              Go to catalog
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Your details</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-gray-600">Name</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600">Phone</div>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 0000"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                disabled={!canSubmit}
                onClick={() => {
                  clearCart();
                  setSuccess(true);
                }}
              >
                Place order
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Order summary</div>

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
                    <div className="font-medium">{price * quantity}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-semibold">{totalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
