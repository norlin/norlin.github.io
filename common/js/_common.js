if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        };
    })();
}

if (typeof(Function.bind) !== "function"){
    Function.prototype.bind = function(bindTo){
        var fn = this;

        return function(){
            fn.apply(bindTo,arguments);
        };
    };
}


if (typeof([].forEach) !== "function"){
    Array.prototype.forEach = function(fn, thisObj) {
        var i, l;

        for (i = 0, l = this.length; i < l; i+=1) {
            if (i in this) {
                fn.call(thisObj, this[i], i, this);
            }
        }
    };
}

if (typeof([].indexOf) !== "function"){
    Array.prototype.indexOf = function(elt /*, from*/){
        var len = this.length,
            from = Number(arguments[1]) || 0;

        from = (from < 0) ? Math.ceil(from): Math.floor(from);
        if (from < 0){
            from += len;
        }

        for (; from < len; from+=1){
            if (from in this && this[from] === elt){
                return from;
            }
        }
        return -1;
    };
}

if (typeof([].map) !== "function") {
    Array.prototype.map = function(mapper, that /*opt*/) {
        var other = new Array(this.length),
            i,
            n = this.length;

        for (i = 0; i < n; i+=1) {
            if (i in this) {
                other[i] = mapper.call(that, this[i], i, this);
            }
        }

        return other;
    };
}

if (typeof([].filter) !== "function") {
    Array.prototype.filter = function(filter, that /*opt*/) {
        var other = [],
            v,
            i,
            n = this.length;

        for (i = 0; i < n; i += 1) {
            if (i in this && filter.call(that, v = this[i], i, this)) {
                other.push(v);
            }
        }

        return other;
    };
}

/* exported wordEnd */
function wordEnd(word,num){
    //word = ['сайтов','сайта','сайт']
    var num100 = num % 100;

    if (num === 0){
        return typeof(word[3]) !== 'undefined' ? word[3] : word[0];
    }
    if (num100 > 10 && num100 < 20){
        return word[0];
    }
    if ( (num % 5 >= 5) && (num100 <= 20) ){
        return word[0];
    }else{
        num = num % 10;
        if (((num >= 5) && num <= 9) || (num === 0)){
            return word[0];
        }
        if ((num >= 2) && (num <= 4)){
            return word[1];
        }
        if (num === 1){
            return word[2];
        }
    }
    return word[0];
}

/* exported getRandom */
function getRandom(min,max){
    min = min || 1;
    if (!max){
        max = min;
        min = 0;
    }

    return Math.floor(Math.random()*(max-min) + min);
}

