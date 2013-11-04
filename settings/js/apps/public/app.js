var appSettings = angular.module('appSettings', ['ngResource']).
config(['$httpProvider', '$routeProvider', '$windowProvider', '$provide',
	function($httpProvider,$routeProvider, $windowProvider, $provide) {
		
		// Always send the CSRF token by default
		$httpProvider.defaults.headers.common.requesttoken = oc_requesttoken;

		var $window = $windowProvider.$get();
		var url = $window.location.href;
		var baseUrl = url.split('index.php')[0] + 'index.php/settings';

		$provide.value('Config', {
			baseUrl: baseUrl
		});

		$routeProvider.when('/:appId', {
			template : 'detail.html',
			controller : 'detailcontroller',
			resolve : {
				app : ['$route', '$q', function ($route, $q) {
					var deferred = $q.defer();
					var appId = $route.current.params.appId;

					return deferred.promise;
				}]
			}
		}).otherwise({
			redirectTo: '/'
		});
	}
]);
appSettings.controller('applistController', ['$scope', 'AppListService',
	function($scope, AppListService){
		$scope.loading = true;
		$scope.allapps = AppListService.listAllApps().get();
		$scope.loading = false;

		$scope.selectApp = AppListService.selectApp(appId,appName,appAuthor,appDesc,appLisence,appReq,appVer);
	}
]);
appSettings.controller('detailController', ['$scope',
	function($scope){
		
	}
]);
appSettings.directive('loading',
	[ function() {
		return {
			restrict: 'E',
			replace: true,
			template:"<div class='loading'></div>",
			link: function($scope, element, attr) {
				$scope.$watch('loading', function(val) {
					if (val) {
						$(element).show();
					}
					else {
						$(element).hide();
					}
				});
			}		
		};
	}]
);
appSettings.factory('AppActionService', ['$resource',
	function ($resource) {
		return {
			enableApp : function(appId) {
				return ($resource(OC.filePath('settings', 'ajax', 'enableapp.php')).post(
					{ appid : appId }
				));
			},
			disableApp : function(appId) {
				return ($resource(OC.filePath('settings', 'ajax', 'disableapp.php')).post(
					{ appid : appId }
				));
			},
			updateApp : function(appId) {
				return ($resource(OC.filePath('settings', 'ajax', 'updateApp.php')).post(
					{ appid : appId }
				));
			}
		};
	}
]);
appSettings.factory('AppListService', ['$resource',
	function ($resource) {
		return {
			listAllApps : function() {
				return ($resource(OC.filePath('settings', 'ajax', 'applist.php')));
			},
			selectApp : function(appId,appName,appAuthor,appDesc,appLisence,appReq,appVer) {
				var details = [appId,appName,appAuthor,appDesc,appLisence,appReq,appVer];
			},
			returnApp : function() {
				console.log(details);
				return details;
			}
		};
	}
]);