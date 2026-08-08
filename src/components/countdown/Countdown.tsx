"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../../public/images/logo-full-dark.jpg";
import Styles from "./countdown.module.css";

interface CountdownProps {
  date: Date;
  children?: React.ReactNode;
}

interface TimerProps {
  label: string;
  number: number;
}

function getTimeLeft(targetDate: Date) {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isFinished: false,
  };
}

function Timer({ label, number }: TimerProps) {
  return (
    <div className={Styles.timer}>
      <div className={Styles.timerNumber}>
        <b>{String(number).padStart(2, "0")}</b>
      </div>
      <div className={Styles.timerLabel}>{label}</div>
    </div>
  );
}

export function Countdown({ date, children }: CountdownProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false });

  useEffect(() => {
    setIsMounted(true);
    setTime(getTimeLeft(date));

    const interval = setInterval(() => {
      const timeLeft = getTimeLeft(date);
      setTime(timeLeft);

      if (timeLeft.isFinished) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (!isMounted) return null;

  if (time.isFinished) {
    return <>{children}</>;
  }

  return (
    <div className={'p-10 flex grow-1 min-h-screen flex-col text-center justify-center items-center gap-10 bg-black text-white'}>
      <Image
        className={Styles.logoImage}
        src={logo}
        alt="logo"
        draggable={false}
      />
      <h1 className={'text-2xl sm:text-5xl font-semibold'}>КУЛЬТ ЗАВАНТАЖУЄТЬСЯ...</h1>
      <div className={'flex gap-5 flex-col sm:flex-row'}>
        <Timer label="Дні" number={time.days}></Timer>
        <Timer label="Години" number={time.hours}></Timer>
        <Timer label="Хвилини" number={time.minutes}></Timer>
        <Timer label="Секунди" number={time.seconds}></Timer>
      </div>
      <input className={'w-50 sm:w-75 border-solid border-[gray] outline-none border-1 rounded-md p-5 text-md'} type="email" placeholder="Ел.пошта"/>
    </div>
  );
}