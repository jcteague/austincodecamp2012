var models = require('../Schemas.js'),
    utils = require("../utils.js"),
    crypto = require("crypto"),
    salt = "WwL1PNR9IOLNKw";

;
exports.loginScreen = function(request,response){response.render('login')};

exports.loginUser = function(req,res){
    creds = req.body;
    var locals = {errors:[]};
    if(!creds.email || !creds.password){
        locals.errors.push("email and password is required")
        res.render('login',{locals:locals});
    }
    else{
        models.Speaker.findSpeakerByLogin(creds.email,function(err,user){
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

};
exports.logoutUser = function(req,res){
    req.session.destroy();
    res.redirect('/login')
};

exports.registerUser = function(req,res){
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

var createHash = function(input){
    return crypto.createHmac('sha256', salt).update(input).digest('hex');
};