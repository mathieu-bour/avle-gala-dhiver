Template.securePage.helpers({
    //add you helpers here
});

Template.securePage.events({
    'submit form': function(e){
        e.preventDefault();

        var code = $(e.target).find('[id=code-input]').val();

        var host = "http://"+window.location.hostname;

       if(host == 'http://localhost'){
           window.location.replace("http://localhost:3000/buy?code=" + code);
       }else{
           window.location.replace(host + "/buy?code=" + code);
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

