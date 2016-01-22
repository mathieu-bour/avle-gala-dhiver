Template.validate.helpers({
    //add your events here
    expressCheckoutDetails: function(){
        return Session.get('expressCheckoutDetails');
    }
});

Template.validate.onRendered(function () {
    Meteor.call('doExpressCheckoutPayment', this.data.token,this.data.PayerID, function(error, result){
        if(!error){

            var query = this.window.location.search;

            query = query.split('?');
            query = query[1];
            query= query.split('&');

            query_json = {};
            for (var i = query.length - 1; i >= 0; i--) {
                item = query[i].split("=");
                query_json[item[0]] = decodeURIComponent(item[1]);
            };
            console.log(result);
            if(result['CHECKOUTSTATUS'] == 'PaymentActionCompleted'){
                var id = result.INVNUM;
                Session.set("expressCheckoutDetails", result);

                var ticket = Tickets.findOne(id);
                Tickets.update(ticket._id, {$set: {isPaid: new Date(), isPaypal: new Date(), correlationId: result['CORRELATIONID']}});

                /*= Save and save invoice =*/
                /*======================================================*/
                HTTP.get('http://lab.dev/invoice_pdf/',{
                    params: {
                        'lastname': ticket.lastname,
                        'firstname': ticket.firstname,
                        'phone': ticket.phone,
                        'school': ticket.school,
                        'getPdf': false,
                        'isPaypal': true,
                        'email': ticket.email,
                        'id': ticket._id,
                        'isForbach': false
                    }
                }, function(error, result){
                    console.log(result);
                });

                HTTP.get('http://lab.dev/ticket_pdf/',{
                    params: {
                        'lastname': ticket.lastname,
                        'firstname': ticket.firstname,
                        'phone': ticket.phone,
                        'school': ticket.school,
                        'isPaypal': true,
                        'sexe': ticket.sexe,
                        'getPdf': false,
                        'email': ticket.email,
                        'id': ticket.uuid,
                        'isForbach': false,
                        '_id': ticket._id
                    }
                }, function(error, result){
                    console.log(result);
                });
            }else{
                console.log("error2");
                var host = "http://"+window.location.hostname;

                if(host == 'http://localhost'){
                    //window.location.replace("http://localhost:3000/buy/payment/canceled");
                }else{
                    //window.location.replace(host + "/buy/payment/canceled");
                }
            }
        }else{
            console.log("error1");
            var host = "http://"+window.location.hostname;

            if(host == 'http://localhost'){
                //window.location.replace("http://localhost:3000/buy/payment/canceled");
            }else{
                //window.location.replace(host + "/buy/payment/canceled");
            }
        }
    });



});

Template.validate.onDestroyed(function () {
    //add your statement here
});

