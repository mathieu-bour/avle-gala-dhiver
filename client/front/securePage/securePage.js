Template.securePage.helpers({
    //add you helpers here
});

Template.securePage.events({
    'submit form': function(e){
        e.preventDefault();

        var code = $(e.target).find('[id=code-input]').val();

        code = Codes.findOne({code: code});

        if(code){
            var start = moment(code.startDate, "DD/MM/YYYY HH:mm");
            var end = moment(code.endDate, "DD/MM/YYYY HH:mm");
            var now = moment();

            var deltaStart = start.diff(now);
            var deltaEnd = end.diff(now);

            if(code.validations < code.maxValidations && deltaStart <= 0 && deltaEnd >= 0){
                var host = "http://"+window.location.hostname;

                if(host == 'http://localhost'){
                    window.location.replace("http://localhost:3000/buy?code=" + code.code);
                }else{
                    window.location.replace(host + "/buy?code=" + code.code);
                }
            }else if(code.validations >= code.maxValidations && deltaStart <= 0 && deltaEnd >= 0){
                Session.set("error", "Ce code a déjà été utilisé trop de fois.");
                Router.go('/');
            }else{
                Session.set("error", "Désolé mais ce code n'est pas valable.");
                Router.go('/');
            }
        }else{
            Session.set("error", "Désolé mais ce code n'est pas valable.");
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

