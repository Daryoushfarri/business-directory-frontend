"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AnimatedButton from "../../components/AnimatedButton";

type Business = {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
};

export default function EditBusiness() {
    const params = useParams();
    const businessId = params?.id as string;
    const [business, setBusiness] = useState<Business | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!businessId) return;
        fetch(`http://localhost:5000/businesses/${businessId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setBusiness(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load business details.");
                setLoading(false);
            });
    }, [businessId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!business) return;

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setError("Unauthorized. Please log in.");
            return;
        }

        const response = await fetch(`http://localhost:5000/businesses/${businessId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(business),
        });

        if (response.ok) {
            router.push(`/businesses/${businessId}`);
        } else {
            setError("Failed to update business.");
        }
    };

    if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    if (loading) return <p style={{ textAlign: "center" }}>Loading business details...</p>;

    return (
        <div style={{
            padding: "20px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "auto",
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            paddingBottom: "20px"
        }}>
            <h1>Edit Business</h1>
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Business Name"
                    value={business?.name || ""}
                    onChange={(e) => setBusiness(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
                <textarea
                    placeholder="Description"
                    value={business?.description || ""}
                    onChange={(e) => setBusiness(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={business?.category || ""}
                    onChange={(e) => setBusiness(prev => prev ? { ...prev, category: e.target.value } : null)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={business?.location || ""}
                    onChange={(e) => setBusiness(prev => prev ? { ...prev, location: e.target.value } : null)}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={business?.image_url || ""}
                    onChange={(e) => setBusiness(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                />

                {/* Buttons */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                    <AnimatedButton type="submit" style={{ background: "#28a745" }}>
                        ✅ Update Business
                    </AnimatedButton>
                    <AnimatedButton onClick={() => router.push("/dashboard")} style={{ background: "#0070f3" }}>
                        🔙 Cancel
                    </AnimatedButton>
                </div>
            </form>
        </div>
    );
}
