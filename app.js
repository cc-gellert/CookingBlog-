const bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	sanitizer = require('express-sanitizer'),
	mongoose = require("mongoose"),
	express = require('express'),
	app = express();

//connect to database
mongoose.connect('mongodb+srv://devsquash:flop*973@cluster0-hgvtd.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(() => {
	console.log('Connected to database'); 
}).catch((err) => {
	console.log("ERROR", err.message); 
});
app.set('view engine', 'ejs'); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer()); 
app.use(methodOverride("_method")); 

//create Post Schema
let postSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

let Post = mongoose.model('Post', postSchema); 

//RESTful Routes

//Index
app.get('/', (req, res) => {
	res.redirect('/posts'); 
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

//New
app.get('/posts/new', (req, res) => {
	res.render('new'); 
}); 
//Create
app.post('/posts', (req, res) => {
	req.body.post.body = req.sanitize(req.body.post.body);
	Post.create(req.body.post, (err, newPost) => {
		if(err){
			res.render('new');
		} else {
			res.redirect('/posts'); 
		}
	});
});
//Show
app.get("/posts/:id", (req, res) => {
	Post.findById(req.params.id, (err, foundPost) => {
		if(err){
			console.log(err); 
			res.redirect('/posts');
		} else {
			res.render("show", {post: foundPost});
		}
	});
}); 

//Edit
app.get("/posts/:id/edit", (req, res) => {
	Post.findById(req.params.id, (err, foundPost) => {
		if(err){
			console.log(err); 
			res.redirect('/');
		} else {
			res.render("edit", {post: foundPost}); 
		}
	});
}); 

//Update
app.put('/posts/:id', (req, res) => {
	req.body.post.body = req.sanitize(req.body.post.body); 
	Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
		if(err){
			console.log(err); 
			res.redirect('index');
		} else {
			res.redirect('/posts/' + updatedPost._id); 
		}
	});
}); 

//Destroy
app.delete('/posts/:id', (req, res) => {
	Post.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			console.log(err); 
			res.redirect('/posts');
		} else {
			res.redirect('/posts'); 
		}
	});
});


//set up on port
app.listen(9000, () => {
	console.log('server is listening on port 9000'); 
}); 
	