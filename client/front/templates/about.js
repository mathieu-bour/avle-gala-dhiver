Template.about.onRendered(function () {
    $('.social a').click(function() {
        window.open($(this).attr('href'));
        return false;
    });
});