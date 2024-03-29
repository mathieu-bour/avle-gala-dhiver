(function () {
    "use strict";

    Accounts.urls.resetPassword = function (token) {
        return Meteor.absoluteUrl('/#/reset-password/' + token);
    };

    Accounts.urls.verifyEmail = function (token) {
        return Meteor.absoluteUrl('/#/verify-email/' + token);
    };

    Accounts.urls.enrollAccount = function (token) {
        return Meteor.absoluteUrl('/#/enroll-account/' + token);
    };

})();

/*= Mail configuration =*/
/*======================================================*/
process.env.MAIL_URL="smtp://contact@avle.fr:Fabert57@server.point-blank.fr:587";
Accounts.emailTemplates.siteName = "Gala d'hiver | A.V.L.E";
Accounts.emailTemplates.from = "A.V.L.E <noreply@avle.fr>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Bien le bonjour " + user.profile.firstname + "!";
};

PrettyEmail.defaults.enrollAccount = {
    heading: 'Tu as maintenant accès à l\'espace référent du site de l\'A.V.L.E !',
    buttonText: 'Changer mon mot de passe'
};

PrettyEmail.options = {
    from: 'A.V.L.E <noreply@avle.fr>',
    logoUrl: 'http://cdn.avle.fr/img/logo_2.png',
    companyName: 'A.V.L.E',
    companyUrl: 'http://avle.fr',
    companyEmail: 'contact@avle.fr',
    siteName: 'A.V.L.E',
}



