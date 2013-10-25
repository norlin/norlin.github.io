var assert = chai.assert;

describe('Существование модуля', function() {
	var header;

	before(function () {
		header = $('.b-header');
	});

	it('должен быть только 1', function(){
		assert.equal(header.length, '1', 'Должен быть только 1 элемент .b-header!');
	});

	it('должен быть обёрнут в fixed', function() {
		assert.equal(header.parent('.b-fixed-container').length, '1', 'Должен быть обёрнут в модуль fixed');
	});
});