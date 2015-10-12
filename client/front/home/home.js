Template.home.helpers({
    countdown: function(){
        setInterval(function(){

            var now = moment();
            Session.set('countdown', now.to("2015-11-22"))
        }, 1000);

        return Session.get('countdown');
    }
});
