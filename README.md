# Angular markdown service and directive 

The module provides a service which renders the markdown input and a directive which can shows it.
The service can be used independently from the directive

1. Injection:

```javascript
var app = angular.module(ngApp, ['ng-md-review', 'ui.codemirror']);
```

2. Configuration:

```javascript
app.config(function (MdViewConfigProvider) {
    var mdConf = {
        highlight: true,
        linkify: true,
    };
    MdViewConfigProvider.setMarkdownItConfig(mdConf);
    MdViewConfigProvider.setEmojifyConfig({
        'img_dir': 'images/sprites',
        // mode: 'sprite',
        mode: 'data-uri',
        // 'tag_type': 'div'
    });
});
```

3. Usage:

```javascript
app.controller('DemoController', ['$scope', function ($scope) {
    $scope.someText = '# MARKDOWN with EMOJI :)';
}]);
```

Than make sure the directive knows where to look for the markdown text 
```html
<md-view mdtext="someText"></md-view>
```

Get a file with markdown
```html
<md-view mdtext="someText" import="/data/README.md"></md-view>
```
