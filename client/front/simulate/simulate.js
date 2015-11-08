/*var girls = ["Adèle","Aicha","Alix","Amel", "Amelia","Amina","Anaelle","Anastasia", "Angelina","Candice","Capucine","Carla"];
var boys = ["Adam","Adel","Ahmed","Alban","Alex","Ali","Amine","Antonin","Armand","Augustin","Bilal","Brahim"];
var schools = [
    // Lycées généraux
    "Lycée Fabert",
    "Lycée Georges de la Tour",
    "Lycée Louis Vincent",
    "Ensemble scolaire Jean XXIII",
    "Lycée Cormontaigne",
    "Lycée de la Miséricorde",
    "Lycée Robert Schuman",
    "Institution De La Salle",
    "Lycée de la Communication",

    // Lycées professionnels
    "Lycée Anne de Méjanès",

    // CPGE
    "CPGE Fabert - PCSI",
    "CPGE Fabert - MPSI",
    "CPGE Fabert - ECS",
    "CPGE Georges de la Tour - BCPST"
];

for(var i = 0; i < 642; i++) {
    var ticket = {};

    ticket.sexe = randBool(0.6) ? "Homme" : "Femme";

    ticket.firstname = ticket.sexe == "Homme" ? randArray(boys) : randArray(girls);
    ticket.lastname = "Dupont";
    ticket.birthday = new Date(randBool(0.7) ? randInt(1995, 1998) : randInt(1997, 1999), randInt(1, 12), randInt(1, 31));
    ticket.email = ticket.firstname.toLowerCase() + ".dupont@gmail.com";
    ticket.phone = (randBool(0.9) ? "06" : "07") + randInt(10000000,99999999);
    ticket.school = randArray(schools);
    ticket.isPaid = randBool(0.5) ? randDate(new Date(2015, 10, 28), new Date(2015, 11, 20)) : false;
    ticket.isPaypal = randBool(0.5);
    ticket.isChecked = false;
    ticket.created = randDate(new Date(2015, 10, 28), new Date(2015, 11, 20));
    ticket.validatorId = ticket.isPaypal ? -1 : randInt(1, 30);

    console.log(ticket);

    Tickets.insert(ticket)
}

function randBool(prob) {
    return Math.random() < prob;
}

function randArray(foo) {
    return foo[randInt(0, foo.length - 1)];
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}*/