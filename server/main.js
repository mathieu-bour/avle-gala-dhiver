process.env.MAIL_URL="smtp://noreply%40point-blank.fr:a2EmmOuPQ3lv7vOliaSw@server.point-blank.fr:587";

Accounts.emailTemplates.siteName = "Gala d'hiver | A.V.L.E";
Accounts.emailTemplates.from = "A.V.L.E <noreply@point-blank.fr>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Bien le bonjour " + user.profile.firstname + "!";
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
    return "Tu as maintenant accès à l'espace référent du site de l'A.V.L.E !"
        + " Pour choisir ton mot de passe et activer ton compte, cliques sur le lien ci-dessous:\n\n"
        + url;
        + "A bientôt pour de supers projets avec le plus beau des pôles de l'A.V.L.E !"
};

/*var users = [
    {lastname:"DELLINGER", firstname: "Ladislas", school: "Fabert", phone: '0634548226', email:"ladislas14@gmail.com",roles:['admin', 'referent']}
];

_.each(users, function (user) {
    var id;

    id = Accounts.createUser({
        email: user.email,
        password: "14021997",
        profile: {
            lastname: user.lastname,
            firstname: user.firstname,
            school: user.school,
            phone: user.phone,
            roles: user.roles
        }
    });

})*/

Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

