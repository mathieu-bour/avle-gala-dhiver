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
                'isForbach': false,
                '_id': ticket._id
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
                    '._id': ticket._id,
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
    },
    'click #confirmation': function(e){
        e.preventDefault();

        Meteor.call('sendEmail',{
            to:       this.email,
            from:     'contact@avle.fr',
            subject:  "Confirmation de réservation pour le Gala d'hiver",
            html:     Blaze.toHTMLWithData(Template.confirmedEmail, this)
        });
    },
    'click #delete': function(e){
        e.preventDefault();

        if(confirm("Etes-vous sûr de vouloir supprimer ce tickets ?")){
            Tickets.remove({_id: this._id});
        }

    },
    'click #edit-email': function(e){
        e.preventDefault();

        var id = $(this).attr("_id");
        var email = Tickets.findOne(id).email;
        var newEmail = prompt("Entrez le nouvel email : ", email);
        if(newEmail != null){
            Tickets.update(id, {$set: {email: newEmail}});
        }
    }
});
