/*
* @Author: egmfilho
* @Date:   2017-06-12 16:20:28
* @Last Modified by:   egmfilho
* @Last Modified time: 2017-06-12 16:21:47
*/

(function() {

	'use strict';

	angular.module('egmfilho.inputFilters', [ ])
		.directive('blurTo', ['$timeout', function($timeout) {
			var blur;

			function link(scope, element, attrs, ctrl) {
				element.bind('blur', function(e) {
					$timeout(function() {
						var value = scope.$eval(attrs.blurTo);
						
						if (value) {
							element.prop('value', value);
    						attrs.$set('value', value);
						}
					});
				});	
			}

			return {
				restrict: 'A',
				link: link
			}

		}])
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
