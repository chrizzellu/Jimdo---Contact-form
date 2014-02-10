$().ready(function() {
	$("#confirmation_notification").hide();
	$("#error_notification").hide();
	$("#name_notification").hide();
	$("#email_notification").hide();
	$("#url").val("http://");
	$("#url_notification").hide();
	$("#package_information").hide();
	$("#subject_notification").hide();
	$("#questions_notification").hide();
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
	var email = $ ('#email').val();
	if ((email.length < 1) || (!IsEmailValid(email))) {
	   	$("#email_notification").show();
		$("#email").css('background-color', '#E4E4E4');
	} else {
        $("#email_notification").hide();
		$("#email").css('background-color', '#FFF');
  	}
}
function IsURLValid(url){
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
	   $.ajax (
		   {
                type: "POST",
                async: false,
                url: "api/package.php",
                data:[
				   {
					   name: 'url',
					   value: url
				   }
			   ],
               success: function (response) {
				   var jsn = $.parseJSON(response);
				   console.log ('package', jsn);
				   if (jsn.success) {
					   var responseData = jsn.data.value;
					   if (responseData.package) {
						   $().ready(function() {
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
function questions_validation(){
	if ($("#questions").val().length < 1) {
	   	$("#questions_notification").show();
		$("#questions").css('background-color', '#E4E4E4');
	} else {
        $("#questions_notification").hide();
		$("#questions").css('background-color', '#FFF');
  	}
}

function select_attachment(){
	$("input[name=attachment_upload]").trigger("click");
}

function send_form () {
	console.log('send wurde aufgerufen');
	var name = $ ('#name').val ();
	var email = $ ('#email').val ();
	var url = $ ('#url').val ();
	var subject = $ ('#subject').val ();
	var questions = $ ('#questions').val ();

	if (
		name.length > 0 && 
	 	email.length > 0 &&
		url.length > 0 &&
		subject.length > 0 &&
		questions.length > 0
		) {
	   	var data = new FormData();
		jQuery.each($('#attachment_upload')[0].files, function(i, file) {
			data.append("ajax-attachment", file);
		});
		data.append("action","upload");
	   $.ajax (
		   {

                type: "POST",
                async: false,
				contentType: 'multipart/form-data',
                url: "api/send_form.php",
				cache: false,
				contentType: false,
				processData: false,
                data:[
				   {
					   name: 'name',
					   value: name
				   },
				   {
					   name: 'email',
					   value: email
				   },
				   {
					   name: 'url',
					   value: url
				   },
				   {
					   name: 'subject',
					   value: subject
				   },
				   {
					   name: 'questions',
					   value: questions
				   },
				   {
					   name: 'attachment',
					   value: data
				   }
			   ],
               success: function (response) {
				   var jsn = $.parseJSON (response);
				   console.log ('send', jsn);
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
			   if ($("#email").val().length < 1) {
					$("#email_notification").show();
					$("#email").css('background-color', '#E4E4E4');
			   }
			   if ($("#url").val().length <= 7) {
					$("#url_notification").show();
					$("#url").css('background-color', '#E4E4E4');
			   }
			   if ($("#subject").val().length < 1) {
					$("#subject_notification").show();
					$("#subject").css('background-color', '#E4E4E4');
			   }
			   if ($("#questions").val().length < 1) {
					$("#questions_notification").show();
					$("#questions").css('background-color', '#E4E4E4');
			   }
       }
}
