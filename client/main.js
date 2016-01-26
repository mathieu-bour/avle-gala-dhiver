// Prices
onlinePrice = 10;
offlinePrice = 12;

schools= {
    'lycees': [
        "Lycée Henri Poincaré",
        "Lycée Jeanne d'Arc",
        "Lycée Frédéric Chopin",
        "Lycée Henri Loritz",
        "Lycée Stanislas",
        "Lycée Arthur Varoquaux",
        "Lycée Georges de la Tour",
        "Lycée Saint-Sigisbert",
        "Lycée Jacques Callot",
        "Lycée Saint-Dominique",
        "Lycée Charles de Foucauld",
        "Lycée Marie Marvingt",
        "Lycée Ernest Bichat"
    ],
    "cpge": [
        "CPGE Lycée Henri Poincaré",
        "CPGE Lycée Frédéric Chopin",
        "CPGE Lycée Saint-Sigisbert",
        "CPGE Lycée Henri Lorz",
        "Autre CPGE"
    ],
    'universite': [
        "Faculté",
        "DUT"
    ],
    "autre": [
        "CAP",
        "BTS",
        "Autre"
    ]
};

moment.locale('fr', {
    months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays: "Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),
    weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY LT",
        LLLL: "dddd D MMMM YYYY LT"
    },
    calendar: {
        sameDay: "[Aujourd'hui �] LT",
        nextDay: '[Demain �] LT',
        nextWeek: 'dddd [�] LT',
        lastDay: '[Hier �] LT',
        lastWeek: 'dddd [dernier �] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: "dans %s",
        past: "il y a %s",
        s: "quelques secondes",
        m: "une minute",
        mm: "%d minutes",
        h: "une heure",
        hh: "%d heures",
        d: "un jour",
        dd: "%d jours",
        M: "un mois",
        MM: "%d mois",
        y: "une ann�e",
        yy: "%d ann�es"
    },
    ordinalParse: /\d{1,2}(er|ème)/,
    ordinal: function (number) {
        return number + (number === 1 ? 'er' : '');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
});

Template.registerHelper('isAdmin', function () {
    if (Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false
    }
});

Template.registerHelper('isReferent', function () {
    if (Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;

        if (roles.indexOf('referent') >= 0) {
            return true;
        } else {
            return false
        }
    } else {
        return false
    }
});

Template.registerHelper('isSuperAdmin', function () {
    if (Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;

        if (roles.indexOf('superAdmin') >= 0) {
            return true;
        } else {
            return false
        }
    } else {
        return false
    }
});