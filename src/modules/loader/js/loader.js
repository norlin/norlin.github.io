/* global app */
(function ($, app) {
	var Loader = app.createModule({
			name: 'loader',
			template: 'loader'
		}),
		duration,
		classes = {
			selector: '>.b-loader_curtain,>.b-loader_block'
		};

	Loader.prototype.ready = function () {
		var module = this;

		function hideLoader (e, element) {
			if (element) {
				module.hideInBlock(element);
			} else {
				module.hide();
			}
		}

		module.sandbox.bind('hide.loader hideStart.loader', hideLoader);

		module.sandbox.bind('show.loader', function (e, element) {
			module.sandbox.unbind('hideStart.loader');

			module.working = true;
			if (element) {
				module.showInBlock(element);
			} else {
				module.show();
			}
		});

		duration = app.get('animation');
		this.node.blockShow(duration);
	};

	Loader.prototype.create = function (callback) {
		var module = this;

		function ready () {
			callback.call(module, $(module.blockLoaderHtml));
		}

		if (this.blockLoaderHtml) {
			ready();
			return;
		}

		dust.render(this.name + '/' + this.template, $.extend(this.data, {
			element: true
		}), function (err, moduleHtml) {
			module.blockLoaderHtml = moduleHtml;
			ready();
		});
	};

	Loader.prototype.hide = function () {
		$(classes.selector, 'body').blockHide(duration, function () {
			$(this).remove();
		});
		this.node.blockHide(duration);
	};

	Loader.prototype.hideInBlock = function (element, force) {
		var node = $(element).find(classes.selector);

		function remove () {
			node.remove();
		}

		if (force) {
			remove();
		} else {
			node.blockHide(duration, function () {
				remove();
			});
		}
	};

	Loader.prototype.show = function () {
		this.node.blockShow(duration);
	};

	Loader.prototype.showInBlock = function (element) {
		element = $(element);

		this.hideInBlock(element, true);

		this.create(function (node) {
			element.append(node);
			node.blockShow(duration);
		});

	};
} (jQuery, app));
/* global -app */