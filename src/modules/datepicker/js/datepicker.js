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