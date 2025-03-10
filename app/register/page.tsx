"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        setMessage(""); // Clear previous messages

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful! Redirecting...");
                setTimeout(() => router.push("/login"), 2000); // Redirect after success
            } else {
                setMessage(data.error || "Registration failed.");
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ padding: "20px", textAlign: "center" }}>
                <h1>Register</h1>
                <form onSubmit={handleRegister} style={{ display: "inline-block", textAlign: "left" }}>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <br />
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <br />
                    <button type="submit" style={{ padding: "10px", marginTop: "10px", cursor: "pointer", background: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}>
                        Register
                    </button>
                </form>
                {message && <p>{message}</p>}
            </main>
        </div>
    );
}
