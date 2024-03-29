Tickets = new Mongo.Collection('tickets');

Tickets.allow({
    'insert': function (userId,doc) {
        if(userId){
            return true;
        }else if(doc.isPaid == false){
            return true;
        }else{
            return false;
        }
    },
    'update': function (userId,doc, fields, modifier) {
        if(userId){
            return true;
        }else if(_.contains(fields, 'isPaypal') && _.contains(fields, 'correlationId') || _.contains(fields, 'acceptDataTransmission')){
            return true;
        }
        else{
            return false;
        }
    },
    'remove': function (userId,doc, fields, modifier) {
        if(userId){
            return true;
        }
        else{
            return false;
        }
    }
});
