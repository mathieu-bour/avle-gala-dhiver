Template.payment.events({
    //TODO payement paypal
    'click #permanenceBuying': function(e){
        e.preventDefault();

        Tickets.update(this._id, {$set : {isPaypal: false}});
        Router.go('/');
    }
});