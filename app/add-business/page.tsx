"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBusiness() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const token = localStorage.getItem("token"); // Get user token
        if (!token) {
            setError("You must be logged in to add a business.");
            return;
        }

        const response = await fetch("http://localhost:5000/businesses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                category,
                location,
                image_url: imageUrl
            })
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Failed to add business.");
        } else {
            setSuccess("Business added successfully! Redirecting...");
            setTimeout(() => router.push("/businesses"), 2000); // Redirect to businesses page
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Add a New Business</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "400px", margin: "auto" }}>
                <input type="text" placeholder="Business Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: "10px", margin: "5px" }} />
                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: "10px", margin: "5px" }} />
                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ padding: "10px", margin: "5px" }} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: "10px", margin: "5px" }} />
                <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: "10px", margin: "5px" }} />
                <button type="submit" style={{ padding: "10px", margin: "10px", cursor: "pointer", background: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}>Add Business</button>
            </form>
        </div>
    );
}
