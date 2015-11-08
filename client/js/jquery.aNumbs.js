/**
 * jquery.aNumbs.js
 * ==
 *
 * Simple plugin to animate numbers and progress bars.
 *
 * @author Mathieu Bour
 * @version 1.0
 */
$.fn.aNumbs = function() {
    $(this).each(function() {
        var duration = 400;
        var $item = $(this);

        var value = parseInt($item.data("anumb"));
        var type = $item.data("anumb-type");
        var append = $item.data("anumb-append");

        switch(type) {
            case "number": {
                var i = 0;
                var counter = setInterval(function() {
                    if(i == 100) {
                        clearInterval(counter);
                    }

                    $item.text(Math.floor((value / 100) * i) + (append != null ? append : ""));
                    i++;
                }, duration / 100);
                break;
            }
            case "width": {
                if(value > 100) {
                    value = 100;
                }

                $item.animate({
                    width: value + "%"
                }, 400);
            }
        }
    });
};