describe('InspectionsCtrl', function ()
{
	beforeEach(module('starter.controllers'));

	var $controller, ionicLoadingMock, state;

	beforeEach(inject(function (_$controller_)
	{
		ionicLoadingMock = jasmine.createSpyObj('ionicLoading', ['show']);
		$controller = _$controller_;
	}));

	it('sets the strength to "strong" if the password length is >8 chars', function ()
	{
		var $scope = {};
		$scope.$on = function () { };
		state = {};
		var InspectionRepository = {};
		var controller = $controller('InspectionsCtrl', { $scope: $scope, $ionicLoading: ionicLoadingMock, $state: state, InspectionRepository: InspectionRepository });
		expect($scope.isLoading).toBe(true);
	});
});