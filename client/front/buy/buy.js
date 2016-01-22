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
        var count = Tickets.find().count();
        var event = Events.findOne();
        return event.ticketNumber - count;
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

        if(code){
            var ticket = {
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
            if(code){
                ticket._id = Tickets.insert(ticket);
                Meteor.call("updateValidations", code._id);
                Router.go('/buy/payment?id=' + ticket._id + "&code=" + code);
            }else{
                ticket._id = Tickets.insert(ticket);
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
    $("#birthdayPicker").birthdayPicker({"dateFormat": "littleEndian"});
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
            $("#ticket-gender").attr("src", "/img/king.png");
        } else {
            $("#ticket-gender").attr("src", "/img/queen.png");
        }
    });

    $("*[data-validator]").validator();
};

Template.buy.onCreated(function () {
    var event = Events.findOne();
    query = this.data;
    var open = moment(event.openDate, "DD/MM/YYYY HH:mm");
    var close = moment(event.closeDate, "DD/MM/YYYY HH:mm");
    var now = moment();

    var deltaClose = close.diff(now);
    var deltaOpen = open.diff(now);

    if(query.code){
        var code = Codes.findOne({code: query.code});
        if(code){
            var start = moment(code.startDate, "DD/MM/YYYY HH:mm");
            var end = moment(code.endDate, "DD/MM/YYYY HH:mm");
            var now = moment();

            var deltaStart = start.diff(now);
            var deltaEnd = end.diff(now);

            if(code.validations <= code.maxValidations && deltaStart <= 0 && deltaEnd >= 0){
                Session.set("code", this.data.code);
            }else if(code.validations > code.maxValidations && deltaStart <= 0 && deltaEnd >= 0){
                Session.set("error", "Ce code a déjà été utilisé trop de fois.");
                Router.go('/');
            }else{
                Session.set("error", "Désolé mais ce code n'est pas valable.");
                Router.go('/');
            }
        }else{
            Session.set("error", "Désolé mais ce code n'est pas valable.");
            Router.go('/');
        }
    }else if(deltaOpen <= 0 && deltaClose >= 0){
        return true;
    }else if(deltaOpen >= 0){
        Session.set("error", "Nous sommes désolés mais la billeterie n'est pas encore ouverte.");
        Router.go('/');
    }else if(deltaClose <= 0){
        Session.set("error", "Nous sommes désolés mais la vente des places est terminée.");
        Router.go('/');
    }

});