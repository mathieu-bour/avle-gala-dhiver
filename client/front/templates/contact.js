Template.contact.helpers({
    //add you helpers here
});

Template.contact.events({
    'submit form': function(e){
        e.preventDefault();

        var data = {
            name: $(e.target).find('[name=contact-name]').val(),
            email: $(e.target).find('[name=contact-email]').val(),
            subject: $(e.target).find('[name=contact-subject]').val(),
            message: $(e.target).find('[name=contact-message]').val()
        };

        Meteor.call('sendEmail',{
            to:       'ladislas14@gmail.com',
            from:     'noreply@point-blank.fr',
            subject:  data.name + ' - ' + data.email + ' - ' + data.subject,
            html:     Blaze.toHTMLWithData(Template.contactEmail, data)
        });
    }
});

Template.contact.onCreated(function () {
    //add your statement here
});

Template.contact.onRendered(function () {
    //add your statement here
});

Template.contact.onDestroyed(function () {
    //add your statement here
});

