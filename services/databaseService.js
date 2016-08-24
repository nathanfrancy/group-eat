let databasePool = require('./../config/databasePool');

// Models
let model = require('./../models');
let Poll = model.Poll;
let PollOption = model.PollOption;
let Vote = model.Vote;

let helpers = require('./../helpers');
let objectHelper = helpers.object;

/**
 * Gets a poll from the database.
 * @param id
 * @returns {Promise}
 */
function getPollById(id) {
    return new Promise((resolve, reject) => {
        databasePool.getConnection((err, connection) => {
            if (err) reject(err);
            else connection.query('SELECT * FROM poll WHERE id = ?',
                [ id ], (err, rows) => {
                    if (err) reject(err);
                    else {
                        if (rows.length !== 1) reject(new Error(`Invalid number of rows returned - ${rows.length}`));
                        else {
                            resolve(objectHelper.convertToRaw.poll(rows[0]));
                        }
                    }
                    connection.release();
                });
        });
    });
}

/**
 * Inserts a poll into the database.
 * @param poll
 * @returns {Promise}
 */
function insertPoll(poll) {
    return new Promise((resolve, reject) => {
        databasePool.getConnection((err, connection) => {
            if (err) reject(err);
            else connection.query('INSERT INTO poll (id, name, code) VALUES (?, ?, ?)',
                [ poll.id, poll.name, poll.code ], (err, rows) => {
                    if (err) reject(err);
                    else resolve(poll.id);
                    connection.release();
                });
        });
    });
}

function getOptionsForPoll(poll_id) {
    return new Promise((resolve, reject) => {
        databasePool.getConnection((err, connection) => {
            if (err) reject(err);
            else connection.query('SELECT * FROM poll_option WHERE poll_id = ?',
                [ poll_id ], (err, rows) => {
                    if (err) reject(err);
                    else {
                        resolve(
                            objectHelper.convertToRawArray(
                                rows,
                                objectHelper.convertToRaw.pollOption
                            )
                        );
                    }
                    connection.release();
                });
        });
    });
}

function getVotesForPoll(poll_id) {
    return new Promise((resolve, reject) => {
        databasePool.getConnection((err, connection) => {
            if (err) reject(err);
            else connection.query('SELECT * FROM vote WHERE poll_id = ?',
                [ poll_id ], (err, rows) => {
                    if (err) reject(err);
                    else {
                        resolve(
                            objectHelper.convertToRawArray(
                                rows,
                                objectHelper.convertToRaw.vote
                            )
                        );
                    }
                    connection.release();
                });
        });
    });
}

function insertVote(vote) {
    return new Promise((resolve, reject) => {
        databasePool.getConnection((err, connection) => {
            if (err) reject(err);
            else connection.query('INSERT INTO vote (id, ip, poll_id, option_id, timestamp) VALUES (?, ?, ?, ?, ?)',
                [ vote.id, vote.ip, vote.poll_id, vote.option_id, vote.timestamp ],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve();
                    connection.release();
                });
        });
    });
}

function getPopulatedPoll(id) {
    let $poll = null;
    return getPollById(id).then(function(poll) {
        $poll = poll;
        return getOptionsForPoll($poll.id);
    }).then(function(options) {
        $poll.setOptions(options);
        return getVotesForPoll($poll.id);
    }).then(function(votes) {
        $poll.setVotes(votes);
        $poll.generateResults();
        return $poll;
    });
}

module.exports = {

    poll: {
        getPopulated: getPopulatedPoll,
        getById: getPollById,
        insert: insertPoll
    },

    pollOptions: {
        getForPoll: getOptionsForPoll
    },

    votes: {
        getForPoll: getVotesForPoll,
        insert: insertVote
    }

};