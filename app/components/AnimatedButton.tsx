"use client";

import { ReactNode } from "react";

interface AnimatedButtonProps {
    onClick?: () => void;
    children: ReactNode;  // ✅ Ensure children is properly typed
    style?: React.CSSProperties;
    type?: "button" | "submit" | "reset";  // ✅ Allow button types
}

export default function AnimatedButton({ onClick, children, style, type = "button" }: AnimatedButtonProps) {
    return (
        <button
            type={type}  // ✅ Ensures correct button behavior
            onClick={onClick}
            style={{
                padding: "10px 15px",
                fontSize: "16px",
                cursor: "pointer",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                transition: "0.3s",
                transform: "scale(1)",
                ...style,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {children}
        </button>
    );
}
