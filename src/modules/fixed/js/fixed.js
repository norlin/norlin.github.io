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