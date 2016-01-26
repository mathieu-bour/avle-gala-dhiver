Router.route('/ticket/:_id', function () {
    var wkhtmltopdf = Npm.require('wkhtmltopdf');
    var res = this.response;

    var id = this.params._id;
    var ticket = Tickets.findOne(id);


    var result = HTTP.get('http://cdn.avle.fr/scripts/ticket_pdf/', {params: {
        '_id': ticket._id,
        'lastname': ticket.lastname,
        'firstname': ticket.firstname,
        'phone': ticket.phone,
        'school': ticket.school,
        'isPaypal': ticket.isPaypal,
        'sexe': ticket.sexe,
        'getPdf': false,
        'email': ticket.email,
        'id': ticket.uuid,
        'isForbach': false,
        'creationDate': moment(ticket.isPaid).format("DD/MM/YYYY"),
        'paymentDate': moment(ticket.isPaid).format("DD/MM/YYYY"),
        getPdf: true
    }});

    wkhtmltopdf(result.content)
        .pipe(res);
}, {where: 'server'});

/*Router.route('/invoice/:_id', function () {
    var wkhtmltopdf = Npm.require('wkhtmltopdf');
    var res = this.response;

    var id = this.params._id;
    var ticket = Tickets.findOne(id);

    var result = HTTP.get('http:/scripts/invoice_pdf/', {params: {id: ticket._id, lastname: ticket.lastname, firstname: ticket.firstname, isPaypal: ticket.isPaypal, email: ticket.email, school: ticket.school, phone: ticket.phone, getPdf: true}});

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
}, {where: 'server'});*/
