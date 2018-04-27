data = {
    nameInternal: undefined,
    nameListener: function (val) { },
    set name(val) {
        this.nameInternal = val;
        this.nameListener(val);
    },
    get name() {
        return this.nameInternal;
    },
    registerListener: function (listener) {
        this.nameListener = listener;
    },

    methodInternal: undefined,
    methodListener: function (val2) { },
    set method(val2) {
        this.methodInternal = val2;
        this.methodListener(val2);
    },
    get method() {
        return this.methodInternal;
    },
    registerListener2: function (listener) {
        this.methodListener = listener;
    }
}




$("#demo").html("Hello, World!");




$("#exportCheck").prop("disabled", true);



$(document).ready(function () {
    data.registerListener(function (val) {
        //alert("Someone changed the value of data.name to " + val);
        if (data.name !== undefined && data.method !== undefined) {
            $("#exportCheck").removeAttr("disabled");
        }
    });

    data.registerListener2(function (val2) {
        //alert("Someone changed the value of data.method to " + val2);
        if (data.name !== undefined && data.method !== undefined) {
            $("#exportCheck").removeAttr("disabled");
        }
    });
})




$(function () {
    $('#app').change(function (e) {
        e.preventDefault();
        console.log('select_link clicked');

        /*$.ajax({
           dataType: 'jsonp',
           data: "data=yeah",						
           jsonp: 'callback',
           url: 'http://localhost:3000/endpoint?callback=?',						
           success: function(data) {
               console.log('success');
               console.log(JSON.stringify(data));
           }
       });*/
        data.name = $("#app option:selected").text();
        console.log(data);

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/testpoint',
            success: function (data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
        /*$.ajax('http://localhost:3000/endpoint', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function() { console.log('success');},
                error  : function() { console.log('error');}
        });*/
    });
});





$(function () {
    $('#select_link2').click(function (e) {
        e.preventDefault();
        console.log('select_link clicked');

        /*$.ajax({
           dataType: 'jsonp',
           data: "data=yeah",						
           jsonp: 'callback',
           url: 'http://localhost:3000/endpoint?callback=?',						
           success: function(data) {
               console.log('success');
               console.log(JSON.stringify(data));
           }
       });*/


        $.ajax({
            type: 'POST',
            data: null,
            contentType: 'application/json',
            url: 'http://localhost:3000/endpoint',
            success: function (data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
        /*$.ajax('http://localhost:3000/endpoint', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function() { console.log('success');},
                error  : function() { console.log('error');}
        });*/
    });
});




$(function () {
    $('#method').change(function (e) {
        e.preventDefault();
        console.log('select_link clicked');


        data.method = $("#method option:selected").text();
        console.log(data);

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/method',
            success: function (data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
    });
});




$(function () {
    $('#export').click(function (e) {
        //e.preventDefault();
        console.log('select_link clicked');

        /*$.ajax({
           dataType: 'jsonp',
           data: "data=yeah",						
           jsonp: 'callback',
           url: 'http://localhost:3000/endpoint?callback=?',						
           success: function(data) {
               console.log('success');
               console.log(JSON.stringify(data));
           }
       });*/

        data.title = "title";
        data.message = "message";

        $.ajax({
            type: 'POST',
            data: null,
            contentType: 'application/json',
            url: '/',
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if (typeof data.redirect == 'string') {
                    // data.redirect contains the string URL to redirect to
                    window.location = data.redirect;
                }
            }
        });
        /*$.ajax('http://localhost:3000/endpoint', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function() { console.log('success');},
                error  : function() { console.log('error');}
        });*/
    });
});

    // // var strUser;

// // document.getElementById('sel1').addEventListener('click', function() {

// // let e = document.getElementById('sel1');
// // strUser = e.options[e.selectedIndex].value; 

// // console.log(strUser);

// // })

