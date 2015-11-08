Template.header.events({
    'click #logout': function(e){
        e.preventDefault();

        Meteor.logout(function(e){
            Router.go('/');
        })
    }
});

