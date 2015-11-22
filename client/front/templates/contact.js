Template.contact.helpers({
    "contactSuccess": function(){
        return Session.get("contactSuccess");
    }
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

        $('#contact-form')[0].reset();

        Meteor.call('sendEmail',{
            to:       'contact@avle.fr',
            from:     'contact@avle.fr',
            subject:  data.name + ' - ' + data.email + ' - ' + data.subject,
            html:     Blaze.toHTMLWithData(Template.contactEmail, data)
        });

        Session.set('contactSuccess', true);
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

