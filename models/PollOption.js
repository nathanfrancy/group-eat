let shortid = require('shortid');

class PollOption {

    constructor (id = null, text = null, poll_id = null) {
        if (id == null) this.id = shortid.generate();
        else this.id = id;

        this.text = text;
        this.poll_id = poll_id;
    }

}

module.exports = PollOption;