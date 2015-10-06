Router.configure({
    layoutTemplate: 'mainLayout'
});

// Front
Router.route('/', {
    name: 'home',
    layoutTemplate: 'noLayout',
});
Router.route('/buying', {name: 'buying'});
Router.route('/buying/payment/:_id', function () {
    this.render('payment', {
        data: function () {
            return Tickets.findOne({_id: this.params._id});
        }
    });
});
Router.route('/paymentConfirmation', {name: 'paymentConfirmation'});


// Referent
Router.route('/referent/paymentValidation', {name: 'paymentValidation'});
Router.route('/referent/registration', {name: 'registration'});
Router.route('/referent/ticketsList', {name: 'referentTicketsList'});

// Admin
Router.route('/admin', {name: 'dashboard'});
Router.route('/admin/referentsList', {name: 'referentsList'});
Router.route('/admin/ticketsList', {name: 'adminTicketsList'});
Router.route('/admin/control', {name: 'control'});
// Waiting for Meteor.user()
