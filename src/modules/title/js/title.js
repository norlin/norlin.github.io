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