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
        ticketsNb = Tickets.find().count();
        return Math.round(((750 - ticketsNb) * 700) / 750);
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

        var ticket = {
            sexe: $(e.target).find('[id=sexe]').val(),
            firstname: $(e.target).find('[id=firstname]').val(),
            lastname: $(e.target).find('[id=lastname]').val(),
            birthday: $(e.target).find('[id=birthday]').val(),
            email: $(e.target).find('[id=email]').val(),
            phone: $(e.target).find('[id=phone]').val(),
            school: $(e.target).find('[id=school]').val(),
            isPaid: false,
            isPaypal: false,
            isChecked: false,
            created: new Date(),
            uuid: uuid
        };

        // Insert ticket
        ticket._id = Tickets.insert(ticket);

        // Redirect to payment page
        Router.go('/buy/payment?id=' + ticket._id);
    }
});

/**
 * On rendered
 */
Template.buy.rendered = function() {
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
            $("#ticket-gender").attr("src", "/img/king.png");
        } else {
            $("#ticket-gender").attr("src", "/img/queen.png");
        }
    });
};