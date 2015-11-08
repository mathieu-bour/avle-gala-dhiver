Template.checkpointActionCell.events({
    'click #cancelTicket': function(){
        (this.isChecked) ? Tickets.update(this._id, {$set: {isChecked: false}}) : Tickets.update(this._id, {$set: {isChecked: new Date()}});
    }
});
