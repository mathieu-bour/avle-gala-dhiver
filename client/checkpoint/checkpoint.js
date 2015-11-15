/*= Events =*/
/*======================================================*/
Template.checkpoint.events({
    /*= Submit ticket id =*/
    /*======================================================*/
    "submit #ticket-check": function (e) {
        e.preventDefault();

        var $ticketInput = $("#ticket-id");
        var ticketId = $ticketInput.val();
        var ticket = Tickets.findOne({uuid: ticketId});

        // Small function for message display
        var $status = $("#status");

        /**
         * Message display helper
         * @param {string} [message] The message to display
         * @param {string} [status] The alert-* class
         */
        var displayStatus = function(message, status) {
            $status.removeClass("alert-info").addClass("alert-" + status).html(message);
        };


        // Controls
        if (ticket == null || !ticket) { // Ticket doe not exist
            displayStatus("Ticket inexistant", "danger");
        } else if (!ticket.isPaid) { // Non paid tickets
            displayStatus("Ticket au nom de <strong>" + ticket.lastname + " " + ticket.firstname + "</strong> - Impayé", "danger");
        } else if (ticket.isChecked) { // Already checked
            displayStatus("Ticket au nom de <strong>" + ticket.lastname + " " + ticket.firstname + "</strong> - Déjà validé à " + moment(ticket.isChecked).format("hh:mm:ss"), "danger");
        } else { // Everything is ok :)
            Tickets.update(ticket._id, {$set: {isChecked: new Date()}}); // Update isChecked status

            displayStatus("Ticket au nom de <strong>" + ticket.lastname + " " + ticket.firstname + "</strong> - Validé !", "success");
            Session.set("lastTicketId", ticketId);
        }

        $ticketInput.val("").focus();
    },

    /*= Cancel last control =*/
    /*======================================================*/
    "click #btn-cancel": function (e) {
        e.preventDefault();
        var lastTicketId = Session.get("lastTicketId");
        ticket = Tickets.findOne({uuid : lastTicketId})
        Tickets.update(ticket._id, {$set: {isChecked: false}});
    }
});

Template.checkpoint.onRendered(function () {
    if (Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else {
            Router.go('/');
        }
    } else {
        Router.go('/');
    }
});

