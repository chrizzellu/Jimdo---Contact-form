(function(){
    var populateForm = function(main) {
        $.each(main, function(index, value) {
            var label = $('label[for="'+value.key+'"]');
            label.text(value.text);
        });

    };

var populateFormSubject = function(subjects) {
    $.each(subjects, function (index, value) {
        $('#support_contact_form_subject').append(
            '<option value="' + value.key + '">' + value.text + '</option>'
        );
    });
};

var populateButton = function(button) {
    $('#support_contact_form_submit_button').attr('value',button);
};

var populateFaq = function(faq) {
    var html = '';
    if (!!faq) {
        html = '<div class="support_contact_form_faq">';
        html += '<div class="support_contact_form_faq_headline">'+faq.headline+'</div>'
        $.each(faq.links, function(index, value) {
            html += '<div><a href="'+value.link+'" target="_blank">'+value.text+'</a></div>'
        });
        html += '</div>';
    }
    $('#support_contact_form_faq').html(html)
};

    var validateForm = function(notifications) {
        validateName(notifications.name);
        validateEmail(notifications.email);
        validateUrl(notifications.url);
    };

    var validateName = function(notification) {
        var value = $('#support_contact_form_name_input_field').val();
        if (typeof value === 'string' && value.length > 1) {
            return true;
        } else {
            $('#support_contact_form_name_input_field_notification').html(notification);
            return false;
        }
    };

    var validateEmail = function(notification) {
        var value = $('#support_contact_form_email_input_field').val();
        var regexp = '^[a-zA-Z0-9_.+-äöüß]+@[a-zA-Z0-9-äöüß]+\.[a-zA-Z0-9-.]+$';
        var match = value.match(regexp);
        if (typeof value === 'string' && match) {
            return match[0];
        } else {
            $('#support_contact_form_email_input_field_notification').html(notification);
            return false;
        }
    };

    var validateUrl = function(notification) {
        var value = $('#support_contact_form_url_input_field').val();
        var regexp = '^(https?://([a-z0-9]+[-a-z0-9]?[a-z0-9]+\.)+)[a-z]{2,6}(:[0-9]{1,5})?(/[^ ]*)?$';
        var match = value.match(regexp);
        if (typeof value === 'string' && match) {
            return match[1];
        } else {
            $('#support_contact_form_url_input_field_notification').html(notification);
            return false;
        }
    };

$().ready(function() {
    var locale = "de_DE";
    populateForm(texts[locale].main);
    populateFormSubject(texts[locale].subjects);
    populateButton(texts[locale].button);

    $('#support_contact_form_subject').on('change', function(e) {
        var key = $($(this).children().get(this.selectedIndex)).attr('value');
        populateFaq(texts[locale].faq[key]);
    });

    $('#support_contact_form_submit_button').on('click', function(e) {
        e.preventDefault();
        $('.support_contact_form_notification').html('');
        validateForm(texts[locale].notifications);
    })
});
})();
