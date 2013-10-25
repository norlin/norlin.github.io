/* global app */
(function ($, app) {
	var Form = app.createModule({
			name: 'form',
			template: 'form'
		});

	Form.prototype.ready = function () {
		var module = this;

		this.node.on('submit', function (e) {
			e.preventDefault();

			module.submit();
		});
	};

	Form.prototype.submit = function () {
		var module = this,
			options = {
				url: module.options.action,
				type: module.options.type || 'POST',
				dataType: 'json',
				traditional: true,
				contentType: 'application/json; charset=UTF-8',
				success: function (data) {
					module.success(data);
				},
				error: function (data) {
					module.error(data);
				},
				complete: function () {
					module.complete();
				}
			};

		this.node.trigger('send.form');

		options.data = JSON.stringify(this.collectInputData());

		$.ajax(options);
	};

	Form.prototype.collectInputData = function () {
		var data = {};

		function getInputValue (input, data) {
			var name = input.attr('name'),
				value,
				type = input.attr('type'),
				types = {
					'text': function (input) {
						return input.val();
					},
					'checkbox': function (input) {
						if (input.is(':checked')) {
							return input.val() || true;
						} else {
							return false;
						}
					}
				};

			if (!name) {
				return data;
			}

			if (input.is('select')) {
				type = 'select';
			} else if (input.is('textarea')) {
				type = 'textarea';
			}

			if (!types[type]) {
				type = 'text';
			}

			value = types[type](input);

			if (value !== undefined) {
				if (data[name] && !(data[name] instanceof Array)) {
					data[name] = [data[name]];
				}

				if (data[name] instanceof Array) {
					data[name].push(value);
				} else {
					data[name] = value;
				}
			}

			return data;
		}

		this.node.find('input,select,textarea').not('[type=file]').each(function () {
			data = getInputValue($(this), data);
		});

		return data;
	};

	Form.prototype.success = function (data) {
		this.node.trigger('success.form', data);
	};

	Form.prototype.error = function (data) {
		this.node.trigger('error.form', data);
	};

	Form.prototype.complete = function () {
		this.node.trigger('complete.form');
	};
} (jQuery, app));
/* global -app */