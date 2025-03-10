const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  let username = req.query.username;
  let password = req.query.password;

  if(!username || !password){
    return res.status(400).json(JSON.stringify({message: "Username or password missing"})); 
  }

  if(isValid(username)){
    return res.status(400).json(JSON.stringify({message: "Username already exists"}));
  }

  users.push({username: username, password: password});

  return res.status(200).json(JSON.stringify({message: "User registered successfully"}));
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

  try {

    const booksList = await getBooks();
    return res.status(200).json(JSON.stringify(booksList));

  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
    
  }

});

async function getBooks() {
  return new Promise((resolve) => {
      setTimeout(() => resolve(books), 1000); // Simule un délai (ex. appel DB)
  });
}

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
      const isbn = req.params.isbn;
      const book = await getBookByISBN(isbn);

      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json(book);
  } catch (error) {
      return res.status(500).json({ message: "Error retrieving book" });
  }
});

// Fonction asynchrone pour récupérer un livre par ISBN
async function getBookByISBN(isbn) {
  return new Promise((resolve) => {
      setTimeout(() => {
          const book = Object.values(books).find(book => book.isbn === isbn);
          resolve(book || null);
      }, 500); // Simule un appel distant
  });
}

public_users.get('/author/:author', async function (req, res) {
  try {
      const author = req.params.author;
      const booksByAuthor = await getBooksByAuthor(author);

      if (booksByAuthor.length === 0) {
          return res.status(404).json({ message: "No books found for this author" });
      }

      return res.status(200).json(booksByAuthor);
  } catch (error) {
      return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Fonction asynchrone pour récupérer les livres d'un auteur
async function getBooksByAuthor(author) {
  return new Promise((resolve) => {
      setTimeout(() => {
          const booksByAuthor = Object.values(books).filter(book => book.author === author);
          resolve(booksByAuthor);
      }, 500);
  });
}

public_users.get('/title/:title', async function (req, res) {
  try {
      const title = req.params.title;
      const booksByTitle = await getBooksByTitle(title);

      if (booksByTitle.length === 0) {
          return res.status(404).json({ message: "No books found with this title" });
      }

      return res.status(200).json(booksByTitle);
  } catch (error) {
      return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Fonction asynchrone pour récupérer les livres par titre
async function getBooksByTitle(title) {
  return new Promise((resolve) => {
      setTimeout(() => {
          const booksByTitle = Object.values(books).filter(book => book.title === title);
          resolve(booksByTitle);
      }, 500);
  });
}


//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  let isbn = req.params.isbn;
  
  let book = Object.values(books).filter(book => book.isbn === isbn).map(book => book.reviews);
  
  if(!book){
    return res.status(404).json({message: "Book not found"});
  }

  return res.status(200).json(JSON.stringify(book));


});

module.exports.general = public_users;
