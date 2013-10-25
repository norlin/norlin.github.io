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

			app.renderModules($(html), router.node);
			router.sandbox.emit('page', page);
			router.update();
		});
	};
} (jQuery, app));
/* global -app */