Template.login.helpers({
    //add you helpers here
});

Template.login.events({
    "submit #login-form" : function(e, t){
        e.preventDefault();

        var email = t.find("#login-email").value, password = t.find("#login-password").value;

        Meteor.loginWithPassword(email, password, function(err){
            console.log("Hello world");

            if (err) {
                console.log(err);

                var $loginEmail = $("#login-email");
                $loginEmail.addClass("form-control-success");
                $loginEmail.parents(".form-group").addClass("has-error");

                var $loginPassword = $("#login-password");
                $loginPassword.addClass("form-control-success");
                $loginPassword.parents(".form-group").addClass("has-error");
            } else {
                Router.go("/admin");
            }
        });
        return false;
    }
});

Template.login.onCreated(function () {
    //add your statement here
});

Template.login.onRendered(function () {
    $.material.init();
});

Template.login.onDestroyed(function () {
    //add your statement here
});

