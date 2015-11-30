$.fn.validator = function() {
    $(this).each(function () {
        var $element = $(this);

        var pattern = $element.data("validator");
        var regex = getRegex(pattern);

        $element.on("keyup", function(e) {
            if (!$element.val().match(regex)) {
                $element.parent().addClass("error").removeClass("success");
            } else {
                $element.parent().addClass("success").removeClass("error");
            }
        });

        var $form = $element.parents("form");

        $form.submit(function(e) {
            e.preventDefault();

            if(pattern === "dd/mm/yyyy") {
                var date = regex.exec($element.val());

                $element.val(date[3] + "-" + date[2] + "-" + date[1]);
            }
        });
    });

    function getRegex(pattern) {
        var regex = pattern
            .replace(/dd/g, "(3?[0-1]|[1-2][0-9])")
            .replace(/mm/g, "(0?[1-9]|1[0-2])")
            .replace(/yyyy/g, "([0-9]{4})")
            .replace("/", '\\/')
            .replace(/email/g, "[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$");

        return new RegExp(regex, "i");
    }
};