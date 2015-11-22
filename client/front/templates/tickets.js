Template.tickets.helpers({
    "notifySuccess": function(){
        return Session.get("notifySuccess");
    }
});

Template.tickets.events({
    'submit form': function(e){
        e.preventDefault();

        var email = $(e.target).find('[id=notify-email]').val();
        if(email && !Newsletter.findOne({mail: email})) {
            var newsletter = {
                mail: email
            };

            newsletter._id = Newsletter.insert(newsletter);
            $('#notify-form')[0].reset();

            Session.set("notifySuccess", true);
        }
    }
});

Template.tickets.onCreated(function () {
    //add your statement here
});

Template.tickets.onRendered(function () {
    //add your statement here
});

Template.tickets.onDestroyed(function () {
    //add your statement here
});

