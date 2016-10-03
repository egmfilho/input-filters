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
        ngModelController.$parsers.push(function(data) {
          // converte o dado no formato da view para o formato do model
          if (data) {
            return parseFloat(data.toString().replace(attrs.symbol || $locale.NUMBER_FORMATS.CURRENCY_SYM, '')
							.replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
							.replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'));
          }

          return parseFloat(data);
        });

        element.bind('blur', function() {
          if (ngModelController.$viewValue) {
            ngModelController.$viewValue = $filter('currency')(ngModelController.$viewValue, attrs.symbol);;
            ngModelController.$render();
          }
        });

        ngModelController.$formatters.push(function(data) {
          if (data != null) {
            return $filter('currency')(data, attrs.symbol);
          }
          return data;
        });
      }
    };
  }]);

}());
