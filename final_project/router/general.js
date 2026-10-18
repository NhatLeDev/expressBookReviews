const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  let result = isValid(req.body.username);
  if (result) {
    return res.status(400).json({ message: "Username already exists" });
  }
  // Add the new user to the users array
  users.push({ username: req.body.username, password: req.body.password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).send(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const result = Object.keys(books)
    .filter((isbn) => books[isbn].author === req.params.author)
    .map((isbn) => ({ isbn, ...books[isbn] }));
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const result = Object.keys(books)
    .filter((isbn) => books[isbn].title === req.params.title)
    .map((isbn) => ({ isbn, ...books[isbn] }));
  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the given title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});
// Task 10: Get all books – using async/await with Axios
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");

    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching book list", error: error.message });
  }
});
// Task 11: Get book details based on ISBN – using async/await with Axios
public_users.get("/async/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    return res
      .status(status)
      .json(error.response?.data || { message: error.message });
  }
});
// Task 12: Get book details based on author – using async/await with Axios
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    return res
      .status(status)
      .json(error.response?.data || { message: error.message });
  }
});
// Task 13: Get book details based on title – using async/await with Axios
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    return res
      .status(status)
      .json(error.response?.data || { message: error.message });
  }
});
module.exports.general = public_users;
