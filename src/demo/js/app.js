/*global angular, ngApp*/
(function () {
	'use strict';
	if (typeof ngApp !== 'string' || ngApp.length <= 0) {
		console.log('Please define variable ngApp in a head scripts tag in index.htm');
		return;
	}
	// var app = angular.module(ngApp, ['ui.router', 'ngSanitize', 'ui.codemirror', 'config', 'angular-local-json-generator']);

	var app = angular.module(ngApp, ['ng-md-review', 'ui.codemirror']);

	app.config(function (MdViewConfigProvider) {
		var mdConf = {
			highlight: true,
			linkify: true,
		};
		MdViewConfigProvider.setMarkdownItConfig(mdConf);
		MdViewConfigProvider.setHighlighterConfig({
			style: 'default'
		});
		MdViewConfigProvider.setEmojifyConfig({
			'img_dir': 'images/sprites',
			// mode: 'sprite',
			mode: 'data-uri',
			// 'tag_type': 'div'
		});
	});

	var RootController = function ($scope, MdViewConfig) {
		console.log('RootController', $scope, MdViewConfig);
		var self = this;
		self.hljsStyle = 'ir_black';
		if (MdViewConfig.hljsConfig.style) {
			self.hljsStyle = MdViewConfig.hljsConfig.style
		}
	};
	app.controller('RootController', ['$scope', 'MdViewConfig', RootController]);

	var DemoController = function ($scope) {
		// console.log('DemoController', $scope);
		var self = this;

		// the codemirror config options. Those are injected via html attribute: ui-codemirror-opts
		self.editorOptions = {
			lineWrapping: true,
			lineNumbers: true,
			// readOnly: 'nocursor',
			matchBrackets: true,
			mode: 'markdown',
			theme: 'base16-light',
			extraKeys: {
				"Enter": "newlineAndIndentContinueMarkdownList"
			}
		};

		$scope.fromCodemirror = '';
	};
	app.controller('DemoController', ['$scope', DemoController]);
})();

/*global angular*/
(function () {
	'use strict';
})();