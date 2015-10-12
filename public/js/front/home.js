(function(window, document, $) {
    /*======================================================*/
    /*= COUNTDOWN =*/
    /*======================================================*/
    var end = new Date("2015/11/22 10:00:00");

    // Values in ms
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    // Update countdown at every second
    setInterval(function () {
        var now = new Date();
        var interval = parseInt(end - now);

        if (interval <= 0) return; // Negativ value, it is the end of the countdown, cancel

        // Interval values
        var days = parseInt(interval / day);
        interval -= days * day;

        var hours = parseInt(interval / hour);
        interval -= hours * hour;

        var minutes = parseInt(interval / minute);
        interval -= minutes * minute;

        var seconds = parseInt(interval / second);

        // Set values in the countdown
        $("#countdown-days").text(days);
        $("#countdown-hours").text((hours < 10 ? "0" : "") + hours);
        $("#countdown-minutes").text((minutes < 10 ? "0" : "") + minutes);
        $("#countdown-seconds").text((seconds < 10 ? "0" : "") + seconds);

        $("#countdown-days-label").text("jour" + (days > 1 ? "s" : ""));
        $("#countdown-hours-label").text("heure" + (hours > 1 ? "s" : ""));
        $("#countdown-minutes-label").text("minute" + (minutes > 1 ? "s" : ""));
        $("#countdown-seconds-label").text("seconde" + (seconds > 1 ? "s" : ""));
    }, 1000);

    /*======================================================*/
    /*= SCROLL COVER =*/
    /*======================================================*/
    var coverAnimationDuration = 1200;

    var lastScroll = 0;
    $(window).scroll(function(event) {
        var currentScroll = $(window).scrollTop();

        /*if(lastScroll == 0 && !$("#cover").hasClass("cover-hidden")) {
            hideCover();
        } else if(lastScroll == 0 && currentScroll == 0 && $("#cover").hasClass("cover-hidden")) {
            showCover();
        }*/

        lastScroll = currentScroll;
    });

    /**
     * Hide the cover
     */
    var hideCover = function() {
        var wHeight = $(window).height();

        $(window).scrollTop(0);

        $("#cover").animate({
            top: -wHeight,
            bottom: wHeight,
            opacity: 0
        }, {
            duration: coverAnimationDuration,
            easing: "easeInQuart"
        }).addClass("cover-hidden");
    };

    /**
     * Display the cover
     */
    var showCover = function() {
        $(window).scrollTop(0);

        $("#cover").animate({
            top: 0,
            bottom: 0,
            opacity: 1
        }, {
            duration: coverAnimationDuration
        }).removeClass("cover-hidden");
    };

    $(window).load(function() {
        // Preloader
        setTimeout(function() {
            $("#preloader-handler").fadeOut(500);
        }, 1000);
    });

})(window, window.document, jQuery);