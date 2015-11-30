TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Tickets = new Tabular.Table({
    name: "Tickets",
    responsive: true,
    collection: Tickets,
    columns: [
        {data: "uuid", title: "UUID"},
        {data: "firstname", title: "Prénom"},
        {data: "lastname", title: "Nom"},
        {
            data: "birthday",
            title: "Date de naissance",
            render: function(value, type, doc) {
                return moment(value).format("DD/MM/YYYY");
            }
        },
        {data: "phone", title: "Téléphone"},
        {data: "email", title: "E-mail"},
        {data: "school", title: "Etablissement"},
        {
            data: "isPaid",
            title: "Payment",
            render: function(value, type, doc) {
                var ticket = Tickets.findOne(doc._id);
                if(!value) {
                    return "Non payé";
                } else if(value && ticket.isPaypal) {

                    return 'PayPal le ' + moment(value).format("DD/MM/YYYY") + '<br><a href="/invoice/' + doc._id + '">Voir la facture</a>';
                }else if(value && !ticket.isPaypal) {

                    return 'Référent le ' + moment(value).format("DD/MM/YYYY") + '<br><a href="/invoice/' + doc._id + '">Voir la facture</a>';
                }
            }
        },
        {
            data: "created",
            title: "Ajouté le",
            render: function(value, type, doc) {
                return moment(value).format("DD/MM/YYYY");
            }
        },
        {
            title: "Actions",
            tmpl: Meteor.isClient && Template.ticketsActionsCell,
            tmplContext: function (rowData) {
                ticket = Tickets.findOne(rowData._id)
                return ticket;
            }
        }

    ],
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
        "sSwfPath": "/swf/copy_csv_xls_pdf.swf",
        "aButtons": ["copy", "pdf", "xls"]
    }
});

TabularTables.ReferentTickets = new Tabular.Table({
    name: "Tickets",
    responsive: true,
    collection: Tickets,
    columns: [
        {data: "firstname", title: "Prénom"},
        {data: "lastname", title: "Nom"},
        {
            data: "birthday",
            title: "Date de naissance",
            render: function(value, type, doc) {
                return moment(value).format("DD/MM/YYYY");
            }
        },
        {data: "phone", title: "Téléphone"},
        {data: "email", title: "E-mail"},
        {data: "school", title: "Etablissement"},
        {
            title: "Actions",
            tmpl: Meteor.isClient && Template.ticketsActionsCell,
            tmplContext: function (rowData) {
                ticket = Tickets.findOne(rowData._id)
                return ticket;
            }
        }

    ],
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
        "sSwfPath": "/swf/copy_csv_xls_pdf.swf",
        "aButtons": ["copy", "pdf", "xls"]
    }
});

TabularTables.Referents = new Tabular.Table({
    name: "Référents",
    responsive: true,
    collection: Meteor.users,
    columns: [
        {data: "profile.firstname", title: "Prénom"},
        {data: "profile.lastname", title: "Nom"},
        {data: "emails.[0].address", title: "E-mail"},
        {data: "profile.phone", title: "Télépone"},
        {data: "profile.school", title: "Etablissement"},
        {
            title: 'Tickets vendus',
            render: function(data, type, doc){
                var soldTickets = Tickets.find({validatorId: doc._id}).fetch().length;

                return soldTickets;
            }
        },
        {
            title: 'Somme due',
            render: function(data, type, doc){
                var soldTickets = Tickets.find({validatorId: doc._id}).fetch().length;
                var given = Given.findOne({referent_id: doc._id});
                if(given){
                    return soldTickets * 10 - given.given + '€';
                }else {
                    return soldTickets * 10 + '€';
                }
            }
        },
        {
            title: 'Somme donnée',
            render: function(data, type, doc){
                var given = Given.findOne({referent_id: doc._id});
                if(given){
                    return given.given + '€';
                }else{
                    return '0€';
                }
            }
        },
        {
            title: "Action",
            tmpl: Meteor.isClient && Template.referentsActionCell,
            tmplContext: function (rowData) {
                user = Meteor.users.findOne(rowData._id);
                return user;
            }
        }

    ],
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
        "sSwfPath": "/swf/copy_csv_xls_pdf.swf",
        "aButtons": ["copy", "pdf", "xls"]
    }
});

/*= Checkpoint Table =*/
/*======================================================*/
TabularTables.TicketsCheckpoint = new Tabular.Table({
    name: "Contrôle",
    responsive: true,
    collection: Tickets,
    selector: function () {
        return {isChecked: {$ne: false}};
    },
    columns: [
        {data: "uuid", title: "Code invité"},
        {data: "firstname", title: "Prénom"},
        {data: "lastname", title: "Nom"},
        {
            data: "birthday",
            title: "Date de naissance",
            render: function(value, type, doc) {
                return moment(value).format("DD/MM/YYYY");
            }
        },
        {
            data: "isChecked",
            title: "Heure de passage",
            render: function(value, type, doc) {
                return moment(value).format("HH:mm");
            }
        },
        {
            title: "Actions",
            tmpl: Meteor.isClient && Template.checkpointActionCell,
            tmplContext: function (rowData) {
                ticket = Tickets.findOne(rowData._id)
                return ticket;
            }
        }
    ],
    order: [4, "desc"]
});


TabularTables.TicketsSearch = new Tabular.Table({
    name: "Recherche du ticket",
    responsive: true,
    collection: Tickets,
    columns: [
        {data: "uuid", title: "Code invité"},
        {data: "firstname", title: "Prénom"},
        {data: "lastname", title: "Nom"},
        {
            data: "birthday",
            title: "Date de naissance",
            render: function(value, type, doc) {
                return moment(value).format("DD/MM/YYYY");
            }
        },
        {
            data: "isPaid",
            title: "Heure de passage",
            render: function(value, type, doc) {
                if(!value) {
                    return '<span class="label label-danger">Impayé</span>';
                } else {
                    return moment(value).format("DD/MM/YYYY HH:mm");
                }
            }
        },
        {
            data: "isChecked",
            title: "Heure de passage",
            render: function(value, type, doc) {
                if(!value) {
                    return "Non contrôlée";
                } else {
                    return moment(value).format("HH:mm");
                }
            }
        },
        {
            title: "Actions",
            tmpl: Meteor.isClient && Template.checkpointActionCell,
            tmplContext: function (rowData) {
                ticket = Tickets.findOne(rowData._id)
                return ticket;
            }
        }
    ],
    order: [2, "desc"]
});

TabularTables.Newsletter = new Tabular.Table({
    name: "Newsletter ",
    responsive: true,
    collection: Newsletter,
    columns: [
        {data: "mail", title: "Email"}
    ]
});