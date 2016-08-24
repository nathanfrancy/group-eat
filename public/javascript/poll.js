var vm = new Vue({
    el: '#poll-wrapper',
    data: {
        poll: poll
    },
    methods: {
        vote: function($index) {
            var that = this;
            $.ajax({
                url: "/poll/" + this.poll.id + "/vote/" + this.poll.options[$index].id,
                type: "post",
                dataType: "json",
                statusCode: {
                    400: function() {
                        console.error('Something went wrong in creation.');
                    },
                    200: function(res) {
                        that.refreshPoll();
                    }
                }
            });
        },
        refreshPoll: function() {
            var that = this;
            $.ajax({
                url: "/api/poll/" + this.poll.id,
                type: "get",
                dataType: "json",
                statusCode: {
                    400: function() {
                        console.error('Something went wrong in creation.');
                    },
                    200: function(res) {
                        that.poll = res;
                    }
                }
            });
        }
    }
});