Events = new Mongo.Collection('events');

Events.allow({
    'insert': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    },
    'update': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    }
});

