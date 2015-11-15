Template.referentsActionCell.events({
    'click #update-given': function(e){
        e.preventDefault();

        var givenDb = Given.findOne({referent_id: this._id});

        if(!givenDb){
            $("#update-given-input").val("0");
        }else{
            $("#update-given-input").val(givenDb.given);
        }

        $("#update-given-dialog").modal("show");
        $("#update-given-button").val(this._id);
    }
});

