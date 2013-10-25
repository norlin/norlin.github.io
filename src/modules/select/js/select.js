/* global app */
(function ($, app) {
	var Select = app.createModule({
			name: 'select',
			template: 'select'
		});

	Select.prototype.ready = function () {
		var options = {};

		if (this.options.input) {
			/*options.query = function (query) {
				var data = {results: []};

				query.callback(data);
			};*/
		}

		if (this.options.json) {
			options.data = this.options.json;
		}

		if (this.options.ajax) {
			options.ajax = {
				url: this.options.ajax
			};
		}

		this.node.select2(options);
	};
} (jQuery, app));
/* global -app */