const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (typeof username !== "string" || username.trim() === "") {
    return false;
  }
  return users.some((user) => username === user.username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => username === user.username && password === user.password,
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };
  return res
    .status(200)
    .json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.body.review || req.query.review; // Allow review to be sent in body or query

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res
    .status(200)
    .json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews,
    });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
