"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBusiness({ params }: { params: { id: string } }) {
    const [business, setBusiness] = useState({
        name: "",
        description: "",
        category: "",
        location: "",
        image_url: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const businessId = params.id;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Unauthorized. Please log in.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/businesses/${businessId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched business:", data);
                if (data.error) {
                    setError(data.error);
                } else {
                    setBusiness({
                        name: data.name || "",
                        description: data.description || "",
                        category: data.category || "",
                        location: data.location || "",
                        image_url: data.image_url || ""
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load business details.");
                setLoading(false);
            });
    }, [businessId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBusiness({ ...business, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

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
            body: JSON.stringify({
                name: business.name,
                description: business.description,
                category: business.category,
                location: business.location,
                image_url: business.image_url
            })
        });

        if (response.ok) {
            alert("Business updated successfully!");
            router.push("/dashboard"); // Redirect to dashboard
        } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to update business.");
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1 style={{ marginBottom: "10px" }}>Edit Business</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {loading ? (
                <p>Loading business details...</p>
            ) : (
                <form onSubmit={handleSubmit} style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    gap: "15px", 
                    width: "100%", 
                    maxWidth: "400px", 
                    margin: "0 auto", 
                    padding: "20px", 
                    border: "1px solid #ddd", 
                    borderRadius: "10px", 
                    background: "#f9f9f9" 
                }}>
                    <label style={{ textAlign: "left", width: "100%" }}>
                        <strong>Business Name:</strong>
                        <input 
                            type="text" 
                            name="name" 
                            value={business.name} 
                            onChange={handleChange} 
                            placeholder="Business Name" 
                            required 
                            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} 
                        />
                    </label>

                    <label style={{ textAlign: "left", width: "100%" }}>
                        <strong>Description:</strong>
                        <textarea 
                            name="description" 
                            value={business.description} 
                            onChange={handleChange} 
                            placeholder="Description" 
                            required 
                            style={{ padding: "10px", width: "100%", marginTop: "5px", height: "80px", borderRadius: "5px", border: "1px solid #ccc" }} 
                        />
                    </label>

                    <label style={{ textAlign: "left", width: "100%" }}>
                        <strong>Category:</strong>
                        <input 
                            type="text" 
                            name="category" 
                            value={business.category} 
                            onChange={handleChange} 
                            placeholder="Category" 
                            required 
                            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} 
                        />
                    </label>

                    <label style={{ textAlign: "left", width: "100%" }}>
                        <strong>Location:</strong>
                        <input 
                            type="text" 
                            name="location" 
                            value={business.location} 
                            onChange={handleChange} 
                            placeholder="Location" 
                            required 
                            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} 
                        />
                    </label>

                    <label style={{ textAlign: "left", width: "100%" }}>
                        <strong>Image URL:</strong>
                        <input 
                            type="text" 
                            name="image_url" 
                            value={business.image_url} 
                            onChange={handleChange} 
                            placeholder="Image URL" 
                            required 
                            style={{ padding: "10px", width: "100%", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} 
                        />
                    </label>

                    {business.image_url && (
                        <img 
                            src={business.image_url} 
                            alt="Business" 
                            width="200" 
                            style={{ borderRadius: "5px", border: "1px solid #ddd", padding: "5px" }} 
                        />
                    )}

                    <button 
                        type="submit" 
                        style={{ 
                            padding: "10px", 
                            cursor: "pointer", 
                            background: "#0070f3", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px",
                            width: "100%",
                            fontSize: "16px"
                        }}>
                        Update Business
                    </button>
                </form>
            )}
        </div>
    );
}
