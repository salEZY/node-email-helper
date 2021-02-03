require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const { sendEmail } = require("./mail");

const port = 8080;
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to MailerApp");
});

app.post(
  "/",
  [
    check("sender").normalizeEmail().isEmail(),
    check("target").normalizeEmail().isEmail(),
    check("note").not().isEmpty(),
    check("senderName").not().isEmpty(),
    check("app").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res
        .status(422)
        .json({ message: "Invalid inputs passed, please check your data" });
    }

    const { sender, target, note, senderName, app } = req.body;
    try {
      await sendEmail(sender, target, "message", note, senderName, app);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
    res.json({ 0: "Poruka je poslata!", 1: "Message was sent!" });
  }
);

app.listen(port, () => {
  console.log(`MailerApp server started at port ${port}`);
});
