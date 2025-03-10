"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedButton from "../components/AnimatedButton";
import ConfirmDelete from "../components/ConfirmDelete";

type Business = {
    id: number;
    name: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
};

export default function Dashboard() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [error, setError] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("You must be logged in to view your dashboard.");
            return;
        }

        fetch("http://localhost:5000/my-businesses", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setBusinesses(data);
                }
            })
            .catch(() => setError("Failed to load businesses."));
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/edit-business/${id}`);
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized. Please log in.");
            return;
        }

        const response = await fetch(`http://localhost:5000/businesses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            setBusinesses(businesses.filter(b => b.id !== id));
            setShowConfirmDelete(null);
        } else {
            setError("Failed to delete business.");
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>📊 My Dashboard</h1>
            <p>Manage your businesses here.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <AnimatedButton onClick={() => router.push("/add-business")} style={{ background: "#0070f3" }}>
                ➕ Add a New Business
            </AnimatedButton>

            {businesses.length > 0 ? (
                businesses.map((business) => (
                    <div key={business.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "5px" }}>
                        <h2>{business.name}</h2>
                        <p><strong>Category:</strong> {business.category}</p>
                        <p><strong>Location:</strong> {business.location}</p>
                        <p>{business.description}</p>
                        {business.image_url && <img src={business.image_url} alt={business.name} width="200" />}

                        <br />
                        <AnimatedButton onClick={() => handleEdit(business.id)} style={{ background: "#f0ad4e" }}>
                            ✏️ Edit
                        </AnimatedButton>

                        {/* ✅ Show delete confirmation directly instead of another button */}
                        {showConfirmDelete === business.id ? (
                            <ConfirmDelete onConfirm={() => handleDelete(business.id)} onCancel={() => setShowConfirmDelete(null)} />
                        ) : (
                            <AnimatedButton onClick={() => setShowConfirmDelete(business.id)} style={{ background: "#d9534f" }}>
                                ❌ Delete
                            </AnimatedButton>
                        )}
                    </div>
                ))
            ) : (
                <p>No businesses found.</p>
            )}
        </div>
    );
}
