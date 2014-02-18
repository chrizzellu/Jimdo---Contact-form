populateForm = function() {
    $.each(main_german, function(index, value) {
        var label = $("label[for='"+value.key+"']");
        label.text(value.text);
    });

};

populateFormSubject = function() {
    $.each(subjects_german, function (index, value) {
        $("#support_contact_form_subject").append(
            '<option value="' + value.key + '">' + value.text + '</option>'
        );
    });
};

$().ready(function() {

    populateForm();

    populateFormSubject();
});
