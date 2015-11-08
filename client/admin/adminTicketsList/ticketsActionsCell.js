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
    }
});
