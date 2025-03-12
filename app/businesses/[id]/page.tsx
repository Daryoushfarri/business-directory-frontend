"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Correct Imports
import AnimatedButton from "../../components/AnimatedButton"; 
import ConfirmDelete from "../../components/ConfirmDelete"; 

type Business = {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
    owner_id: number;
};

export default function BusinessDetails() {
    const params = useParams(); // ✅ Get params from Next.js
    const businessId = params?.id as string; // ✅ Ensure `id` is a string
    const [business, setBusiness] = useState<Business | null>(null);
    const [error, setError] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const router = useRouter();

    // ✅ Get User ID & Token from Local Storage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const userId = storedUserId ? parseInt(storedUserId, 10) : null;

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
            })
            .catch(() => setError("Failed to load business details."));
    }, [businessId]); // ✅ Correct dependency

    const handleEdit = () => {
        router.push(`/edit-business/${businessId}`);
    };

    const handleDelete = async () => {
        if (!token) {
            setError("Unauthorized. Please log in.");
            return;
        }

        const response = await fetch(`http://localhost:5000/businesses/${businessId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            router.push("/businesses");
        } else {
            setError("Failed to delete business.");
        }
    };

    if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
    if (!business) return <p style={{ textAlign: "center" }}>Loading business details...</p>;

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
            <h1 style={{ fontSize: "24px", color: "#333" }}>{business.name}</h1>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}><strong>Category:</strong> {business.category}</p>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}><strong>Location:</strong> {business.location}</p>
            <p style={{ color: "#555", fontSize: "15px", marginBottom: "15px" }}>{business.description}</p>

            {business.image_url && (
                <img 
                    src={business.image_url} 
                    alt={business.name} 
                    width="100%" 
                    style={{ borderRadius: "5px", marginBottom: "15px", maxHeight: "250px", objectFit: "cover" }} 
                />
            )}

            {/* Buttons */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                <AnimatedButton onClick={() => router.push("/businesses")} style={{ background: "#0070f3" }}>
                    🔙 Return to Listings
                </AnimatedButton>

                {/* ✅ Show Edit & Delete buttons only for the owner */}
                {userId && business.owner_id === userId && (
                    <>
                        <AnimatedButton onClick={handleEdit} style={{ background: "#f0ad4e" }}>
                            ✏️ Edit Business
                        </AnimatedButton>

                        {/* ✅ Show confirmation when deleting */}
                        {showConfirmDelete ? (
                            <ConfirmDelete onConfirm={handleDelete} onCancel={() => setShowConfirmDelete(false)} />
                        ) : (
                            <AnimatedButton onClick={() => setShowConfirmDelete(true)} style={{ background: "#d9534f" }}>
                                ❌ Delete Business
                            </AnimatedButton>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
