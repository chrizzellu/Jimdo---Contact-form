(function () {
    var populateForm = function (main) {
        $.each(main, function (index, value) {
            var label = $('label[for="' + value.key + '"]');
            label.text(value.text);
        });

    };

    var populateFormSubject = function (subjects) {
        $.each(subjects, function (index, value) {
            $('#support_contact_form_subject').append(
                '<option value="' + value.key + '">' + value.text + '</option>'
            );
        });
    };

    var populateButton = function (button) {
        $('#support_contact_form_submit_button').attr('value', button);
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

    var validateForm = function (notifications) {
        var validate = true;
        if (!validateName(notifications.name)) {
            validate = false;
        }
        if (!validateEmail(notifications.email)) {
            validate = false;
        }
        if (!validateUrl(notifications.url)) {
            validate = false;
        }
        return validate;
    };

    var validateName = function (notification) {
        var value = $('#support_contact_form_name_input_field').val();
        if (typeof value === 'string' && value.length > 1) {
            return value;
        } else {
            $('#support_contact_form_name_input_field_notification').html(notification);
            return false;
        }
    };

    var validateEmail = function (notification) {
        var value = $('#support_contact_form_email_input_field').val();
        var regexp = new RegExp('^[a-z0-9_.+-äöüß]+@[a-z0-9-äöüß]+\.[a-z0-9-.]+$', 'i');
        var match = value.match(regexp);
        if (typeof value === 'string' && match) {
            return match[0];
        } else {
            $('#support_contact_form_email_input_field_notification').html(notification);
            return false;
        }
    };

    var validateUrl = function (notification) {
        var value = $('#support_contact_form_url_input_field').val();
        var regexp = new RegExp('^(https?://(?:[a-z0-9äöü]+[-a-z0-9äöü]?[a-z0-9äöü]+\\.)+[a-z]{2,6})(?::[0-9]{1,5})?(?:/[^ ]*)?$', 'i');
        var match = value.match(regexp);
        if (typeof value === 'string' && match) {
            return match[1];
        } else {
            $('#support_contact_form_url_input_field_notification').html(notification);
            return false;
        }
    };

    var formSubmit = function () {
        $.ajax(
            {
                type: "POST",
                async: false,
                url: "http://mgmt.jimdo.dev/api/support/sendmail",
                dataType: "json",
                data: {
                    'name': validateName(),
                    'from': validateEmail(),
                    'url': validateUrl(),
                    'subject': $('#support_contact_form_subject').val(),
                    'message': $('#support_contact_form_message_input_area').val()
                }
            }
        );
    };

    var checkMail = function (email, url) {
        $.ajax(
            {
                type: "GET",
                async: false,
                url: "http://mgmt.jimdo.dev/api/support/checkmail",
                dataType: "json",
                data: {
                    'email': email,
                    'url': url
                }
            }
        );
    };

    $().ready(function () {
        populateForm(texts.main);
        populateFormSubject(texts.subjects);
        populateButton(texts.button);

        $('#support_contact_form_subject').on('change', function (e) {
            var key = $($(this).children().get(this.selectedIndex)).attr('value');
            populateFaq(texts.faq[key]);
        });

        $('#support_contact_form_name_input_field').on('change', function (e) {
            $('.support_contact_form_notification').html('');
        });

        $('#support_contact_form_mail_input').on('change', function (e) {
            $('.support_contact_form_notification').html('');
            var email = validateEmail(texts.notifications.email);
            var url = validateUrl(texts.notifications.url);
            if (email && url) {
                checkMail(email, url);
            }
        });

        $('#support_contact_form_url_input_field').on('change', function (e) {
            $('.support_contact_form_notification').html('');
            var email = validateEmail(texts.notifications.email);
            var url = validateUrl(texts.notifications.url);
            if (email && url) {
                checkMail(email, url);
            }
        });

        $('#support_contact_form_submit_button').on('click', function (e) {
            e.preventDefault();
            $('.support_contact_form_notification').html('');
            if (validateForm(texts.notifications)) {
                formSubmit();
            }
        })
    });
})();
