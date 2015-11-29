Template.generateCode.helpers({
    "codes": function(){
        console.log(Codes.find().fetch());
        return Codes.find().fetch();
    }
});

Template.generateCode.events({
    'click #generate-code': function(e){
        e.preventDefault();

        function generatePrivateCode(){
            var years = [];
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var currentYears = 1990;
            for(var i = 0; i<26; i++){
                years.push(currentYears);
                currentYears++;
            }

            var privateCode = "";
            for(var i= 0; i<4; i++){
                privateCode += chars[Math.round((Math.random()*26)+1)];
            }
            var random = Math.round((Math.random()*25)+1);
            privateCode += years[random];
            console.log(random);
            console.log(privateCode);

            return privateCode;
        }

        var privateCode = generatePrivateCode();

        Codes.insert({code:  privateCode, validations: 0});
    }
});

Template.generateCode.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else {
            Router.go('/login');
        }
    }else{
        Router.go('/login');
    }
});
