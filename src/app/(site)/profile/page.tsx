"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { LogOut, ChevronDown, ChevronUp, User, MapPin, Zap, Package, ShieldCheck, Camera, Check, Edit2, Hash, Navigation } from "lucide-react";
import Image from "next/image";

const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const dm = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function ProfilePage() {
  const { t } = useTranslation("Profile");
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
      name: "",
      email: "",
      phone: "",
      city: "",
      post: "",
      zip: "",
      avatarUrl: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/user/me`, {
      credentials: 'include' 
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => {
      setProfile({
        ...data,
        avatarUrl: data.avatarUrl || null
      });
      let parsedAddress = { city: "", post: "", zip: "" };
      if (data.address) {
          try {
              if (data.address.startsWith("{")) {
                  parsedAddress = JSON.parse(data.address);
              } else {
                  const parts = data.address.split(",");
                  parsedAddress.city = parts[0]?.trim() || "";
                  parsedAddress.post = parts[1]?.trim() || "";
              }
          } catch(e) {}
      }

      setEditForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: parsedAddress.city,
          post: parsedAddress.post,
          zip: parsedAddress.zip,
          avatarUrl: data.avatarUrl || ""
      });
      setLoading(false);
    })
    .catch(() => {
      // Mock data if backend fails
      const mockData = {
        id: "user-123",
        name: "Аліма",
        email: "holy.founder@holydrip.com",
        phone: "+38 099 666 99 99",
        address: "м. Київ, Нова Пошта №42",
        avatarUrl: null,
        discount: { percent: 10 },
        totalSpent: 16500,
        orders: [
          {
            id: "order-12345678-abc",
            createdAt: new Date().toISOString(),
            totalPrice: "4500",
            status: "PAID",
            items: [
              { name: "Balenciaga Defender", size: "43", quantity: 1 }
            ]
          }
        ]
      };
      setProfile(mockData);
      let parsedAddressMock = { city: "", post: "", zip: "" };
      if (mockData.address) {
          const parts = mockData.address.split(",");
          parsedAddressMock.city = parts[0]?.trim() || "";
          parsedAddressMock.post = parts[1]?.trim() || "";
      }
      setEditForm({
          name: mockData.name,
          email: mockData.email,
          phone: mockData.phone,
          city: parsedAddressMock.city,
          post: parsedAddressMock.post,
          zip: parsedAddressMock.zip,
          avatarUrl: mockData.avatarUrl || ""
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              // If we are in edit mode, just update the form
              if (isEditing) {
                  setEditForm(prev => ({ ...prev, avatarUrl: base64String }));
              } else {
                  // If not in edit mode, instantly jump to edit mode with the new avatar
                  setEditForm(prev => ({ ...prev, avatarUrl: base64String }));
                  setIsEditing(true);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          // Send PUT request to save user data
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/user/${profile.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                  name: editForm.name,
                  email: editForm.email,
                  phone: editForm.phone,
                  address: JSON.stringify({ city: editForm.city, post: editForm.post, zip: editForm.zip }),
                  avatarUrl: editForm.avatarUrl
              })
          });
          
          if (res.ok) {
              const updated = await res.json();
              setProfile((prev: any) => ({ ...prev, ...updated }));
          } else {
              const fakeAddress = JSON.stringify({ city: editForm.city, post: editForm.post, zip: editForm.zip });
              setProfile((prev: any) => ({ ...prev, name: editForm.name, email: editForm.email, phone: editForm.phone, address: fakeAddress, avatarUrl: editForm.avatarUrl }));
          }
      } catch (err) {
          const fakeAddress = JSON.stringify({ city: editForm.city, post: editForm.post, zip: editForm.zip });
          setProfile((prev: any) => ({ ...prev, name: editForm.name, email: editForm.email, phone: editForm.phone, address: fakeAddress, avatarUrl: editForm.avatarUrl }));
      } finally {
          setIsEditing(false);
          setSaving(false);
      }
  };

  if (loading) {
    return (
      <div className={`${dm.className} min-h-[90vh] bg-black flex flex-col items-center justify-center`}>
         <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
      </div>
    );
  }

  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const totalSpent = profile?.totalSpent || 0;
  let nextTierThreshold = 5000;
  let currentTierThreshold = 0;
  let nextTierPercent = 5;

  if (totalSpent >= 50000) {
      currentTierThreshold = 50000;
      nextTierThreshold = 50000;
      nextTierPercent = 20;
  } else if (totalSpent >= 30000) {
      currentTierThreshold = 30000;
      nextTierThreshold = 50000;
      nextTierPercent = 20;
  } else if (totalSpent >= 15000) {
      currentTierThreshold = 15000;
      nextTierThreshold = 30000;
      nextTierPercent = 15;
  } else if (totalSpent >= 5000) {
      currentTierThreshold = 5000;
      nextTierThreshold = 15000;
      nextTierPercent = 10;
  }

  const progressPercent = nextTierThreshold === currentTierThreshold 
      ? 100 
      : ((totalSpent - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100;

  const toggleOrder = (id: string) => {
    if (expandedOrder === id) setExpandedOrder(null);
    else setExpandedOrder(id);
  };

  const currentAvatar = isEditing ? editForm.avatarUrl : profile.avatarUrl;

  return (
    <div className={`${dm.className} min-h-[90vh] bg-[#020202] flex flex-col pb-32 text-white relative`}>
      
      {/* Subtle Dark Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent rounded-[100%] pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="flex items-end justify-between px-6 sm:px-12 md:px-[70px] pt-32 pb-8 border-b border-white/[0.05] relative z-10"
      >
        <div className="flex flex-col gap-3">
            <span className="text-white/40 text-[9px] uppercase tracking-[8px] font-light flex items-center gap-2">
                <ShieldCheck size={12} className="text-white/60" /> 
                {t("title") || "Автентифікація підтверджена"}
            </span>
            <h1 className={`font-fraktur text-6xl md:text-[80px] tracking-wide text-white leading-none`}>
                Особистий кабінет
            </h1>
        </div>
        <button 
          onClick={() => {/* logout logic */}}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[4px] pb-2 group"
        >
          <span className="hidden sm:block">Вийти</span> 
          <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 lg:gap-8 px-6 sm:px-12 md:px-[70px] mt-10 w-full relative z-10"
      >
        
        {/* Top Section: Profile & Loyalty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left: Unified Profile Data (Spans 8 columns) */}
            <motion.div variants={itemVars} className="lg:col-span-8 flex flex-col p-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px] overflow-hidden relative group">
                <div className="bg-[#050505] rounded-[22px] w-full h-full p-8 md:p-10 flex flex-col relative overflow-hidden transition-colors duration-500 group-hover:bg-[#080808]">
                    
                    {/* Decorative glowing orb inside card */}
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/[0.02] rounded-full blur-[60px] pointer-events-none" />

                    <div className="flex items-center justify-between gap-3 mb-8 relative z-10 border-b border-white/[0.05] pb-4">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-white/40" />
                            <h2 className="text-[10px] uppercase tracking-[4px] text-white/50">Ваші Дані</h2>
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Редагувати <Edit2 size={10} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={() => {
                                    setIsEditing(false);
                                    setEditForm({
                                        name: profile.name || "",
                                        email: profile.email || "",
                                        phone: profile.phone || "",
                                        city: JSON.parse(profile.address || "{}").city || "",
                                        post: JSON.parse(profile.address || "{}").post || "",
                                        zip: JSON.parse(profile.address || "{}").zip || "",
                                        avatarUrl: profile.avatarUrl || ""
                                    });
                                }} className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
                                    Скасувати
                                </button>
                                <button onClick={handleSave} disabled={saving} className="group/btn relative overflow-hidden bg-white text-black px-6 py-2 rounded-full font-medium transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    <span className="relative z-10 text-[9px] uppercase tracking-widest font-bold">
                                        {saving ? 'Збереження...' : 'Зберегти'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-10 md:gap-16 relative z-10 w-full h-full">
                        
                        {/* Avatar & Main Info */}
                        <div className="flex flex-col md:w-1/2 gap-8">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="relative group/avatar cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleAvatarChange} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                    <div className={`w-24 h-24 rounded-full overflow-hidden border border-white/10 relative transition-transform duration-500 group-hover/avatar:scale-105 flex items-center justify-center ${!currentAvatar ? 'bg-white/[0.02]' : ''}`}>
                                        {currentAvatar ? (
                                            <Image src={currentAvatar} alt="Avatar" layout="fill" objectFit="cover" />
                                        ) : (
                                            <User size={32} className="text-white/20" />
                                        )}
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 backdrop-blur-sm">
                                            <Camera size={16} className="text-white/80" />
                                            <span className="text-[8px] uppercase tracking-widest text-white/80">Змінити</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#050505] rounded-full flex items-center justify-center border border-white/10 group-hover/avatar:bg-white/10 transition-colors">
                                        <Camera size={12} className="text-white/50" />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 w-full max-w-[300px]">
                                    <span className="text-[9px] uppercase tracking-[3px] text-white/30 ml-1">Нікнейм</span>
                                    {isEditing ? (
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={editForm.name} 
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-2xl font-fraktur text-white focus:outline-none rounded-xl transition-all duration-300"
                                            />
                                            <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                        </div>
                                    ) : (
                                        <p className="text-3xl font-fraktur tracking-wide mt-1">{profile.name}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6 mt-4">
                                <div className={`flex flex-col gap-2 ${!isEditing && 'border-b border-white/[0.05] pb-4'}`}>
                                    <span className="text-[9px] uppercase tracking-[3px] text-white/40 ml-1">Email</span>
                                    {isEditing ? (
                                        <div className="relative group/input">
                                            <input 
                                                type="email" 
                                                value={editForm.email} 
                                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none rounded-xl transition-all duration-300"
                                            />
                                            <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-mono text-white/80">{profile.email}</span>
                                    )}
                                </div>
                                <div className={`flex flex-col gap-2 ${!isEditing && 'border-b border-white/[0.05] pb-4'}`}>
                                    <span className="text-[9px] uppercase tracking-[3px] text-white/40 ml-1">Телефон</span>
                                    {isEditing ? (
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                value={editForm.phone} 
                                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none rounded-xl transition-all duration-300"
                                                placeholder="+38 000 000 00 00"
                                            />
                                            <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                        </div>
                                    ) : (
                                        <span className="text-sm font-mono text-white/80">{profile.phone || "Не вказано"}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Column */}
                        <div className="flex flex-col flex-grow md:w-1/2 border-t md:border-t-0 md:border-l border-white/[0.05] pt-8 md:pt-0 md:pl-10">
                            <span className="text-[9px] uppercase tracking-[3px] text-white/40 mb-4 flex items-center gap-2">
                                <MapPin size={12} className="text-white/40" /> Адреса Доставки
                            </span>
                            
                            {isEditing ? (
                                <div className="flex flex-col gap-4">
                                    <div className="relative group/input">
                                        <input 
                                            type="text" 
                                            value={editForm.city} 
                                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                                            className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none rounded-xl transition-all duration-300"
                                            placeholder="Місто (напр. Київ)"
                                        />
                                        <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                    </div>
                                    <div className="relative group/input">
                                        <input 
                                            type="text" 
                                            value={editForm.post} 
                                            onChange={(e) => setEditForm({...editForm, post: e.target.value})}
                                            className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none rounded-xl transition-all duration-300"
                                            placeholder="Відділення (напр. НП №42) або Вулиця"
                                        />
                                        <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                    </div>
                                    <div className="relative group/input">
                                        <input 
                                            type="text" 
                                            value={editForm.zip} 
                                            onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                                            className="w-full bg-white/[0.02] group-hover/input:bg-white/[0.04] border border-transparent focus:border-white/20 focus:bg-transparent px-4 py-3 text-sm font-mono text-white focus:outline-none rounded-xl transition-all duration-300"
                                            placeholder="Індекс (01001)"
                                        />
                                        <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none group-hover/input:ring-white/10 transition-all duration-300" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow flex flex-col justify-center bg-white/[0.01] rounded-xl p-6 border border-white/[0.03]">
                                    {profile.address ? (
                                        <div className="flex flex-col gap-5">
                                            {(() => {
                                                try {
                                                    const p = JSON.parse(profile.address);
                                                    return (
                                                        <>
                                                            {p.city && (
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/[0.05]">
                                                                        <Navigation size={12} className="text-white/60" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[9px] uppercase tracking-[3px] text-white/30 mb-0.5">Місто</span>
                                                                        <span className="text-[14px] font-mono text-white/90">{p.city}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {p.post && (
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/[0.05]">
                                                                        <Package size={12} className="text-white/60" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[9px] uppercase tracking-[3px] text-white/30 mb-0.5">Відділення / Вулиця</span>
                                                                        <span className="text-[14px] font-mono text-white/90 leading-relaxed">{p.post}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {p.zip && (
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/[0.05]">
                                                                        <Hash size={12} className="text-white/60" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[9px] uppercase tracking-[3px] text-white/30 mb-0.5">Індекс</span>
                                                                        <span className="text-[14px] font-mono text-white/70">{p.zip}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                } catch(e) {
                                                    return <p className="text-[13px] font-mono text-white/70 leading-loose whitespace-pre-wrap">{profile.address}</p>;
                                                }
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center opacity-30 gap-3">
                                            <MapPin size={24} className="text-white/20" />
                                            <p className="text-[10px] uppercase tracking-[3px] text-white/50">Адреса не вказана</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>

            {/* Right: Loyalty (Spans 4 columns) */}
            <motion.div variants={itemVars} className="lg:col-span-4 flex flex-col p-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px] overflow-hidden group">
                <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] rounded-[22px] w-full h-full p-8 md:p-10 flex flex-col relative overflow-hidden transition-colors duration-500 group-hover:from-[#0f0f0f] group-hover:to-[#050505]">
                    
                    <div className="absolute -right-10 -top-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                        <Zap size={200} />
                    </div>
                    
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-white/40" />
                            <h2 className="text-[10px] uppercase tracking-[4px] text-white/50">Лояльність</h2>
                        </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow justify-center relative z-10">
                        <span className="block text-[9px] uppercase tracking-widest text-white/30 mb-2">Персональна знижка</span>
                        <div className="flex items-baseline gap-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <span className="text-[90px] font-light tracking-tighter leading-none">{profile.discount?.percent || 0}</span>
                            <span className="text-4xl text-white/40 font-light">%</span>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10 bg-white/[0.02] p-5 rounded-xl border border-white/[0.03]">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[9px] uppercase tracking-[3px] text-white/40 font-mono">Витрачено</span>
                            <span className="text-lg font-mono text-white/90">{totalSpent} ₴</span>
                        </div>
                        <div className="w-full h-1 bg-black rounded-full overflow-hidden mb-3 border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-white relative"
                            />
                        </div>
                        <div className="flex justify-end">
                            <span className="text-[8px] uppercase tracking-widest text-white/40">
                                {nextTierThreshold === currentTierThreshold ? "МАКСИМАЛЬНИЙ РАНГ" : `ЦІЛЬ: ${nextTierThreshold} ₴`}
                            </span>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>

        {/* Bottom Section: Orders Table */}
        <motion.div variants={itemVars} className="flex flex-col p-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-[24px] overflow-hidden group">
            <div className="bg-[#050505] rounded-[22px] w-full h-full p-8 md:p-10 flex flex-col relative overflow-hidden transition-colors duration-500 group-hover:bg-[#080808]">
                
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.05] mb-8">
                    <div className="flex items-center gap-3">
                        <Package size={16} className="text-white/40" />
                        <h2 className="text-[10px] uppercase tracking-[4px] text-white/50">Історія Замовлень</h2>
                    </div>
                    <span className="text-[9px] uppercase tracking-[4px] text-white/30 font-mono bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                        {profile.orders?.length || 0} RECORDS
                    </span>
                </div>
                
                {profile.orders?.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <Package size={40} className="mb-4 text-white/20" />
                        <p className="text-[10px] uppercase tracking-[4px]">Немає замовлень</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Header Desktop */}
                        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-white/[0.05] text-[9px] uppercase tracking-[3px] text-white/30">
                            <div className="col-span-3">Order ID</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-3">Total</div>
                            <div className="col-span-1 text-right">Details</div>
                        </div>
                        
                        {/* Order Rows */}
                        {profile.orders.map((order: any) => {
                            const isExpanded = expandedOrder === order.id;
                            return (
                                <div key={order.id} className="flex flex-col border-b border-white/[0.05] last:border-0 group/order">
                                    {/* Row */}
                                    <div 
                                        className={`grid grid-cols-2 md:grid-cols-12 gap-4 py-5 items-center cursor-pointer transition-colors duration-300 rounded-xl px-2 -mx-2 md:px-4 md:-mx-4 ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
                                        onClick={() => toggleOrder(order.id)}
                                    >
                                        <div className="col-span-2 md:col-span-3 flex items-center justify-between md:justify-start gap-4">
                                            <span className="text-sm font-mono text-white/80 uppercase tracking-wide group-hover/order:text-white transition-colors">
                                                #{order.id.slice(0,8)}
                                            </span>
                                            <div className="md:hidden flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <span className="text-[9px] uppercase tracking-[2px] text-white/50">
                                                    {order.status === 'PAID' ? 'Оплачено' : 'Очікує'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-span-1 md:col-span-2 text-sm font-mono text-white/40 group-hover/order:text-white/60 transition-colors">
                                            {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                                        </div>
                                        
                                        <div className="hidden md:flex col-span-3 items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'PAID' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'}`} />
                                            <span className={`text-[9px] uppercase tracking-[3px] ${order.status === 'PAID' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                                                {order.status === 'PAID' ? 'Оплачено' : 'Очікує оплати'}
                                            </span>
                                        </div>
                                        
                                        <div className="col-span-1 md:col-span-3 text-[15px] font-mono text-white/90">
                                            {order.totalPrice} <span className="text-white/40">₴</span>
                                        </div>

                                        <div className="hidden md:flex col-span-1 justify-end text-white/30 group-hover/order:text-white/60 transition-colors">
                                            <div className={`w-8 h-8 rounded-full border border-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'bg-white/10 rotate-180' : 'bg-transparent'}`}>
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden bg-[#020202] rounded-xl -mt-2 mb-4 mx-2 md:mx-4 border border-white/[0.03]"
                                            >
                                                <div className="p-6 md:p-8 flex flex-col gap-4 border-l-2 border-white/10">
                                                    <h4 className="text-[9px] uppercase tracking-[4px] text-white/30 mb-2">Деталі покупки</h4>
                                                    {order.items.map((item: any, i: number) => (
                                                        <div key={i} className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-white/20 font-mono text-[10px]">0{i+1}</span>
                                                                <span className="text-white/80">{item.name}</span>
                                                                <span className="text-white/40 text-[9px] uppercase tracking-widest px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded">SIZE {item.size}</span>
                                                            </div>
                                                            <span className="font-mono text-white/50">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
