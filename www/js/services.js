angular.module('starter.services', [])

.factory('InspectionDetail', function ()
{
	var InspectionDetail = function ()
	{
		this.comment = '';
		this.rank = 0;
	};

	return InspectionDetail;
})
.factory('Inspection', function (InspectionDetail, guidService)
{
	var Inspection = function (rawInspection)
	{
		this.addresss = '';
		this.inspectionDate;
		this.details = {};
		this._id = guidService.getGuid();
		$.extend(this, rawInspection)
		this.inspectionDate = new Date(this.inspectionDate);
	};

	Inspection.prototype.getDetail = function (category, subcategory)
	{
		var categoryDetail = this.details[category];
		if (!categoryDetail)
		{
			categoryDetail = {};
			categoryDetail[subcategory] = new InspectionDetail();
			this.details[category] = categoryDetail;
		}
		return categoryDetail[subcategory];
	}

	return Inspection;
})

.service('dbService', function ($q)
{
	PouchDB.debug.enable('*');
	var db = new PouchDB('dbname');

	this.save = function (Inspection)
	{
		return convertPouchDBPromiseToQPromise(db.put(JSON.parse(JSON.stringify(Inspection)))); //This is wrong but can't find better to convert object with function to JSON style
	};

	this.loadAll = function ()
	{
		return convertPouchDBPromiseToQPromise(
			db.allDocs({ include_docs: true, attachments: true }));
	};

	this.get = function (inspectionID)
	{
		return convertPouchDBPromiseToQPromise(db.get(inspectionID, { attachments: true }));
	};

	this.remove = function (Inspection)
	{
		return db.remove(Inspection);
	}

	var convertPouchDBPromiseToQPromise = function (pouchDbPromise)
	{
		var deferred = $q.defer();

		pouchDbPromise.then(function (result)
		{
			deferred.resolve(result)
		}, function (error)
		{
			deferred.reject(error);
		});
		return deferred.promise;
	};
})

.service('guidService', function ()
{
	this.getGuid = function ()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
		{
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
})

.factory('InspectionRepository', function (dbService, Inspection, InspectionDetail)
{
	var repository = {
		all: function ()
		{
			return dbService.loadAll();
		},
		get: function (inspectionId)
		{
			return dbService.get(inspectionId).then(function (result)
			{
				return new Inspection(result);
			})
		},
		create: function ()
		{
			return new Inspection();
		},
		save: function (Inspection)
		{
			return dbService.save(Inspection);
		},
		remove: function (Inspection)
		{
			return dbService.remove(Inspection);
		}
	};
	return repository;
})

.factory('Categories', function ()
{
	return a =
	[
		{ name: 'Bedroom', min: 1, max: 10, defaultVal: 3, propertyName: 'bedroomCount' },
		{ name: 'Bathroom', min: 1, max: 4, defaultVal: 1, propertyName: 'bathroomCount' },
		{ name: 'Toilet', min: 1, max: 4, defaultVal: 1, propertyName: 'toiletCount' },
		{ name: 'Parking', min: 0, max: 3, defaultVal: 1, propertyName: 'parkingCount' },
		{ name: 'Studies', min: 0, max: 3, defaultVal: 0, propertyName: 'studiesCount' },
		{ name: 'Living Area', min: 0, max: 3, defaultVal: 1, propertyName: 'livingAreaCount' },
		{ name: 'Dinig Area', min: 0, max: 3, defaultVal: 1, propertyName: 'diningAreaCount' },
		{ name: 'Laundry', min: 0, max: 3, defaultVal: 1, propertyName: 'laundryCount' },
		{ name: 'Backyard', min: 0, max: 1, defaultVal: 1, propertyName: 'backyardCount' },
		{ name: 'Backyard', min: 0, max: 2, defaultVal: 1, propertyName: 'shedCount' },
		{ name: 'Kitchen', min: 1, max: 3, defaultVal: 1, propertyName: 'KitchenCount' },
	];
})

.factory('Camera', function ($q)
{
	return tt =
	{
		getPicture: function ()
		{
			var q = $q.defer();

			var options =
				{
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					allowEdit: true,
					encodingType: Camera.EncodingType.JPEG,
					targetWidth: 100,
					targetHeight: 100,
					saveToPhotoAlbum: false
				};

			navigator.camera.getPicture(function (result)
			{
				q.resolve(result);
			}, function (err)
			{
				q.reject(err);
			}, options);

			return q.promise;
		}
	}
});