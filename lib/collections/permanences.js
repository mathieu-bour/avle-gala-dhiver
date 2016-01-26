Permanences = new Mongo.Collection('permanences');

Permanences.allow({
    'insert': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    },'update': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    },'remove': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    }
});

