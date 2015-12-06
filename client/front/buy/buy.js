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
        return 750 - ticketsNb;
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
        var validations = Codes.findOne({code: code}).validations;


        if(code){
            var ticket = {
                sexe: $(e.target).find('[id=sexe]').val(),
                firstname: $(e.target).find('[id=firstname]').val(),
                lastname: $(e.target).find('[id=lastname]').val(),
                birthday: $(e.target).find('[id=birthday]').val(),
                email: $(e.target).find('[id=email]').val(),
                phone: $(e.target).find('[id=phone]').val(),
                school: $(e.target).find('[id=school]').val(),
                level: $(e.target).find('[id=level]').val(),
                sexe: $(e.target).find('input[name=sexe]:checked').val(),
                isPaid: false,
                isPaypal: false,
                isChecked: false,
                created: new Date(),
                uuid: uuid,
                accessCode: code
            };
        }else{
            var ticket = {
                sexe: $(e.target).find('[id=sexe]').val(),
                firstname: $(e.target).find('[id=firstname]').val(),
                lastname: $(e.target).find('[id=lastname]').val(),
                birthday: $(e.target).find('[id=birthday]').val(),
                email: $(e.target).find('[id=email]').val(),
                phone: $(e.target).find('[id=phone]').val(),
                school: $(e.target).find('[id=school]').val(),
                level: $(e.target).find('[id=level]').val(),
                sexe: $(e.target).find('input[name=sexe]:checked').val(),
                isPaid: false,
                isPaypal: false,
                isChecked: false,
                created: new Date(),
                uuid: uuid,
            };
        }

        var alreadyExist = Tickets.findOne({email: ticket.email});
        if(alreadyExist){
            if(alreadyExist.isPaid){
                Session.set("error", "Désolé mais un ticket payé existe déjà à ce nom. N'hésitez pas à nous contacter par email à contact@avle.fr si vous n'avez pas reçu votre place.");
            }else if(alreadyExist.accessCode){
                Session.set("error", "Désolé mais un ticket existe déjà à ce nom. Si vous avez tenté de payer votre ticket par Paypal et que vous avez quitté la page avant la fin de la procédure, cela signifie que votre payement n'a pas été fait.");
                Session.set("errorLink", "/buy/payment?id=" + alreadyExist._id + "&code=" + alreadyExist.accessCode)
            }else{
                Session.set("error", "Désolé mais un ticket existe déjà à ce nom. Si vous avez tenté de payer votre ticket par Paypal et que vous avez quitté la page avant la fin de la procédure, cela signifie que votre payement n'a pas été fait.");
                Session.set("errorLink", "/buy/payment?id=" + alreadyExist._id);
            }
            Router.go('/');
        }else{
            if(code && validations < 50){
                ticket._id = Tickets.insert(ticket);
                Router.go('/buy/payment?id=' + ticket._id + "&code=" + code);
            }
            else if(code && validations >= 50){
                Session.set("error", "Désolé mais ce code a déjà été utilisé trop de fois.");
                Router.go('/');
            }
            else{
                Router.go('/buy/payment?id=' + ticket._id);
            }
        }
        // Insert ticket

    }
});

/**
 * On rendered
 */
Template.buy.rendered = function() {

    $.material.init(); // Init Bootstrap Material
    if(this.data.code){
        Session.set("code", this.data.code)
    }
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