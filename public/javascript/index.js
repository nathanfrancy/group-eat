var vm = new Vue({
    el: '#new-wrapper',
    data: {
        name: '',
        code: ''
    },
    methods: {
        createPoll: function() {
            var that = this;
            $.ajax({
                url: "/poll/create",
                type: "post",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    name: (that.name == '' ? null : that.name),
                    code: (that.code == '' ? null : that.code)
                }),
                dataType: "json",
                statusCode: {
                    400: function() {
                        console.error('Something went wrong in creation.');
                    },
                    200: function(res) {
                        window.location.href = '/poll/' + res.id;
                    }
                }
            });
        }
    }
});