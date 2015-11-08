Template.referentsList.onCreated(function () {
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