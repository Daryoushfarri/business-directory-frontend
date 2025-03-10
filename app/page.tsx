"use client";

import Link from "next/link";

export default function Home() {
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome to the Business Directory</h1>
            <p>Find and connect with businesses in your area.</p>

            {/* Add Business Button */}
            <Link href="/add-business">
                <button 
                    style={{
                        padding: "12px 20px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        background: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        marginTop: "20px"
                    }}
                >
                    ➕ Add Your Business
                </button>
            </Link>

            {/* View Business Listings */}
            <p style={{ marginTop: "15px" }}>
                <Link href="/businesses" style={{ textDecoration: "none", color: "#0070f3", fontSize: "18px" }}>
                    View Business Listings →
                </Link>
            </p>
        </div>
    );
}
