function compile(element){
  var el = angular.element(element);    
  $scope = el.scope();
    $injector = el.injector();
    $injector.invoke(function($compile){
       $compile(el)($scope)
    })     
}

agGrid.initialiseAgGridWithAngular1(angular);

var app = angular.module('ee', ["agGrid"]);

app.controller('dataFetch', function($scope) {
	$scope.ls = false;
	$scope.sv = false;
	$scope.dataset="ipr_ta_tot";
	$scope.response="";
	$scope.ds="";
	$scope.data="";
	$scope.status="";
	$scope.saved="";
	$scope.table="";
	$scope.semafor=0;
	$scope.fetch = function () {
		$scope.status="Fetching...";
		$scope.url="http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/"+$scope.dataset+"?precision=1";
		//$scope.url= "http://json-stat.org/samples/canada.json";
		$scope.response = JSONstat($scope.url);

		if ($scope.response!="") {
			
		    $scope.data = $scope.response.Dataset(0).label;
			
			$scope.status = "Fetched: " + $scope.data;
			$scope.sv = true;
			
			$scope.grid();

	    	
		} else {
			$scope.status = "Fetching failed!";
		};
		
	};
	
	$scope.enableGrid = function(){
	    var el = document.getElementById("grid");
	    if (!el.attributes['ag-grid']) {
	    	el.setAttribute("ag-grid", "gridOptions");
	    	compile(el);
	    }
	    else {
	    	$scope.gridOptions.api.setColumnDefs($scope.cols());
	    	$scope.gridOptions.api.setRowData($scope.rows());
	    }
	}
	
	$scope.save = function() {
		if (localStorage.dataset) {
			localStorage.removeItem("dataset");
		}
		
		// saving whole dataset
		localStorage.dataset = angular.toJson($scope.response);
		$scope.saved = $scope.data;
		
		/* saving filtered data
		$scope.filtered = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function(node){
			$scope.filtered.push(node.data);
		});
		console.log($scope.filtered);
		localStorage.dataset = angular.toJson($scope.filtered);
		*/
		
		//setting loading div visible
		$scope.ls = true;
		
		
	}
	$scope.load = function() {
		
		//retrieving whole dataset from localstorage
		$scope.response = JSONstat(angular.fromJson(localStorage.dataset));
		$scope.data = $scope.response.Dataset(0).label;
		
		//loading to table
		$scope.grid();
		
		/* loading filtered data
		
		var loaded = angular.fromJson(localStorage.dataset); 
		var headers = [];
		$.each(loaded[0], function(key, element) {
		    headers.push({headerName: key, field: key});
		});
		$scope.gridOptions.api.setColumnDefs(headers);
		$scope.gridOptions.api.setRowData(loaded);
		*/
	}
	$scope.grid = function() {
		$scope.table=$scope.response.Dataset(0).toTable();
		$scope.enableGrid();
		
	    
	};
	$scope.cols = function() {
		var colnames = [];
		for (var i=1; i<$scope.table[0].length; i++) {
			colnames[i-1] = {headerName: $scope.table[0][i], field: $scope.table[0][i]};
		}
		return colnames;
	}
	$scope.rows = function() {
		var arr  = [];
		for (var i=1; i<$scope.table.length; i++){
			var field = '{';
			for (var j=1; j<$scope.table[0].length; j++) {
				field +='"'+ $scope.table[0][j] + '": "' + $scope.table[i][j] + '", ';
			};
			field=field.slice(0,-2);
			field += '}';
			arr.push(angular.fromJson(field))
		};
		return arr;
	};
	/*
	$scope.cols = [
        {headerName: "Make", field: "make"},
        {headerName: "Model", field: "model"},
        {headerName: "Price", field: "price"},
    ];

    $scope.rows = function(){ return [
        {make: "Toyota", model: "Celica", price: 35000,},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxter", price: 72000},
    ];
    }//*/
	$scope.gridOptions = {
	    onGridReady: () => {
	    	
	    	$scope.gridOptions.api.setColumnDefs($scope.cols());
	    	$scope.gridOptions.api.setRowData($scope.rows());

        },
        enableSorting: true,
        enableFilter: true
	};
});