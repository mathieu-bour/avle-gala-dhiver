Template.referentsList.helpers({
    referents: function () {
        console.log(dataTableData());
        return dataTableData;
    }
});

/*Template.referentsList.onRendered(function () {
    if(Meteor.user() !== null) {
        var roles = Meteor.user().profile.roles;
        if (roles.indexOf('referent') >= 0) {
            return true;
        } else {
            Router.go('/');
        }
    }else{
        Router.go('/');
    }
});*/