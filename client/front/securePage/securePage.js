Template.securePage.helpers({
    //add you helpers here
});

Template.securePage.events({
    'submit form': function(e){
        e.preventDefault();

        var code = $(e.target).find('[id=code-input]').val();

        var code = Codes.findOne({code: query.code});
        if(code.validations < 10){
            var host = "http://"+window.location.hostname;

            if(host == 'http://localhost'){
                window.location.replace("http://localhost:3000/buy?code=" + code);
            }else{
                window.location.replace(host + "/buy?code=" + code);
            }
        }else{
            Session.set("error", "Ce code a déjà été utilisé trop de fois. Rendez-vous mercredi prochain à 19h !");
            Router.go('/');
        }

    }
});

Template.securePage.onCreated(function () {
    //add your statement here
});

Template.securePage.onRendered(function () {
    //add your statement here
});

Template.securePage.onDestroyed(function () {
    //add your statement here
});

