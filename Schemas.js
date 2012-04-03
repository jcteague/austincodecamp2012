var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;

var PresentationSchema = new Schema({
    speakerName: String,
    speakerId: {type:ObjectId,ref:'Speaker'},
    title:String,
    description: String,
    duration: {type:Number, default: 1},
    startTime: Date

});
var SpeakerSchema = new Schema({
  firstName: {type: String, required:true},
  lastName: {type: String, required:true},
  email: {type: String, unique:true, required:true},
  password: {type:String, required:true},
  bio: String

});
exports.Presentation = mongoose.model("Presentation",PresentationSchema);
exports.Speaker = mongoose.model("Speaker",SpeakerSchema);
