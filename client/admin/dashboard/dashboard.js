Template.dashboard.helpers({
    ticketsCounter: function () {
        return Tickets.find().count();
    },
    paidTicketsCounter: function () {
        return Tickets.find({isPaid: true}).count();
    },
    amount: function () {
        var onlineTickets = Tickets.find({isOnline: true, isPaid: true}).count()
        var offlineTickets = Tickets.find({isOnline: false, isPaid: true}).count()
        var amount = onlineTickets * onlinePrice + offlineTickets * offlinePrice;

        return amount;
    },
    'schools': function(){
        return schools;
    }

});

Template.dashboard.events({
    'submit #create-referent': function (e) {
        e.preventDefault();

        Meteor.call('createReferent',
            $(e.target).find('[id=referent-first-name]').val(),
            $(e.target).find('[id=referent-last-name]').val(),
            $(e.target).find('[id=referent-email]').val(),
            $(e.target).find('[id=referent-phone]').val(),
            $(e.target).find('[id=referent-school]').val(),
            false
        );

        $('#create-referent')[0].reset();
    }
});


Template.dashboard.onRendered(function () {
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    Chart.defaults.global.responsive = false;
    Chart.defaults.global.maintainAspectRatio = true;

    var tickets = Tickets.find().fetch();

    /*= Stats chart =*/
    /*======================================================*/
    var intervals = [];
    var walkerDate = new Date(2015, 10, 28);
    var endInterval = new Date(2015, 11, 20);

    while (walkerDate <= endInterval) {
        intervals.push(new Date(walkerDate));
        walkerDate = walkerDate.addDays(1);
    }

    var reservedTickets = [];
    var paidTickets = [];

    for (var i = 0; i < intervals.length; i++) {
        reservedTicketsCount = Tickets.find({
            created: {
                $gte: intervals[i],
                $lt: intervals[i + 1]
            }
        }).fetch().length;

        reservedTickets.push(reservedTicketsCount);

        paidTicketsCount = Tickets.find({
            isPaid: true,
            created: {
                $gte: intervals[i],
                $lt: intervals[i + 1]
            }
        }).fetch().length;

        paidTickets.push(paidTicketsCount);
    }

    var intervalLabels = [];

    for (var j = 0; j < intervals.length; j++) {
        intervalLabels[j] = intervals[j].getDate() + "/" + (intervals[j].getMonth() + 1);
    }

    var data = {
        labels: intervalLabels,
        datasets: [
            {
                label: "Places réservées",
                fillColor: "rgba(0,150,136,0.7)",
                strokeColor: "rgba(0,150,136,1)",
                pointColor: "rgba(0,150,136,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(0,150,136,1)",
                data: reservedTickets
            },
            {
                label: "Places payées",
                fillColor: "rgba(255,87,34,0.7)",
                strokeColor: "rgba(255,87,34,1)",
                pointColor: "rgba(255,87,34,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(255,87,34,1)",
                data: paidTickets
            }
        ]
    };

    var $statsChart = $("#stats-chart");
    var statsChartWidth = $statsChart.parent().width();
    $statsChart.attr("width", statsChartWidth);
    $statsChart.attr("height", (statsChartWidth / 16) * 9);
    var statsChartContext = $("#stats-chart").get(0).getContext("2d");
    var statsChart = new Chart(statsChartContext).Line(data);
    $statsChart.css({"height": ""});


    /*= Gender chart =*/
    /*======================================================*/
    var genderChartContext = $("#gender-chart").get(0).getContext("2d");
    var genderChart = new Chart(genderChartContext).Pie([
        {
            value: Tickets.find({sexe: "Homme"}).fetch().length,
            color: "#03a9f4",
            //highlight: "#",
            label: "Hommes"
        }, {
            value: Tickets.find({sexe: "Femme"}).fetch().length,
            color: "#f44336",
            //highlight: "#",
            label: "Femmes"

        }
    ]);

    /*= Age chart =*/
    /*======================================================*/
    var ageChartContext = $("#age-chart").get(0).getContext("2d");
    var ageChart = new Chart(ageChartContext).Pie([
        {
            value: Tickets.find({birthday: {$lte: new Date(1997, 11, 20)}}).fetch().length,
            color: "#03a9f4",
            //highlight: "#",
            label: "Majeurs"
        }, {
            value: Tickets.find({birthday: {$gt: new Date(1997, 11, 20)}}).fetch().length,
            color: "#f44336",
            //highlight: "#",
            label: "Mineurs"

        }
    ]);


    /*= School chart =*/
    /*======================================================*/
    var schoolChartRawData = {};

    for (var k = 0; k < tickets.length; k++) {
        var ticketSchool = tickets[k].school;

        if(schoolChartRawData.hasOwnProperty(ticketSchool)) {
            schoolChartRawData[ticketSchool] += 1;
        } else {
            schoolChartRawData[ticketSchool] = 1;
        }
    }

    var schoolChartData = [];

    for (var school in schoolChartRawData) {
        schoolChartData.push({
            value: schoolChartRawData[school],
            color: "#03a9f4",
            //highlight: "#",
            label: school
        });
    }

    var schoolChartContext = $("#school-chart").get(0).getContext("2d");
    var schoolChart = new Chart(schoolChartContext).Doughnut(schoolChartData);


    /*= Widgets =*/
    /*======================================================*/
    // Reserved tickets widget
    var reservedTicketsCount = Tickets.find().fetch().length;
    var reservedTicketsPercentage = Math.round((reservedTicketsCount / 750) * 100 * 10) / 10;
    $("#reserved-tickets-data").data("anumb", reservedTicketsCount);
    $("#reserved-tickets-progress")
        .data("anumb", reservedTicketsPercentage)
        .text(reservedTicketsPercentage + "% de 750");

    // Paid tickets widget
    var paidTicketsCount = Tickets.find({isPaid: {$ne : false}}).fetch().length;
    var paidTicketsPercentage = Math.round((paidTicketsCount / 750) * 100 * 10) / 10;
    $("#paid-tickets-data").data("anumb", paidTicketsCount);
    $("#paid-tickets-progress")
        .data("anumb", paidTicketsPercentage)
        .text(paidTicketsPercentage + "% de 750");

    // Turnovers
    var paypalPaidTicketsCount = Tickets.find({isPaypal: {$ne: false}, isPaid: {$ne: false}}).fetch().length;
    var nonPaypalPaidTicketsCount = Tickets.find({isPaypal: false, isPaid: {$ne: false}}).fetch().length;
    var turnovers = paypalPaidTicketsCount * 10.50 + nonPaypalPaidTicketsCount * 10;
    var turnoverPercentage = Math.round(turnovers / 7500 * 100 * 10) / 10;

    $("#turnover-data").data("anumb", turnovers);
    $("#turnover-progress")
        .data("anumb", turnoverPercentage)
        .text(turnoverPercentage + "% de 7500 €");


    // Earnings
    var earnings = turnovers - ((paypalPaidTicketsCount + nonPaypalPaidTicketsCount) * 5);
    var earningsPercentage = Math.round(earnings / 3750 * 100 * 10) / 10;
    console.log(earningsPercentage);
    $("#earnings-data").data("anumb", earnings);
    $("#earnings-progress")
        .data("anumb", earningsPercentage)
        .text(earningsPercentage + "% de 3750 €");


    // Number animations
    $("*[data-aNumb]").aNumbs();
});


Template.dashboard.onCreated(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('admin') >= 0) {
            return true;
        } else if(roles.indexOf('referent') >= 0){
            Router.go('/referent/ticketsList');
        }
    }else{
        Router.go('/login');
    }
});