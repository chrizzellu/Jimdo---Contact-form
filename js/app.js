populateForm = function(main) {
    $.each(main, function(index, value) {
        var label = $("label[for='"+value.key+"']");
        label.text(value.text);
    });

};

populateFormSubject = function(subjects) {
    $.each(subjects, function (index, value) {
        $("#support_contact_form_subject").append(
            '<option value="' + value.key + '">' + value.text + '</option>'
        );
    });
};

populateButton = function(button) {
    $("#support_contact_form_submit_button").attr('value',button);
};

$().ready(function() {
    var locale = "de_DE";
    populateForm(texts[locale].main);
    populateFormSubject(texts[locale].subjects);
    populateButton(texts[locale].button);
});
