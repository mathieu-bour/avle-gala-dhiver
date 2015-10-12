// Prices
onlinePrice = 10;
offlinePrice = 12;

moment.locale('fr', {
    months : "janvier_f�vrier_mars_avril_mai_juin_juillet_ao�t_septembre_octobre_novembre_d�cembre".split("_"),
    monthsShort : "janv._f�vr._mars_avr._mai_juin_juil._ao�t_sept._oct._nov._d�c.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui �] LT",
        nextDay: '[Demain �] LT',
        nextWeek: 'dddd [�] LT',
        lastDay: '[Hier �] LT',
        lastWeek: 'dddd [dernier �] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une ann�e",
        yy : "%d ann�es"
    },
    ordinalParse : /\d{1,2}(er|�me)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : '�me');
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
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

if (Meteor.isClient) {
    Template.registerHelper("appropriateStylesheet", function() {
        console.log(Router.current().route.getName());
        return whichStylesheet;
    });
}