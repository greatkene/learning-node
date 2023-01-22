const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

// express app
const app = express();

// Connect to mongoDB
const dbURI =
  "mongodb+srv://nwabugo:zAUOrcLC1rcnA8WQ@blog.j36o2pw.mongodb.net/learning-node?retryWrites=true&w=majority";

// the extra argument to stop depreciation warning
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(4000))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// Middleware & Static files (styles and images)
app.use(express.static("public"));

// For accepting form data
app.use(express.urlencoded({ extended: true }));

// Third-party middleware
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("new request made in next middleware");
  next();
});

// routing with Express / rendering a view
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// blog routes

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All blogs", blogs: result });
    })
    .catch((err) => console.log(err));
});

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => console.log(err));
});

// Route parameters
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id).then((result) => {
    res.render("details", { blog: result, title: "Blog Details" });
  });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

// 404
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
