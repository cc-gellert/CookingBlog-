var express = require('express'),
	app = express(),
	bodyParser = require("body-parser"), 
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	sanitizer = require('express-sanitizer'); 

app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride("_method")); 
app.use(sanitizer()); 
//connect to database
mongoose.connect('mongodb+srv://devsquash:flop*973@cluster0-hgvtd.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to database'); 
}).catch((err) => {
	console.log("ERROR", err.message); 
});

//create Post Schema
let postSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

let Post = mongoose.model('Post', postSchema); 
// Post.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
// 	body: "This is a test post",
// }); 

//RESTful Routes
//Index
app.get('/', (req, res) => {
	res.redirect('/posts'); 
}); 
//New
app.get('/new', (req, res) => {
	res.render('/posts/new'); 
}); 
//Create
app.post('/posts', (req, res) => {
	req.body.post.body = req.sanitize(req.body.post.body);
	Post.create(req.post.blog, (err, newPost) => {
		if(err){
			res.render('new');
		} else {
			res.redirect('/posts'); 
		}
	});
});
//Show
app.get('/posts/:id', (req, res) => {
	Post.findById(req.params.id, (err, foundPost) => {
		if(err){
			res.redirect('/posts');
		} else {
			res.render('show', {post: foundPost});
		}
	});
}); 
//Edit
app.get('/posts/:id/edit', (req, res) => {
	Post.findById(req.params.id, (err, foundPost) => {
		if(err){
			console.log(err); 
			res.redirect('/posts');
		} else {
			res.render('edit', {post: foundPost}); 
		}
	});
});
//Update
app.put('/posts/:id', (req, res) => {
	req.body.post.body = req.sanitize(req.body.post.body); 
	Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
		if(err){
			res.redirect('index');
		} else {
			res.redirect('/posts/' + req.params.id); 
		}
	});
}); 
//Destroy
app.delete('/posts/:id', (req, res) => {
	Post.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect('/posts');
		} else {
			res.redirect('/posts'); 
		}
	});
});

app.get('/posts', (req, res) => {
	Post.find({}, (err, posts) => {
		if(err){
			console.log(err);
		}  else {
			res.render('index', {posts: posts}); 
		} 
	});   
});
//set up on port
app.listen(9000, () => {
	console.log('server is listening on port 9000'); 
}); 
	