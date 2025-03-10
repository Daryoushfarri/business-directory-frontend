"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div style={{
            textAlign: "center",
            padding: "50px",
            background: "#f0f0f5", // Soft grey background
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {/* Modern Welcome Box */}
            <div style={{
                background: "linear-gradient(135deg, #0070f3, #0050b3)", 
                color: "white",
                padding: "30px 40px",
                borderRadius: "15px",
                width: "90%",
                maxWidth: "600px",
                textAlign: "center",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                transform: "scale(1.02)",
                transition: "0.3s ease-in-out"
            }}>
                <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
                    Welcome to the Business Directory
                </h1>
                <p style={{ fontSize: "18px", opacity: "0.9", marginBottom: "0" }}>
                    Find and connect with businesses in your area.
                </p>
            </div>

            {/* Business Illustration */}
            <img 
                src="https://cdn-icons-png.flaticon.com/512/906/906334.png" 
                alt="Business Directory Icon" 
                style={{ width: "150px", marginTop: "30px" }} 
            />

            {/* Buttons */}
            <div style={{
                display: "flex", 
                justifyContent: "center", 
                gap: "20px", 
                flexWrap: "wrap",
                marginTop: "30px"
            }}>
                <button 
                    onClick={() => router.push("/businesses")} 
                    style={{
                        padding: "15px 30px",
                        fontSize: "16px",
                        cursor: "pointer",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                        transition: "0.2s ease-in-out"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    View Businesses
                </button>

                <button 
                    onClick={() => router.push("/dashboard")} 
                    style={{
                        padding: "15px 30px",
                        fontSize: "16px",
                        cursor: "pointer",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                        transition: "0.2s ease-in-out"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    My Dashboard
                </button>
            </div>
        </div>
    );
}
