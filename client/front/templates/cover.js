Template.cover.helpers({
    'success': function(){
        return Session.get('success');
    },
    'error': function(){
        return Session.get('error');
    },
    'errorLink': function(){
        return Session.get("errorLink");
    },
    "isOpened": function(){
        var isOpenened =  Session.get('isOpened');

        var event = Events.findOne();
        var open = moment(event.openDate, "DD/MM/YYYY HH:mm");
        var now = moment();
        var delta = open.diff(now);

        return (delta > 0);
    }
});

Template.cover.events({
    "click #goToEvent": function(e){
        e.preventDefault();

        /**
         * Hide the cover
         */
        var coverAnimationDuration = 1200;
        var wHeight = $(window).height();

        $("#cover").animate({
            top: -wHeight,
            bottom: wHeight,
            opacity: 0
        }, {
            duration: coverAnimationDuration,
            easing: "easeInQuart"
        }).addClass("cover-hidden");

        $(window).scrollTo("#event", 800);
    }
});

Template.cover.rendered = function () {
    $('#goToEvent').bind( "touchstart",function(e){
        $(window).scrollTo("#event", 800);
    });
};
