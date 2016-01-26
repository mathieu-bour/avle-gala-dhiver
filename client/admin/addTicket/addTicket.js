/**
 * buy.js
 * ==
 *
 * Handle tickets purchase events
 *
 * @author Mathieu Bour
 * @version 1.0
 */

/**
 * Helpers
 */
Template.addTicket.helpers({
    'schools': function(){
        return schools;
    },
    'availableTickets': function(){
        var ticketsNb = Tickets.find().count();
        return 700 - ticketsNb;
    }
});

/**
 * Events
 */
Template.addTicket.events({
    "submit form": function(e){
        e.preventDefault();

        var str = "";

        for(var i = 0; i < 12; i++) {
            str = "x" + str;
        }

        // str = "xxxxx...xx" length time
        var d = new Date().getTime();

        var uuid = str.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return ( c == "x" ? r : (r&0x3|0x8)).toString(16);
        });

        var birthday = $(e.target).find('[id=birthday]').val();
        console.log(birthday);
        var birthdayFormated = moment(birthday, "YYYY-MM-DD").toDate();
        console.log(birthdayFormated);

        var ticket = {
            firstname: $(e.target).find('[id=firstname]').val(),
            lastname: $(e.target).find('[id=lastname]').val(),
            birthday: birthdayFormated,
            email: $(e.target).find('[id=email]').val(),
            phone: $(e.target).find('[id=phone]').val(),
            school: $(e.target).find('[id=school]').val(),
            level: $(e.target).find('[id=level]').val(),
            sexe: $(e.target).find('input[name=sexe]:checked').val(),
            isPaid: new Date(),
            isPaypal: false,
            isChecked: false,
            created: new Date(),
            uuid: uuid
        };

        ticket._id = Tickets.insert(ticket);

        /*HTTP.get('http:/cdn.avle.fr/scripts/invoice_pdf/',{
            params: {
                'lastname': ticket.lastname,
                'firstname': ticket.firstname,
                'phone': ticket.phone,
                'school': ticket.school,
                'getPdf': false,
                'isPaypal': ticket.isPaypal,
                'email': ticket.email,
                'id': ticket._id,
                'isForbach': false,
            }
        }, function(error, result){
            console.log(result);
        });*/

        HTTP.get('http://cdn.avle.fr/scripts/ticket_pdf/',{
            params: {
                '_id': ticket._id,
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
                'creationDate': moment(ticket.isPaid).format("DD/MM/YYYY"),
                'paymentDate': moment(ticket.isPaid).format("DD/MM/YYYY")
            }
        }, function(error, result){
            console.log(result);
        });

        $('form')[0].reset();

    }
});

/**
 * On rendered
 */
Template.addTicket.rendered = function() {

    $.material.init(); // Init Bootstrap Material

    $("*[data-validator]").validator();
};

Template.addTicket.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('referent') >= 0) {
            return true;
        }
    }else{
        Router.go('/login');
    }
});