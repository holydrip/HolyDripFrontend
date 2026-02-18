/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useMemo, useState } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/lib/cart";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/pricing";

export default function CheckoutPage() {
  const mounted = useMounted();

  // ✅ Subscribe to real state so UI rerenders on changes
  const itemsMap = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Avoid hydration mismatch: before mounted, pretend empty
  const items = useMemo(() => (mounted ? Object.values(itemsMap) : []), [mounted, itemsMap]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, it) => {
      // const unit = getDiscountedPrice(it.product.price, it.product.discountPct);
      return sum + it.product.price * it.qty;
    }, 0);
  }, [items]);

  const canSubmit = useMemo(() => {
    return items.length > 0 && name.trim().length >= 2 && phone.trim().length >= 6;
  }, [items.length, name, phone]);

  if (!mounted) {
    return (
      <main className="pb-10">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading checkout...</div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="pb-10">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="text-lg font-semibold">Success 🎉</div>
          <div className="mt-2 text-sm text-gray-600">Your order has been placed.</div>
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

      {items.length === 0 ? (
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
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Phone</div>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0000" />
              </div>
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                disabled={!canSubmit}
                onClick={() => {
                  clear();
                  setSuccess(true);
                }}
              >
                Place order
              </Button>
              <div className="mt-2 text-xs text-gray-500">MVP: no payment integration yet.</div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium">Order summary</div>

            <div className="mt-4 space-y-3">
              {items.map(({ product, qty }) => {
                const unit = product.price;
                return (
                  <div key={product.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="text-gray-700">
                      {product.name} <span className="text-gray-400">× {qty}</span>
                    </div>
                    <div className="font-medium">{formatMoney(unit * qty)}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-semibold">{formatMoney(totalValue)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
