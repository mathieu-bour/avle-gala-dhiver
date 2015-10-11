dataTableData = function () {
    return Meteor.users.find().fetch(); // or .map()
};

Template.referentsList.helpers({
    referents: function () {
        console.log(dataTableData());
        return dataTableData;
    }
});