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
       Meteor.call('setExpressCheckout', this._id, function(error, result){
           Session.set('paypalUrl', result);
       });

       return Session.get('paypalUrl');
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

        Session.set("success", "Votre invitation à bien été reservée. Nous vous attendons lors de l'une de nos permanences pour finaliser l'achat de votre place");

        Router.go("/");
    }
});


/**
 * On render
 */
Template.payment.rendered = function() {
    $.material.init();

    $("#ticket-barcode").barcode("specimen", "code128"); // Generate barcode
    $("#age-warning-dialog").modal("show"); // Force age-warning modal to appear
};