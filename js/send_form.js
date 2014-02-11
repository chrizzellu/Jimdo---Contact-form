$().ready(function () {
    $("#confirmation_notification").hide();
    $("#error_notification").hide();
    $("#name_notification").hide();
    $("#from_notification").hide();
    $("#url").val("http://");
    $("#url_notification").hide();
    $("#package_information").hide();
    $("#subject_notification").hide();
    $("#message_notification").hide();
});

function name_validation() {
    if ($("#name").val().length < 1) {
        $("#name_notification").show();
        $("#name").css('background-color', '#E4E4E4');
    } else {
        $("#name_notification").hide();
        $("#name").css('background-color', '#FFF');
    }
}
function IsEmailValid(email) {
    var email_regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return email_regex.test(email);
}
function email_validation() {
    var email = $('#from').val();
    if ((email.length < 1) || (!IsEmailValid(email))) {
        $("#from_notification").show();
        $("#from").css('background-color', '#E4E4E4');
    } else {
        $("#from_notification").hide();
        $("#from").css('background-color', '#FFF');
    }
}
function IsURLValid(url) {
    var url_regex = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
    return url_regex.test(url);
}
function package_validation() {
    console.log('package wurde aufgerufen');
    var url = $('#url').val();

    if (
        (url.length >= 7 )
    //&& (IsURLValid(url))
        ) {
        $.ajax(
            {
                type: "POST",
                async: false,
                url: "http://a.jimdo.dev/app/web/api/checkmail",
                data: [
                    {
                        name: 'url',
                        value: url
                    }
                ],
                success: function (response) {
                    var jsn = $.parseJSON(response);
                    console.log('package', jsn);
                    if (jsn.success) {
                        var responseData = jsn.data.value;
                        if (responseData.package) {
                            $().ready(function () {
                                var package = responseData.package;
                                console.log(package);
                                $("#package_information").empty();
                                $("#package_information").show();
                                $("#package_information").append('Du hast ' + package);
                                $("#url_notification").hide();
                                $("#url").css('background-color', '#FFF');
                            });
                        }
                    } else {
                        console.log('package error 1');
                    }
                }
            });
    }
    else {
        $("#url_notification").show();
        $("#url").css('background-color', '#E4E4E4');
    }
}
function subject_validation() {
    if ($("#subject").val().length < 1) {
        $("#subject_notification").show();
        $("#subject").css('background-color', '#E4E4E4');
    } else {
        $("#subject_notification").hide();
        $("#subject").css('background-color', '#FFF');
    }
}
function message_validation() {
    if ($("#message").val().length < 1) {
        $("#message_notification").show();
        $("#message").css('background-color', '#E4E4E4');
    } else {
        $("#message_notification").hide();
        $("#message").css('background-color', '#FFF');
    }
}

function send_form() {
    console.log('send wurde aufgerufen');
    var name = $('#name').val();
    var email = $('#from').val();
    var url = $('#url').val();
    var subject = $('#subject').val();
    var message = $('#message').val();

    if (
        name.length > 0 &&
            email.length > 0 &&
            url.length > 0 &&
            subject.length > 0 &&
            message.length > 0
        ) {
        var data = new FormData();

        $.ajax(
            {
                type: "POST",
                async: false,
                url: "http://a.jimdo.dev/app/web/api/sendmail",
                dataType: "json",
                data: {
                    'name': name,
                    'from': email,
                    'url': url,
                    'subject': subject,
                    'message': message
                },

                success: function (response) {
                    var jsn = $.parseJSON(response);
                    console.log('send', jsn);
                    if (jsn.success) {
                        var responseData = jsn.data.value;
                        if (responseData.send_notification) {
                            console.log('Success sending form');
                            console.log(responseData.send_notification);
                            console.log(responseData.package);
                            $("#contact_form").hide();
                            $("#confirmation_notification").show();
                        }
                    }
                    else {
                        console.log('Error sending form');
                        $("#contact_form").hide();
                        $("#error_notification").show();

                    }
                }
            });
    }
    else {
        console.log('validation error');
        if ($("#name").val().length < 1) {
            $("#name_notification").show();
            $("#name").css('background-color', '#E4E4E4');
        }
        if ($("#from").val().length < 1) {
            $("#from_notification").show();
            $("#from").css('background-color', '#E4E4E4');
        }
        if ($("#url").val().length <= 7) {
            $("#url_notification").show();
            $("#url").css('background-color', '#E4E4E4');
        }
        if ($("#subject").val().length < 1) {
            $("#subject_notification").show();
            $("#subject").css('background-color', '#E4E4E4');
        }
        if ($("#message").val().length < 1) {
            $("#message_notification").show();
            $("#message").css('background-color', '#E4E4E4');
        }
    }
}
