"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <nav style={{
            background: "#0070f3",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white"
        }}>
            <h2 style={{ margin: 0 }}>
                <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: "24px" }}>
                    📍 Business Directory
                </Link>
            </h2>

            <div>
                <Link href="/businesses" style={{ color: "white", textDecoration: "none", marginRight: "20px" }}>
                    🏢 Businesses
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard" style={{ color: "white", textDecoration: "none", marginRight: "20px" }}>
                            📊 My Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            style={{ 
                                padding: "5px 10px",
                                background: "#d9534f",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "5px"
                            }}>
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ color: "white", textDecoration: "none", marginRight: "20px" }}>
                            🔑 Login
                        </Link>
                        <Link href="/register" style={{ color: "white", textDecoration: "none" }}>
                            📝 Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
