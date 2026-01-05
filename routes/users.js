const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const connection = require("../db");

const router = express.Router();

/* HOME */
router.get("/", (req, res) => {
  connection.query("SELECT COUNT(*) AS count FROM user", (err, result) => {
    if (err) return res.send("DB Error");
    res.render("home", { count: result[0].count });
  });
});

/* SHOW USERS */
router.get("/user", (req, res) => {
  connection.query("SELECT * FROM user", (err, users) => {
    if (err) return res.send("DB Error");
    res.render("showusers", { users });
  });
});

/* ADD USER FORM */
router.get("/user/add", (req, res) => {
  res.render("add");
});

/* ADD USER */
router.post("/user/add", async (req, res) => {
  const { username, email, password } = req.body;
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)",
    [id, username, email, hashedPassword],
    (err) => {
      if (err) return res.send("Insert Failed");
      res.redirect("/user");
    }
  );
});

/* EDIT FORM */
router.get("/user/:id/edit", (req, res) => {
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.send("DB Error");
      res.render("edit", { user: result[0] });
    }
  );
});

/* UPDATE USERNAME */
router.patch("/user/:id", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id],
    async (err, result) => {
      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.send("Wrong password");

      connection.query(
        "UPDATE user SET username = ? WHERE id = ?",
        [username, req.params.id],
        () => res.redirect("/user")
      );
    }
  );
});

/* DELETE USER */
router.delete("/user/:id", (req, res) => {
  const { password } = req.body;

  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [req.params.id],
    async (err, result) => {
      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.send("Wrong password");

      connection.query(
        "DELETE FROM user WHERE id = ?",
        [req.params.id],
        () => res.redirect("/user")
      );
    }
  );
});

module.exports = router;
