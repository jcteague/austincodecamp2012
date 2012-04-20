exports.formatErrors = function(err){
    //If it isn't a mongoose-validation error, just throw it.
    if (err.name !== 'ValidationError') return cb(err);
    var messages = {
        'required': "%s is required.",
        'unique': "%s already exists.",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value."
    }

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