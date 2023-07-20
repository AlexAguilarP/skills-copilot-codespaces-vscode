// create web server with Express and Node.js
// https://www.youtube.com/watch?v=JlgKybraoy4

// import modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { check, validationResult } = require("express-validator");

// initialize express
const app = express();

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// set up global vars
const comments = [
  {
    name: "John Doe",
    comment: "This is comment #1",
  },
  {
    name: "Jane Doe",
    comment: "This is comment #2",
  },
  {
    name: "Jim Doe",
    comment: "This is comment #3",
  },
];

// set up routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Comments",
    comments: comments,
  });
});

app.post(
  "/comment/add",
  [
    check("name").isLength({ min: 1 }).trim().withMessage("Name is required."),
    check("comment")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Comment is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("index", {
        title: "Comments",
        comments: comments,
        errors: errors.array(),
      });
    } else {
      const comment = {
        name: req.body.name,
        comment: req.body.comment,
      };
      comments.push(comment);
      res.redirect("/");
    }
  }
);

// start web server
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
