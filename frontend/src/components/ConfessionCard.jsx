import React, { useState, useEffect } from "react";
import api from "../api";
import Modal from "./Modal";
import { ThumbsUp, Heart, Smile, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

function ConfessionCard({ confession, refresh, isTrending }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [newText, setNewText] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [showActions, setShowActions] = useState(false);

  // Random visuals state
  const [rotation, setRotation] = useState(0);
  const [bgColor, setBgColor] = useState("#fff");

  // Reaction limiting (Array of active reaction types)
  const [activeReactions, setActiveReactions] = useState([]);

  useEffect(() => {
    // Generate random rotation between -3 and 3 degrees
    setRotation(Math.random() * 6 - 3);

    // Pick a random paper color
    const colors = ["#fef3c7", "#fce7f3", "#dbeafe", "#dcfce7", "#fff7ed"];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);

    // Check localStorage for this confession's reactions
    const allReacted = JSON.parse(localStorage.getItem("reacted_confessions") || "{}");
    const storedReactions = allReacted[confession._id];

    if (Array.isArray(storedReactions)) {
      setActiveReactions(storedReactions);
    } else if (typeof storedReactions === 'string') {
      // Legacy support: convert single string to array
      setActiveReactions([storedReactions]);
    }
  }, [confession._id]);

  const reactionEmojis = {
    like: { icon: ThumbsUp, color: "text-blue-600", hex: "#2563eb" },
    love: { icon: Heart, color: "text-pink-600", hex: "#db2777" },
    laugh: { icon: Smile, color: "text-yellow-600", hex: "#ca8a04" }
  };

  const react = async (type, e) => {
    const isActive = activeReactions.includes(type);
    const action = isActive ? 'remove' : 'add';

    // Optimistic UI update
    let newActiveReactions;
    if (isActive) {
      newActiveReactions = activeReactions.filter(r => r !== type);
    } else {
      newActiveReactions = [...activeReactions, type];
      // Only trigger confetti on ADD
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        origin: { x, y },
        particleCount: 30,
        spread: 50,
        colors: [reactionEmojis[type].hex, "#ffffff"],
        zIndex: 2000,
        disableForReducedMotion: true,
        shapes: ['circle']
      });
    }
    setActiveReactions(newActiveReactions);

    try {
      await api.post(`/confessions/${confession._id}/react`, { type, action });

      // Update LocalStorage
      const allReacted = JSON.parse(localStorage.getItem("reacted_confessions") || "{}");
      allReacted[confession._id] = newActiveReactions;
      localStorage.setItem("reacted_confessions", JSON.stringify(allReacted));

      refresh();
    } catch (err) {
      console.error("Failed to react", err);
      // Revert state if needed, but for now just log
    }
  };

  const openDeleteModal = () => {
    setModalAction("delete");
    setSecretCode("");
    setIsModalOpen(true);
    setShowActions(false);
  };

  const openEditModal = () => {
    setModalAction("edit");
    setSecretCode("");
    setNewText(confession.text);
    setNewSubject(confession.subject || "");
    setIsModalOpen(true);
    setShowActions(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSecretCode("");
    setNewText("");
    setNewSubject("");
  };

  const handleSubmit = async () => {
    if (secretCode.length < 4) {
      alert("Secret code must be at least 4 characters.");
      return;
    }

    try {
      if (modalAction === "delete") {
        await api.delete(`/confessions/${confession._id}`, {
          data: { secretCode }
        });
      } else if (modalAction === "edit") {
        await api.put(`/confessions/${confession._id}`, {
          text: newText,
          subject: newSubject,
          secretCode
        });
      }
      refresh();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed. Check secret code.");
    }
  };

  return (
    <>
      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: rotation }}
        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }} // Straighten on hover
        style={{
          backgroundColor: bgColor,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          {isTrending && <div className="trending-badge">TOP SECRET</div>}
          <div style={{ flex: 1 }}></div>

          <div style={{ position: "relative" }}>
            <button
              className="btn-icon"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    zIndex: 20,
                    minWidth: "140px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                  }}
                >
                  <button
                    onClick={openEditModal}
                    className="btn-icon"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "0.8rem", fontSize: "1rem", color: "#334155" }}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={openDeleteModal}
                    className="btn-icon"
                    style={{ width: "100%", justifyContent: "flex-start", gap: "0.8rem", fontSize: "1rem", color: "#ef4444" }}
                  >
                    <Trash2 size={16} /> Burn
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {confession.subject && (
          <h4 style={{
            fontSize: "1.2rem",
            marginBottom: "0.5rem",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            paddingBottom: "0.2rem",
            color: "#1e293b"
          }}>
            {confession.subject}
          </h4>
        )}
        <p className="confession-text">{confession.text}</p>

        <div className="card-actions">
          <div className="reactions" style={{ display: "flex", gap: "0.5rem" }}>
            {Object.keys(reactionEmojis).map((type) => {
              const Icon = reactionEmojis[type].icon;
              const count = confession.reactions[type] || 0;
              const isActive = activeReactions.includes(type);

              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="reaction-btn"
                  onClick={(e) => react(type, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    color: isActive ? reactionEmojis[type].hex : "",
                    fontWeight: isActive ? 700 : 400,
                    backgroundColor: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                    border: isActive ? `1px solid ${reactionEmojis[type].hex}` : "1px solid transparent"
                  }}
                >
                  <Icon size={18} fill={isActive ? reactionEmojis[type].hex : "none"} strokeWidth={2} />
                  <span>{count > 0 ? count : ""}</span>
                </motion.button>
              );
            })}
          </div>

          <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: 'Inter, sans-serif' }}>
            {new Date(confession.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalAction === "edit" ? "Rewrite Note" : "Burn Note"}
      >
        {modalAction === "edit" && (
          <>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject (Optional)"
              style={{ marginBottom: "1rem", fontFamily: "Patrick Hand", fontWeight: "600" }}
            />
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Edit your confession..."
              rows="5"
              style={{ marginBottom: "1rem", background: "#fefce8", border: "none", boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)" }}
            />
          </>
        )}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Enter Secret Code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            style={{ width: "100%", marginBottom: 0 }}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} style={{ width: "100%", fontSize: "1.2rem" }}>
          {modalAction === "edit" ? "Update Note" : "Burn it"}
        </button>
      </Modal>
    </>
  );
}

export default ConfessionCard;
