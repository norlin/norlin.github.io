/* MODULE: router */
/* global app */
(function ($, app) {
	var Router = app.createModule({
			name: 'router',
			template: 'router'
		}),
		classes = {
			link: 'b-router_link',
			activeLink: 'b-router_link__active'
		};

	Router.prototype.cleanUrl = function (url) {
		url = url.split(this.base)[1] || url;
		url = url.replace(/(\/$)|(^\/)/g,'');

		return url;
	};

	Router.prototype.ready = function () {
		var router = this,
			startPage;

		this.update();

		this.options = $.extend({index: 'index'}, this.options);

		startPage = window.location.hash.split('#!')[1];

		this.base = app.get('basePath') || '';
		this.base += '/';
		this.index = app.get('indexPath') || '';

		/*if (startPage) {
			this.options.index = this.cleanUrl(startPage);
		}*/

		this.goTo(startPage || this.options.index, {}, true);

		this.sandbox.bind('route.router', function (e, data) {
			router.goTo(data.page, data);
		});

		$(window).on('popstate', function (e) {
			var data = e && e.originalEvent ? e.originalEvent.state : null;

			router.checkPath(extractGetString(window.location.href), data);
		});
	};

	function parseGetParams (getString) {
		var params,
			data = {};

		if (typeof(getString) === 'string') {
			params = extractGetString(getString);
			if (!params) {
				return getString;
			}

			params = params.match(/^\?(.*)/);

			if (params && params[1]) {
				getString = params[1];

				getString = getString.split('&');
				getString.forEach(function (param) {
					param = param.split('=');

					if (data[param[0]]) {
						data[param[0]] = [data[param[0]]];
						data[param[0]].push(param[1]);
					} else {
						data[param[0]] = param[1];
					}
				});

				return data;
			}
		} else if (getString && typeof(getString.page) === 'string') {
			return parseGetParams(getString.page);
		}

		return getString;
	}

	function extractGetString (href) {
		href = href.match(/(\?.*)$/);

		if (href) {
			return href[1];
		} else {
			return undefined;
		}
	}

	Router.prototype.update = function () {
		var router = this;

		this.links = $('a[data-type=route]').addClass(classes.link);

		this.links.off('click.router').on('click.router', function (e) {
			var $this = $(this),
				href = $this.attr('href'),
				params;

			e.preventDefault();

			href = href.split(router.base)[1] || href;
			params = href.match(/(\?.*)$/);

			if (params) {
				href = href.split(params[0])[0];
				params = params[1];
			}

			href = router.cleanUrl(href);

			router.goTo(href, params);
		});
	};

	Router.prototype.goTo = function (path, data, replace) {
		var getParams = '';
		path = this.cleanUrl(path);

		if (path === this.options.index) {
			path = this.index;
		}

		path = this.base + path;

		if (typeof(data) === 'string') {
			path += data;
			getParams = data;
		}

		if (typeof(data) === 'object') {
			data = $.extend(parseGetParams(data), data);
		} else {
			data = parseGetParams(data);
		}

		if (path === (window.history.location || window.location).pathname) {
			replace = true;
		}

		if (replace) {
			app.replaceState(data, null, path);
		} else {
			app.pushState(data, null, path);
		}

		this.checkPath(getParams, data);
	};

	Router.prototype.checkPath = function (getParams, data) {
		var router = this,
			path = (window.history.location || window.location).pathname.split(this.base)[1],
			url,
			url2;

		path = router.cleanUrl(path);

		if (path === '' || path === this.index) {
			path = this.options.index;
		}

		url = url2 = path;

		if (typeof(getParams) === 'string') {
			url += getParams;
			url2 += '/' + getParams;
		}

		this.links.removeClass(classes.activeLink);
		$('a[data-type=route][href="' + this.base + url + '"]').addClass(classes.activeLink);
		$('a[data-type=route][href="' + this.base + url2 + '"]').addClass(classes.activeLink);

		if (this.loading) {
			this.loading.done(function () {
				router.makePage(path, data);
			});
		} else {
			this.makePage(path, data);
		}
	};

	Router.prototype.makePage = function (page, data) {
		var router = this,
			loader = $.Deferred(),
			tmpl;

		tmpl = 'page/' + page;

		//возможно, сделать кеширование страниц
		//(нужно ли? может, проще чтоб всегда с нуля рендерелись)
		router.sandbox.emit('show.loader');
		this.sandbox.bind('append', function () {
			router.sandbox.unbind('append');
			router.sandbox.emit('hide.loader');
			loader.resolve();
		});

		this.loading = loader;

		dust.render(tmpl, data, function (err, html) {
			if (err) {
				throw err;
			}

			if (!html) {
				throw new Error('Empty page! page: `' + page + '`');
			}

			app.renderModules(html, router.node);
			router.sandbox.emit('page', page);
			router.update();
		});
	};
} (jQuery, app));
/* global -app */
/* file: router.js */
(function(){dust.register("router/router",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-router\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</div>");}return body_0;})();
/* file: router.dust */

/* end module router */
/* MODULE: button */
/* global app */
(function ($, app) {
	var Button = app.createModule({
			name: 'button',
			template: 'button'
		});

	Button.prototype.ready = function () {
	};
} (jQuery, app));
/* global -app */
/* file: button.js */
(function(){dust.register("button/button",body_0);function body_0(chk,ctx){return chk.write("<button class=\"b-button").exists(ctx.getPath(false,["module","options","color"]),ctx,{"block":body_1},null).write("\" ").exists(ctx.getPath(false,["module","options","disabled"]),ctx,{"block":body_2},null).write(">").exists(ctx.getPath(false,["module","options","icon"]),ctx,{"block":body_3},null).reference(ctx.getPath(false,["module","content"]),ctx,"h").write("</button>");}function body_1(chk,ctx){return chk.write(" b-button__").reference(ctx.getPath(false,["module","options","color"]),ctx,"h");}function body_2(chk,ctx){return chk.write("disabled");}function body_3(chk,ctx){return chk.write("<i class=\"b-button_icon b-button_icon__").reference(ctx.getPath(false,["module","options","icon"]),ctx,"h").write("\"></i>");}return body_0;})();
/* file: button.dust */

/* end module button */
/* MODULE: datepicker */
/* global app */
(function ($, app) {
	var Datepicker = app.createModule({
			name: 'datepicker',
			template: 'datepicker'
		});

	Datepicker.prototype.ready = function () {
		var datepickerNode,
			monthButton,
			monthButtonTemplate = [
				'<button class="b-button b-datepicker_button b-datepicker_button__%btn%">',
					'<i class="b-datepicker_button_icon b-datepicker_button_icon__%btn%"></i>',
				'</button>'].join('');

		this.node.Zebra_DatePicker({
			days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
			days_abbr: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
			format: 'd.m.Y',
			months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
			show_clear_date: false,
			show_select_today: false,
			header_navigation: [
					monthButtonTemplate.replace(/%btn%/g, 'prev'),
					monthButtonTemplate.replace(/%btn%/g, 'next')
				]
		});

		datepickerNode = this.node.data('Zebra_DatePicker').datepicker;
		monthButton = datepickerNode.find('.dp_caption');

		if (!monthButton.hasClass('b-button')) {
			monthButton.addClass('b-button');
		}
	};
} (jQuery, app));
/* global -app */
/* file: datepicker.js */
(function(){dust.register("datepicker/datepicker",body_0);function body_0(chk,ctx){return chk.write("<input class=\"b-input b-input__datepicker\"").exists(ctx.getPath(false,["module","options","id"]),ctx,{"block":body_1},null).write(" type=\"text\" value=\"").reference(ctx.getPath(false,["module","content"]),ctx,"h").write("\"").exists(ctx.getPath(false,["module","options","disabled"]),ctx,{"block":body_2},null).write(" />");}function body_1(chk,ctx){return chk.write(" id=\"").reference(ctx.getPath(false,["module","options","id"]),ctx,"h").write("\"");}function body_2(chk,ctx){return chk.write(" disabled");}return body_0;})();
/* file: datepicker.dust */

/* end module datepicker */
/* MODULE: scrollbar */
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
/* file: scrollbar.js */
(function(){dust.register("scrollbar/scrollbar",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-scrollbar").exists(ctx.getPath(false,["module","options","disabled"]),ctx,{"block":body_1},null).write("\" ").exists(ctx.getPath(false,["module","options","disabled"]),ctx,{"block":body_2},null).write("><p>").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</p></div>");}function body_1(chk,ctx){return chk.write(" b-scrollbar__disabled");}function body_2(chk,ctx){return chk.write("disabled");}return body_0;})();
/* file: scrollbar.dust */

/* end module scrollbar */
/* MODULE: header */
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
/* file: header.js */
(function(){dust.register("header/content",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-header_block b-header_block__first\"><h1 class=\"b-header_title").exists(ctx.getPath(false,["module","options","class"]),ctx,{"block":body_1},null).write("\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</h1></div><div class=\"b-header_block b-header_block__second\"><a class=\"b-header_button\" href=\"/index\" data-type=\"route\">Hello</a></div><div class=\"b-header_block\"><a class=\"b-header_button\" href=\"/page2\" data-type=\"route\">Bye</a></div><div class=\"b-header_right\"><div class=\"b-header_block\"></div><div class=\"b-header_block\"><!-- help --></div></div>");}function body_1(chk,ctx){return chk.write(" b-header_title__").reference(ctx.getPath(false,["module","options","class"]),ctx,"h");}return body_0;})();
/* file: content.dust */
(function(){dust.register("header/header",body_0);function body_0(chk,ctx){return chk.write("<div>").helper("my",ctx,{"block":body_1},{"module":"fixed"}).write("</div>");}function body_1(chk,ctx){return chk.write("<div class=\"b-header g-transition-opacity\"><div class=\"b-header-content\">").partial("header/content",ctx,null).write("</div></div>");}return body_0;})();
/* file: header.dust */

/* end module header */
/* MODULE: tabs */
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
/* file: tabs.js */
(function(){dust.register("tabs/tabs",body_0);function body_0(chk,ctx){return chk.write("<div>").exists(ctx.getPath(false,["module","options","fixed"]),ctx,{"block":body_1},null).write("<div class=\"b-tabs-header\"><ul id=\"tabsHeader").reference(ctx.getPath(false,["module","id"]),ctx,"h").write("\" class=\"b-tabs-menu\">").section(ctx.getPath(false,["module","tabs"]),ctx,{"block":body_2},null).write("</ul></div>").exists(ctx.getPath(false,["module","options","fixed"]),ctx,{"block":body_4},null).write("<div id=\"tabsBody").reference(ctx.getPath(false,["module","id"]),ctx,"h").write("\" class=\"b-tabs-body\">").section(ctx.getPath(false,["module","tabs"]),ctx,{"block":body_5},null).write("</div></div>");}function body_1(chk,ctx){return chk.write("<div data-type=\"module\" data-name=\"fixed\">");}function body_2(chk,ctx){return chk.write("<li data-id=\"").reference(ctx.get("id"),ctx,"h").write("\" class=\"b-tabs-item").exists(ctx.get("active"),ctx,{"block":body_3},null).write(" g-transition-background\"><a class=\"b-tabs-link\" href=\"#tab").reference(ctx.get("id"),ctx,"h").write("\">").reference(ctx.get("title"),ctx,"h").write("</a></li>");}function body_3(chk,ctx){return chk.write(" b-tabs-item__active");}function body_4(chk,ctx){return chk.write("</div>");}function body_5(chk,ctx){return chk.write("<div data-id=\"").reference(ctx.get("id"),ctx,"h").write("\" class=\"g-transition-opacity b-tabs-content").notexists(ctx.get("active"),ctx,{"block":body_6},null).write("\">").reference(ctx.get("content"),ctx,"h",["s"]).write("</div>");}function body_6(chk,ctx){return chk.write(" g-hidden g-fade");}return body_0;})();
/* file: tabs.dust */

/* end module tabs */
/* MODULE: dropdown */
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
/* file: dropdown.js */
(function(){dust.register("dropdown/dropdown",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-dropdown g-transition-background\"><span class=\"b-dropdown_title").exists(ctx.getPath(false,["module","options","class"]),ctx,{"block":body_1},null).write("\">").reference(ctx.getPath(false,["module","options","title"]),ctx,"h").write("</span><i class=\"b-dropdown_arrow\"></i></div><ul class=\"b-dropdown_list").exists(ctx.getPath(false,["module","options","block"]),ctx,{"block":body_2},null).write(" b-dropdown_list__hidden\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</ul>");}function body_1(chk,ctx){return chk.write(" ").reference(ctx.getPath(false,["module","options","class"]),ctx,"h");}function body_2(chk,ctx){return chk.write(" b-dropdown_list__block");}return body_0;})();
/* file: dropdown.dust */
(function(){dust.register("dropdown/mini",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-dropdown b-dropdown__mini g-transition-background\"><span class=\"b-dropdown_title").exists(ctx.getPath(false,["module","options","class"]),ctx,{"block":body_1},null).write("\">").reference(ctx.getPath(false,["module","options","title"]),ctx,"h").write("</span></div><div class=\"b-dropdown_list b-dropdown_list__block b-dropdown_list__hidden\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</div>");}function body_1(chk,ctx){return chk.write(" ").reference(ctx.getPath(false,["module","options","class"]),ctx,"h");}return body_0;})();
/* file: mini.dust */

/* end module dropdown */
/* MODULE: fixed */
/* global app */
(function ($, app) {
	var Fixed = app.createModule({
			name: 'fixed',
			template: 'fixed'
		}),
		classes = {
			fixed: 'b-fixed__fixed',
			container: 'b-fixed-container'
		};

	Fixed.prototype.updateList = function () {
		this.fixedList = app.get('fixed-list');

		if (!this.fixedList) {
			this.fixedList = [];
			app.set({
				'fixed-list': this.fixedList
			});
		}

		this.fixed = {
			node: this.container
		};

		this.fixedList.push(this.fixed);
	};

	Fixed.prototype.updatePosition = function () {
		var index,
			top = 0;

		if (this.fixed.position === undefined) {
			this.fixed.position = this.container.offset().top;

			this.fixedList.sort(function (a, b) {
				return a.position - b.position;
			});
		}

		index = this.fixedList.indexOf(this.fixed);

		/* jshint plusplus:false */
		while (index--) {
			top += this.fixedList[index].height || 0;
		}
		/* jshint plusplus:true */

		this.fixedTop = top;
	};

	Fixed.prototype.updateSize = function (forced) {
		if (!this.fixed.height || forced) {
			this.fixed.height = this.container.height();
		}

		if (!this.fixed.position && !this.stucked) {
			this.fixed.position = this.container.offset().top;

			this.fixedList.sort(function (a, b) {
				return a.position - b.position;
			});
		}
	};

	Fixed.prototype.ready = function () {
		var module = this;

		this.container = this.node.find('.' + classes.container);
		this.updateList();

		this.sandbox.bind('scroll', function () {
			module.onScroll();
		});

		this.sandbox.bind('change.tabs', function () {
			module.updateSize(true);
			module.onScroll();
		});

		this.sandbox.bind('resize', function () {
			module.unfix();
			module.updateSize(true);
			module.onScroll();
		});

		module.updateSize(true);
		module.onScroll();
	};

	Fixed.prototype.onScroll = function () {
		var scrollTop = $(window).scrollTop();

		this.updatePosition();

		if (scrollTop + this.fixedTop > this.fixed.position) {
			this.fix();
		} else {
			this.unfix();
		}
	};

	Fixed.prototype.fix = function () {
		if (!this.stucked && this.fixed.height) {
			this.stucked = true;
			this.node.height(this.fixed.height);
			this.container.addClass(classes.fixed);
			this.container.css('top', this.fixedTop);
		}
	};

	Fixed.prototype.unfix = function () {
		if (this.stucked) {
			this.stucked = false;
			this.node.css('height', '');
			this.container.removeClass(classes.fixed);
			this.container.css('top', '');
		}
	};
} (jQuery, app));
/* global -app */
/* file: fixed.js */
(function(){dust.register("fixed/fixed",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-fixed\"><div class=\"b-fixed-container").exists(ctx.getPath(false,["module","options","inline"]),ctx,{"block":body_1},null).write("\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</div></div>");}function body_1(chk,ctx){return chk.write(" b-fixed__inline");}return body_0;})();
/* file: fixed.dust */

/* end module fixed */
/* MODULE: footer */
/* global app */
(function ($, app) {
	var Footer = app.createModule({
			name: 'footer',
			template: 'footer'
		});

	Footer.prototype.ready = function () {
		//var module = this;

		//module usage
	};
} (jQuery, app));
/* global -app */
/* file: footer.js */
(function(){dust.register("footer/footer",body_0);function body_0(chk,ctx){return chk.exists(ctx.getPath(false,["module","options","sticked"]),ctx,{"block":body_1},null).write("<div class=\"b-footer").exists(ctx.getPath(false,["module","options","sticked"]),ctx,{"block":body_2},null).write("\"><div class=\"b-footer_block b-footer_block__last\"><a class=\"b-footer_link\" href=\"mailto:alexey@norlin.ru\">alexey@norlin.ru</a></div></div>");}function body_1(chk,ctx){return chk.write("<div class=\"b-footer_push\"></div>");}function body_2(chk,ctx){return chk.write(" b-footer__sticked");}return body_0;})();
/* file: footer.dust */

/* end module footer */
/* MODULE: select */
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
/* file: select.js */
(function(){dust.register("select/select",body_0);function body_0(chk,ctx){return chk.exists(ctx.getPath(false,["module","options","input"]),ctx,{"else":body_1,"block":body_4},null);}function body_1(chk,ctx){return chk.write("<select class=\"b-select ").reference(ctx.getPath(false,["module","options","class"]),ctx,"h").write("\"").exists(ctx.getPath(false,["module","options","name"]),ctx,{"block":body_2},null).write(" ").exists(ctx.getPath(false,["module","options","disabled"]),ctx,{"block":body_3},null).write(">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</select>");}function body_2(chk,ctx){return chk.write(" name=\"").reference(ctx.getPath(false,["module","options","name"]),ctx,"h").write("\"");}function body_3(chk,ctx){return chk.write("disabled");}function body_4(chk,ctx){return chk.write("<input class=\"b-select ").reference(ctx.getPath(false,["module","options","class"]),ctx,"h").write("\"").exists(ctx.getPath(false,["module","options","name"]),ctx,{"block":body_5},null).exists(ctx.getPath(false,["module","options","id"]),ctx,{"block":body_6},null).exists(ctx.getPath(false,["module","options","type"]),ctx,{"block":body_7},null).write("/>");}function body_5(chk,ctx){return chk.write(" name=\"").reference(ctx.getPath(false,["module","options","name"]),ctx,"h").write("\"");}function body_6(chk,ctx){return chk.write(" id=\"").reference(ctx.getPath(false,["module","options","id"]),ctx,"h").write("\"");}function body_7(chk,ctx){return chk.write(" type=\"").reference(ctx.getPath(false,["module","options","type"]),ctx,"h").write("\"");}return body_0;})();
/* file: select.dust */

/* end module select */
/* MODULE: loader */
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
/* file: loader.js */
(function(){dust.register("loader/loader",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-loader_curtain").exists(ctx.get("element"),ctx,{"block":body_1},null).write(" g-transition-opacity g-fade g-hidden\"></div><div class=\"b-loader_block").exists(ctx.get("element"),ctx,{"block":body_2},null).write(" g-transition-opacity g-fade g-hidden\"><i class=\"b-loader\"></i>").exists(ctx.get("text"),ctx,{"else":body_3,"block":body_4},null).write("</div>");}function body_1(chk,ctx){return chk.write(" b-loader_curtain__element");}function body_2(chk,ctx){return chk.write(" b-loader_block__element");}function body_3(chk,ctx){return chk.write("Загрузка...");}function body_4(chk,ctx){return chk.reference(ctx.get("text"),ctx,"h");}return body_0;})();
/* file: loader.dust */

