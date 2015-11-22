/*= Default options =*/
/*======================================================*/
Router.configure({
    layoutTemplate: "noLayout",
    loadingTemplate: 'loading',
    notFoundTemplate: "notFound",
    waitOn: function() { return Meteor.subscribe("tickets") && Meteor.subscribe('allUsers'); }
});

var cdn = Meteor.settings.public.local ? "" : "//cdn.avle.fr";

/*= CSS configuration =*/
/*======================================================*/
var stylesheets = {
    front: {
        common: {
            href: cdn + "/css/common.css",
            rel: "stylesheet"
        },
        frontMobile:  {
            href: cdn + "/css/front.mobile.css",
            rel: "stylesheet"
        },
        front:  {
            href: cdn + "/css/front.css",
            rel: "stylesheet"
        }
    },
    admin: {
        common: {
            href: cdn + "/css/common.css",
            rel: "stylesheet"
        },
        adminMobile:  {
            href: cdn + "/css/admin.mobile.css",
            rel: "stylesheet"
        },
        admin:  {
            href: cdn + "/css/admin.css",
            rel: "stylesheet"
        }
    },
    checkpoint: {
        common: {
            href: cdn + "/css/common.css",
            rel: "stylesheet"
        },
        admin:  {
            href: cdn + "/css/checkpoint.css",
            rel: "stylesheet"
        }
    }
};


/*= Routes =*/
/*======================================================*/

/*= Front-end =*/
/*======================================================*/
// Homepage
Router.route("/", {
    name: "home",
    link: stylesheets.front
});


// Countdown before opening
var open = moment("02/12/2015 19:00", "DD/MM/YYYY HH:mm");
var now = moment();
var delta = open.diff(now);

if(delta <= 0) {
    Router.route("/buy", {
        name: "buy",
        link: stylesheets.front
    });
    Router.route("buy/payment", {
        name: "payment",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            if(query.id){
                return Tickets.findOne(query.id);
            }else{
                Router.go('/');
            }

        }
    });
    Router.route("buy/payment/validate", {
        name: "validate",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            return query;
        }
    });
}

/*= Login page =*/
/*======================================================*/
Router.route("/paymentConfirmation", {name: "paymentConfirmation"});
Router.route("/login", {
    name: "login",
    layoutTemplate: "centered",
    link: stylesheets.front
});

/*= Referent =*/
/*======================================================*/

Router.route("/referent/ticketsList", {
    name: "referentTicketsList",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});


/*= Admin =*/
/*======================================================*/
Router.route("/admin", {
    name: "dashboard",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
Router.route("/admin/referentsList", {
    name: "referentsList",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
Router.route("/admin/ticketsList", {
    name: "adminTicketsList",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});Router.route("/admin/newsletter", {
    name: "newsletter",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});

/*= Checkpoint =*/
/*======================================================*/
Router.route("/admin/checkpoint", {
    name: "checkpoint",
    layoutTemplate: "noLayout",
    link: stylesheets.checkpoint
});
