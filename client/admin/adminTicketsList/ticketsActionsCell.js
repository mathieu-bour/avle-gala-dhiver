Template.ticketsActionsCell.events({
    'click #sendTicket': function(e){
        e.preventDefault();

        var ticket = this;

        HTTP.get('http://cdn.avle.fr/scripts/invoice_pdf/',{
            params: {
                'lastname': ticket.lastname,
                'firstname': ticket.firstname,
                'phone': ticket.phone,
                'school': ticket.school,
                'getPdf': false,
                'isPaypal': ticket.isPaypal,
                'email': ticket.email,
                'id': ticket._id,
                'isForbach': false
            }
        }, function(error, result){
            console.log(result);
        });

        HTTP.get('http://cdn.avle.fr/scripts/ticket_pdf/',{
            params: {
                'lastname': ticket.lastname,
                'firstname': ticket.firstname,
                'phone': ticket.phone,
                'school': ticket.school,
                'isPaypal': ticket.isPaypal,
                'sexe': ticket.sexe,
                'getPdf': false,
                'email': ticket.email,
                'id': ticket.uuid,
                'isForbach': false
            }
        }, function(error, result){
            console.log(result);
        });
    },'click #checkTicket ': function(e){
        e.preventDefault();

        if(confirm('Etes-vous sur de vouloir valider le payement de ce ticket ?')){
            Tickets.update(this._id, {$set: {isPaid: new Date(), validatorId: Meteor.user()._id}});

            var ticket = this;
            var id = this._id;

            /*= Save and save invoice =*/
            /*======================================================*/
            HTTP.get('http://cdn.avle.fr/scripts/invoice_pdf/',{
                params: {
                    'lastname': ticket.lastname,
                    'firstname': ticket.firstname,
                    'phone': ticket.phone,
                    'school': ticket.school,
                    'getPdf': false,
                    'isPaypal': ticket.isPaypal,
                    'email': ticket.email,
                    'id': ticket._id,
                    'isForbach': false
                }
            }, function(error, result){
                console.log(result);
            });

            HTTP.get('http://cdn.avle.fr/scripts/ticket_pdf/',{
                params: {
                    'lastname': ticket.lastname,
                    'firstname': ticket.firstname,
                    'phone': ticket.phone,
                    'school': ticket.school,
                    'isPaypal': ticket.isPaypal,
                    'sexe': ticket.sexe,
                    'getPdf': false,
                    'email': ticket.email,
                    'id': ticket.uuid,
                    'isForbach': false
                }
            }, function(error, result){
                console.log(result);
            });
        }
    }
});
