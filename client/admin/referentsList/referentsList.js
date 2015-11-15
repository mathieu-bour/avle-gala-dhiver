Template.referentsList.events({
    'click #update-given-button': function(e){
        var givenInput = $("#update-given-input").val();

        var id = $('#update-given-button').val();
        var dbGiven = Given.findOne({referent_id: id});

        if(dbGiven){
            Given.update(dbGiven._id, {$set: {given: givenInput}});
        }else{
            Given.insert({given: givenInput, referent_id: id});
        }
    }
});

Template.referentsList.onRendered(function () {
    /*= Widgets =*/
    /*======================================================*/

    // Turnovers
    var nonPaypalPaidTicketsCount = Tickets.find({isPaypal: false, isPaid: {$ne: false}}).fetch().length;
    var given = Given.find().fetch();
    var givenAmount = 0;
    for (var i = given.length - 1; i >= 0; i--) {
        givenAmount += parseFloat(given[i]['given']);
    };
    var dueAmmount = nonPaypalPaidTicketsCount * 10 - givenAmount;
    var dueAmmountPercentage = Math.round((dueAmmount / (nonPaypalPaidTicketsCount * 10)) * 100 * 10) / 10;

    $("#due-amount-data").data("anumb", dueAmmount);
    $("#due-amount-progress")
        .data("anumb", dueAmmountPercentage)
        .text(dueAmmountPercentage + "% de " + nonPaypalPaidTicketsCount * 10 + " €");

    var givenAmountPercentage = Math.round((givenAmount / (nonPaypalPaidTicketsCount * 10)) * 100 * 10) / 10;

    $("#given-amount-data").data("anumb", givenAmount);
    $("#given-amount-progress")
        .data("anumb", givenAmountPercentage)
        .text(givenAmountPercentage + "% de " + nonPaypalPaidTicketsCount * 10 + " €");

    // Number animations
    $("*[data-aNumb]").aNumbs();
});

Template.referentsList.onCreated(function () {
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