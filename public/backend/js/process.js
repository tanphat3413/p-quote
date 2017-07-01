function parseFormError(form, errorData) {
	if (errorData && errorData.length > 0) {
		for (var i = 0; i < errorData.length; i++) {
			var error = errorData[i];
			if (error.hasOwnProperty('field') && error.hasOwnProperty('error')) {
				show_input_error($('#' + error.field), error.error);
			}
		}
		return true;
	}
	return false;
}

function parseFormData(form, data) {
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			var name = key,
				value = data[key];
			if (form.find('input[type="text"]#' + key).length) {
				form.find('input[type="text"]#' + key).val(value);
			} else if(form.find('input[type="checkbox"]#'+key).length){
				form.find('input[type="checkbox"]#' + key).prop('checked', value);
			}
		}
	}
}

function errorNotify(message, uiUID) {
	$('.'+uiUID).remove();
	return `<div class="alert alert-danger ` + uiUID + `">
					<div class="container-fluid">
					<div class="alert-icon">
						<i class="material-icons">error_outline</i>
					</div>
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true"><i class="material-icons">clear</i></span>
					</button>
					<b>Error:</b> ` + message + `
					</div>
				</div>`;
}

function successNotify(message, uiUID) {
	$('.'+uiUID).remove();
	return `<div class="alert alert-success ` + uiUID + `">
				<div class="container-fluid">
					<div class="alert-icon">
						<i class="material-icons">done</i>
					</div>
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true"><i class="material-icons">clear</i></span>
					</button>
					<b>Success:</b> ` + message + `
				</div>
			</div>`;
}

function show_input_error(ele, strMessage, uiUID) {
	remove_input_error(ele, uiUID);
	ele.parent().addClass('has-error').append('<span class="material-icons form-control-feedback">clear</span><p class="help-block error-text">' + strMessage + '</p>');
	ele.on('keydown', function () {
		remove_input_error($(this), uiUID);
	});
}

function remove_input_error(ele, uiUID){
	$(ele).parent().removeClass('has-error').find('.error-text').fadeOut('fast', function () { $(this).remove(); });
	$(ele).parent().find('.form-control-feedback').fadeOut('fast', function () { $(this).remove(); });
	$('.' + uiUID).remove();
}

function confirmModal(title, message, genUID, yesAction) {
	
	var html = `
	<div class="modal fade" id="`+genUID+`" tabindex="-1" role="dialog" aria-labelledby="`+genUID+`Label" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="`+genUID+`Label">`+ title + `</h4>
			</div>
			<div class="modal-body">
					` + message + `
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id="`+genUID+`action">YES</button>
				<button type="button" class="btn btn-default btn-simple" data-dismiss="modal">NO</button>				
			</div>
		</div>
	</div>
	</div>`;

	$('body').append(html);

	var confirmModal = $('#'+genUID).modal();
	$('#'+genUID).on('hidden.bs.modal', function (e) {
		$(this).remove();
	});
	$('#'+genUID+'action').click(function () {
		if (typeof yesAction == 'function') {
			yesAction();
			confirmModal.modal('hide');			
		}
	});
}