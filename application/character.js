const { Library, Book } = require('./application/library.js');

$('#add').click(() => {
	add('string');
});
$('#name-edit-input').on('keypress', (event) => {
	if (event.keyCode == 13) {
		$('#name-edit-save').click();
	}
});

let count = 0;

function add(type) {
	let html = `
<div id="data-div-${count}" class="form-group row">
	<label id="data-label-${count}" for="data-input-${count}" class="col-md-2 col-form-label">
		Item_${count}:
	</label>
	<div class="col-md-10">
		<div class="input-group">
	`;

	switch (type) {
		case 'string':
			html += `
			<input id="data-input-${count}" type="text" class="form-control" placeholder="">
			`;
			break;
		case 'number':
			html += `
			<input id="data-input-${count}" type="number" class="form-control" placeholder="">
			`;
			break;
		case 'text':
			html += `
			<textarea id="data-input-${count}" class="form-control" placeholder=""></textarea>
			`;
			break;
		default:
			html += `
			<label id="data-input-${count}" class="form-control">
				<i class="fas fa-exclamation-triangle" style="color:Tomato"></i>
				Failed to create input!
			</label>
			`;
	}

	html += `
			<div class="input-group-append">
				<button type="button" id="data-edit-${count}" class="btn btn-outline-secondary">
					<i class="fas fa-wrench"></i>
				</button>
				<button type="button" id="data-remove-${count}" class="btn btn-outline-danger">
					<i class="fas fa-backspace"></i>
				</button>
			</div>
		</div>
	</div>
</div>
	`;
	$('#data').append(html);

	$('#data-edit-' + count).click(count, (event) => {
		run_name_edit_modal(event.data);
	});
	$('#data-remove-' + count).click(count, (event) => {
		$('#data-div-' + event.data).remove();
	});

	run_name_edit_modal(count);
	count += 1;
}

function run_name_edit_modal(number) {
	$('#name-edit-input').val($('#data-label-' + number).text().trim().slice(0, -1));
	$('#name-edit-save').off('click');
	$('#name-edit-save').one('click', () => {
		$('#name-edit-modal').modal('hide');

		let new_name = $('#name-edit-input').val();
		$('#data-label-' + number).text(new_name + ':');
	});
	$('#name-edit-modal').one('shown.bs.modal', () => {
		$('#name-edit-input').focus().select();
	})
	$('#name-edit-modal').modal('show');
}
