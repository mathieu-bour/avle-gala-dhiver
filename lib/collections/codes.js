Codes = new Mongo.Collection('codes');

Codes.allow({
    'insert': function (userId,doc) {
        if(userId){
            return true;
        }else{
            return false;
        }

    }
});

