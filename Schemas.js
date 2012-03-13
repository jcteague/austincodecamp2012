var mongoose = require('mongoose')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;
var PresentationSchema = new Schema({
    speakerName: String,
    speakerId: {type:ObjectId,ref:'Speaker'},
    title:String,
    description: String,
    duration: {type:Number, default: 1},
    startTime: String

});

var SpeakerSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  bio: String

});

exports.Presentation = mongoose.model("Presentation",PresentationSchema);
exports.Speaker = mongoose.model("Speaker",SpeakerSchema);
