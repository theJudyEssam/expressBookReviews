const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

  if(username && password){
      if(!isValid(username)){
        users.push({
          "username":username, "password":password
        })
        return res.status(200).json({message: "User successfully registered. Now you can login"});

      }
      else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "No credentials provided"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const data = axios.get("./booksdb.js")
console.log(data)
  res.send(JSON.stringify(books,null,4))
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  const data = axios.get("./booksdb.js")
  retrieved_book = data[isbn]

  res.send(retrieved_book)
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const data = axios.get("./booksdb.js")
  let book = []
  for(let i = 1;i < 11;i++){
   if(data[i].author === author){book.push(data[i])}
  }

  res.send(book)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const data = axios.get("./booksdb.js")

  let retrievied_title = []
  for(let i = 1;i < 11;i++){
    if(data[i].title === title){retrievied_title.push(data[i])}
   }
  res.send(retrievied_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  retrieved_book = books[isbn].review

  res.send(retrieved_book)
  
});

module.exports.general = public_users;
