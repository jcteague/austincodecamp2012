//var models = require('../Schemas.js'),
var utils = require("../utils.js"),
    crypto = require("crypto"),
    password_salt = "WwL1PNR9IOLNKw";


var AuthRoutes = function(speaker){
    this.speakerModel = speaker;
};

AuthRoutes.prototype.loginScreen = function(request,response){response.render('login')};

AuthRoutes.prototype.loginUser = function(req,res){
    console.log("request " + req);
    var creds = req.body;
    var locals = {errors:[]};
    if(!creds.email || !creds.password){
        locals.errors.push("email and password is required")
        res.render('login',{locals:locals});
    }
    else{
        debugger;
        var hashed_password = this.createHash(creds.password);
        this.speakerModel.findSpeakerByLogin(creds.email,function(err,user){

            if(user){

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

};
AuthRoutes.prototype.logoutUser = function(req,res){
    req.session.destroy();
    res.redirect('/login')
};

AuthRoutes.prototype.registerUser = function(req,res){
    console.log(req.body);
    register(req.body,function(err){
        if(err){
            console.log("save errors");
            console.log(err);
            res.render('register',{locals: {errors:err}});
            return;
        }
        else{
            res.render('register',{locals:{errors:null}});
        }
    })
};
AuthRoutes.prototype.createHash = function(input){
    return crypto.createHmac('sha256', password_salt).update(input).digest('hex');
};

var register = function(input, cb){
    input.password = createHash(input.password)
    var spkr = new models.Speaker(input);
    console.log("Speaker Model");
    console.log(spkr);
    spkr.save(function(err){
        if(err){
            messages = utils.formatErrors(err);
            cb(messages)
        }
        else{
            cb()
        }

    });
};


module.exports = AuthRoutes;