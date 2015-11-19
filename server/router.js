Router.route('/ticket/:_id', function () {
    var wkhtmltopdf = Meteor.npmRequire('wkhtmltopdf');
    var res = this.response;

    var id = this.params._id;
    var ticket = Tickets.findOne(id);


    var result = HTTP.get('http://cdn.avle.fr/scripts/ticket_pdf/', {params: {id: ticket.uuid, lastname: ticket.lastname, firstname: ticket.firstname, sexe: ticket.sexe, getPdf: true}});

    wkhtmltopdf(result.content, {
        'no-outline': true,         // Make Chrome not complain
        'margin-top': 0,
        'margin-right':0,
        'margin-bottom': 0,
        'margin-left':0,

        // Default page options
        'disable-smart-shrinking': true,
    })
        .pipe(res);
}, {where: 'server'});

Router.route('/invoice/:_id', function () {
    var wkhtmltopdf = Npm.require('wkhtmltopdf');
    var res = this.response;

    var id = this.params._id;
    var ticket = Tickets.findOne(id);

    var fs = Npm.require('fs');
    var path = process.env["PWD"] + "/public/";
    console.log(ticket.isPaypal);

    var result = HTTP.get('http://cdn.avle.fr/scripts/invoice_pdf/', {params: {id: ticket._id, lastname: ticket.lastname, firstname: ticket.firstname, isPaypal: ticket.isPaypal, email: ticket.email, school: ticket.school, phone: ticket.phone, getPdf: true}});

    wkhtmltopdf(result.content, {
        'no-outline': true,         // Make Chrome not complain
        'margin-top': 0,
        'margin-right':0,
        'margin-bottom': 0,
        'margin-left':0,

        // Default page options
        'disable-smart-shrinking': true
    })
        .pipe(res);
}, {where: 'server'});


