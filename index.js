require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const { sendEmail } = require("./mail");

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Node Emailer Helper API");
});

app.post(
  "/",
  [
    check("sender").normalizeEmail().isEmail(),
    check("note").not().isEmpty(),
    check("name").not().isEmpty(),
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

    const { sender, note, name, app } = req.body;
    try {
      await sendEmail(
        sender,
        "lawofficemilic@gmail.com",
        "message",
        note,
        name,
        app
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err });
    }
    res.json({ sr: "Poruka je poslata!", en: "Message was sent!" });
  }
);

app.listen(port, () => {
  console.log(`MailerApp server started at port ${port}`);
});
