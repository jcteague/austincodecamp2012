var express = require("express"),
auth = require('connect-auth'),
_ = require('underscore'),
mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/codecamp');
var models = require('./Schemas.js');
var path = __dirname;
var app = express.createServer()
app.set('view engine','jade');
app.set('views', path + '/views');
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.static(path + '/public'));  // Before router to enable dynamic routing
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/',function(request,response){
	response.render('index',{layout:false})
});
app.get('/ejs_test',function(req,res){
    res.render("ejs_test.ejs",{layout:false});
});
app.get('/session/new',function(request,response){
    response.render('session_form',{layout:false});
});
app.post('/session/new',function(request,response){
    console.log("session submitted %o" ,request.body);
    save_sessions(request.body,function(){
        response.render('session_form',{layout:false});
    });

});

var save_sessions = function(input){
    var speaker = new models.Speaker({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        bio: input.bio
    });
    speaker.save(function(err){
        console.log("saving the speaker");
        if(err){
            console.log("error saving speaker %o",err);
            return;
        }
        presentations = _.filter(input.presentations,function(p){return p.title !=""});
        presentations.forEach(function(item){
                var pres = new models.Presentation({
                    title: item.title,
                    description: item.description,
                    duration: item.duration,
                    speakerName: speaker.firstName + " " + speaker.lastName,
                    speakerId: speaker._id

                });

                pres.save(function(){console.log("saving presentation")})
            });



    });


};
var port = process.env.PORT || 3000;

app.listen(port, function(){console.log("listening to port" + port)})



