Template.referentTicketsList.helpers({
    tickets: function(){
        return Tickets.find({isPaid: true, validateBy: Meteor.userId()});
    },
    ticketCounter: function(){
        return Tickets.find({validateBy: Meteor.userId(), isPaid: true}).count();
    },
    amount: function(){
        var onlineTickets = Tickets.find({validateBy: Meteor.userId(), isOnline: true, isPaid: true}).count()
        var offlineTickets = Tickets.find({validateBy: Meteor.userId(), isOnline: false, isPaid: true}).count()
        var amount = onlineTickets * onlinePrice + offlineTickets * offlinePrice;

        return amount;
    }
});

Template.referentTicketsList.events({
    'click #sendTicket': function(e){
        e.preventDefault();

        Meteor.call('sendEmail',
            'noreply@point-blank.fr',
            this.mail,
            "Votre invitation pour le gala d'hiver !",
            "Votre invitation pour le gala d'hiver est disponible en ligne !");
    }
});

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