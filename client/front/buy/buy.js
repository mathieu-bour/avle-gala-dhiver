Template.buy.events({
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
            isOnline: true,
            isPaid: false,
            isChecked: false
        };
        //TODO Vérif des données

        if(typeof Tickets.findOne({firstname: ticket.firstname, lastname:ticket.lastname, birthday: ticket.birthday}) != 'undefined'){
            return false
        }else {
            ticket._id = Tickets.insert(ticket);

            Router.go('/buying/payment/' + ticket._id);
        }
    }
});