/*= Initial admin generation =*/
/*======================================================*/
/*var users = [
    {lastname:"DELLINGER", firstname: "Ladislas", school: "CPGE Fabert - PCSI", phone: '0634548226', email:"ladislas14@gmail.com",roles:['superAdmin', 'admin', 'referent']},
];

_.each(users, function (user) {
    var id;

    id = Accounts.createUser({
        email: user.email,
        password: "test",
        profile: {
            lastname: user.lastname,
            firstname: user.firstname,
            school: user.school,
            phone: user.phone,
            roles: user.roles
        }
    });

    //Accounts.sendEnrollmentEmail(id);

});

/*= Meteor server methods =*/
/*======================================================*/
Meteor.methods({
    /**
     * Send an email through Sendgrid
     * @param {object} options Options object from Sendgrid (cf tutorial)
     * @param {string} options.to
     * @param {string} options.from
     * @param {string} options.subject
     * @param {string} options.html
     * @returns {err|json} if err is true, return err and json, else return json
     * @tutorial https://github.com/sendgrid/sendgrid-nodejs
     */
    sendEmail: function (options) {
        var sendgrid = Npm.require('sendgrid')('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');
        var email     = new sendgrid.Email(options);

        sendgrid.send(email, function(err, json) {
            if (err) { return err; }
            return json;
        });
    },

    /**
     * Create a new referent (method called from client)
     * @param {string} firstname
     * @param {string} lastname
     * @param {string} mail
     * @param {string} phone
     * @param {string} school
     * @param {boolean} createAdmin
     */
    createReferent: function(firstname,lastname,mail,phone,school, createAdmin){
        if(createAdmin == true){
            id = Accounts.createUser({
                email: mail,
                profile: {
                    lastname: lastname,
                    firstname: firstname,
                    school: school,
                    phone: phone,
                    roles: ['admin', 'referent']
                }
            });
        }else{
            id = Accounts.createUser({
                email: mail,
                profile: {
                    lastname: lastname,
                    firstname: firstname,
                    school: school,
                    phone: phone,
                    roles: ['referent']
                }
            });
        }

        Accounts.sendEnrollmentEmail(id);
    },

    /**
     * Add private code to referent
     * @param {string} privateCode
     */
    'addPrivateCode': function(userId, privateCode){
        var user = Meteor.users.findOne(userId);

        Meteor.users.update({_id: user._id}, {$set: {"profile.code": privateCode}});
    },

    /**
     * Update ticket with paypal infos
     *
     */
    'updateTicket': function(id, correlationId){
        Tickets.update(id, {$set: {isPaid: new Date(), isPaypal: new Date(), correlationId: correlationId}});
    },

    /**
     * SetExpressCheckout method from PaypalEC API: init checkout
     * @param {string} id from the ticket (used as invoice number)
     * @returns {string|Meteor.Error()} throw new error if error is true, else return url of PaypalEC page
     */
    'setExpressCheckout': function(id){
        console.log("called");
        console.log(id);
        try {
            // fill in the blanks here with params, timeout, etc.
            var result = HTTP.get('http://cdn.avle.fr/scripts/paypal-ec-php/',{params: {id: id, action: 'SetExpressCheckout'}});
            content = result.content;
            var token = content.split("&")[0];
            token = token.split("=")[1];
            console.log(result.content);

            var url = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + token;
        } catch (_error) {
            throw new Meteor.Error("No Result", "Failed to fetch...");
        }

        return url;
    },

    /**
     * GetExpressCheckoutDetails method fom PaypalEC API: get details from checkout
     * @param {string} token return by PaypalEC page
     * @returns {object|Meteor.Error()} throw new error if error is true, else return content_json (Checkout details)
     */
    'getExpressCheckoutDetails': function(token){
        try {
            // fill in the blanks here with params, timeout, etc.
            var result = HTTP.get('http://cdn.avle.fr/scripts/paypal-ec-php/',{params: {token: token, action: 'GetExpressCheckoutDetails'}});
            content = result.content;
            content = content.split('&');
            content_json = {};
            for (var i = content.length - 1; i >= 0; i--) {
                item = content[i].split("=");
                content_json[item[0]] = decodeURIComponent(item[1]);
            };
            return content_json;
        } catch (_error) {
            throw new Meteor.Error("No Result", "Failed to fetch...");
        }
    },

    /**
     * DoExpressCheckoutPayment method from PaypalEC API: process to payment
     * @param {string} token return by PaypalEC page
     * @param {string} payerID return by PaypalEC page
     * returns {object|Meteor.Error()} content_json (Checkout result) if no error, else throw new error
     */
    'doExpressCheckoutPayment': function(token, payerID){
        try {
            // fill in the blanks here with params, timeout, etc.
            var result = HTTP.get('http://cdn.avle.fr/scripts/paypal-ec-php/',{params: {token: token, PayerID: payerID, action: 'DoExpressCheckoutPayment'}});
            content = result.content;
            content = content.split('&');
            content_json = {};
            for (var i = content.length - 1; i >= 0; i--) {
                item = content[i].split("=");
                content_json[item[0]] = decodeURIComponent(item[1]);
            };
            return content_json;
        } catch (_error) {
            throw new Meteor.Error("No Result", "Failed to fetch...");
        }
    },

    /**
     * Return params from url
     * @param {string} query to parse
     * @return {object} object of params
     */
    'getParams': function(query){
        query = query.split('?');
        query = query[1];
        query= query.split('&');

        query_json = {};
        for (var i = query.length - 1; i >= 0; i--) {
            item = query[i].split("=");
            query_json[item[0]] = decodeURIComponent(item[1]);
        };
        return query_json;
    },

    /**
    * Generate a unique ID for a new ticket
    * @param {int} length of UUID
    * @return {string} uuid
    */
    'generateUUID': function(length){
        var str = "";
        for(i=0;i<length;i++){
            str = "x" + str;
        }
        var d = new Date().getTime();
        var uuid = str.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;

    },

    /**
     * Update number of validations for a code
     * @param {string} id
     */
    'updateValidations': function(id){
        var code = Codes.findOne(id);
        console.log(code);
        var validations = code.validations + 1;

        Codes.update(code._id, {$set: {validations: validations}});
    },

    /*= The following functions are obsolete. Everything is done in php scripts =*/
    /*======================================================*/

    /**
     * Save invoice as pdf in ./uploads/invoices folder
     * @param {string} id from ticket
     * @returns {boolean} true
     */
    'saveInvoice': function(id){
        var wkhtmltopdf = Npm.require('wkhtmltopdf');
        var ticket = Tickets.findOne(id);

        var fs = Npm.require('fs');
        var path = process.env["PWD"];

        var result = HTTP.get('/scripts/invoice_pdf/', {params: {id: ticket.uuid, lastname: ticket.lastname, firstname: ticket.firstname, isPaypal: ticket.isPaypal, email: ticket.email, school: ticket.school, phone: ticket.phone}});

        try {
            // Query the entry
            stats = fs.lstatSync(path + '/uploads/invoices/invoice_' + id + '.pdf');

            // Is it a directory?
            if (stats.isFile()) {
                return true
            }
        }
        catch (e) {
            wkhtmltopdf(result.content, {
                'no-outline': true,         // Make Chrome not complain
                'margin-top': 0,
                'margin-right':0,
                'margin-bottom': 0,
                'margin-left':0,

                // Default page options
                'disable-smart-shrinking': true
            }).pipe(fs.createWriteStream(path + '/uploads/invoices/invoice_' + id + '.pdf'));

            return true;
        }
    },

    /**
     * Save invoice as pdf in ./uploads/tickets folder
     * @param {string} id of the ticket
     * @returns {boolean} true
     */
    'saveTicket': function(id){
        var wkhtmltopdf = Npm.require('wkhtmltopdf');
        var ticket = Tickets.findOne(id);

        var fs = Npm.require('fs');
        var path = process.env["PWD"];

        var result = HTTP.get('/scripts/ticket_pdf/', {params: {id: ticket.uuid, lastname: ticket.lastname, firstname: ticket.firstname, sexe: ticket.sexe}});

        try {
            // Query the entry
            stats = fs.lstatSync(path + '/uploads/tickets/ticket_' + id + '.pdf');

            // Is it a directory?
            if (stats.isFile()) {
                return true
            }
        }
        catch (e) {
            wkhtmltopdf(result.content, {
                'no-outline': true,         // Make Chrome not complain
                'margin-top': 0,
                'margin-right':0,
                'margin-bottom': 0,
                'margin-left':0,

                // Default page options
                'disable-smart-shrinking': true
            }).pipe(fs.createWriteStream(path + '/uploads/tickets/ticket_' + id + '.pdf'));

            return true;
        }
    },

    /**
     * Send the invoice to the client
     * @param {object} options Options object from Sendgrid (cf tutorial)
     * @param {string} options.to
     * @param {string} options.from
     * @param {string} options.subject
     * @param {string} options.html
     * @returns {err|json} if err is true, return err and json, else return json
     * @tutorial https://github.com/sendgrid/sendgrid-nodejs
     *
     * @id {string} id of the ticket
     */
    sendInvoice: function(options, id){
        Meteor.setTimeout(function(){
            var sendgrid = Npm.require('sendgrid')('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');
            var email     = new sendgrid.Email(options);

            var path = process.env["PWD"];

            email.addFile({
                filename:'invoice_' + id + '.pdf',
                path: path + '/uploads/invoices/invoice_' + id + '.pdf'
            });

            sendgrid.send(email, function(err, json) {
                if (err) { return console.error(err); }
                console.log(json);
            });
        }, 10000);
    },

    /**
     * Send the ticket to the client
     * @param {object} options Options object from Sendgrid (cf tutorial)
     * @param {string} options.to
     * @param {string} options.from
     * @param {string} options.subject
     * @param {string} options.html
     * @returns {err|json} if err is true, return err and json, else return json
     * @tutorial https://github.com/sendgrid/sendgrid-nodejs
     *
     * @id {string} id of the ticket
     */
    sendTicket: function(options, id){
        Meteor.setTimeout(function(){
            var sendgrid = Npm.require('sendgrid')('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');
            var email     = new sendgrid.Email(options);

            var path = process.env["PWD"];

            email.addFile({
                filename:'ticket_' + id + '.pdf',
                path: path + '/uploads/tickets/ticket_' + id + '.pdf'
            });

            sendgrid.send(email, function(err, json) {
                if (err) { return console.error(err); }
                console.log(json);
            });
        }, 5000)

    }
});

/*= Send notify mail on D-Day =*/
/*======================================================*/
// TODO Send newsletter on dday (and just one time)