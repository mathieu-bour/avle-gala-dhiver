Template.referentTicketsList.helpers({
    'selector': function(){
        var userId = Meteor.userId();

        return {$or: [{isPaid: false},{validatorId: userId}]};
    }
})

Template.referentTicketsList.onRendered(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('referent') >= 0) {
            return true;
        } else {
            Router.go('/');
        }
    }else{
        Router.go('/');
    }
});