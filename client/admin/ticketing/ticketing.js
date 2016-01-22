Template.ticketing.helpers({
    "codes": function(){
        return Codes.find();
    },
    'success': function(){
        return Session.get('success');
    },
    'error': function(){
        return Session.get('error');
    },
});

Template.ticketing.events({
    "submit #update-event": function(e){
        e.preventDefault();

        var event = {
            openDate: $(e.target).find('[id=open-date]').val(),
            closeDate: $(e.target).find('[id=close-date]').val(),
            ticketNumber: $(e.target).find('[id=ticket-number]').val()
        };

        if(Events.findOne()){
            oldEvent = Events.findOne();
            Events.update(oldEvent._id, {$set: event});
        }else{
            Events.insert(event);
        }
    },
    "submit #create-code": function(e){
        e.preventDefault();

        var code = {
            code: $(e.target).find('[id=code]').val(),
            startDate: $(e.target).find('[id=start-date]').val(),
            endDate: $(e.target).find('[id=end-date]').val(),
            maxValidations: $(e.target).find('[id=max-validations]').val(),
            validations: 0
        };

        Codes.insert(code);
        Session.set("success", "Le code a bien été ajouté.");

        $('#create-code')[0].reset();
    }
});

Template.ticketing.onCreated(function () {

});

Template.ticketing.onRendered(function () {
    this.$('.datetimepicker').datetimepicker({
        icons: {
            time: "zmdi zmdi-time",
            date: "zmdi zmdi-calendar",
            up: "zmdi zmdi-caret-up-circle",
            down: "zmdi zmdi-caret-down-circle",
            previous: "zmdi zmdi-caret-left-circle",
            next: "zmdi zmdi-caret-right-circle"
        },
        locale: 'fr'
    });
    if(Events.findOne()){
        var event = Events.findOne();
        console.log(event.openDate);
        $("input[id=open-date]").val(event.openDate);
        $("input[id=close-date]").val(event.closeDate);
        $("input[id=ticket-number]").val(event.ticketNumber);
    }
});

Template.ticketing.onDestroyed(function () {
    //add your statement here
});

