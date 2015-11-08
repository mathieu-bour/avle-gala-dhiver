Template.validate.helpers({
    //add your events here
    expressCheckoutDetails: function(){
        return Session.get('expressCheckoutDetails');
    }
});

Template.validate.onCreated(function () {
    //add your statement here
});

Template.validate.onRendered(function () {
    Meteor.call('getExpressCheckoutDetails', this.data.token, function(error, result){
        if(!error){
            Session.set('expressCheckoutDetails', result);
        }
    });
    Meteor.call('doExpressCheckoutPayment', this.data.token,this.data.PayerID, function(error, result){
        if(!error){
            Session.set('checkoutResult', result);
            var expressCheckoutDetails = Session.get('expressCheckoutDetails');
            var id = expressCheckoutDetails.INVNUM;
            Tickets.update(id, {$set : {isPaypal: true, isPaid: new Date()}});
            var ticket = Tickets.findOne(id);


            Meteor.call('saveInvoice',id, function(error, result){
                if(error){
                    console.log(error);
                }else{
                    Meteor.call('sendInvoice',{
                        to:       ticket.email,
                        from:     'noreply@point-blank.fr',
                        subject:  'Confirmation de payement n°' + id,
                        html:     Blaze.toHTMLWithData(Template.invoiceEmail, ticket)
                    },id);
                }
            });

            Meteor.call('saveTicket',id, function(error, result){
                if(error){
                    console.log(error);
                }else{
                    Meteor.call('sendTicket',{
                        to:       ticket.email,
                        from:     'noreply@point-blank.fr',
                        subject:  'Votre invitation pour le Gala d\'hiver',
                        html:     Blaze.toHTMLWithData(Template.ticketEmail, ticket)
                    },id);
                }
            });
        }
    });

});

Template.validate.onDestroyed(function () {
    //add your statement here
});
