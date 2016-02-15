Template.checkpointActionCell.events({
    'click #cancelTicket': function(){
        if(this.email === "surplace@gmail.com" && this.isChecked) {
            Tickets.remove(this._id);
        } else {
            (this.isChecked) ? Tickets.update(this._id, {$set: {isChecked: false}}) : Tickets.update(this._id, {$set: {isChecked: new Date()}});
        }
    }
});