/* end module loader */
/* MODULE: title */
/* global app */
(function ($, app) {
	var Title = app.createModule({
			name: 'title',
			template: 'title'
		});

	/*
	Title.prototype.render = function (ready) {
		var module = this,
			moduleSource = this.data.dom; //`<div data-type="module">` node from app template

		this.processDOM();

		//method for custom html renderer

		dust.render(this.name + '/' + this.template, this.data, function (err, moduleHtml) {
			module.node = $(moduleHtml);
			ready();
		});
	};
	*/

	Title.prototype.ready = function () {
		var module = this,
			title = this.node.find('.js-title-name');

		module.sandbox.emit('name.title', title.html());
	};
} (jQuery, app));
/* global -app */
/* file: title.js */
(function(){dust.register("title/title",body_0);function body_0(chk,ctx){return chk.write("<div class=\"b-title b-block").exists(ctx.getPath(false,["module","options","hidden"]),ctx,{"block":body_1},null).write("\"><h2 class=\"b-title_text js-title-name\">").reference(ctx.getPath(false,["module","content"]),ctx,"h",["s"]).write("</h2></div>");}function body_1(chk,ctx){return chk.write(" g-hidden");}return body_0;})();
/* file: title.dust */

/* end module title */
(function(){dust.register("page/index",body_0);function body_0(chk,ctx){return chk.helper("my",ctx,{"block":body_1},{"module":"title","hidden":"true"}).write("<div class=\"b-block\">Initial commit<p>На этой страничке заголовок скрыт.</p></div>");}function body_1(chk,ctx){return chk.write("Hello, world!");}return body_0;})();
/* file: index.dust */
(function(){dust.register("page/page2",body_0);function body_0(chk,ctx){return chk.helper("my",ctx,{"block":body_1},{"module":"title"}).write("<div class=\"b-block\">Test page for initial commit</div>");}function body_1(chk,ctx){return chk.write("Goodbye, world!");}return body_0;})();
/* file: page2.dust */
/* global app */
(function (window, $, app) {
	//app.start('app-name', dataForTemplate, container);
	app.set({
		animation: 400
	});

	//window.setTimeout(function () {
		app.start('index', {}, '#layout');
	//}, 2000);

}(window, jQuery, app));
/* global -app */(function(){dust.register("index",body_0);function body_0(chk,ctx){return chk.helper("my",ctx,{"block":body_1},{"module":"header"}).helper("my",ctx,{"block":body_2},{"module":"router"}).helper("my",ctx,{},{"module":"footer","sticked":"true"}).helper("my",ctx,{},{"module":"loader"});}function body_1(chk,ctx){return chk.write("pages");}function body_2(chk,ctx){return chk.partial("page/index",ctx,null);}return body_0;})();