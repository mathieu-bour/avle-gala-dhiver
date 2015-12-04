Template.referentTicketsList.onRendered(function(){
    var id = Meteor.userId();
    var validateTickets = Tickets.find({validatorId: id}).count();
    var total = validateTickets * 10;

    var given = Given.findOne({referent_id: id}).given;
    if(!given){
        given = 0;
    }
    var givenPercentage = Math.round(given / total * 100 * 10) / 10;

    var dueSum = validateTickets * 10 - given;
    var dueSumPercentage = Math.round(dueSum / total * 100 * 10) / 10;

    $("#due-sum-data").data("anumb", dueSum);
    $("#due-sum-progress")
        .data("anumb", dueSumPercentage)
        .text(dueSumPercentage + "% de " + total + " €");

    $("#given-sum-data").data("anumb", given);
    $("#given-sum-progress")
        .data("anumb", givenPercentage)
        .text(givenPercentage + "% de " + total + " €");


    // Number animations
    $("*[data-aNumb]").aNumbs();
});

Template.referentTicketsList.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('referent') >= 0) {
            return true;
        } else {
            Router.go('/');
        }
    }else{
        Router.go('/');
    }
});