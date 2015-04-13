angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform)
{
	$ionicPlatform.ready(function ()
	{
		if (window.cordova && window.cordova.plugins.Keyboard)
		{
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar)
		{
			StatusBar.styleDefault();
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider)
{
	$stateProvider

	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "templates/tabs.html"
	})

	.state('tab.Inspections', {
		cache: false,
		url: '/Inspections',
		views: {
			'tab-Inspections': {
				templateUrl: 'templates/inspections.html',
				controller: 'InspectionsCtrl'
			}
		}
	})

	.state('tab.InspectionDetails', {
		cache: false,
		url: '/InspectionDetails/:inspectionID',
		views: {
			'tab-Inspections': {
				templateUrl: 'templates/inspection-details.html',
				controller: 'InspectionDetailsCtrl'
			}
		}
	})

	.state('tab.inspectionDetailsRating', {
		cache: false,
		url: '/inspectionDetailsRating/:inspectionID',
		views: {
			'tab-Inspections': {
				templateUrl: 'templates/inspection-details-rating.html',
				controller: 'inspectionDetailsRatingCtrl'
			}
		}
	});

	$urlRouterProvider.otherwise('/tab/Inspections');
});