"use client";

import React, { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ className = "", ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white transition-colors ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";