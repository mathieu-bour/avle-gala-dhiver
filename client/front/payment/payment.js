/**
 * payment.js
 * ==
 *
 * Handle payment page events and actions
 *
 * @author Mathieu Bour & Ladislas Dellinger
 * @version 1.0
 */

/**
 * Helpers
 */
Template.payment.helpers({
   "paypalUrl": function(){
       return Session.get('paypalUrl');
   },
    "permanences": function(){
        var permanences = Permanences.find().fetch();

        for (var i = permanences.length - 1; i >= 0; i--) {
            var day = moment(permanences[i].startDate, "DD/MM/YYYY hh:mm").format("dddd Do MMMM");
            var startHour = moment(permanences[i].startDate, "DD/MM/YYYY hh:mm").format("HH[h]mm");
            var endHour = moment(permanences[i].endDate, "DD/MM/YYYY hh:mm").format("HH[h]mm");
            var date = day + " de " + startHour + " à " + endHour;

            permanences[i].date = date;
        };

        return permanences;
    }
});

/**
 * Events
 */
Template.payment.events({
    "click #paypal-btn": function(e){
        e.preventDefault();

        if($("#accept-conditions").prop("checked")){
            window.location.replace(Session.get('paypalUrl'));
        }
    },
    "click #permanence-btn": function(e){
        e.preventDefault();

        if($("#accept-conditions").prop("checked")){
            $("#permanence-selection-dialog").modal();
        }
    },
    "click #validate-btn": function(e){
        e.preventDefault();

        var id = Session.get("_id");
        var ticket = Tickets.findOne(id);

        Meteor.call('sendEmail',{
            to:       ticket.email,
            from:     'contact@avle.fr',
            subject:  "Confirmation de réservation pour le Gala d'hiver",
            html:     Blaze.toHTMLWithData(Template.confirmedEmail, ticket)
        });

        Session.set("success", "Votre invitation à bien été reservée. Nous vous attendons lors de l'une de nos permanences pour finaliser l'achat de votre place");

        Router.go("/");
    }
});

Template.payment.onCreated(function () {
    Meteor.call('setExpressCheckout', this.data.id, function(error, result){
        Session.set('paypalUrl', result);
    });
});
/**
 * On render
 */
Template.payment.rendered = function() {
    $.material.init();

    if(this.data.code){
        Session.set("code", this.data.code);
    }
    Session.set("_id", this.data.id);

    $("#ticket-barcode").barcode("specimen", "code128"); // Generate barcode
    $("#age-warning-dialog").modal("show"); // Force age-warning modal to appear
};