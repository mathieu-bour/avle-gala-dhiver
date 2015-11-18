Template.header.events({
    'click .logout': function(e){
        e.preventDefault();

        Meteor.logout(function(e){
            Router.go('/');
        });
    },
    'click .toggle-sidebar': function(e) {
        e.preventDefault();

        $(".sidebar").toggleClass("sidebar-mobile-shown");
    }
});