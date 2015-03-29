describe('InspectionsCtrl', function ()
{
	beforeEach(module('starter.controllers'));

	var $controller;
	var $q;
	var $rootScope;
	var $scope;

	beforeEach(inject(function (_$controller_, _$q_, _$rootScope_)
	{
		$controller = _$controller_;
		$q = _$q_;
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
	}));

	describe('InspectionsCtrl', function ()
	{
		var ionicLoadingMock, $state, InspectionRepository;

		beforeEach(function ()
		{
			ionicLoading = jasmine.createSpyObj('ionicLoading', ['show']);
			$state = {};
			InspectionRepository = {};
			var controller = $controller('InspectionsCtrl', { $scope: $scope, $ionicLoading: ionicLoading, $state: $state, InspectionRepository: InspectionRepository });
		});

		it('scope.isLoading at begining should be set', function ()
		{
			expect($scope.isLoading).toBe(true);
		});

		it('ionicLoading should been called', function ()
		{
			expect(ionicLoading.show).toHaveBeenCalledWith({ template: 'Loading...', delay: 500 });
		});

		describe('delete', function ()
		{
			var Inspection;
			var removeDeferred;
			var confirmSpy;

			beforeEach(function ()
			{
				removeDeferred = $q.defer();
				InspectionRepository.remove = jasmine.createSpy('delete').and.returnValue(removeDeferred.promise);

				Inspection = { doc: {} };
				confirmSpy = spyOn(window, 'confirm');
			});

			describe('with user accept confirmation', function ()
			{
				beforeEach(function ()
				{
					confirmSpy.and.returnValue(true);

					$scope.delete(Inspection);

				});

				it('should show proper confirmation message', function ()
				{
					expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete inspection?');

				});

				describe('with calling remove', function ()
				{
					beforeEach(function ()
					{
						$state.go = jasmine.createSpy('go');
					});

					it('should call remove with proper params', function ()
					{
						expect(InspectionRepository.remove).toHaveBeenCalledWith(Inspection.doc);
					});

					it('before resolving it should not call $state.go', function ()
					{
						$rootScope.$apply();
						expect($state.go).not.toHaveBeenCalled();
					});

					describe('with resolving remove deferred', function ()
					{
						it('$scope.go should be called', function ()
						{
							removeDeferred.resolve();
							$rootScope.$apply();
							expect($state.go).toHaveBeenCalled();
						});
					});
				});
			});
		});

		describe('$ionicView.enter', function ()
		{
			var allDeferred;
			beforeEach(function ()
			{
				allDeferred = $q.defer();
				InspectionRepository.all = jasmine.createSpy('all').and.returnValue(allDeferred.promise);
				$scope.$broadcast('$ionicView.enter');
			});

			it('should fetch all inspections', function ()
			{
				expect(InspectionRepository.all).toHaveBeenCalledWith();
			});

			describe('when all inspection has been fetched correctly', function ()
			{
				var rows;

				beforeEach(function ()
				{
					spyOn($scope, '$apply');
					$scope.$$phase = false;
					rows = [1, 2, 3];
					allDeferred.resolve({ rows: rows });
					$rootScope.$apply();
				});

				it('Inspections value should  be fetched', function ()
				{
					expect($scope.Inspections).toBe(rows);
				});

				describe('with set $scope.$$phase', function()
				{
					it('should call $scope.$apply', function ()
					{
						expect($scope.$apply).toHaveBeenCalledWith();
					});
				})
			});
		});
	});
});