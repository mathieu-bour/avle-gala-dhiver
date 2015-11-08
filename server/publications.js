/**
 * Collection publications
 *
 */
Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish('tickets', function() {
    return Tickets.find();
});

Meteor.publish('newsletter', function() {
    return Newsletter.find();
});