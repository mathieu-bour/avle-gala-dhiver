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
var open = moment("10/12/2015 20:00", "DD/MM/YYYY HH:mm");
var close = moment("11/12/2015 22:00", "DD/MM/YYYY HH:mm");
var now = moment();

var deltaClose = close.diff(now);
var delta = open.diff(now);

if(deltaClose <= 0){
    Router.route("/buy", {
        name: "buy",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            if(query.code){
                return query;
            }
            else
            {
                Session.set("error", "Nous sommes désolés mais la billeterie est actuellement fermée.");
                Router.go('/');
            }


        }
    });

    Router.route("/buy/payment", {
        name: "payment",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            if(query.code){
                return query;
            }
            else
            {
                Session.set("error", "Nous sommes désolés mais la billeterie est actuellement fermée.");
                Router.go('/');
            }

        }
    });

    Router.route("/buy/payment/validate", {
        name: "validate",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;
            if(query.token){
                return query;
            }else{
                Router.go('/');
            }
        }
    });
    Router.route("/buy/payment/canceled", {
        name: "canceled",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            return query;
        }
    });
}
else if(delta <= 0) {
    Router.route("/buy", {
        name: "buy",
        link: stylesheets.front,
        data: function () {
            var ticketsNb = Tickets.find().count();
            var query = this.params.query;

            if(query.code){
                return query;
            }
            else if(ticketsNb < 850){
                return true
            }
            else
            {
                Session.set("error", "Nous sommes désolés mais il n'y a plus de places disponibles pour le Gala d'hiver.")
                Router.go('/');
            }

        }
    });
    Router.route("/buy/payment", {
        name: "payment",
        link: stylesheets.front,
        data: function () {
            var ticketsNb = Tickets.find().count();
            var query = this.params.query;

            if(query.code){
                return query;
            }
            else if(ticketsNb < 850){
                return query
            }
            else
            {
                Session.set("error", "Nous sommes désolés mais il n'y a plus de places disponibles pour le Gala d'hiver.")
                Router.go('/');
            }

        }
    });
    Router.route("/buy/payment/validate", {
        name: "validate",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            return query;
        }
    });

}else{
    Router.route("/buy", {
        name: "buy",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            if(query.code){
                return query;
            }else{
                Router.go('/');
            }

        }
    });
    Router.route("/buy/payment", {
        name: "payment",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            if(query.id && query.code){
                return Tickets.findOne(query.id);
            }else{
                Router.go('/');
            }

        }
    });
    Router.route("/buy/payment/validate", {
        name: "validate",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;
            if(query.token){
                return query;
            }else{
                Router.go('/');
            }
        }
    });
    Router.route("/buy/payment/canceled", {
        name: "canceled",
        link: stylesheets.front,
        data: function () {
            var query = this.params.query;

            return query;
        }
    });

    /*Router.route("/buy", {
        name: "maintenance",
        link: stylesheets.front
    });*/
}

Router.route("/check", {
    name: "check",
    link: stylesheets.front
});

/*= Secure access page =*/
/*======================================================*/
Router.route("/secureAccess", {
    name: "securePage",
    layoutTemplate: "centered",
    link: stylesheets.front
});

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

Router.route("/referent", {
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
});
Router.route("/admin/newsletter", {
    name: "newsletter",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
Router.route("/admin/codesList", {
    name: "generateCode",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
Router.route("/admin/addTicket", {
    name: "addTicket",
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

/*= Superadmin =*/
/*======================================================*/
Router.route("/superAdmin/createAdmin", {
    name: "createAdmin",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
Router.route("/superAdmin/exportTicketsList", {
    name: "exportTicketsList",
    link: stylesheets.admin,
    layoutTemplate: "adminLayout"
});
