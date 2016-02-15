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

        // Buy at the club
        if(ticketId === "3329680967760") {
            var ticket = {
                firstname: "surplace",
                lastname: "surplace",
                birthday: "01/01/2016",
                email: "surplace@gmail.com",
                phone: "0600000000",
                school: "surplace",
                level: "",
                sexe: "",
                isPaid: false,
                isPaypal: false,
                isChecked: false,
                created: new Date(),
                uuid: "surplace"
            };
            ticket._id = Tickets.insert(ticket);
            Tickets.update(ticket._id, {$set: {isChecked: new Date(), uuid: ticket._id}}); // Update isChecked status

            console.log(ticket._id);

            displayStatus("Ticket acheté sur place - Validé !", "success");
            Tickets.update(ticket._id, {$set: {isPaid: new Date(), isChecked: new Date()}}); // Update isChecked status

            Session.set("lastTicketId", ticket._id);
        } else {
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
        }

        $ticketInput.val("").focus();
    },

    /*= Cancel last control =*/
    /*======================================================*/
    "click #btn-cancel": function (e) {
        e.preventDefault();
        var lastTicketId = Session.get("lastTicketId");
        var ticket = Tickets.findOne({uuid : lastTicketId});

        if(ticket.email === "surplace@gmail.com") {
            Tickets.remove(ticket._id);
        }

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

