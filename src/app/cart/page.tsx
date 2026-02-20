"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useMounted } from "@/lib/useMounted";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/pricing";

export default function CartPage() {
  const mounted = useMounted();

  // subscribe to actual state
  const itemsMap = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const items = useMemo(() => (mounted ? Object.values(itemsMap) : []), [mounted, itemsMap]);

  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      return sum + it.product.price * it.qty;
    }, 0);
  }, [items]);

  if (!mounted) {
    return (
      <main>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading cart...</div>
        </div>
      </main>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold">Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="text-sm font-medium">Your cart is empty</div>
          <div className="mt-3">
            <a className="text-sm text-gray-700 underline" href="/catalog">Go to catalog</a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, qty }) => {
              // const unit = getDiscountedPrice(product.price, product.discountPct);
              return (
                <div key={product.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="mt-1 text-sm text-gray-600">{product.price} each</div>
                        </div>

                        <Button variant="ghost" onClick={() => remove(product.id)}>Remove</Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" onClick={() => setQty(product.id, qty - 1)}>-</Button>
                          <div className="w-10 text-center text-sm">{qty}</div>
                          <Button variant="secondary" onClick={() => setQty(product.id, qty + 1)}>+</Button>
                        </div>

                        <div className="text-sm font-semibold">{product.price * qty}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Total</div>
            <div className="mt-2 text-2xl font-semibold">{formatMoney(total)}</div>

            <a href="/checkout" className="mt-5 block">
              <Button className="w-full">Go to checkout</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
