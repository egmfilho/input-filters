/*
 * @Author: egmfilho
 * @Date:   2017-06-12 16:20:28
 * @Last Modified by:   egmfilho
 * @Last Modified time: 2017-10-24 16:26:31
*/

'use strict';

angular.module('egmfilho.inputFilters', [ ])
	.directive('blurTo', ['$timeout', function($timeout) {
		var blur;

		function link(scope, element, attrs, ngModelCtrl) {
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
		};

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
	.directive('replaceText', ['$locale', function($locale) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ngModelCtrl) {

				function parse(text) {
					if (attr.replaceText) {
						var transformedInput = text,
							obj = scope.$eval(attr.replaceText);

						for(var x in obj) {
							transformedInput = transformedInput.replace(x, obj[x]);
						}

						if (transformedInput !== text) {
							ngModelCtrl.$setViewValue(transformedInput);
							ngModelCtrl.$render();
						}

						return transformedInput;
					}

					return text;
				}

				ngModelCtrl.$parsers.push(parse);
			}
		};
	}])
	.directive('currency', ['$filter', '$locale', function($filter, $locale) {

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModelCtrl) {

				var symbol = scope.$eval(attrs.symbol) || '';

				/* From string to float */
				/* Remove locale currency */
				function parseToModel(data) {
					if (!isNaN(parseFloat(data))) {
						return parseFloat(data.toString().replace(symbol || $locale.NUMBER_FORMATS.CURRENCY_SYM, '')
							.replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
							.replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'));
					}

					return 0;
				}

				/* From float to string */
				function parseToView(data) {
					var model =  !isNaN(data) && angular.isNumber(+data) ? data : parseToModel(data);

					var maxFractionSize = attrs.maxFractionSize ? parseInt(attrs.maxFractionSize) : $locale.NUMBER_FORMATS.PATTERNS[1].maxFrac,
						fractionSize = model.toString().indexOf('.') < 0 ? 0 : model.toString().split('.')[1].length;

					if (attrs.trim && fractionSize < maxFractionSize)
						maxFractionSize = Math.max(attrs.minFractionSize ? parseInt(attrs.minFractionSize) : $locale.NUMBER_FORMATS.PATTERNS[1].minFrac, fractionSize);

					if (model != null) {
						return $filter('currency')(model, symbol, maxFractionSize);
					}

					return model;
				}

				ngModelCtrl.$parsers.push(parseToModel);
				ngModelCtrl.$formatters.push(parseToView);

				element.bind('change', function() {
					if (ngModelCtrl.$viewValue) {
						ngModelCtrl.$setViewValue(parseToView(ngModelCtrl.$viewValue));
						ngModelCtrl.$render();
					}
				});
			}
		};
	}]);
