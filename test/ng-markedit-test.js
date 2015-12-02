/*global describe, beforeEach, it*/
(function () {
	'use strict';
	describe('TODO test', function () {
		var MdRenderService, $rootScope;

		beforeEach(module('ng-md-view'));
		beforeEach(inject(function ($injector, _$rootScope_) {
			MdRenderService = $injector.get('MdRenderService');
			$rootScope = _$rootScope_;
		}));

		it('generate and test an array of values as well as the bool type', function () {
			// $rootScope.$apply();
		});
	});
})();