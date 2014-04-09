(function () {
    var checkConnection = true;
    var checkUrl = true;

    var populateForm = function () {
        $.each(texts.main, function (index, value) {
            var label = $('label[for="' + value.key + '"]');
            label.text(value.text);
        });

    };

    var populateFormSubject = function () {
        $.each(texts.subjects, function (index, value) {
            $('#support_contact_form_subject').append(
                '<option value="' + value.key + '">' + value.text + '</option>'
            );
        });
    };

    var populateButton = function () {
        $('#support_contact_form_submit_button').attr('value', texts.button);
    };

    var populateFaq = function (faq) {
        var html = '';
        if (!!faq) {
            html = '<div class="support_contact_form_faq">';
            html += '<div class="support_contact_form_faq_headline">' + faq.headline + '</div>'
            $.each(faq.links, function (index, value) {
                html += '<div><a href="' + value.link + '" target="_blank">' + value.text + '</a></div>'
            });
            html += '</div>';
        }
        $('#support_contact_form_faq').html(html)
    };

    var validateForm = function () {
        var validate = true;
        if (!validateName()) {
            validate = false;
        }
        if (!validateEmail()) {
            validate = false;
        }
        if (!validateUrl()) {
            validate = false;
        }
        return validate;
    };

    var validateName = function () {
        var value = $('#support_contact_form_name_input_field').val();
        if (typeof value === 'string' && value.length > 1) {
            return value;
        } else {
            $('#support_contact_form_name_input_field_notification').html(texts.notifications.name);
            return false;
        }
    };

    var validateEmail = function () {
        var value = $('#support_contact_form_email_input_field').val();
        var regexp = new RegExp('^[a-z0-9_.+-äöüß]+@[a-z0-9-äöüß]+\.[a-z0-9-.]+$', 'i');
        var match = value.match(regexp);
        if (typeof value === 'string' && match) {
            return match[0];
        } else {
            $('#support_contact_form_email_input_field_notification').html(texts.notifications.email);
            return false;
        }
    };

    var validateUrl = function () {
        if (checkUrl) {
            var value = $('#support_contact_form_url_input_field').val();
            var regexp = new RegExp('^(https?://(?:[a-z0-9äöü]+[-a-z0-9äöü]?[a-z0-9äöü]+\\.)+[a-z]{2,6})(?::[0-9]{1,5})?(?:/[^ ]*)?$', 'i');
            var match = value.match(regexp);
            if (typeof value === 'string' && match) {
                return match[1];
            } else {
                $('#support_contact_form_url_input_field_notification').html(texts.notifications.url);
                return false;
            }
        }
    };

    var submitForm = function () {
        var data = {
            'name': validateName(),
            'email': validateEmail(),
            'url': validateUrl(),
            'subject': $('#support_contact_form_subject option:selected').text(),
            'message': $('#support_contact_form_message_input_area').val(),
            'lang' : texts.lang
        };

        $.getJSON("http://a.jimdo.com/app/web/support/sendmail?callback=?", data, function(response) {
            if (!response.success) {
                alert(response.errorMessage);
            }
        });
    };

    var changeValidation = function (key) {
        var validate = true;
        for (var i = 0; i < texts.noUrlValidation.length; i++) {
            if (texts.noUrlValidation[i] === key) {
                checkConnection = false;
                checkUrl = false;
                $('#support_contact_form_url_input_field_notification').html('');
                validate = false;
                break;
            }
        }
        if (validate) {
            checkConnection = true;
            checkUrl = true;
            checkMail(validateEmail(), validateUrl());
        }
    }

    var checkMail = function (email, url) {
        if (checkConnection) {
            var data = {
                'email': email,
                'url': url
            };

            $.getJSON("http://a.jimdo.com/app/web/support/checkmail?callback=?", data, function(response) {
                var success = response.success;
                var errorCode = response.errorCode;
                validJimdoUrl = !(errorCode == 1);
                if (!success) {
                    $('#support_contact_form_url_input_field_notification').html(texts.errorCodes[errorCode]);
                }
            });
        }
    };

    $().ready(function () {
        populateForm();
        populateFormSubject();
        populateButton();

        $('#support_contact_form_subject').on('change', function (e) {
            var key = $($(this).children().get(this.selectedIndex)).attr('value');
            populateFaq(texts.faq[key]);
            changeValidation(key);

        });

        $('#support_contact_form_name_input_field').on('change', function (e) {
            $('.support_contact_form_notification').html('');
        });

        $('#support_contact_form_email_input_field').on('change', function (e) {
            $('.support_contact_form_notification').html('');
            var email = validateEmail();
            var url = validateUrl();
            if (email && url) {
                checkMail(email, url);
            }
        });

        $('#support_contact_form_url_input_field').on('change', function (e) {
            $('.support_contact_form_notification').html('');
            var email = validateEmail();
            var url = validateUrl();
            if (email && url) {
                checkMail(email, url);
            }
        });

        $('#support_contact_form_submit_button').on('click', function (e) {
            e.preventDefault();
            $('.support_contact_form_notification').html('');
            if (validateForm()) {
                submitForm();
            }
        })
    });
})();
