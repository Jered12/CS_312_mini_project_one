// Import everything that is needed
//express = routes, and http requests
import express from "express";
//fs will be used for posts.json
import fs from "fs";

//initilize function that will be used
const app=express();
const PORT=1002;
const POSTS="posts.json";

//middleware that will be redaing the form data
app.use(express.urlencoded());
//make sure that everything in the publix folder is avalable to browser
app.use(express.static("public"));
//make sure to use EJS templetes when rendering the html pges
app.set("view engine", "ejs");

// function to load posts
function loadPosts() 
{
  // read the files posts  as a string 
  const fileContents =fs.readFileSync(POSTS, "utf-8");

  // convert the json string posts into a javascript object with data
  const javaObj =JSON.parse(fileContents);

  // finally return that parsed data
  return javaObj;
}

//function tto save posts
function savePosts(posts) 
{
  //change the javascript posts into a JSON string
  const jsonStrings= JSON.stringify(posts); 
  //Now write that json string into the file if its already there replace it
  fs.writeFileSync(POSTS, jsonStrings);

}

// Load posts 
let posts =loadPosts();
//set the id for the next post 
let nextId =+ 1;



// route for the homepage
app.get("/", (req, res) => 
{
  //render the index ejs and pass the posts so they are displayed
  res.render("index", { posts });
});

// route for creating a new post
app.post("/submit", (req, res) => 
{
  //from the req.body take out creators name, title, and content
  const { creatorName, title, content } = req.body;
  //new post object
  const newPost = 
  {
    //add the new id to that post
    id: nextId++,
    //set title
    title,
    //set content
    content,
    //add the time the post was created
    createdAt: new Date().toLocaleString()
  };
  //add the new post to the post arrau
  posts.push(newPost);
  //save the updated poost to the json file
  savePosts(posts);
  //take the user back to the homepage
  res.redirect("/");
});

// when the user wants to edit this will show up
app.get("/edit/:id", (req, res) => 
{
  //chnage the id into a number
  const id =Number(req.params.id); 
  //then seach the post for the matching id      
  const post =posts.find(p => p.id === id);  
  //render all the information that was already in the post
  res.render("edit",{ post });
});

// Save edited post
app.post("/edit/:id", (req, res) => 
{
  //chnage the id into a number
  const id= Number(req.params.id); 
  //then seach the post for the matching id      
  const post =posts.find(p => p.id === id);  

  //now we have to update all the new items we added the creators name
  post.creatorName= req.body.creatorName;
  //the title
  post.title= req.body.title;
  //and the content
  post.content =req.body.content;
  //finally save the post in the json file
  savePosts(posts);
  //take the user back to the compage
  res.redirect("/");
});

// delete post route
app.post("/delete/:id", (req, res) => 
{
   // change the id to a number
  const id =Number(req.params.id);  
  // create a new array without the post that matches the id     
  const postsLeft=posts.filter(p => p.id !== id); 
  // then update the posts array to only include the posts left
  posts = postsLeft;       
  //save the updated posts in the json
  savePosts(posts);
  //redirect user back to homepage
  res.redirect("/");
});

//finally start the server
app.listen(PORT, () => 
  //and write that its good in the terminal
  console.log(`Server running`));