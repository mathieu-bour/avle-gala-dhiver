(function (window, document, $) {
    var init = function () {
        /* SPARKLINES
         * =======================================*/
        var $widgetGraphs = $(".widget-graph");

        $widgetGraphs.each(function () {
            var $graph = $(this);
            var barWidth = $graph.width() / 7;

            $graph.sparkline("html", {
                enableTagOptions: true,
                type: "bar",
                width: "100%",
                height: "100%",
                barWidth: barWidth,
                fillColor: false,
                barColor: "#dddddd",
                chartRangeMin: 0
            });

        });


        /* CHART.JS
         * =======================================*/
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Annonces",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "Commentaires",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var ctx = $("#stats-chart").get(0).getContext("2d");
        var myNewChart = new Chart(ctx).Bar(data, {
            scaleFontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        });
    };

    init();
})(window, document, jQuery);