const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { json } = require('body-parser');
const regd_users = express.Router();

let users = [
  {"username":"j", "password":"12345"}
];

const isValid = (username)=>{ //returns boolean
  console.log(users)
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
     // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
 
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error Logging In"});
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data:password
    }, 'access', {expiresIn:600*600})

    req.session.authorization = {
      accessToken, username
    }
    return res.sendStatus(200).json({message:"User successfully logged in"})
}
  return res.status(208).json({message: "Invalid"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  console.log(req.session.username)
  // const review = {"review": req.body.review, "username":req.session.authorization["username"]}
  const new_review = {
    [req.session.authorization["username"]]: {
      "review": req.body.review
    }
  };
  
  const book =books[isbn]
  book["review"] = new_review
  
  res.send(review)
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).send("Book not found");
  }
  
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; // Remove the review
    res.send(books[isbn]);
  } else {
    res.status(404).send("Review not found for user");
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
