var mocha = require("mocha")
    ,should = require("should")
    ,mockRequest = require("mock-request")
    //,models = require('../Schemas.js')
    ,AuthenticationRoutes = require("../routes/auth.js")
    ,assert = require("assert")
    ,sinon = require("sinon")
    ;

describe("authentication",function(){
describe("When a User is logging and did not provide user name or password",function(){
    var authRoutes
        , speaker
        , response = {}
        ;

    beforeEach(function(){
       authRoutes = new AuthenticationRoutes(speaker);
    });

    it("it should render login screen when the password is not provieded",function(done){

        response.render = function(page,info){
            assert.equal(page,"login","should render login screen")
            done();
        };
        authRoutes.loginUser({"body":{"email":"email","passward":""}},response);
    });
    it("it should render login screen when the username is not provieded",function(done){

        response.render = function(page,info){
            assert.equal(page,"login","should render login screen")
            done();
        };
        authRoutes.loginUser({"body":{"email":"","passward":"secret"}},response);
    });
    it("should return an error message when the username and password",function(done){
        response.render = function(page,info){
            assert.notEqual(info.locals,null);
            assert.equal(info.locals.errors.length,1);
            done();
        }
        authRoutes.loginUser({"body":{"email":"email","passward":"secret"}},response);
    });

});

describe("When the user logs on with credentials and the credentials are valid",function(){
    var response = {},
        request = {
            body:{},
            session: {}
        }
        , authRoutes
        , request_body
        , speaker = {}
        , user = {}
        , user_email
        , user_password
        ;

    beforeEach(function(){
        speaker.findSpeakerByLogin = function(email,cb){
            cb(null, user);
        };
        authRoutes = new AuthenticationRoutes(speaker);
        user_email = "email";
        user_password = "secret";
        debugger;
        user.email = user_email;
        user.password = authRoutes.createHash(user_password);
        request.body = {"email":user_email,"password":user_password};


    });

    it("should render the the session form",function(done){

        request.session = {
            regenerate: function(){}
        };

        response.render = function(page, locals){
            assert.equal(page,"session/new");
            done();
        };
        authRoutes.loginUser(request,response);

    });

//    it("should add the user to the session",function(done){
//
//    })

});
});