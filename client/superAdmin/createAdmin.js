Template.createAdmin.helpers({
    "schools": function(){
        return schools;
    }
});

Template.createAdmin.events({
    'submit #create-referent': function (e) {
        e.preventDefault();

        Meteor.call('createReferent',
            $(e.target).find('[id=referent-first-name]').val(),
            $(e.target).find('[id=referent-last-name]').val(),
            $(e.target).find('[id=referent-email]').val(),
            $(e.target).find('[id=referent-phone]').val(),
            $(e.target).find('[id=referent-school]').val(),
            true
        );

        $('#create-referent')[0].reset();
    }
});

Template.createAdmin.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('superAdmin') >= 0) {
            return true;
        } else if(roles.indexOf('admin') >= 0){
            Router.go('/admin');
        } else if(roles.indexOf('referent') >= 0){
            Router.go('/referent');
        }
    }else{
        Router.go('/login');
    }
});