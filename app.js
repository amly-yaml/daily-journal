const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

const homeStartingContent =
  "I would even argue that writing is the best form of meditation. It clears your mind of all unnecessary thoughts, but does not let it rest. You focus not on your breathing, you focus not on one word, or idea, or feeling. When you write, there is a whole new world created in your head, and you bring all of your attention to develop it.";
const aboutContent =
  "Just write the story. Anything you like. Create it in your imagination, replay it in your mind and gift it to the paper. It doesn’t need to be a complete story, or a part of something big. It is not intended to make you famous. Its main purpose (besides making you write) is to hone your creativity, thus making your mind sharper.Write about a person you met today. If no one comes to mind, write about any interesting person you’ve met recently. Attention to details is important, but being naturally attentive to other people will serve you very well. Keeping your daily journal in this style will help you to gain this superpower.";
const contactContent =
  "This contact page will help the users to find the page information and to be contacted the business address.";

const app = express();
// const posts = [];
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/blogDB");
mongoose.connect(
  "mongodb+srv://angret-admin:test123@cluster0.cg5cp.mongodb.net/blogDB"
);

const blogSchema = {
  title: String,
  content: String,
};

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  Blog.find({}, function (err, posts) {
    if (!err) {
      res.render("home", {
        putContent: homeStartingContent,
        composePost: posts,
      });
    }
  });
  // res.render("home", {putContent: homeStartingContent, composePost: posts});
});

app.get("/about", function (req, res) {
  res.render("about", { putContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { putContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/post", function (req, res) {
  res.render("post");
});

app.get("/posts/:postid", function (req, res) {
  // console.log(req.params.postid);
  // req.params.postid, this one get from the :postid
  const postId = req.params.postid;
  Blog.findOne({ _id: postId }, function (err, findPost) {
    if (!err) {
      res.render("post", {
        getTitle: findPost.title,
        getPost: findPost.content,
      });
    }
  });
  // posts.forEach(function(post){
  //   if(lodash.lowerCase(req.params.postid) === lodash.lowerCase(post.textTitle)){
  //     res.render("post", {
  //       getTitle: post.textTitle,
  //       getPost: post.postBody
  //     });
  //   }
  // else{
  //   res.render("post", {getTitle:"Not Found", getPost: "Not Found"});
  // }
});

app.post("/compose", function (req, res) {
  // console.log(req.body);
  const addtext = req.body.textTitle;
  const postText = req.body.postBody;
  // console.log(addtext, postText);
  // let composePost = {
  //   textTitle: req.body.textTitle,
  //   postBody: req.body.postBody
  // };

  const post = new Blog({
    title: addtext,
    content: postText,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

  // posts.push(composePost);
  // compose page go to the home page again to upload add more blogs
  // res.redirect("/");
});

app.post("/delete", function (req, res) {
  const deletePostId = req.body.submit;
  console.log(deletePostId);

  Blog.findByIdAndRemove(deletePostId, function (err) {
    if (!err) {
      console.log("Successfully deleted the notes.");
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running on 3000.");
});
