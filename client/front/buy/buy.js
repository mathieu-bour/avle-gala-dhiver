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
Template.buy.helpers({
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
Template.buy.events({
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
        var code = Session.get("code");

        var ticket = {
            sexe: $(e.target).find('[id=sexe]').val(),
            firstname: $(e.target).find('[id=firstname]').val(),
            lastname: $(e.target).find('[id=lastname]').val(),
            birthday: $(e.target).find('[id=birthday]').val(),
            email: $(e.target).find('[id=email]').val(),
            phone: $(e.target).find('[id=phone]').val(),
            school: $(e.target).find('[id=school]').val(),
            level: $(e.target).find('[id=level]').val(),
            sexe: $(e.target).find('[name=sexe]').val(),
            isPaid: false,
            isPaypal: false,
            isChecked: false,
            created: new Date(),
            uuid: uuid,
            accessCode: code
        };
        code = Codes.findOne({code: code});
        if(code.validations < 100){
            var alreadyExist = Tickets.findOne({email: ticket.email});
            if(alreadyExist){
                Session.set("error", "Désolé mais un ticket existe déjà à ce nom. Si vous avez tenté de payer votre ticket par Paypal et que vous avez quitté la page avant la fin de la procédure, cela signifie que votre payement n'a pas été fait. Votre place est en revanche bien enregistrée et il faudra venir la payer lors d'une permanence.");
                Router.go('/');
            }else{
                ticket._id = Tickets.insert(ticket);

                if(code){
                    Router.go('/buy/payment?id=' + ticket._id + "&code=" + code.code);
                }else{
                    Router.go('/buy/payment?id=' + ticket._id);
                }
            }
        }else{
            Session.set("error", "Ce code a déjà été utilisé trop de fois. Rendez-vous mercredi prochain à 19h !");
            Router.go('/');
        }
        // Insert ticket

    }
});

/**
 * On rendered
 */
Template.buy.rendered = function() {
    Session.set("code", this.data.code);

    $.material.init(); // Init Bootstrap Material

    $("#ticket-barcode").barcode("specimen", "code128"); // Render page

    // Update ticket name
    $("#firstname").bind("keyup change", function(e) {
        updateName();
    });
    $("#lastname").bind("keyup change", function(e) {
        updateName();
    });

    var updateName = function() {
        $("#ticket-user-name").text($("#firstname").val() + " " + $("#lastname").val());
    };

    // Update picture (male/female)
    $("input[type=radio][name=sexe]").change(function() {
        if($(this).val() == "Homme") {
            $("#ticket-gender").attr("src", "//cdn.avle.fr/img/king.png");
        } else {
            $("#ticket-gender").attr("src", "//cdn.avle.fr/img/queen.png");
        }
    });

    $("*[data-validator]").validator();
};