Template.adminTicketsList.helpers({
    tickets: function(){
        return Tickets.find();
    },
    ticketsCounter: function(){
        return Tickets.find().count();
    },
    paidTicketsCounter: function(){
        return Tickets.find({isPaid: true}).count();
    },
    amount: function(){
        var onlineTickets = Tickets.find({isOnline: true, isPaid: true}).count()
        var offlineTickets = Tickets.find({isOnline: false, isPaid: true}).count()
        var amount = onlineTickets * onlinePrice + offlineTickets * offlinePrice;

        return amount;
    }
});

Template.adminTicketsList.events({
    'click #sendTicket': function(e){
        e.preventDefault();

        Meteor.call('sendEmail',
            'noreply@point-blank.fr',
            this.mail,
            "Votre invitation pour le gala d'hiver !",
            "Votre invitation pour le gala d'hiver est disponible en ligne !");
    }
});

Template.adminTicketsList.onRendered(function () {
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