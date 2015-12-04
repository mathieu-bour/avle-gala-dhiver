Template.exportTicketsList.helpers({
    'ticketsList': function(){
        var tickets = Tickets.find().fetch();

        /*var ticketsList= "\\begin{tabular}{|c|c|c|c|c|c|c|} \n";
        ticketsList += "\\hline \n ";
        ticketsList += "Prénom & Nom & Date de naissance & Téléphone & Email & Payement \\\\ \n";
        ticketsList += "\\hline \n ";
        for (var i = tickets.length - 1; i >= 0; i--) {
        	ticketsList += tickets[i].firstname + " & " + tickets[i].lastname + " & " +tickets[i].birthday + " & " +tickets[i].phone + " & " +tickets[i].email + " & " + (tickets[i].isPaid ? "Payé" : "Non payé") + " \\\\ \n";
            ticketsList += "\\hline \n ";
        };

        ticketsList += "\\end{tabular}";*/

        var ticketsList = "Prénom, Nom, Date de naissance, Téléphone, Email, Payement \n";
        for (var i = tickets.length - 1; i >= 0; i--) {
            ticketsList += tickets[i].firstname + ", " + tickets[i].lastname + ", " +tickets[i].birthday + ", " +tickets[i].phone + ", " +tickets[i].email + ", " + (tickets[i].isPaid ? "Payé" : "Non payé") + " \n";
        };

        return ticketsList;
    }
});

Template.exportTicketsList.events({
    //add your events here
});

Template.exportTicketsList.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('superAdmin') >= 0) {
            return true;
        } else if(roles.indexOf('admin') >= 0){
            Router.go('/admin');
        } else if(roles.indexOf('referent') >= 0){
            Router.go('/referent');
        }
    }else{
        Router.go('/login');
    }
});
