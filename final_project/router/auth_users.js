const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid

  let user = users.map((user) => user.username == username);

  return user.length > 0 ? true : false;

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {

  const username = req.query.username;
  const password = req.query.password;

  let user = users.map((user) => user.username === username && user.password === password);

  if (user.length > 0) {
    let accessToken = jwt.sign({
      data: [username, password]
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
    };
    req.session.authenticated = true;

    return res.status(200).json(JSON.stringify({ message: "User logged in successfully" }));
  }
  return res.status(403).json(JSON.stringify({ message: "Invalid credentials" }));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 
  console.log(token);
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
