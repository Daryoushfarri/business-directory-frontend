"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Business = {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
};

export default function BusinessDetails() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter(); // ✅ Added for navigation
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:5000/businesses/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Business not found");
                }
                return response.json();
            })
            .then((data) => {
                setBusiness(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load business details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading business details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!business) return <p>No business found.</p>;

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>{business.name}</h1>
            <p><strong>Category:</strong> {business.category}</p>
            <p><strong>Location:</strong> {business.location}</p>
            <p>{business.description}</p>
            {business.image_url && <img src={business.image_url} alt={business.name} width="200" />}

            {/* ✅ Added Return to Listings Button */}
            <br />
            <button 
                onClick={() => router.push("/businesses")} 
                style={{ marginTop: "20px", padding: "10px", background: "#0070f3", color: "white", borderRadius: "5px", cursor: "pointer" }}
            >
                🔙 Return to Listings
            </button>
        </div>
    );
}
