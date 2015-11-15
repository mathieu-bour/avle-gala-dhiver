Template.adminTicketsList.onRendered(function () {
    /*= Widgets =*/
    /*======================================================*/
    // Reserved tickets widget
    var reservedTicketsCount = Tickets.find().fetch().length;
    var reservedTicketsPercentage = Math.round((reservedTicketsCount / 750) * 100 * 10) / 10;
    $("#reserved-tickets-data").data("anumb", reservedTicketsCount);
    $("#reserved-tickets-progress")
        .data("anumb", reservedTicketsPercentage)
        .text(reservedTicketsPercentage + "% de 750");

    // Paid tickets widget
    var paidTicketsCount = Tickets.find({isPaid: {$ne : false}}).fetch().length;
    var paidTicketsPercentage = Math.round((paidTicketsCount / 750) * 100 * 10) / 10;
    $("#paid-tickets-data").data("anumb", paidTicketsCount);
    $("#paid-tickets-progress")
        .data("anumb", paidTicketsPercentage)
        .text(paidTicketsPercentage + "% de 750");

    // Turnovers
    var paypalPaidTicketsCount = Tickets.find({isPaypal: {$ne: false}, isPaid: {$ne: false}}).fetch().length;
    var nonPaypalPaidTicketsCount = Tickets.find({isPaypal: false, isPaid: {$ne: false}}).fetch().length;
    var turnovers = paypalPaidTicketsCount * 10.50 + nonPaypalPaidTicketsCount * 10;
    var turnoverPercentage = Math.round(turnovers / 7500 * 100 * 10) / 10;

    $("#turnover-data").data("anumb", turnovers);
    $("#turnover-progress")
        .data("anumb", turnoverPercentage)
        .text(turnoverPercentage + "% de 7500 €");


    // Earnings
    var earnings = turnovers - ((paypalPaidTicketsCount + nonPaypalPaidTicketsCount) * 5);
    var earningsPercentage = Math.round(earnings / 3750 * 100 * 10) / 10;
    $("#earnings-data").data("anumb", earnings);
    $("#earnings-progress")
        .data("anumb", earningsPercentage)
        .text(earningsPercentage + "% de 3750 €");


    // Number animations
    $("*[data-aNumb]").aNumbs();
});

Template.adminTicketsList.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else {
            Router.go('/login');
        }
    }else{
        Router.go('/login');
    }
});