"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
    const base =
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
        variant === "primary"
            ? "bg-black text-white hover:opacity-90"
            : variant === "secondary"
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-transparent text-gray-900 hover:bg-gray-100";

    return <button className={`${base} ${styles} ${className}`} {...props} />;
}
