let shortid = require('shortid');

class Vote {

    constructor (id = null, ip = null, poll_id = null, option_id = null, timestamp = null) {
        if (id == null) this.id = shortid.generate();
        else this.id = id;

        this.ip = ip;
        this.poll_id = poll_id;
        this.option_id = option_id;

        if (!timestamp) this.timestamp = new Date();
        else this.timestamp = timestamp;
    }

}

module.exports = Vote;