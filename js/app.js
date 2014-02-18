(function(){
    var populateForm = function(main) {
        $.each(main, function(index, value) {
            var label = $("label[for='"+value.key+"']");
            label.text(value.text);
        });

    };

var populateFormSubject = function(subjects) {
    $.each(subjects, function (index, value) {
        $("#support_contact_form_subject").append(
            '<option value="' + value.key + '">' + value.text + '</option>'
        );
    });
};

var populateButton = function(button) {
    $("#support_contact_form_submit_button").attr('value',button);
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

$().ready(function() {
    var locale = "de_DE";
    populateForm(texts[locale].main);
    populateFormSubject(texts[locale].subjects);
    populateButton(texts[locale].button);

    $('#support_contact_form_subject').on('change', function(e) {
        var key = $($(this).children().get(this.selectedIndex)).attr('value');
        populateFaq(texts[locale].faq[key]);
    })
});
})();
