var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect('mongodb://localhost:27017/blog_site', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//TO USE CUSTOM STYLE SHEETS
app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(expressSanitizer()); //always after above line

//SCHEMA SET UP
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);


//TO ADD BLOG
/*Blog.create({
	title: "Test Blog",
	image: "https://images.unsplash.com/photo-1514784311994-b2dde641cc79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
	body: "HELLO THIS IS A TEST BLOG"
	
}, function(err,blog){
	if(err){
		console.log(err);
	} else {
		console.log("NEWLY CREATED BLOG");
		console.log(blog);
	}
});
*/
//RESTful ROUTES

//INDEX
app.get("/blogs",function(req,res){
	//Get all blogs from DB
	Blog.find({}, function(err, blogs){
					if(err){
						console.log(err);
					} else {
						 res.render("index",{blogs:blogs});
					}
		
		});   
});

app.get("/blogs",function(req,res){
    res.render("index");
});

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//POST ROUTE
//NEW AND CREATE
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

app.post("/blogs",function(req,res){
	//CREATE A NEW BLOG AND SAVE TO DB
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newlyBlog){
					if(err){
						res.render("new");
					} else {
						 res.redirect("/blogs");
					}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog})
		}
	});
});

// EDIT AND UPDATE ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}	
	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});


//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


//Tell express to listen for requests(start server)
    app.listen(80, function() { 
      console.log('Server listening on port 80'); 
    });