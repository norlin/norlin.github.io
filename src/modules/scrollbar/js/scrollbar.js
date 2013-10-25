/* global app */
(function ($, app) {
	var Scrollbar = app.createModule({
			name: 'scrollbar',
			template: 'scrollbar'
		});

	Scrollbar.prototype.ready = function () {
		var module = this;

		module.node.jScrollPane();
		this.sandbox.bind('resize change.tabs', function () {
			module.node.jScrollPane('reinitialise');
		});
	};
} (jQuery, app));
/* global -app */