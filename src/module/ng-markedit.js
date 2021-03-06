/*global window, emojify, hljs, markdownit, markdownitFootnote*/
(function (window, angular) {
	'use strict';

	if (!angular) {
		console.log('angularjs is required');
		return;
	}

	var app = angular.module('ng-markedit', []);

	app.provider('markeditConf', function () {
		this.hljsConfig = {
			style: 'default',
			highlight: true
		};
		this.mdConfig = {
			html: true,
			linkify: true,
			highlight: true,
			typographer: false
		};
		this.emojifyConfig = {
			'img_dir': 'bower_components/emojify.js/dist/images',
			blacklist: {
				elements: ['pre']
			}
		};

		var objMerge = function (objDest, objSrc) {
			for (var key in objSrc) {
				objDest[key] = objSrc[key];
			}
		};

		this.setHighlighterConfig = function (config) {
			objMerge(this.hljsConfig, config);
		};

		this.setMarkdownItConfig = function (config) {
			objMerge(this.mdConfig, config);
		};

		this.setEmojifyConfig = function (config) {
			objMerge(this.emojifyConfig, config);
		};

		this.$get = function () {
			return this;
		};

	});

	app.service('EmojifyService', ['markeditConf', function (markeditConf) {
		// console.log('EmojifyService');
		var self = {
			emojify: function (text) {
				emojify.setConfig(markeditConf.emojifyConfig);

				text = emojify.replace(text);
				// console.log('EmojifyService result', text);
				return text;
			}
		};
		return self;
	}]);

	app.directive('markedit', ['$templateRequest', 'markeditConf', 'EmojifyService', 'MdRenderService', function ($templateRequest, markeditConf, EmojifyService, MdRenderService) {
		return {
			scope: {
				mdtext: '=',
				import: '@'
			},
			link: function ($scope, el, attr) {
				// console.log('ng-markedit', $scope, el, attr);

				var doIt = function (text) {
					// console.log(text);
					// 1. emojify the markdown text
					var result = EmojifyService.emojify(text);

					// 2. render the markdown
					el.html(MdRenderService.render(result));

					//Fix: Since the markdown parser does not attach highlighter's class, we need 
					// to do it manually
					if (markeditConf.mdConfig.highlight) {
						el.find('pre').addClass('hljs');
					}
				};

				if (attr.mdtext) {
					$scope.$watch('mdtext', doIt);
				}
				// doIt();

				if (attr.import) {
					$scope.$watch('import', function (src) {
						// console.log(src)
						$templateRequest(src, true).then(function (response) {
							if (attr.mdtext) {
								$scope.mdtext = response;
							}
							doIt(response);
						});
					});
				}
			}
		};
	}]);

	app.service('MdRenderService', ['markeditConf', function (markeditConf) {
		// console.log('EmojifyService');
		var languageOverrides = {
				js: 'javascript', // allow js as javascript as well
				html: 'xml' //use xml instead of html
			},
			highlightFn = function (code, lang) {
				if (languageOverrides[lang]) {
					lang = languageOverrides[lang];
				}
				if (lang && hljs.getLanguage(lang)) {
					try {
						return hljs.highlight(lang, code).value;
					} catch (e) {}
				}
				return '';
			},
			mdObj;

		// If we set we want highlight, use our method
		if (markeditConf.mdConfig.highlight === true) {
			markeditConf.mdConfig.highlight = highlightFn;
		}
		// If a method is not set, do not use highlight at all;
		if (typeof markeditConf.mdConfig.highlight !== 'function') {
			delete markeditConf.mdConfig.highlight;
		}

		mdObj = markdownit(markeditConf.mdConfig).use(markdownitFootnote);

		var self = {
			render: function (text) {
				if (typeof text !== 'string' || text.length <= 0) {
					return ''; // empty string if we try to render a non string or empty string text 
				}
				return mdObj.render(text);
			}
		};
		return self;
	}]);
})(window, window.angular);