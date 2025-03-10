"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ Import Framer Motion for animations
import React from "react"; // ✅ Import React explicitly


type Business = {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
};

export default function BusinessListings() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/businesses")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setBusinesses(data); // ✅ If backend returns an array
                } else if (data.data && Array.isArray(data.data)) {
                    setBusinesses(data.data); // ✅ If backend returns an object with `data`
                } else {
                    setError("Unexpected response format.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load businesses.");
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Loading businesses...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

    const filteredBusinesses = businesses.filter((business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <main style={{ padding: "20px", textAlign: "center" }}>
                <h1>Business Listings</h1>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "80%",
                        marginBottom: "20px",
                        fontSize: "16px"
                    }}
                />

                {/* Business Listings with Animation */}
                {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((business, index) => (
                        <motion.div 
                            key={business.id} 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: index * 0.2 }} // ✅ Staggered animation effect
                            style={{ 
                                border: "1px solid #ddd", 
                                padding: "15px", 
                                margin: "10px", 
                                borderRadius: "10px",
                                background: "white",
                                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
                            }}
                        >
                            <h2>{business.name}</h2>
                            <p><strong>Category:</strong> {business.category}</p>
                            <p><strong>Location:</strong> {business.location}</p>
                            <p>{business.description}</p>
                            {business.image_url && <img src={business.image_url} alt={business.name} width="200" />}
                            <br />
                            <a 
                                href={`/businesses/${business.id}`} 
                                style={{
                                    textDecoration: "none", 
                                    color: "white",
                                    background: "#0070f3",
                                    padding: "8px 12px",
                                    borderRadius: "5px",
                                    display: "inline-block",
                                    marginTop: "10px",
                                    fontWeight: "bold" as const
                                }}>
                                🔍 View Details
                            </a>
                        </motion.div>
                    ))
                ) : (
                    <p>No businesses found.</p>
                )}
            </main>
        </div>
    );
}
