"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Check, ChevronDown, RotateCcw, Package } from "lucide-react";

interface CityItem {
  present: string;
  name: string;
  area: string;
  ref: string;
  settlementRef?: string;
  settlementType?: string;
}

interface WarehouseItem {
  ref: string;
  description: string;
  number: string;
  category: string;
}

interface NovaPoshtaPickerProps {
  value: string;
  onChange: (address: string) => void;
}

const POPULAR_CITIES = [
  { name: "Київ", query: "Київ" },
  { name: "Львів", query: "Львів" },
  { name: "Одеса", query: "Одеса" },
  { name: "Дніпро", query: "Дніпро" },
  { name: "Харків", query: "Харків" },
  { name: "Вінниця", query: "Вінниця" },
];

export function NovaPoshtaPicker({ value, onChange }: NovaPoshtaPickerProps) {
  const [isManual, setIsManual] = useState(false);

  // City state
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<CityItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isCityLoading, setIsCityLoading] = useState(false);

  // Warehouse state
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseItem | null>(null);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const warehouseDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(e.target as Node)) {
        setIsWarehouseOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search cities debounced (searches all cities, towns, and villages in Ukraine)
  useEffect(() => {
    if (selectedCity && cityQuery === selectedCity.name) return;
    if (!cityQuery.trim() || cityQuery.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCityLoading(true);
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "cities", query: cityQuery }),
        });
        const data = await res.json();
        if (data.success && data.cities) {
          setCitySuggestions(data.cities);
          setIsCityOpen(true);
        }
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setIsCityLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [cityQuery, selectedCity]);

  // Load warehouses with live search on typing
  useEffect(() => {
    if (!selectedCity) {
      setWarehouses([]);
      setSelectedWarehouse(null);
      return;
    }

    // Don't re-query if user already selected a warehouse and the query is its exact description
    if (selectedWarehouse && warehouseQuery === selectedWarehouse.description) return;

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsWarehouseLoading(true);
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "warehouses",
            cityRef: selectedCity.ref,
            settlementRef: selectedCity.settlementRef,
            query: warehouseQuery,
          }),
        });
        const data = await res.json();
        if (!isCancelled && data.success && data.warehouses) {
          setWarehouses(data.warehouses);
        }
      } catch (err) {
        console.error("Failed to load warehouses:", err);
      } finally {
        if (!isCancelled) setIsWarehouseLoading(false);
      }
    }, warehouseQuery.trim() ? 250 : 0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCity, warehouseQuery, selectedWarehouse]);

  // Handle select city
  const handleSelectCity = (city: CityItem) => {
    setSelectedCity(city);
    setCityQuery(city.name);
    setIsCityOpen(false);
    setSelectedWarehouse(null);
    setWarehouseQuery("");
  };

  // Quick select popular city
  const handleQuickCity = async (cityName: string) => {
    setIsCityLoading(true);
    try {
      const res = await fetch("/api/novaposhta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cities", query: cityName }),
      });
      const data = await res.json();
      if (data.success && data.cities && data.cities.length > 0) {
        handleSelectCity(data.cities[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCityLoading(false);
    }
  };

  // Handle select warehouse
  const handleSelectWarehouse = (w: WarehouseItem) => {
    setSelectedWarehouse(w);
    setWarehouseQuery(w.description);
    setIsWarehouseOpen(false);

    if (selectedCity) {
      const full = `${selectedCity.present}, ${w.description}`;
      onChange(full);
    }
  };

  if (isManual) {
    return (
      <div className="flex flex-col gap-2 sm:col-span-2">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[2px] text-white/40">
            Місто та відділення НП (Вручну) *
          </div>
          <button
            type="button"
            onClick={() => setIsManual(false)}
            className="text-[10px] uppercase tracking-[1px] text-white/60 hover:text-white underline"
          >
            Обрати зі списку Нової Пошти
          </button>
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="м. Київ, Відділення №1"
          className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:col-span-2">
      {/* City Input */}
      <div className="flex flex-col gap-2 relative" ref={cityDropdownRef}>
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[2px] text-white/40">
            1. Місто або населений пункт доставки *
          </div>
          <button
            type="button"
            onClick={() => setIsManual(true)}
            className="text-[10px] uppercase tracking-[1px] text-white/40 hover:text-white underline"
          >
            Ввести вручну
          </button>
        </div>

        <div className="relative">
          <input
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setSelectedCity(null);
            }}
            onFocus={() => {
              if (citySuggestions.length > 0) setIsCityOpen(true);
            }}
            placeholder="Введіть місто або село (наприклад: Київ, Львів, Козин, Чайки...)"
            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors pr-8"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40">
            {isCityLoading ? (
              <span className="text-[10px] uppercase animate-pulse">Пошук...</span>
            ) : (
              <Search size={16} />
            )}
          </div>
        </div>

        {/* Popular Cities Chips */}
        {!selectedCity && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase tracking-[1px] text-white/30 mr-1">Швидкий вибір:</span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleQuickCity(c.query)}
                className="px-2.5 py-0.5 text-[10px] tracking-[1px] uppercase bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* City Dropdown */}
        {isCityOpen && citySuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-black/95 border border-white/20 shadow-2xl backdrop-blur-md">
            {citySuggestions.map((city, idx) => (
              <button
                key={city.ref ? city.ref + idx : idx}
                type="button"
                onClick={() => handleSelectCity(city)}
                className="w-full text-left px-4 py-3 hover:bg-white/[0.08] border-b border-white/[0.05] last:border-none transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-white/40 shrink-0" />
                  <span className="text-xs text-white/90">{city.present}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse Input */}
      <div className="flex flex-col gap-2 relative" ref={warehouseDropdownRef}>
        <div className="text-[10px] uppercase tracking-[2px] text-white/40">
          2. Відділення або поштомат Нової Пошти *
        </div>

        <div className="relative">
          <input
            disabled={!selectedCity}
            value={warehouseQuery}
            onChange={(e) => {
              setWarehouseQuery(e.target.value);
              setSelectedWarehouse(null);
              setIsWarehouseOpen(true);
            }}
            onFocus={() => {
              if (selectedCity) setIsWarehouseOpen(true);
            }}
            placeholder={
              !selectedCity
                ? "Спочатку оберіть населений пункт вище"
                : isWarehouseLoading
                ? "Пошук відділень..."
                : "Введіть номер відділення, поштомату або вулицю"
            }
            className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed pr-8"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40">
            {isWarehouseLoading ? (
              <span className="text-[10px] uppercase animate-pulse">Завантаження...</span>
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </div>

        {/* Warehouse Dropdown */}
        {isWarehouseOpen && selectedCity && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto bg-black/95 border border-white/20 shadow-2xl backdrop-blur-md">
            {warehouses.length === 0 ? (
              <div className="p-4 text-xs text-white/40 text-center">
                {isWarehouseLoading ? "Отримуємо список відділень..." : "Відділень за цим запитом не знайдено"}
              </div>
            ) : (
              warehouses.map((w) => {
                const isPostomat = w.category === "Postomat" || w.description.toLowerCase().includes("поштомат");
                return (
                  <button
                    key={w.ref}
                    type="button"
                    onClick={() => handleSelectWarehouse(w)}
                    className="w-full text-left px-4 py-3 hover:bg-white/[0.08] border-b border-white/[0.05] last:border-none transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      {isPostomat ? (
                        <Package size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Building2 size={15} className="text-white/40 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs text-white/90">{w.description}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">
                          {isPostomat ? "Поштомат Нової Пошти" : "Відділення Нової Пошти"}
                        </div>
                      </div>
                    </div>
                    {selectedWarehouse?.ref === w.ref && (
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Selected Address Confirmation Badge */}
      {selectedCity && selectedWarehouse && (
        <div className="p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span className="text-xs text-white/80 leading-snug">
              {selectedCity.present}, {selectedWarehouse.description}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedWarehouse(null);
              setWarehouseQuery("");
              onChange("");
            }}
            className="text-[10px] uppercase tracking-[1px] text-white/40 hover:text-white shrink-0 flex items-center gap-1"
          >
            <RotateCcw size={11} />
            <span>Змінити</span>
          </button>
        </div>
      )}
    </div>
  );
}
