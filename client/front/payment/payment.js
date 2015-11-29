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
            var code = Session.get("code");
            var code = Codes.findOne({code: code});

            Meteor.call("updateValidations", code._id);
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

        var code = Session.get("code");
        var code = Codes.findOne({code: code});

        Meteor.call("updateValidations", code._id);

        Session.set("success", "Votre invitation à bien été reservée. Nous vous attendons lors de l'une de nos permanences pour finaliser l'achat de votre place");

        Router.go("/");
    }
});


/**
 * On render
 */
Template.payment.rendered = function() {
    $.material.init();

    var query = location.search;

    query = query.split('?');
    query = query[1];
    query= query.split('&');

    query_json = {};
    for (var i = query.length - 1; i >= 0; i--) {
        item = query[i].split("=");
        query_json[item[0]] = decodeURIComponent(item[1]);
    };

    Session.set("code", query_json.code)

    $("#ticket-barcode").barcode("specimen", "code128"); // Generate barcode
    $("#age-warning-dialog").modal("show"); // Force age-warning modal to appear
};