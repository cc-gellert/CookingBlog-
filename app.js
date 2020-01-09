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
	useCreateIndex: true 
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
			res.redirect("/posts"); 
		}
	});
});
//Show

//Edit

//Update

//Destroy

//set up on port
app.listen(9000, () => {
	console.log("server is listening on port 9000"); 
}); 
	