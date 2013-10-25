/* global app */
(function ($, app) {
	var Header = app.createModule({
			name: 'header',
			template: 'header'
		}),
		classes = {
			item: 'b-header_button',
			itemActive: 'b-header_button__active',
			routeActive: 'b-router_link__active'
		};

	Header.prototype.ready = function () {
		var title = this.node.find('.js-header-page'),
			items = this.node.find('.' + classes.item),
			ready = false;

		this.sandbox.bind('page', function (e, page) {
			if (!ready) {
				title.html(page);
			}

			items.removeClass(classes.itemActive);
			items.filter('.' + classes.routeActive).addClass(classes.itemActive);
		});

		this.sandbox.bind('name.title', function (e, name) {
			title.html(name);
			ready = true;
		});
	};
} (jQuery, app));
/* global -app */