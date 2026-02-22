import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Pin, MoveUpRight, Sparkles, Highlighter } from "lucide-react";

const COLORS = ["#3b82f6", "#ec4899", "#eab308"];

function Stats({ totalConfessions, totalReactions, confessions = [] }) {
    // Calculate reaction distribution
    const reactionData = [
        { name: "Likes", value: 0 },
        { name: "Love", value: 0 },
        { name: "Laughs", value: 0 },
    ];

    confessions.forEach(c => {
        reactionData[0].value += c.reactions?.like || 0;
        reactionData[1].value += c.reactions?.love || 0;
        reactionData[2].value += c.reactions?.laugh || 0;
    });

    const hasReactions = reactionData.some(d => d.value > 0);

    return (
        <div className="stats-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3rem", marginBottom: "4rem", paddingTop: "1rem" }}>

            {/* Widget 1: Total Confessions (Lined Sticky Note) */}
            <motion.div
                initial={{ rotate: -5, y: -20, opacity: 0 }}
                animate={{ rotate: -3, y: 0, opacity: 1 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{
                    background: "#fef3c7",
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 19px, #94a3b8 20px)",
                    backgroundSize: "100% 20px",
                    padding: "1.5rem",
                    width: "220px",
                    height: "220px",
                    boxShadow: "5px 10px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    marginTop: "1rem"
                }}
            >
                {/* Tape effect */}
                <div style={{
                    position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%) rotate(-2deg)",
                    width: "110px", height: "35px", background: "rgba(255,255,255,0.3)", backdropFilter: "blur(2px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.2)"
                }}></div>

                <h3 style={{ fontFamily: "Caveat", fontSize: "2rem", color: "#78350f", margin: 0, marginTop: "10px" }}>Total Secrets</h3>

                <div style={{ position: "relative" }}>
                    <span style={{ fontSize: "5rem", fontWeight: "bold", fontFamily: "Patrick Hand", color: "#b45309", lineHeight: 1 }}>
                        {totalConfessions}
                    </span>
                    {/* Circle Doodle */}
                    <svg style={{ position: "absolute", top: "-10px", left: "-15px", width: "120%", height: "120%", pointerEvents: "none" }} viewBox="0 0 100 100">
                        <path d="M10,50 Q25,25 50,10 T90,50 T50,90 T10,50" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" transform="rotate(-15 50 50)" opacity="0.6" />
                    </svg>
                </div>

                <span style={{ fontFamily: "Inter", fontSize: "0.8rem", color: "#92400e", opacity: 0.8, background: "#fef3c7", padding: "0 5px" }}>pinned on the wall</span>
            </motion.div>

            {/* Widget 2: Reaction Distribution (Detailed Coaster) */}
            <motion.div
                initial={{ rotate: 3, y: -20, opacity: 0 }}
                animate={{ rotate: 2, y: 0, opacity: 1 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                style={{
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "1rem",
                    width: "300px",
                    height: "300px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    border: "2px solid #e2e8f0"
                }}
            >

                <div style={{ position: "absolute", top: "0", right: "20px", transform: "translateY(-50%) rotate(15deg)" }}>
                    <Pin size={32} color="#ef4444" fill="#ef4444" style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.2))" }} />
                </div>

                <h3 style={{ fontFamily: "Caveat", fontSize: "1.8rem", color: "#334155", marginBottom: "0" }}>Emotional Mix</h3>

                {hasReactions ? (
                    <div style={{ width: "100%", height: "200px", position: "relative" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reactionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {reactionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", fontFamily: "Inter" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Custom Legend with Arrows */}
                        <div style={{ position: "absolute", bottom: "-10px", width: "100%", display: "flex", justifyContent: "space-between", padding: "0 20px", fontSize: "0.9rem", fontFamily: "Patrick Hand" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ color: COLORS[0], fontWeight: "bold" }}>Likes</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ color: COLORS[1], fontWeight: "bold" }}>Love</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <span style={{ color: COLORS[2], fontWeight: "bold" }}>Laughs</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "Caveat", fontSize: "1.4rem", textAlign: "center", padding: "1rem" }}>
                        <Highlighter size={24} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                        No reactions yet...
                        <span style={{ fontSize: "1rem" }}>be the first!</span>
                    </div>
                )
                }
            </motion.div >

            {/* Widget 3: Engagement (Glossy Polaroid) */}
            < motion.div
                initial={{ rotate: -2, y: -20, opacity: 0 }}
                animate={{ rotate: 1, y: 0, opacity: 1 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                style={{
                    background: "#fff",
                    padding: "12px 12px 40px 12px", // Classic polaroid ratio
                    width: "200px",
                    height: "fit-content",
                    boxShadow: "5px 5px 20px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: "rotate(1deg)",
                    position: "relative"
                }}
            >
                {/* Glossy Overlay */}
                < div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 100%)",
                    pointerEvents: "none", zIndex: 10
                }}></div >

                <div style={{
                    background: "#1e293b",
                    width: "100%",
                    height: "140px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    marginBottom: "1rem",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" // Depth for photo
                }}>
                    <Sparkles size={20} color="#fcd34d" style={{ marginBottom: "0.5rem", opacity: 0.8 }} />
                    <span style={{ fontSize: "3.5rem", fontWeight: "bold", fontFamily: "Space Grotesk", lineHeight: 1, textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
                        {totalReactions}
                    </span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.6, letterSpacing: "1px" }}>ENGAGEMENT</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "Caveat", fontSize: "1.8rem", color: "#334155" }}>Buzz Score</span>
                    <MoveUpRight size={18} color="#10b981" />
                </div>
            </motion.div >

        </div >
    );
}

export default Stats;
