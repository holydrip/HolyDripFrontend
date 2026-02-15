"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "../../../public/images/logo-full-dark.jpg";
import Styles from "./countdown.module.css";

interface CountdownProps {
  date: Date;
}

interface TimerProps {
  label: string;
  number: number;
}

function getTimeLeft(targetDate: Date) {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
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

export function Countdown({ date }: CountdownProps) {
  const [time, setTime] = useState(getTimeLeft(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(date));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Styles.wrapper}>
      <Image
        className={Styles.logoImage}
        src={logo}
        alt="logo"
        draggable={false}
      />
      <h1 className={Styles.loadingCaption}>CULT IS LOADING...</h1>
      <div className={Styles.timers}>
        <Timer label="Days" number={time.days}></Timer>
        <Timer label="Hours" number={time.hours}></Timer>
        <Timer label="Minutes" number={time.minutes}></Timer>
        <Timer label="Seconds" number={time.seconds}></Timer>
      </div>
      <input className={Styles.emailInput} type="email" placeholder="Email address"/>
    </div>
  );
}
