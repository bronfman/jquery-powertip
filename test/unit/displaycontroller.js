/*global
	DATA_HASACTIVEHOVER:true
	session:true
	DisplayController:true*/
$(function() {
	'use strict';

	module('Display Controller');

	test('expose methods', function() {
		var dc = new DisplayController();
		strictEqual(typeof dc.show, 'function', 'show method is defined');
		strictEqual(typeof dc.hide, 'function', 'hide method is defined');
		strictEqual(typeof dc.cancel, 'function', 'cances method is defined');
		strictEqual(typeof dc.resetPosition, 'function', 'resetPosition method is defined');
	});

	asyncTest('show method calls TooltipController.showTip', function() {
		var element = $('<span />'),
			showCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					showCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		dc.show();

		setTimeout(function() {
			ok(showCalled, 'showTip called');
			start();
		}, $.fn.powerTip.defaults.intentPollInterval + 10);
	});

	asyncTest('hide method calls TooltipController.hideTip', function() {
		var element = $('<span />'),
			hideCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function(el) {
					hideCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide();

		setTimeout(function() {
			ok(hideCalled, 'hideTip called');
			start();
		}, $.fn.powerTip.defaults.closeDelay + 10);
	});

	test('resetPosition method calls TooltipController.resetPosition', function() {
		var element = $('<span />'),
			resetCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				null,
				function() {
					resetCalled = true;
				}
			)
		);

		dc.resetPosition();

		ok(resetCalled, 'resetPosition method called');
	});

	test('show method does not delay when immediate is set to true', function() {
		var element = $('<span />'),
			showCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function(el) {
					showCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		dc.show(true);

		ok(showCalled, 'showTip called');
	});

	test('hide method does not delay when disableDelay is set to true', function() {
		var element = $('<span />'),
			hideCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function(el) {
					hideCalled = true;
					deepEqual(el, element, 'original element passed');
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide(true);

		ok(hideCalled, 'hideTip called');
	});

	asyncTest('cancel method stops showTip from being called', function(){
		var element = $('<span />'),
			showCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				function() {
					showCalled = true;
				}
			)
		);

		dc.show();

		setTimeout(function() {
			dc.cancel();

			setTimeout(function() {
				ok(!showCalled, 'showTip was not called');
				start();
			}, $.fn.powerTip.defaults.intentPollInterval / 2 + 10);
		}, $.fn.powerTip.defaults.intentPollInterval / 2);
	});

	asyncTest('cancel method stops hideTip from being called', function(){
		var element = $('<span />'),
			hideCalled = false,
			dc;

		dc = new DisplayController(
			element,
			$.fn.powerTip.defaults,
			new MockTipController(
				null,
				function() {
					hideCalled = true;
				}
			)
		);

		element.data(DATA_HASACTIVEHOVER, true); // set active hover or hide wont do anything
		dc.hide();

		setTimeout(function() {
			dc.cancel();

			setTimeout(function() {
				ok(!hideCalled, 'showTip was not called');
				start();
			}, $.fn.powerTip.defaults.closeDelay / 2 + 10);
		}, $.fn.powerTip.defaults.closeDelay / 2);
	});

	function MockTipController(show, hide, reset) {
		this.showTip = show || $.noop;
		this.hideTip = hide || $.noop;
		this.resetPosition = reset || $.noop;
	}

});
