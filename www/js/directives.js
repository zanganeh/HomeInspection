angular.module('starter.directives', ['ui.bootstrap'])
.directive('hiRating', function ()
{
	function link($scope, element, attrs)
	{
		$scope.max = 10;
		$scope.isReadonly = false;

		$scope.hoveringOver = function (value)
		{
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		$scope.ratingStates = [
		  { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
		  { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
		  { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
		  { stateOn: 'glyphicon-heart' },
		  { stateOff: 'glyphicon-off' }
		];
	}
	return {
		templateUrl: 'templates/hi-rating.html',
		link: link,
		scope: {
			rate: '=rate'
		}
	};
})
.directive('inspectionDetail', function (dbService)
{
	function link($scope, element, attrs, form)
	{
		$scope.$watch(function ()
		{
			return $scope.category && $scope.subcategory;
		}, function (value)
		{
			if (value)
			{
				$scope.detail = $scope.Inspection.getDetail($scope.category, $scope.subcategory);
			}
		});
	}

	return {
		templateUrl: 'templates/inspection-detail.html',
		link: link,
		scope: {
			category: '=category',
			subcategory: '@subcategory',
			Inspection: '=inspection'
		},
		require: '^form'
	};
})

.directive('formLocator', function() {
	return {
		link: function(scope) {
			scope.$emit('formLocator');
		}
	}
});