Newsletter = new Mongo.Collection('newsletter');

Newsletter.allow({
    'insert': function (userId,doc) {
        /* user and doc checks ,
         return true to allow insert */
        return true;
    }
});
