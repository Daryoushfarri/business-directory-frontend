"use client";

import Navbar from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Business Directory</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f4f4f4" }}>
                <Navbar /> {/* ✅ Navbar only appears once */}
                <main style={{ padding: "20px" }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
