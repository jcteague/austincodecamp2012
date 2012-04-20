var express = require("express"),

mongoose = require("mongoose"),

models = require('./Schemas.js'),
mongoSessionStore = require('connect-mongodb'),
authRoutes = require('./routes/auth.js'),
sessionRoutes = require('./routes/sessions.js'),
path = __dirname,
app = express.createServer(),
mongo_url = process.env["MONGOHQ_URL"] || "mongodb://localhost/codecamp";

process.on("error",function(err){
    console.log ("system error: %o", err)
});
process.on("SIGTERM",function(err){
    console.log("sigterm event");
    app.close();
    process.exit(0);

})

process.on('uncaughtException', function(err) {
    console.log( " UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
    app.close();
    process.exit(1);
});
console.log("mongodb connect to " + mongo_url);
app.set('view engine','jade');
app.set('views', path + '/views');
app.set('view options',{layout:false})
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('codecamp'));
	app.use(express.session({
          key:'sid'
        , secret: 'eugeatnhoj'
        , cookie: {  path: '/', maxAge: 60000000 * 5,secret:"1202nitsua" }
        , store: new mongoSessionStore({
            url: mongo_url
        })
        }));
	app.use(express.static(path + '/public'));  // Before router to enable dynamic routing


});
app.configure('production',function(){
    mongoose.connect(process.env["MONGOHQ_URL"]);
    app.use(express.errorHandler());
});

app.configure("development",function(){
    console.log("development config")
    mongoose.connect("mongodb://localhost/codecamp");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

})



app.dynamicHelpers({
    isPost: function(req,res){ return res.req.method === 'POST'},
    error:  function(req,res){return req.session.error},
    user:   function(req,res){return req.session.user}
});

var loggedIn = function(request,response,next){
    if(!request.session.user)
        response.redirect('/login')
    else
        next();
}

app.get('/',function(request,response){
	response.render('index')
});

app.get('/login',authRoutes.loginScreen);
app.post('/login',authRoutes.loginUser);

app.get('/logout',authRoutes.logoutUser)

app.get('/register',function(req,res){
    res.render('register')
});
app.post('/register',authRoutes.registerUser);

app.get('/session/new',loggedIn, sessionRoutes.showForm );

app.post('/session/new',sessionRoutes.save);

var port = process.env.PORT || 3000;

app.listen(port, function(){console.log("listening to port" + port)})



