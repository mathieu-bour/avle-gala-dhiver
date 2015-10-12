Template.control.helpers({
    ticket: function(){ return Session.get('ticket')},
    alreadyChecked: function(){ return Session.get('alreadyChecked')}
});

Template.control.events({
    'submit form': function(e){
        e.preventDefault();

        id = $(e.target).find('[id=ticketId]').val();

        ticket = Tickets.findOne(id);

        if(ticket.isChecked){
            Session.set('alreadyChecked', true);
            Session.set('ticket', Tickets.findOne(id));
        }else{
            Session.set('alreadyChecked', false);
            Tickets.update(id, {$set: {isChecked: true}});
            Session.set('ticket', Tickets.findOne(id));
        }


        $('#controlForm')[0].reset();
    },
    'click #cancel': function(e){
        e.preventDefault();
        ticket = Session.get('ticket');
        Tickets.update(ticket._id, {$set: {isChecked: false}});
        Session.set('alreadyChecked', false);
    }

});

Template.control.onCreated(function () {
    //add your statement here
});

Template.control.onRendered(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else {
            Router.go('/');
        }
    }else{
        Router.go('/');
    }
});

Template.control.onDestroyed(function () {
    //add your statement here
});

