/**
 * home.js
 * ==
 *
 * Handle homepage rendering and events
 *
 * @author Mathieu Bour
 * @version 1.0
 */

/**
 * On render
 */
Template.home.rendered = function () {
    /*= COUNTDOWN =*/
    /*======================================================*/
    var end = new Date("2015/12/02 19:00:00");

    // Values in ms
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    // Update countdown at every second
    setInterval(function () {
        var now = new Date();
        var interval = parseInt(end - now);

        if (interval <= 0) return; // Negative value, it is the end of the countdown, cancel

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

    /*= SCROLL COVER =*/
    /*======================================================*/
    var coverAnimationDuration = 1200;

    $(window).bind("mousewheel", function(event) {
        var $cover = $("#cover");
        if (event.originalEvent.wheelDelta < 0 && $(window).scrollTop() == 0 && !$cover.hasClass("cover-hidden")) {
            hideCover();
            return false;
        }
        else if(event.originalEvent.wheelDelta >= 0 && $(window).scrollTop() == 0 && $cover.hasClass("cover-hidden")) {
            showCover();
            return false;
        }
    });

    /**
     * Hide the cover
     */
    var hideCover = function () {
        var wHeight = $(window).height();

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
    var showCover = function () {
        $("#cover").animate({
            top: 0,
            bottom: 0,
            opacity: 1
        }, {
            duration: coverAnimationDuration
        }).removeClass("cover-hidden");
    };

    // Preloader
    setTimeout(function () {
        $("#preloader-handler").fadeOut(500);
    }, 1000);

    /*= Google Maps =*/
    /*======================================================*/
    // Enable map interaction on click
    $(".map").click(function () {
        $(this).find("iframe").css("pointer-events", "auto");
    });

    if(isMobile()) {
        $("body").css({"padding-top": $(window).height() });
    }
};


/**
 * @returns {boolean} If the device is a mobile
 */
function isMobile() {
    return $(window).width() <= 768;
}