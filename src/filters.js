/**
 * Created by egmfilho on 24/08/16.
 */

(function() {

'use strict';

angular.module('egmfilho.inputFilters', [ ])
  .directive('numberOnly', [function() {
    return {
			restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModelCtrl) {
        ngModelCtrl.$parsers.push(function(text) {
          var transformedInput = text.replace(/[^0-9\,\.]/g, '');
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
			scope: { 
				symbol: '@'
			},		
      link: function(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function(data) {
          // converte o dado no formato da view para o formato do model
          if (data) {
            return parseFloat(data.toString().replace(scope.symbol || $locale.NUMBER_FORMATS.CURRENCY_SYM, '')
							.replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
							.replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'));
          }

          return parseFloat(data);
        });

        ngModelController.$formatters.push(function(data) {
          // converte o dado no formato do model para o formato da view

          if (data != null) {
            return $filter('currency')(data, scope.symbol);
          }

          return data;
        });
      }
    };
  }]);

}());