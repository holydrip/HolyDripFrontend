"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { DM_Sans } from "next/font/google";
import {
  Check,
  Copy,
  Package,
  User,
  ArrowRight,
  Truck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  CreditCard,
  Send,
} from "lucide-react";

const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

interface OrderItem {
  id: string;
  size?: string;
  quantity: number;
  price: string | number;
  product?: {
    id: string;
    name: string;
    images?: string[];
    price?: string | number;
  };
}

interface OrderData {
  id: string;
  name: string;
  phone: string;
  telegram?: string | null;
  address?: string | null;
  totalPrice: string | number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(orderId));
  const [copied, setCopied] = useState<boolean>(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://holydripbackend-production.up.railway.app";

  useEffect(() => {
    // Immediately clear cart after payment
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetch(`${API_URL}/order/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setOrder(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load order:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, API_URL]);

  const handleCopyId = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "PAID":
        return {
          label: "Оплачено",
          dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]",
          text: "text-emerald-400",
          border: "border-emerald-500/30 bg-emerald-500/10",
        };
      case "CONFIRMED":
        return {
          label: "Підтверджено",
          dot: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]",
          text: "text-sky-400",
          border: "border-sky-500/30 bg-sky-500/10",
        };
      case "SHIPPED":
        return {
          label: "Відправлено",
          dot: "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]",
          text: "text-indigo-400",
          border: "border-indigo-500/30 bg-indigo-500/10",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          label: "Скасовано",
          dot: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.8)]",
          text: "text-rose-400",
          border: "border-rose-500/30 bg-rose-500/10",
        };
      case "PENDING":
      default:
        return {
          label: "Обробляється",
          dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
          text: "text-amber-400",
          border: "border-amber-500/30 bg-amber-500/10",
        };
    }
  };

  const statusInfo = getStatusBadge(order?.status || "PAID");

  return (
    <main
      className={`${dm.className} min-h-screen bg-[#020202] text-white px-4 sm:px-8 md:px-14 py-24 relative overflow-hidden flex flex-col items-center justify-center`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/[0.02] blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Top Hero Card */}
        <div className="p-[1px] bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent rounded-[28px]">
          <div className="bg-gradient-to-b from-[#090909] to-[#040404] backdrop-blur-2xl rounded-[27px] p-6 sm:p-12 text-center relative overflow-hidden border border-white/[0.02]">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] mb-6">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[9px] uppercase tracking-[3px] text-white/60 font-mono">
                Holy Drip Official
              </span>
            </div>

            {/* Glowing Success Emblem */}
            <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center relative z-10 shadow-[0_0_35px_rgba(16,185,129,0.2)]"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <Check className="w-8 h-8 text-emerald-300 stroke-[2.5]" />
                </div>
              </motion.div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            </div>

            {/* Fraktur Title */}
            <h1 className="font-fraktur text-4xl sm:text-6xl text-white tracking-wide leading-tight">
              Замовлення сплачено
            </h1>

            <p className="mt-4 text-xs uppercase tracking-[3px] text-white/50 max-w-md mx-auto leading-relaxed">
              Дякуємо за довіру. Твоє замовлення вже зафіксоване в системі.
            </p>

            {/* Status & Order ID Pill */}
            {orderId && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
                  <Package size={13} className="text-white/40" />
                  <span className="text-xs font-mono text-white/90 uppercase tracking-wider">
                    #{orderId.slice(0, 8)}
                  </span>
                  <button
                    onClick={handleCopyId}
                    title="Копіювати повний номер"
                    className="ml-1 text-white/40 hover:text-white transition-colors p-1"
                  >
                    {copied ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusInfo.border}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                  <span
                    className={`text-[10px] uppercase tracking-[2px] font-mono font-medium ${statusInfo.text}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Order Details Section */}
        {loading ? (
          <div className="mt-6 p-8 rounded-[24px] border border-white/[0.05] bg-white/[0.01] text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-white/40">
              Завантаження деталей замовлення...
            </span>
          </div>
        ) : order ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 flex flex-col gap-6"
          >
            {/* Delivery & Customer Info Card */}
            <div className="p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px]">
              <div className="bg-[#060606] rounded-[23px] p-6 sm:p-8 border border-white/[0.02]">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-6">
                  <span className="text-[10px] uppercase tracking-[4px] text-white/40 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-white/60" /> Дані
                    доставки
                  </span>
                  <span className="text-[10px] font-mono text-white/30 uppercase">
                    {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-[3px] text-white/30">
                      Одержувач
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {order.name}
                    </span>
                    <span className="text-xs font-mono text-white/60">
                      {order.phone}
                    </span>
                    {order.telegram && (
                      <span className="text-xs font-mono text-emerald-400/80 flex items-center gap-1 mt-0.5">
                        <Send size={11} /> {order.telegram}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] uppercase tracking-[3px] text-white/30 flex items-center gap-1.5">
                      <Truck size={12} className="text-white/40" /> Адреса
                      відділення
                    </span>
                    <span className="text-sm text-white/90 leading-relaxed font-mono">
                      {order.address || "Не вказано"}
                    </span>
                    <span className="text-[10px] uppercase tracking-[2px] text-white/40 mt-1">
                      Нова Пошта • Доставка по Україні
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Summary Card */}
            {order.items && order.items.length > 0 && (
              <div className="p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px]">
                <div className="bg-[#060606] rounded-[23px] p-6 sm:p-8 border border-white/[0.02]">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-6">
                    <span className="text-[10px] uppercase tracking-[4px] text-white/40 flex items-center gap-2">
                      <Package size={14} className="text-white/60" /> Товари в
                      замовленні
                    </span>
                    <span className="text-[10px] font-mono text-white/40 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                      {order.items.length} ПОЗИЦІЇ
                    </span>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    {order.items.map((item, idx) => {
                      const image = item.product?.images?.[0];
                      const title =
                        item.product?.name ||
                        (item as any).name ||
                        "Товар Holy Drip";

                      return (
                        <div
                          key={item.id || idx}
                          className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden shrink-0 relative flex items-center justify-center">
                              {image ? (
                                <Image
                                  src={image}
                                  alt={title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package size={20} className="text-white/20" />
                              )}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm font-medium text-white/90 line-clamp-1 max-w-xs sm:max-w-md">
                                {title}
                              </span>
                              <div className="flex items-center gap-3 mt-1">
                                {item.size && (
                                  <span className="text-[10px] font-mono text-white/50 bg-white/[0.03] px-2 py-0.5 rounded border border-white/5 uppercase">
                                    Розмір: {item.size}
                                  </span>
                                )}
                                <span className="text-[10px] font-mono text-white/40">
                                  Кількість: {item.quantity} шт.
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-mono text-white/90">
                              {Number(item.price) * item.quantity}{" "}
                              <span className="text-white/40 text-xs">₴</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total row */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[3px] text-white/50">
                      Разом сплачено
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-fraktur text-2xl sm:text-3xl text-white tracking-wide">
                        {order.totalPrice}
                      </span>
                      <span className="text-sm font-mono text-white/40">₴</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline / Next Steps */}
            <div className="p-6 rounded-[22px] border border-white/[0.05] bg-gradient-to-r from-white/[0.02] to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-white/70" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-white/90 uppercase tracking-wider">
                    Що відбувається далі?
                  </span>
                  <span className="text-xs text-white/50 leading-relaxed">
                    Менеджер формує посилку. Номер накладної ТТН буде додано до
                    твого кабінету.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/profile"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/20 text-white hover:border-white px-8 py-4 rounded-xl text-[10px] uppercase tracking-[3px] transition-all hover:bg-white/[0.05]"
          >
            <User size={13} />
            Особистий кабінет
          </Link>

          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-white/90 px-8 py-4 rounded-xl text-[10px] uppercase tracking-[3px] font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            В каталог
            <ArrowRight size={13} />
          </Link>
        </motion.div>

        {/* Home link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[2px] text-white/30 hover:text-white transition-colors"
          >
            Повернутися на головну
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#020202] flex items-center justify-center">
          <div className="text-[11px] font-mono uppercase tracking-[3px] text-white/40 flex items-center gap-3">
            <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
            Завантаження...
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
