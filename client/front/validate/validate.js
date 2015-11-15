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
            Tickets.update(id, {$set : {isPaypal: new Date(), isPaid: new Date()}});
            var ticket = Tickets.findOne(id);

            /*= Save and save invoice =*/
            /*======================================================*/
            HTTP.get('http://php.dev/invoice_pdf/',{
                params: {
                    'lastname': ticket.lastname,
                    'firstname': ticket.firstname,
                    'phone': ticket.phone,
                    'school': ticket.school,
                    'getPdf': false,
                    'isPaypal': ticket.isPaypal,
                    'email': ticket.email,
                    'id': ticket._id
                }
            }, function(error, result){
                console.log(result);
            });

            HTTP.get('http://php.dev/ticket_pdf/',{
                params: {
                    'lastname': ticket.lastname,
                    'firstname': ticket.firstname,
                    'phone': ticket.phone,
                    'school': ticket.school,
                    'sexe': ticket.sexe,
                    'getPdf': false,
                    'email': ticket.email,
                    'id': ticket._id
                }
            }, function(error, result){
                console.log(result);
            });

            /*Meteor.call('saveTicket',id, function(error, result){
                if(error){
                    console.log(error);
                }else{
                    Meteor.call('sendTicket',{
                        to:       ticket.email,
                        from:     'noreply@avle-alca.fr',
                        subject:  'Votre invitation pour le Gala d\'hiver',
                        html:     Blaze.toHTMLWithData(Template.ticketEmail, ticket)
                    },id);
                }
            });*/
        }
    });

});

Template.validate.onDestroyed(function () {
    //add your statement here
});

