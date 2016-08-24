let shortid = require('shortid');

class Poll {

    constructor(id = null, name = null, code = null) {
        if (!id) this.id = shortid.generate();
        else this.id = id;

        if (!name) this.name = '';
        else this.name = name;

        this.code = code;
        this.options = [];
        this.votes = [];
    }

    setOptions(options) {
        this.options = options;
    }

    setVotes(votes) {
        this.votes = votes;
    }

    generateResults() {
        var results = {};

        // Turn options into an object for easy access.
        for (var i = 0; i < this.options.length; i++) {
            results[this.options[i].id] = this.options[i];
            results[this.options[i].id].votes = [];
        }

        // Put votes into options.
        for (var j = 0; j < this.votes.length; j++) {
            if (results[this.votes[j].option_id] != undefined)
                results[this.votes[j].option_id].votes.push(this.votes[j]);
        }
    }

    setResults(results) {
        this.results = results;
    }

}

module.exports = Poll;