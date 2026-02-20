import React, { useEffect, useState } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import CreateConfession from "./components/CreateConfession";
import ConfessionCard from "./components/ConfessionCard";
import Stats from "./components/Stats";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

function App() {
  const [confessions, setConfessions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfessions = async () => {
    try {
      const res = await api.get("/confessions");
      setConfessions(res.data);
    } catch (err) {
      console.error("Failed to fetch confessions", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
    fetchUser();
  }, []);

  const totalConfessions = confessions.length;
  const totalReactions = confessions.reduce((acc, curr) => {
    return acc + (curr.reactions?.like || 0) + (curr.reactions?.love || 0) + (curr.reactions?.laugh || 0);
  }, 0);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="container">
      <Navbar user={user} />

      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1>The Wall of Secrets</h1>
        <p className="subtitle">"Man is least himself when he talks in his own person. Give him a mask, and he will tell you the truth."</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Stats
          totalConfessions={totalConfessions}
          totalReactions={totalReactions}
          confessions={confessions}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, rotate: -1 }}
        animate={{ opacity: 1, rotate: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CreateConfession onConfessionPosted={fetchConfessions} user={user} />
      </motion.div>

      <div className="confessions-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem", borderBottom: "2px solid #cbd5e1", paddingBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "2rem", fontWeight: "700" }}>
            Pinned Notes
          </h3>
          <div style={{ fontSize: "1.2rem", fontFamily: "Caveat", color: "#64748b" }}>
            {confessions.length} scraps of paper
          </div>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {confessions.map((c) => {
            const totalReactions = (c.reactions?.like || 0) + (c.reactions?.love || 0) + (c.reactions?.laugh || 0);
            const isTrending = totalReactions > 0 && totalReactions === Math.max(...confessions.map(conf =>
              (conf.reactions?.like || 0) + (conf.reactions?.love || 0) + (conf.reactions?.laugh || 0)
            ));

            return (
              <ConfessionCard
                key={c._id}
                confession={c}
                refresh={fetchConfessions}
                isTrending={isTrending}
              />
            );
          })}
        </Masonry>

        {confessions.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "6rem", color: "#94a3b8", fontFamily: "Caveat", fontSize: "2rem" }}>
            <p>The wall is empty. Pin something up?</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
