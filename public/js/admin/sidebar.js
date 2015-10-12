;(function($) {
    "use strict";

    /* SIDEBAR MENU
     * =======================================*/
    var $links = $(".sidebar-nav-item.has-children > a");

    $links.on("click", function(e) {
        e.preventDefault();

        var $li = $(this).parent();
        var $sub = $li.find(".sub");

        if($li.hasClass("open")) {
            $sub.slideUp(100);
            $li.removeClass("open");
        } else {
            var $open = $(".sidebar-nav-item.has-children.open");

            if($open.length > 0) {
                $open.find(".sub").slideUp(100);
                $open.removeClass("open");
            }

            $li.addClass("open");
            $sub.slideDown(100);
        }
    });
})(jQuery);