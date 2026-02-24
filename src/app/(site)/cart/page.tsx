"use client";

import Image from "next/image";
import { useMounted } from "@/lib/useMounted";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
export default function CartPage() {
  const mounted = useMounted();
  const { cart, removeFromCart, setQuantity } = useCart();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setTotal(
      cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
    );
  }, [cart]);

  if (!mounted) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Loading cart...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-semibold">Cart</h1>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
          <div className="text-sm font-medium">Your cart is empty</div>
          <div>
            <a className="text-sm text-gray-700 underline" href="/catalog">
              Go to catalog
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 justify-center">
          <div className="lg:col-span-2 space-y-3">
            {cart.map(({ id, name, price, images, quantity }) => {
              // const unit = getDiscountedPrice(product.price, product.discountPct);
              return (
                <div
                  key={id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={images[0]}
                        alt={name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{name}</div>
                          <div className="mt-1 text-sm text-gray-600">
                            {price} each
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() => removeFromCart(id)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 cu">
                          <Button
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => setQuantity(id, quantity - 1)}
                          >
                            -
                          </Button>
                          <div className="w-10 text-center text-sm">
                            {quantity}
                          </div>
                          <Button
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => setQuantity(id, quantity + 1)}
                          >
                            +
                          </Button>
                        </div>

                        <div className="text-sm font-semibold">
                          {price * quantity} UAH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-600">Total</div>
            <div className="mt-2 text-2xl font-semibold">{total} UAH</div>

            <a href="/checkout" className="mt-5 block">
              <Button className="w-full cursor-pointer transition-200-ease">Go to checkout</Button>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
