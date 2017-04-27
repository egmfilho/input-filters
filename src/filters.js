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

 				var symbol = scope.$eval(attrs.symbol) || '';

 				function parseToModel(data) {

 					if (!isNaN(parseFloat(data)) && data.toString().indexOf('.') != -1) {
 						return parseFloat(data);
 					} else {
 						return parseFloat(data.toString().replace(symbol || $locale.NUMBER_FORMATS.CURRENCY_SYM, '')
 							.replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
 							.replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'));
 					}

 				}

 				ngModelController.$parsers.push(parseToModel);

 				function parseToView(data) {
 					if (data != null) {
 						return $filter('currency')(parseToModel(data.toString().replace(symbol, '')), symbol);
 					}
 					return data;
 				}

 				ngModelController.$formatters.push(parseToView);

 				element.bind('blur', function() {
 					if (ngModelController.$viewValue) {
 						ngModelController.$viewValue = parseToView(ngModelController.$viewValue);
 						ngModelController.$render();
 					}
 				});
 			}
 		};
 	}]);

 }());
