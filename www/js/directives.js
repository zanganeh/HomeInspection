angular.module('starter.directives', ['ui.bootstrap'])

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