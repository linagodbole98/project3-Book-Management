const express = require("express");
const router = express.Router();

const UserAPIs = require("../controller/UserAPIs");
const BookAPIs = require("../controller/BookAPIs");
const ReviewAPIs = require("../controller/ReviewAPIs");
const middleware = require("../middle/midfile");

// User API's
router.post("/register", UserAPIs.createUser);
router.post("/write-file-aws", async function(req, res){

  try{
      let files= req.files
      if(files && files.length>0){
          //upload to s3 and get the uploaded link
          // res.send the link back to frontend/postman
          let uploadedFileURL= await uploadFile( files[0] )
          res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
      }
      else{
          res.status(400).send({ msg: "No file found" })
      }
      
  }
  catch(err){
      res.status(500).send({msg: err})
  }
  
})
router.post("/login", UserAPIs.loginUser);

// Book API's
router.post("/books", middleware.authentication, BookAPIs.createBook);
router.get("/books", middleware.authentication, BookAPIs.getBooksByQuery);
router.get("/books/:bookId", middleware.authentication, BookAPIs.getBooksById);

router.put(
  "/books/:bookId",
  middleware.authentication,
  middleware.authorization,
  BookAPIs.updateBooks
);
router.delete(
  "/books/:bookId",
  middleware.authentication,
  middleware.authorization,
  BookAPIs.deleteBook
);

// Review API's
router.post("/books/:bookId/review", ReviewAPIs.createReview);
router.put("/books/:bookId/review/:reviewId", ReviewAPIs.updateRview);
router.delete("/books/:bookId/review/:reviewId", ReviewAPIs.deleteRview);

//router.put("/books/bookId/",ReviewAPIs.)
//router.delete("/books/bookId/review",ReviewAPIs)
module.exports = router;
