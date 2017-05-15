var app = angular.module('ee', []);
app.controller('dataFetch', function($scope){
	$scope.ls = false;
	$scope.sv = false;
	$scope.dataset="ipr_ta_tot";
	$scope.response="";
	$scope.ds="";
	$scope.data="";
	$scope.status="";
	$scope.saved="";
	$scope.fetch = function () {
		$scope.status="Fetching...";
		$scope.url="http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/"+$scope.dataset+"?precision=1";
		//$scope.url= "http://json-stat.org/samples/canada.json";
		$scope.response = JSONstat($scope.url);
		
	    //$scope.data = [];
	    //$scope.columns = [];
	    /*
	    $scope.gridOptions = {
	      data: 'data',
	      columnDefs: 'columns'
	    };
	    */
		if ($scope.response!="") {
			
		    $scope.data = $scope.response.Dataset(0).label;
			//$scope.data = "Dane: " + response.Dataset(0).label;
			$scope.status = "Fetched: " + $scope.data;
			$scope.sv = true;
			//grid
			/*
			angular.forEach(response.data[0], function(value, key){
				if(key.indexOf('$') !== 0) {
		        	$scope.columnDefines.push({ field: key, displayName: key})
		        };
			});*/
		} else {
			$scope.status = "Fetching failed!";
		};
		
	};
	$scope.save = function() {
		if (localStorage.dataset) {
			localStorage.removeItem("dataset");
		}
		localStorage.dataset = angular.toJson($scope.response);
		$scope.saved = $scope.data;
		$scope.ls = true;
		
	}
	$scope.load = function() {
		$scope.response = JSONstat(angular.fromJson(localStorage.dataset));
		$scope.data = $scope.response.Dataset(0).label;
	}
	
	

});
//angular.bootstrap(body, ['ee']);