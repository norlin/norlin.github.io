/* global app */
(function ($, app) {
	var Dropdown = app.createModule({
			name: 'dropdown',
			template: 'dropdown'
		}),
		classes = {
			base: 'b-dropdown',
			baseOpened: 'b-dropdown__opened',
			title: 'b-dropdown_title',
			list: 'b-dropdown_list',
			listHidden: 'b-dropdown_list__hidden',
			item: 'b-dropdown_item',
			itemActive: 'b-dropdown_item__active'
		};

	Dropdown.prototype.render = function (ready) {
		var module = this,
			moduleSource = this.data.dom, //`module` node from app template
			active,
			template = this.options.template || this.template;

		if (moduleSource) {
			moduleSource.find('li').addClass(classes.item);
			active = moduleSource.find('.active');

			if (active.length === 0) {
				active = $(moduleSource.find('li')[0]);
			}

			active.addClass(classes.itemActive);
		}

		this.processDOM();

		dust.render(this.name + '/' + template, this.data, function (err, moduleHtml) {
			module.node = $(moduleHtml);
			ready();
		});
	};

	Dropdown.prototype.ready = function () {
		var list;

		list = new DropdownList(this, this.node);

		this.sandbox.bind('resize', function () {
			list.updateSize();
		});
	};

	var DropdownList = function (module, node) {
		var list = this;
		this.module = module;

		this.button = node.filter('.' + classes.base);
		this.title = this.button.find('.' + classes.title);
		this.list = node.filter('.' + classes.list);

		this.dimensions = {};

		if (!module.options.block) {
			this.items = [];
			this.itemNodes = this.list.find('.' + classes.item);

			this.itemNodes.each(function () {
				list.items.push(new DropdownItem(list, $(this)));
			});
		}

		this.bindAll();
	};

	DropdownList.prototype.updateSize = function () {
		var listWidth;
		this.dimensions.width = this.button.outerWidth();
		this.dimensions.height = this.button.outerHeight();

		listWidth = Math.max(this.dimensions.width + 10, this.list.width());
		this.list.width(listWidth);
	};

	DropdownList.prototype.updatePosition = function () {
		var offset = this.button.offset();

		this.dimensions.top = offset.top;
		this.dimensions.left = offset.left;

		offset.top += this.dimensions.height;

		this.list.css(offset);
	};

	DropdownList.prototype.open = function () {
		this.updatePosition();

		this.list.removeClass(classes.listHidden);
		this.button.addClass(classes.baseOpened);
		this.opened = true;
	};

	DropdownList.prototype.clearTimer = function () {
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = undefined;
		}
	};

	DropdownList.prototype.makeTimer = function () {
		var list = this;

		this.clearTimer();

		this.timer = window.setTimeout(function () {
			list.close();
			list.timer = undefined;
		}, 500);
	};

	DropdownList.prototype.close = function () {
		this.list.addClass(classes.listHidden);
		this.button.removeClass(classes.baseOpened);
		this.opened = false;
		this.clearTimer();
	};

	DropdownList.prototype.bindAll = function () {
		var list = this;

		this.updateSize();

		this.button.click(function () {
			if (list.opened) {
				list.close();
			} else {
				list.open();
			}
		});

		list.list.appendTo('body');

		function timerUpdate () {
			list.makeTimer();
		}

		function timerClear () {
			list.clearTimer();
		}

		this.button.on({
			'mouseenter': timerClear,
			'mouseleave': timerUpdate,
		});
		this.list.on({
			'mouseenter': timerClear,
			'mouseleave': timerUpdate,
		});
	};

	var DropdownItem = function (list, node) {
		this.list = list;
		this.node = node;

		this.bindEvents();

		if (this.node.is('.' + classes.itemActive)) {
			this.activate();
		}
	};

	DropdownItem.prototype.bindEvents = function () {
		var item = this;
		this.node.click(function () {
			item.activate();
			item.list.close();
		});
	};

	DropdownItem.prototype.activate = function () {
		this.list.title.html(this.node.text());
		this.list.itemNodes.removeClass(classes.itemActive);
		this.list.updateSize();

		this.node.addClass(classes.itemActive);
	};
} (jQuery, app));
/* global -app */