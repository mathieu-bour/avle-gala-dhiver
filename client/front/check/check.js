Template.check.helpers({
    "paypalUrl": function(){
	return Session.get("paypalUrl");
    }
});

Template.check.events({
    'submit form': function(e){
        e.preventDefault();

        var email = $(e.target).find('[id=email]').val();
        var ticket = Tickets.findOne({email: email});
        Session.set("ticket", ticket);
        if(ticket && ticket.isPaid){
            $("#search").hide();
            $("#paid").show();
        }else if(ticket){
	    Meteor.call("setExpressCheckout", ticket._id, function(error, result){
		Session.set("paypalUrl", result);
	    });

            $("#search").hide();
            $("#reserved").show();
        }else{
            $("#search").hide();
            $("#not-found").show();
        }

    },
    'click #send-confirm': function(e){
        e.preventDefault();

        $("#confirm-sent").show();

        var ticket = Session.get("ticket");

        Meteor.call('sendEmail',{
            to:       ticket.email,
            from:     'contact@avle.fr',
            subject:  "Confirmation de réservation pour le Gala d'hiver",
            html:     Blaze.toHTMLWithData(Template.confirmedEmail, ticket)
        });
    },
    'click #send-ticket': function(e){
        e.preventDefault();

        $("#ticket-sent").show();

        var ticket = Session.get("ticket");

        HTTP.get('http:/scripts/invoice_pdf/',{
            params: {
                'lastname': ticket.lastname,
                'firstname': ticket.firstname,
                'phone': ticket.phone,
                'school': ticket.school,
                'getPdf': false,
                'isPaypal': true,
                'email': ticket.email,
                'id': ticket._id,
                'isForbach': false
            }
        }, function(error, result){
            console.log(result);
        });

        HTTP.get('http:/scripts/ticket_pdf/',{
            params: {
                'lastname': ticket.lastname,
                'firstname': ticket.firstname,
                'phone': ticket.phone,
                'school': ticket.school,
                'isPaypal': true,
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
    },
    'click .close': function(e){
        e.preventDefault();

        $("#search").show();
        $("#paid").hide();
        $("#reserved").hide();
        $("#not-found").hide();
    }
});

Template.check.onCreated(function () {
    //add your statement here
});

Template.check.onRendered(function () {
    //add your statement here
});

Template.check.onDestroyed(function () {
    //add your statement here
});

