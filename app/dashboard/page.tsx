"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function MyDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);

    const fetchUserBusinesses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/my-businesses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsLoggedIn(false);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBusinesses(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBusinesses();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    const response = await fetch(`http://localhost:5000/businesses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setBusinesses(businesses.filter((b) => b.id !== id));
    } else {
      setError("Failed to delete business.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!isLoggedIn) return <p>You must be logged in to view your dashboard.</p>;
  if (!businesses || businesses.length === 0) return <p>You have no businesses listed.</p>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 My Businesses</h2>

      <button
        onClick={() => router.push("/add-business")}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        ➕ Add a New Business
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
          padding: "20px",
        }}
      >
        {businesses.map((business) => (
          <div
            key={business.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              background: "#fff",
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {business.image_url && (
              <img
                src={business.image_url}
                alt={business.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            )}

            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>{business.name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              <strong>📍 {business.location}</strong>
            </p>
            <p style={{ fontSize: "12px", color: "#777" }}>{business.description}</p>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => router.push(`/edit-business/${business.id}`)}
                style={{
                  background: "#f0ad4e",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  flex: 1,
                  marginRight: "5px",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(business.id)}
                style={{
                  background: "#d9534f",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  flex: 1,
                }}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDashboard;
