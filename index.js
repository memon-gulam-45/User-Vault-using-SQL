const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const userRoutes = require("./routes/users");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", userRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
