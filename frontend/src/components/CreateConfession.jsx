import React, { useState } from "react";
import { Send, Lock, Calendar, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";

function CreateConfession({ onConfessionPosted, user }) {
    const [text, setText] = useState("");
    const [subject, setSubject] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [showScheduling, setShowScheduling] = useState(false);
    const [availableAt, setAvailableAt] = useState("");
    const [deleteAt, setDeleteAt] = useState("");

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
            await api.post("/confessions", {
                text,
                subject,
                secretCode,
                availableAt: availableAt || null,
                deleteAt: deleteAt || null
            });
            setText("");
            setSubject("");
            setSecretCode("");
            setAvailableAt("");
            setDeleteAt("");
            setShowScheduling(false);
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
                <input
                    placeholder="Subject (Optional)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                        marginBottom: "1rem",
                        padding: "0.8rem 1rem",
                        fontSize: "1.1rem",
                        fontFamily: "Patrick Hand",
                        fontWeight: "600",
                        border: "1px solid #cbd5e1"
                    }}
                />

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

                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
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

                    <button
                        type="button"
                        onClick={() => setShowScheduling(!showScheduling)}
                        style={{
                            background: showScheduling ? "#f1f5f9" : "transparent",
                            border: "1px solid #e2e8f0",
                            color: "#64748b",
                            padding: "0.5rem 1rem",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        {showScheduling ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        Schedule
                    </button>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: "1.2rem", padding: "0.8rem 1.5rem" }}>
                        {loading ? "Sticking..." : (
                            <>
                                <span>Stick It</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </div>

                {showScheduling && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        style={{
                            overflow: "hidden",
                            background: "#f8fafc",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px dashed #cbd5e1",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem"
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <Calendar size={14} /> Available At (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={availableAt}
                                onChange={(e) => setAvailableAt(e.target.value)}
                                style={{
                                    fontSize: "0.9rem",
                                    padding: "0.5rem",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "4px",
                                    fontFamily: "Inter"
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <Trash2 size={14} /> Auto-Delete At (Optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={deleteAt}
                                onChange={(e) => setDeleteAt(e.target.value)}
                                style={{
                                    fontSize: "0.9rem",
                                    padding: "0.5rem",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "4px",
                                    fontFamily: "Inter"
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}

export default CreateConfession;
