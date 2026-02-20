import React, { useState } from "react";
import { Send, Lock } from "lucide-react";
import api from "../api";

function CreateConfession({ onConfessionPosted, user }) {
    const [text, setText] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login to stick a note!");
            return;
        }

        if (!text || secretCode.length < 4) {
            alert("Please enter a note and a secret code (min 4 chars).");
            return;
        }

        setLoading(true);
        try {
            await api.post("/confessions", { text, secretCode });
            setText("");
            setSecretCode("");
            onConfessionPosted();
        } catch (err) {
            alert("Failed to stick the note.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-form-container">
            <div className="create-form-header">
                <h3>Write a Note</h3>
                <p style={{ fontFamily: 'Inter', color: '#64748b' }}>Pin a secret to the wall. Nobody will know it's you.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Dear Wall..."
                    rows="4"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    style={{
                        background: "#fff",
                        backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px)",
                        backgroundSize: "100% 2rem",
                        lineHeight: "2rem",
                        padding: "0 1rem",
                        border: "1px solid #cbd5e1"
                    }}
                />

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <Lock className="input-icon" size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input
                            placeholder="Secret Code (4+ chars)"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            type="password"
                            style={{ paddingLeft: "2.5rem", marginBottom: 0, fontSize: "1rem", fontFamily: "Inter" }}
                            required
                            minLength={4}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem" }}>
                        {loading ? "Sticking..." : (
                            <>
                                <span>Stick It</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateConfession;
