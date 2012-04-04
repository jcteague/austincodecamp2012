var express = require("express"),
_ = require('underscore'),
mongoose = require("mongoose"),
crypto = require("crypto");
models = require('./Schemas.js'),
path = __dirname,
salt = "WwL1PNR9IOLNKw";
app = express.createServer();

app.set('view engine','jade');
app.set('views', path + '/views');
app.set('view options',{layout:false})
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'eugeatnhoj'}));
	app.use(express.static(path + '/public'));  // Before router to enable dynamic routing


});
app.configure('production',function(){
    mongoose.connect(process.env["MONGOHQ_URL"]);
    app.use(express.errorHandler());
});

app.configure("development",function(){
   mongoose.connect("mongodb://localhost/codecamp");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

})


app.dynamicHelpers({
    isPost: function(req,res){ return res.req.method === 'POST'},
    error:  function(req,res){return req.session.error},
    user:   function(req,res){return req.session.user}
});

app.get('/',function(request,response){
	response.render('index')
});

app.get('/login',function(req,res){res.render('login')});
app.post('/login',function(req,res){
    creds = req.body;
    var locals = {errors:[]};
    if(!creds.email || !creds.password){
        locals.errors.push("email and password is required")
        res.render('login',{locals:locals});
    }
    else{
        findSpeakerByLogin(creds.email,function(err,user){
            if(user){
                var hashed_password = createHash(creds.password);
                if(user.password === hashed_password){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        res.redirect('/session/new')
                    })
                }
                else{
                    locals.errors.push("Authentication Failed");
                    res.render('login',{locals:locals});
                }
            }
            else{
                locals.errors.push("Authentication Failed")
                res.render('login',{locals:locals});

            }

        })
    }

});
app.get('/register',function(req,res){
    res.render('register')
});
app.post('/register',function(req,res){
   console.log(req.body);

   register(req.body,function(err){
       if(err){
            console.log("save errors");
            console.log(err);
            res.render('register',{locals: {errors:err}});
            return;
       }
       else{
           console.log("response");
           console.log(res);
           res.render('register',{locals:{errors:null}});
       }


   })
});
app.get('/session/new',function(request,response){
    if(!request.session.user){
        response.redirect('/login')
    }
    else{
        getSpeakerPresentations(request.session.user,function(data){
            var data = {
                user:request.session.user,
                presentations: JSON.stringify(data)
            };
            console.log("locals: %o", data)
            response.render('session_form',{locals: data});
        })

    }

});
app.post('/session/new',function(request,response){
    console.log("session submitted %o" ,request.body);
    save_sessions(request.session.user, request.body,function(){
        response.render('session_form');
    });

});

var createHash = function(input){
    return crypto.createHmac('sha256', salt).update(input).digest('hex');
};

var register = function(input, cb){
    input.password = createHash(input.password)
    var spkr = new models.Speaker(input);
    console.log("Speaker Model");
    console.log(spkr);
    spkr.save(function(err){
        if(err){
            messages = formatErrors(err);
            cb(messages)
        }
        else{
            cb()
        }

    });
};

var findSpeakerByLogin = function(login, cb){
    models.Speaker.findOne({email:login},function(err,result){
        console.log("speaker result")
        console.log(result)
        if(err){
         cb(err)   //?
        }
        cb(null,result);
    })
};
var getSpeakerPresentations = function(speaker,next){
    models.Presentation.find({speakerId:speaker._id},function(err,results){
        if(err){
            console.log("error getting presentations");
            console.log(err);
        }
        next(results);
    })
}

var save_sessions = function(current_user, input,next){

    var update_data = {
        lastName:  input.lastName,
        email: input.email,
        firstName: input.firstName,
        bio: input.bio
    };

    models.Speaker.update({_id:current_user._id},update_data,function(err){
        console.log("updating the speaker");
        if(err){
            console.log("error saving speaker %o",err);
            return;
        }
        presentations = _.filter(input.presentations,function(p){return p.title !=""});
        var count = presentations.length;
        var current = 0;
        presentations.forEach(function(item){
                console.log("updating presentation ")
                var presentation_id = item._id === "" ? null : item._id;
                var presentation_data = {
//                    _id: presentation_id,
                    speakerId: current_user._id,
                    speakerName: current_user.firstName + " " + current_user.lastName,
                    title:item.title,
                    description: item.description,
                    duration: item.duration
                };
                var presentation_doc = new models.Presentation(presentation_data);
                if(presentation_id === null){
                    presentation_doc.save(function(err){
                        if(err){
                            console.log("error saving presentation");
                            console.log(err)
                        }
                        current++;
                        if(current === count){
                            next()
                        }
                    })
                }
                else{
                    models.Presentation.update({_id:presentation_id},presentation_data,function(err){
                        if(err){
                            console.log("error updating presentatin");
                            console.log(err);
                        }
                        current++;
                        if(current === count){
                            next()
                        }

                    });
                }

         });
    });


};
var formatErrors = function(err){
    //If it isn't a mongoose-validation error, just throw it.
    if (err.name !== 'ValidationError') return cb(err);
    var messages = {
        'required': "%s is required.",
        'unique': "%s already exists.",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value."
    };

    //A validationerror can contain more than one error.
    var errors = [];

    //Loop over the errors object of the Validation Error
    var format = require('util').format;
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field];

        //If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eObj.type)) errors.push(eObj.type);

        //Otherwise, use util.format to format the message, and passing the path
        else errors.push(format(messages[eObj.type], eObj.path));
    });

    return errors;
}

var port = process.env.PORT || 3000;

app.listen(port, function(){console.log("listening to port" + port)})



