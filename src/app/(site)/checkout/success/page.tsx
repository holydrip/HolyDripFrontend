"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle, ArrowRight, Package, User } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart immediately on successful payment return
    clearCart();
  }, [clearCart]);

  return (
    <main className="px-6 sm:px-12 md:px-[70px] py-20 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full border border-white/10 bg-black/40 backdrop-blur-md p-8 sm:p-14 text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-white/[0.03] blur-3xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <h1 className="font-fraktur text-3xl sm:text-5xl text-white tracking-wide">
          Оплата успішна!
        </h1>

        <p className="mt-4 text-xs uppercase tracking-[3px] text-white/50">
          Дякуємо за вибір Holy Drip
        </p>

        {orderId && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02]">
            <Package size={14} className="text-white/40" />
            <span className="text-[11px] font-mono text-white/80 uppercase tracking-wider">
              Замовлення #{orderId}
            </span>
          </div>
        )}

        <div className="mt-8 text-sm text-white/70 font-light leading-relaxed max-w-lg mx-auto">
          Твоє замовлення успішно сплачено та прийнято в систему. Ми зв&apos;яжемося з тобою у Telegram або за номером телефону для підтвердження відправки.
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:border-white px-8 py-3.5 text-[10px] uppercase tracking-[3px] transition-all hover:bg-white/[0.05]"
          >
            <User size={13} />
            Особистий кабінет
          </Link>
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 px-8 py-3.5 text-[10px] uppercase tracking-[3px] font-semibold transition-all"
          >
            В каталог
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[2px] text-white/40 hover:text-white transition-colors"
          >
            Повернутися на головну
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-[11px] font-mono uppercase tracking-[3px] text-white/50">
          Завантаження...
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
