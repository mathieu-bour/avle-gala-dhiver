Template.paymentValidation.helpers({
    tickets: function(){
        return Tickets.find({isPaid: false});
    },
    ticketsCounter: function(){
        return Tickets.find({validateById: Meteor.userId(), isPaid: true}).count();
    },
    amount: function(){
        var onlineTickets = Tickets.find({validateById: Meteor.userId(), isOnline: true, isPaid: true}).count()
        var offlineTickets = Tickets.find({validateById: Meteor.userId(), isOnline: false, isPaid: true}).count()
        var amount = onlineTickets * onlinePrice + offlineTickets * offlinePrice;

        return amount;
    }
});

Template.paymentValidation.events({
    'click #validatePayment ': function(e){
        e.preventDefault();

        if(confirm('Etes-vous sur de vouloir valider le payement de ce ticket ?')){
            Tickets.update(this._id, {$set: {isPaid: true, validateById: Meteor.user()._id, validateBy: Meteor.user()}});

            Meteor.call('sendEmail',
                'noreply@point-blank.fr',
                this.mail,
                "Votre invitation pour le gala d'hiver !",
                "Votre invitation pour le gala d'hiver est disponible en ligne !");
        }
    }
});

Template.paymentValidation.onRendered(function () {
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