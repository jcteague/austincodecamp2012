var models = require('../Schemas.js'),
    _ = require('underscore');

exports.showForm = function(request,response){
    models.Presentation.getPresentationsBySpeaker(request.session.user,function(data){
        var data = {
            user:request.session.user,
            presentations: JSON.stringify(data)
        };
        console.log("session locals: %o", data)
        response.render('session_form',{locals: data});
    })
};

exports.save = function(request,response){
    console.log("session submitted %o" ,request.body);
    save_sessions(request.session.user, request.body,function(){
        response.render('session_form');
    });
};

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

