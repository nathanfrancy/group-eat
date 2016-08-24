// Import models
let model = require('./../models');
let Poll = model.Poll;
let PollOption = model.PollOption;
let Vote = model.Vote;

function convertRawToPoll(data) {
    return new Poll(
        data.id,
        data.name,
        data.code
    );
}

function convertRawToPollOption(data) {
    return new PollOption(
        data.id,
        data.text,
        data.poll_id
    );
}

function convertRawToVote(data) {
    return new Vote(
        data.id,
        data.ip,
        data.poll_id,
        data.option_id,
        data.timestamp
    );
}

function convertRawArray(arr, convertFn) {
    let arr_objs = [];
    for (var i = 0; i < arr.length; i++) {
        arr_objs.push(convertFn(arr[i]));
    }
    return arr_objs;
}

module.exports = {

    convertToRaw: {
        poll: convertRawToPoll,
        pollOption: convertRawToPollOption,
        vote: convertRawToVote
    },

    convertToRawArray: convertRawArray

};