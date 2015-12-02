/*global angular, ngApp*/
(function () {
	'use strict';
	if (typeof ngApp !== 'string' || ngApp.length <= 0) {
		console.log('Please define variable ngApp in a head scripts tag in index.htm');
		return;
	}
	// var app = angular.module(ngApp, ['ui.router', 'ngSanitize', 'ui.codemirror', 'config', 'angular-local-json-generator']);

	var app = angular.module(ngApp, ['ng-markedit', 'ui.codemirror']);

	app.config(function (markeditConfProvider) {
		var mdConf = {
			highlight: true,
			linkify: true,
		};
		markeditConfProvider.setMarkdownItConfig(mdConf);
		markeditConfProvider.setHighlighterConfig({
			style: 'default'
		});
		markeditConfProvider.setEmojifyConfig({
			'img_dir': 'images/sprites',
			// mode: 'sprite',
			mode: 'data-uri',
			// 'tag_type': 'div'
		});
	});

	var RootController = function ($scope, markeditConf) {
		// console.log('RootController', $scope, markeditConf);
		var self = this;
		self.hljsStyle = 'ir_black';
		if (markeditConf.hljsConfig.style) {
			self.hljsStyle = markeditConf.hljsConfig.style
		}
	};
	app.controller('RootController', ['$scope', 'markeditConf', RootController]);

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