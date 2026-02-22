import express from "express";
import Confession from "../models/Confession.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/", ensureAuth, async (req, res) => {
  const { text, subject, secretCode, availableAt, deleteAt } = req.body;

  if (secretCode.length < 4)
    return res.status(400).json({ message: "Secret code too short" });

  const newConfession = await Confession.create({
    text,
    subject: subject || "",
    secretCode,
    userId: req.user.id,
    availableAt: availableAt || null,
    deleteAt: deleteAt || null
  });

  res.json(newConfession);
});



router.get("/", async (req, res) => {
  const now = new Date();

  // Cleanup: Delete expired confessions
  await Confession.deleteMany({ deleteAt: { $ne: null, $lt: now } });

  // Fetch only available confessions
  const confessions = await Confession.find({
    $or: [
      { availableAt: null },
      { availableAt: { $lte: now } }
    ]
  }).sort({ createdAt: -1 });

  res.json(confessions);
});



router.put("/:id", ensureAuth, async (req, res) => {
  const { text, subject, secretCode } = req.body;

  const confession = await Confession.findById(req.params.id);

  if (!confession || confession.secretCode !== secretCode)
    return res.status(400).json({ message: "Wrong secret code" });

  confession.text = text;
  if (subject !== undefined) confession.subject = subject;
  await confession.save();

  res.json(confession);
});



router.delete("/:id", ensureAuth, async (req, res) => {
  const { secretCode } = req.body;

  const confession = await Confession.findById(req.params.id);

  if (!confession || confession.secretCode !== secretCode)
    return res.status(400).json({ message: "Wrong secret code" });

  await confession.deleteOne();
  res.json({ message: "Deleted" });
});



router.post("/:id/react", async (req, res) => {
  const { type, action } = req.body;

  const confession = await Confession.findById(req.params.id);

  if (action === "remove") {
    confession.reactions[type] = Math.max(0, confession.reactions[type] - 1);
  } else {
    confession.reactions[type]++;
  }

  await confession.save();

  res.json(confession);
});

export default router;
