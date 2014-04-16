(function () {
    var checkConnection = true;
    var checkUrl = true;
    var validJimdo = false;
    var lastCheckedUrl = '';
    var lastCheckedEmail = '';
    var emailToUrlChecked = null;

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
        var error = '';
        var ret = false;
        if (typeof value === 'string' && value.length > 1) {
            ret = value;
        } else {
            error = texts.notifications.name;
        }
        $('#support_contact_form_name_input_field_notification').html(error);
        return ret;
    };

    var validateEmail = function () {
        var value = $('#support_contact_form_email_input_field').val();
        var regexp = new RegExp('^[a-z0-9_.+-äöüß]+@[a-z0-9-äöüß]+\.[a-z0-9-.]+$', 'i');
        var match = value.match(regexp);
        var error = '';
        var ret = false;
        if (typeof value === 'string' && match) {
            ret = match[0];
        } else {
            $('#support_contact_form_email_to_url_input_field_notification').html('');
            error = texts.notifications.email;
        }
        $('#support_contact_form_email_input_field_notification').html(error);
        return ret;
    };

    var validateUrl = function () {
        if (checkUrl) {
            var value = $('#support_contact_form_url_input_field').val();
            var regexp = new RegExp('^(https?://(?:[a-z0-9äöü]+[-a-z0-9äöü]?[a-z0-9äöü]+\\.)+[a-z]{2,6})(?::[0-9]{1,5})?(?:/[^ ]*)?$', 'i');
            var match = value.match(regexp);
            var error = '';
            var ret = false;
            if (typeof value === 'string' && match) {
                ret = match[1];
            } else {
                $('#support_contact_form_email_to_url_input_field_notification').html('');
                error = texts.notifications.url;
            }
            $('#support_contact_form_url_input_field_notification').html(error);
            return ret;
        } else {
            return $('#support_contact_form_url_input_field').val();
        }
    };

    var validateEmailAndUrl = function() {
        var email = validateEmail();
        var url = validateUrl();
        if (hasChanged(email, url) && email && url) {
            checkMail(email, url);
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
            } else {
                alert(response.message);
            }
        });
    };

    var changeValidation = function (key) {
        if (texts.noUrlValidation.indexOf(key) >= 0) {
            checkConnection = false;
            checkUrl = false;
            $('#support_contact_form_url_input_field_notification').html('');
        } else {
            checkConnection = true;
            checkUrl = true;
        }
    }

    var hasChanged = function(email, url) {
        if (lastCheckedEmail !== email || lastCheckedUrl !== url) {
            lastCheckedEmail = email;
            lastCheckedUrl = url;
            return true;
        }
        return false;
    }

    var checkMail = function (email, url) {
        if (checkConnection) {
            emailToUrlChecked = $.Deferred();
            var data = {
                'email': email,
                'url': url
            };

            $.getJSON("http://a.jimdo.com/app/web/support/checkmail?callback=?", data, function(response) {
                var success = response.success;
                var errorCode = response.errorCode;
                var error = '';
                emailToUrlChecked.resolve((errorCode !== 1));
                if (!success) {
                    error = texts.errorCodes[errorCode];
                }
                $('#support_contact_form_email_to_url_input_field_notification').html(error);
            });
        }
    };

    var hideForm = function () {
        $('.support_contact_form_input_content, #support_contact_form_submit').hide();
    }

    var showForm = function () {
        $('.support_contact_form_input_content,#support_contact_form_submit').show();
    }

    var init = function() {
        populateForm();
        populateFormSubject();
        populateButton();
        hideForm();

        $('#support_contact_form_subject').on('change', function (e) {
            var key = $(this).val();
            if (key !== 'choose_subject') {
                showForm();
                populateFaq(texts.faq[key]);
                changeValidation(key);
            } else {
                hideForm();
                $('#support_contact_form_faq').html('');
            }
        });

        $('#support_contact_form_name_input_field').on('blur', validateName);

        var $emailInput = $('#support_contact_form_email_input_field');
        var $urlInput = $('#support_contact_form_url_input_field');

        $emailInput.on('blur', function() {
            if ($urlInput.val().replace(/http(s)?:\/\//, '').length) {
                validateEmailAndUrl();
            } else {
                validateEmail();
            }
        });

        $urlInput.on('blur', function() {
            if ($emailInput.val().length) {
                validateEmailAndUrl();
            } else {
                validateUrl();
            }
        });

        $('#support_contact_form_submit_button').on('click', function (e) {
            e.preventDefault();
            if (subject = $('#support_contact_form_subject').val() === 'choose_subject') {
                return;
            }


            $('.support_contact_form_notification').html('');
            validateName();
            validateEmailAndUrl();

            var subject = $('#support_contact_form_subject').val();
            if (checkConnection === true) {
                if (emailToUrlChecked === null) {
                    alert(texts.notifications.missing);
                    return;
                }

                emailToUrlChecked.then(function(ok) {
                    emailToUrlChecked = null;
                    if (ok && validateForm()) {
                        submitForm();
                    } else {
                        alert(texts.notifications.missing);
                    }
                });
            } else {
                if (validateForm()) {
                    submitForm();
                } else {
                    alert(texts.notifications.missing);
                }
            }
        });
    };

    $(function() {
        init();
    });

    // $(function() {
    //     $.getJSON('gfdfiogh/texts_' + jimdoData.cmsLanguage + '.json', function(resp) {
    //
    //
    //     });
    // });
})();
