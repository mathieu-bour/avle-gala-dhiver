Template.registration.events({
    'submit form': function(e){
        e.preventDefault();

        var ticket = {
            firstname: $(e.target).find('[id=firstname]').val(),
            lastname: $(e.target).find('[id=lastname]').val(),
            birthday: $(e.target).find('[id=birthday]').val(),
            mail: $(e.target).find('[id=mail]').val(),
            phone: $(e.target).find('[id=phone]').val(),
            school: $(e.target).find('[id=school]').val(),
            sexe: $(e.target).find('[name=sexe]:checked').val(),
            isOnline: false,
            isPaid: true,
            isPaypal: false,
            isChecked: false,
            validateBy: Meteor.user(),
            validateById: Meteor.userId()
        };

        //TODO Vérif des données
        if(typeof Tickets.findOne({firstname: ticket.firstname, lastname:ticket.lastname, birthday: ticket.birthday}) != 'undefined'){
            return false
        }else {
            ticket._id = Tickets.insert(ticket);

            Meteor.call('sendEmail',
                'noreply@point-blank.fr',
                ticket.mail,
                "Votre invitation pour le gala d'hiver !",
                "Votre invitation pour le gala d'hiver est disponible en ligne !");

            $('#buyingForm')[0].reset();
        }
    }
});

Template.registration.onRendered(function () {
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