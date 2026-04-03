import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  });
});

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

export default router;
