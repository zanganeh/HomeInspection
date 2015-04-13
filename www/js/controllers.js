angular.module('starter.controllers', ['ui.bootstrap', 'starter.directives'])

.filter('zeroToNo', function ()
{
	return function (input)
	{
		return input === "0" || input === 0 ? "No" : input;
	};
})

.controller('InspectionsCtrl', function ($ionicLoading, $scope, $state, InspectionRepository)
{
	$scope.Inspections = [];
	$ionicLoading.show({
		template: 'Loading...',
		delay: 500
	});
	$scope.isLoading = true;

	$scope.delete = function (Inspection)
	{
		if (confirm('Are you sure you want to delete inspection?'))
		{
			InspectionRepository.remove(Inspection.doc).then(function ()
			{
				$state.go($state.current, {}, { reload: true });
			});
		}
	};

	$scope.$on('$ionicView.enter', function ()
	{
		InspectionRepository.all().then(function (result)
		{
			$scope.Inspections = result.rows;
			if (!$scope.$$phase)
			{
				$scope.$apply();
			}
		}).finally(function ()
		{
			$ionicLoading.hide();
			$scope.isLoading = false;
		});
	});
})

.controller('InspectionDetailsCtrl', function ($q, $rootScope, $scope, $stateParams, $http, $location, $ionicPopup, $ionicLoading, Categories, InspectionRepository)
{
	$scope.alerts = [];
	$ionicLoading.show({
		template: 'Loading...',
		delay: 500
	});

	$scope.addAlert = function (message)
	{
		if ($scope.alerts.filter(function (alert)
		{
			return alert.msg === message && alert.type === 'danger';
		}).length === 0)
		{
			$scope.alerts.push({ type: 'danger', msg: message });
		}
	};

	$scope.closeAlert = function (index)
	{
		$scope.alerts.splice(index, 1);
	};


	$scope.mm = { categories: Categories };

	$scope.$on('$ionicView.enter', function ()
	{
		var inspectionGet = $stateParams.inspectionID ? InspectionRepository.get($stateParams.inspectionID) : $q.when(InspectionRepository.create());
		inspectionGet.then(function (result)
		{
			$scope.Inspection = result;

			$scope.mm.categories.forEach(function (category)
			{
				if (!$scope.Inspection[category.propertyName])
				{
					$scope.Inspection[category.propertyName] = category.defaultVal;
				}

				category.increase = function ()
				{
					var result = parseInt($scope.Inspection[category.propertyName] || 0) + 1;
					if (result <= category.max)
					{
						$scope.Inspection[category.propertyName] = result;
					}
					else
					{
						$ionicPopup.alert({
							title: 'Warning!',
							template: "Can't add more than " + category.max + " " + category.name + "(s)"
						});
					}
				};

				category.decrease = function ()
				{
					var result = parseInt($scope.Inspection[category.propertyName] || 0) - 1;
					if (result >= category.min)
					{
						$scope.Inspection[category.propertyName] = result;
					}
					else
					{
						$ionicPopup.alert({
							title: 'Warning!',
							template: "Can't add less than " + category.min + " " + category.name + "(s)"
						});
					}
				};
			});

			$scope.originalInspection = angular.copy(result);
		}).finally(function ()
		{
			$ionicLoading.hide();
		});
	});

	$scope.hasChanges = function ()
	{
		return !angular.equals($scope.Inspection, $scope.originalInspection);
	};
	
	$scope.getLocation = function (val)
	{
		return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				components: 'country:AU'
			}
		}).then(function (response)
		{
			return response.data.results.map(function (item)
			{
				return item.formatted_address;
			});
		});
	};

	$scope.$on('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams)
		{
			if ($scope.hasChanges())
			{
				var answer = confirm("Are you sure you want to leave this page without saving?")
				if (!answer)
				{
					event.preventDefault();
					return;
				}
				if (!$scope.inspectionDetailsForm.$valid)
				{
					$scope.addAlert("Please provide address.");
					return;
				}
				InspectionRepository.save($scope.Inspection).then(function ()
				{
					$scope.originalInspection = $scope.Inspection;
				});
			}
		});

	$scope.$on('formLocator', function (event)
	{
		$scope.inspectionDetailsForm = event.targetScope.inspectionDetailsForm;
	});

	$scope.gotoNext = function ()
	{
		if (!$scope.inspectionDetailsForm.$valid)
		{
			$scope.addAlert("Please provide address.");
			return;
		}
		InspectionRepository.save($scope.Inspection).then(function ()
		{
			$location.path('/tab/inspectionDetailsRating/' + $scope.Inspection._id);
		});
	};
})
.controller('inspectionDetailsRatingCtrl', function ($scope, $stateParams, Categories, InspectionRepository, Camera)
{
	$scope.categoriesHasValue = [];
	if ($stateParams.inspectionID)
	{
		InspectionRepository.get($stateParams.inspectionID)
			.then(function (result)
			{
				$scope.Inspection = result;

				Categories.forEach(function (category)
				{
					var categoryValue = $scope.Inspection[category.propertyName];
					if(categoryValue > 0)
					{
						var category = { name: category.name, propertyName: category.propertyName, value: categoryValue, subCategories: [] };
						
						for (var i = 1; i <= categoryValue; i++)
						{
							var subCategoryName = category.name + i;
							category.subCategories.push(subCategoryName)
						}
						$scope.categoriesHasValue.push(category);

					}
				});
			});

		$scope.saveRate = function (subcategory, rate)
		{
			$scope.Inspection[subcategory] = $scope.Inspection[subcategory] || {};
			$scope.Inspection[subcategory].rate = rate;
			$scope.save();
		};

		$scope.save = function ()
		{
			InspectionRepository.save($scope.Inspection).then(function (inspect)
			{
				$scope.Inspection = inspect;
			});
		};

		$scope.getPhoto = function (subcategory)
		{
			Camera.getPicture().then(function (image)
			{
				$scope.Inspection[subcategory] = $scope.Inspection[subcategory] || {};
				$scope.Inspection[subcategory].images = $scope.Inspection[subcategory].images || [];
				$scope.Inspection[subcategory].images.push(image);
				$scope.save();
			}, function (err)
			{
				console.err(err);
			})
		};
	}
	else
	{
		throw "No inspectionID has been provided";
	}
});
