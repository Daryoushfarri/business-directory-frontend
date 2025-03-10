"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful! Redirecting...");
                localStorage.setItem("token", data.token); // Store token
                setTimeout(() => router.push("/"), 2000); // Redirect to home
            } else {
                setMessage(data.error || "Login failed.");
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ padding: "20px", textAlign: "center" }}>
                <h1>Login</h1>
                <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <br />
                    <button type="submit" style={{ padding: "10px", marginTop: "10px", cursor: "pointer", background: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}>
                        Login
                    </button>
                </form>
                {message && <p>{message}</p>}
            </main>
        </div>
    );
}
