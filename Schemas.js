var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var PresentationSchema = new Schema({
    speakerName: String,
    speakerId: {type:ObjectId,ref:'Speaker'},
    title:String,
    description: String,
    duration: {type:Number, default: 1},
    voteCount: {type:Number, default: 0},
    startTime: Date

});

PresentationSchema.statics.getPresentationsBySpeaker = function(speaker,next){
    this.find({speakerId:speaker._id},function(err,results){
        if(err){
            console.log("error getting presentations");
            console.log(err);
        }
        next(results);
    })
};


var SpeakerSchema = new Schema({
  firstName: {type: String, required:true},
  lastName: {type: String, required:true},
  email: {type: String, unique:true, required:true},
  password: {type:String, required:true},
  bio: String

});
SpeakerSchema.statics.findSpeakerByLogin = function(login, cb){
    this.findOne({email:login},function(err,result){
        console.log("speaker result")
        console.log(result)
        if(err){
            cb(err)
        }
        cb(null,result);
    })
};



exports.Presentation = mongoose.model("Presentation",PresentationSchema);
exports.Speaker = mongoose.model("Speaker",SpeakerSchema);
