/* global app */
(function ($, app) {
	var Tabs = app.createModule({
			name: 'tabs',
			template: 'tabs'
		}),
		classes = {
			tab: 'b-tabs-content',
			tabItem: 'b-tabs-item',
			tabLink: 'b-tabs-link',
			active: 'b-tabs-content__active',
			itemActive: 'b-tabs-item__active'
		},
		duration = app.get('animation');

	Tabs.prototype.render = function (ready) {
		var module = this,
			tabsSource = this.data.dom.find('>div[data-type=tab]'),
			tabs = [],
			i = 0,
			activeExists = false;

		tabsSource.each(function () {
			var tab = $(this),
				active = !!tab.attr('active');

			tabs.push({
				title: tab.attr('title'),
				content: tab.html(),
				id: tab.attr('id') || i,
				active: active
			});

			if (active) {
				activeExists = true;
			}

			i += 1;
		});

		if (!activeExists) {
			tabs[0].active = true;
		}

		this.processDOM();
		this.data.module.tabs = tabs;

		dust.render(this.name + '/' + this.template, this.data, function (err, moduleHtml) {
			module.node = $(moduleHtml);
			ready();
		});
	};

	Tabs.prototype.switchTo = function (tabId) {
		var module = this,
			tab = this.tabs[tabId],
			item = this.items[tabId];

		if (tab && tab.length) {
			this.$tabs.not('.g-hidden').blockHide(duration, function () {
				tab.blockShow(duration, function () {
					module.sandbox.emit('change.tabs');
				});
			});

			this.$items.removeClass(classes.itemActive);
		} else {
			throw new Error('There is no tab with `tabId` == `' + tabId + '`!');
		}

		if (item && item.length) {
			item.addClass(classes.itemActive);
		} else {
			throw new Error('There is no tab link with `tabId` == `' + tabId + '`!');
		}
	};

	Tabs.prototype.ready = function () {
		var module = this;

		this.tabs = {};
		this.items = {};

		this.$tabs = this.node.find('#tabsBody' + module.id + ' >.' + classes.tab);
		this.$items = this.node.find('#tabsHeader' + module.id + ' >.' + classes.tabItem);

		this.$tabs.each(function () {
			var tab = $(this),
				id = tab.data('id');

			if (id !== '' && id !== undefined) {
				module.tabs[id] = tab;
			}
		});

		this.$items.each(function () {
			var item = $(this),
				id = item.data('id'),
				link = item.find('.' + classes.tabLink).addBack();

			if (id !== undefined && id !== '') {
				module.items[id] = item;

				link.click(function (e) {
					e.preventDefault();
					e.stopPropagation();

					module.switchTo(id);
				});
			} else {
				link.click(function (e) {
					e.preventDefault();
					e.stopPropagation();

					throw new Error('Tab id not found in data-id attribute!');
				});
			}
		});

		this.sandbox.bind('switchTo', function (e, tabId) {
			if (tabId) {
				this.switchTo(tabId);
			}
		});
	};
} (jQuery, app));
/* global -app */