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
/* global -app */