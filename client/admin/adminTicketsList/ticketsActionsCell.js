Template.ticketsActionsCell.events({
    'click #sendTicket': function(e){
        e.preventDefault();

        Meteor.call('sendTicket',{
            to:       this.email,
            from:     'noreply@point-blank.fr',
            subject:  'Votre invitation pour le Gala d\'hiver',
            html:     Blaze.toHTMLWithData(Template.ticketEmail, this)
        },this._id);
    },'click #checkTicket ': function(e){
        e.preventDefault();

        if(confirm('Etes-vous sur de vouloir valider le payement de ce ticket ?')){
            Tickets.update(this._id, {$set: {isPaid: new Date(), validatorId: Meteor.user()._id}});

            var ticket = this;
            var id = this._id;

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
        }
    }
});