(function (window, $) {
    jQuery.fn.blockHide = function (duration, callback) {
        var $this = $(this),
            timer = $this.data('fadeTimer');

        if (timer) {
            window.clearTimeout(timer);
        }

        $this.addClass('g-fade');
        timer = window.setTimeout(function () {
            $this.addClass('g-hidden');

            if (callback) {
                callback.apply(this);
            }
        }, duration);

        $this.data('fadeTimer', timer);
    };

    jQuery.fn.blockShow = function (duration, callback) {
        var $this = $(this),
            timer = $this.data('fadeTimer');

        if (timer) {
            window.clearTimeout(timer);
        }

        $this.removeClass('g-hidden');
        timer = window.setTimeout(function () {
            $this.removeClass('g-fade');

            timer = window.setTimeout(function () {
                if (callback) {
                    callback.apply(this);
                }
            }, duration);

            $this.data('fadeTimer', timer);
        }, 13);

        $this.data('fadeTimer', timer);
    };
} (window, jQuery));
/* file: common.js */
(function (window, $) {
	var App = function () {
		var data = {
				basePath: window.location.pathname.replace(/\/[^\/]*?$/,''),
				indexPath: window.location.pathname.replace(/^.*\/([^\/]*)$/,'$1')
			};

		this.sandboxes = [];
		this.modules = {};
		this.pages = [];

		this.set = function (newData) {
			data = $.extend(data, newData);
		};

		this.get = function (param) {
			return data[param];
		};
	};

	/**
	 * Создание потомка класса Модуль
	 */
	App.prototype.createModule = function (params) {
		this.modules[params.name] = function () {
			var param;
			Module.apply(this, arguments);

			for (param in params) {
				if (params.hasOwnProperty(param)) {
					this[param] = params[param];
				}
			}
		};

		this.modules[params.name].prototype = Object.create(Module.prototype);
		this.modules[params.name].prototype.name = params.name;

		return this.modules[params.name];
	};

	App.prototype.create = function (moduleType, data, callback) {
		var module,
			sandbox,
			CurrentModule = this.modules[moduleType];

		if (CurrentModule) {
			module = new CurrentModule();
			module.set(data);

			sandbox = new Sandbox(this, module.name);
			this.sandboxes.push(sandbox);

			module.init(sandbox).done(callback);
		} else {
			throw 'Module "' + moduleType + '" not found!';
			//callback();
		}
	};

	App.prototype.renderModules = function (node, container) {
		var app = this,
			wrapper = $('<div></div>');

		wrapper.append(node);

		this.initModules(wrapper, function () {
			if (!container) {
				container = app.container;
				app.node = app.container;
			}

			container.empty();
			container.append(wrapper.contents());

			app.trigger('append');
			app.trigger('resize');
		});
	};

	App.prototype.initModules = function (container, callback) {
		var app = this,
			loaders = [],
			modules;

		modules = container.find('[data-type=module]').addBack('[data-type=module]').not('[data-type=module] [data-type=module]');
		modules.each(function () {
			var loader = $.Deferred();
			loaders.push(loader);

			app.initModule(this, function () {
				loader.resolve();
			});
		});

		function initDone() {
			//remove uninited modules from template
			modules.remove();
			callback();
		}

		if (callback) {
			if (loaders.length) {
				$.when.apply($, loaders).done(initDone);
			} else {
				initDone();
			}
		}
	};

	App.prototype.initModule = function (moduleNode, callback) {
		var app = this,
			$this = $(moduleNode),
			name = $this.data('name');

		if (name) {
			app.create(name, {dom: $this}, function (module) {
				if (module && module.node) {
					app.initModules(module.node, callback);
				} else {
					callback();
				}
			});
		} else {
			callback();
		}
	};

	App.prototype.trigger = function (event, data) {
		this.sandboxes.forEach(function (sandbox) {
			sandbox.trigger(event, data);
		});

		//this.container.trigger(event, data);
	};

	App.prototype.start = function (name, data, container, callback) {
		var app = this;

		this.name = name;

		function start() {
			var page,
				pageRx = /^page\/(.*)$/;

			for (page in dust.cache) {
				if (dust.cache.hasOwnProperty(page) && pageRx.test(page)) {
					app.pages.push(page.replace(pageRx, '$1'));
				}
			}

			app.container = $(container) || $('body');

			callback = callback || function () {
				app.trigger('hideStart.loader');
			};

			dust.render(app.name, data, function (err, html) {
				app.node = $('<div></div>');
				app.node.html(html);

				if (err) {
					throw err;
				}

				app.renderModules(app.node);
				if (callback) {
					callback();
				}
			});

			$(window).resize(function (e) {
				app.trigger('resize', e);
			}).scroll(function (e) {
				app.trigger('scroll', e);
			});
		}

		$(start);
	};

	App.prototype.pushState = function (data, title, url) {
		window.history.pushState(data, title, url);
	};

	App.prototype.replaceState = function (data, title, url) {
		window.history.replaceState(data, title, url);
	};
	/**
	 * Песочница для модулей
	 */
	var Sandbox = function (app, name) {
		this.app = app;
		this.name = name;
		this.events = $('<sandbox></sandbox>');

		this.eventList = [];

		this.createId();
	};

	Sandbox.prototype.ready = function () {
		var sandbox = this;
		this.working = true;

		this.eventList.forEach(function (event) {
			sandbox.trigger(event.event, event.data);
		});

		this.eventList = [];
	};

	Sandbox.prototype.bind = function (event, callback) {
		this.events.bind(event, callback);
	};

	Sandbox.prototype.unbind = function (event) {
		this.events.unbind(event);
	};

	Sandbox.prototype.trigger = function (event, data) {
		if (this.working || event === 'append') {
			//TODO: сделать нормальную систему событий
			this.events.trigger(event, data);
		} else {
			this.eventList.push({
				event: event,
				data: data
			});
		}
	};

	Sandbox.prototype.emit = function (event, data) {
		this.app.trigger(event, data);
	};

	Sandbox.prototype.createId = function () {
		var ts;

		if (!this.id) {
			ts = (new Date()).getTime();

			this.id = ts + '_' + Math.floor(Math.random() * 10000);
		}
	};

	/**
	 * Конструктор модуля
	 */
	var Module = function () {
		this.data = {};
	};

	Module.prototype.set = function (data) {
		this.data = $.extend(this.data, data);
	};

	Module.prototype.init = function (sandbox) {
		var module = this,
			ready = $.Deferred();

		this.sandbox = sandbox;
		this.id = sandbox.id;

		if (this.template) {
			if (module.data.dom) {
				module.options = module.data.dom.data('options');
			}

			this.render(function () {
				if (module.data.dom) {
					module.data.dom.replaceWith(module.node);
				}

				module.sandbox.bind('append.create', function () {
					var moduleReady;

					module.sandbox.unbind('append.create');

					if (module.node) {
						module.node.data('Module', module);
					}

					moduleReady = module.ready();
					if (moduleReady) {
						moduleReady.done(module.sandbox.ready());
					} else {
						module.sandbox.ready();
					}
				});
				ready.resolve(module);
			});
		} else {
			this.ready();
			ready.resolve(module);
		}

		return ready;
	};

	Module.prototype.processDOM = function () {
		var module = this,
			moduleSource;

		if (module.data.dom) {
			moduleSource = module.data.dom.html();
		}

		this.data.module = {
			id: module.id,
			options: this.options,
			content: moduleSource
		};
	};
//
	Module.prototype.render = function (callback) {
		var module = this;
		this.processDOM();

		dust.render(this.name + '/' + this.template, this.data, function (err, moduleHtml) {
			if (err) {
				throw err;
			}

			module.node = $(moduleHtml);

			callback();
		});
	};

	Module.prototype.ready = function () {
		//module usage
		window.console.warn('Please, define `ready` method for module `' + this.name + '`');
	};

	/* exported app */
	window.app = new App();
} (window, jQuery));
/* file: core.js */
(function() {
/**
 * Подключение dust-хэлперов для node.js и browser использования
 */

    var helpers = {};

    function addHelpers (dust) {
        var helper;

        dust.helpers = dust.helpers || {};

        for (helper in helpers) {
            if (helpers.hasOwnProperty(helper)) {
                dust.helpers[helper] = helpers[helper];
            }
        }
    }

    /* HELPERS HERE */

    helpers.my = function (chunk, ctx, bodies, params) {
        var body = bodies.block,
            //content,
            moduleTypes = {
                table: {
                    node: 'table'
                },
                form: {
                    node: 'form'
                }
            },
            moduleType = dust.helpers.tap(params.module, chunk, ctx),
            moduleParams = moduleTypes[moduleType] || {},
            paramName,
            saveData;

        for (paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                moduleParams[paramName] = dust.helpers.tap(params[paramName], chunk, ctx);
            }
        }

        moduleParams.node = moduleParams.node || 'div';

        function createModuleHtml (moduleParams, content) {
            var opt = '';
            content = content || '';

            opt = "data-options='" + JSON.stringify(moduleParams) + "'";

            return '<' + moduleParams.node + ' data-type="module" data-name="' + moduleParams.module + '" ' + opt + '>' + content + '</' + moduleParams.node + '>';
        }

        if (bodies.json) {
            saveData = chunk.data;
            ctx = ctx.push(params);
            chunk.data = [];
            moduleParams.json = bodies.json(chunk, ctx).data.join('');
            moduleParams.json = JSON.parse(moduleParams.json);
            chunk.data = saveData;
        }

        if (body) {
            return chunk.capture(body, ctx, function(string, chunk) {
                chunk.end(createModuleHtml(moduleParams, string));
            });
        }

        return chunk.write(createModuleHtml(moduleParams));
    };

    /* end helpers */

    /* global module */
    if (typeof(module) !== 'undefined') {
        module.exports = addHelpers;
    } else if (typeof(dust) !== 'undefined') {
        addHelpers(dust);
    } else {
        throw "Can't find Dust!";
    }
}());
/* file: helpers.js */
