/**
 * Created by egmfilho on 24/08/16.
 */

(function() {

'use strict';

angular.module('egmfilho.inputFilters', [ ])
  .directive('numberOnly', ['$locale', function($locale) {
    return {
			restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModelCtrl) {
        ngModelCtrl.$parsers.push(function(text) {
          var separator = attr.separator ? attr.separator : $locale.NUMBER_FORMATS.DECIMAL_SEP,
              transformedInput = text.replace(new RegExp('[^0-9' + separator + ']', 'g'), '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  }])
	.directive('currency', ['$filter', '$locale', function($filter, $locale) {

    return {
			restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {

        function parseToModel(data) {
          if (data) {
            return parseFloat(data.toString().replace(scope.$eval(attrs.symbol) || $locale.NUMBER_FORMATS.CURRENCY_SYM, '')
              .replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
              .replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'));
          }
          return parseFloat(data);
        }

        function parseToView(data) {
          return $filter('currency')(parseToModel(data.replace(scope.$eval(attrs.symbol), '')), scope.$eval(attrs.symbol));
        }

        ngModelController.$parsers.push(parseToModel);

        element.bind('blur', function() {
          if (ngModelController.$viewValue) {
            ngModelController.$viewValue = parseToView(ngModelController.$viewValue);
            ngModelController.$render();
          }
        });

        ngModelController.$formatters.push(function(data) {
          if (data != null) {
            return parseToView(data.toString());
          }
          return data;
        });
      }
    };
  }]);

}());
