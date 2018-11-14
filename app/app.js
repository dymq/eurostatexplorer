function compile(element){
  var el = angular.element(element);    
  $scope = el.scope();
    $injector = el.injector();
    $injector.invoke(function($compile){
       $compile(el)($scope)
    })     
}

agGrid.initialiseAgGridWithAngular1(angular);

var app = angular.module('ee', ["agGrid", 'chart.js', 'textAngular', 'ng-sweet-alert']);

app.controller('dataFetch', function($scope, $window) {
	
	$scope.ls = false;
	$scope.sv = false;
	$scope.go = false;
	$scope.cl = false;
	$scope.cb = false;
	$scope.cp = false;
	$scope.gg = false;
	$scope.gc = false;
	$scope.dataset="ipr_ta_tot";
	$scope.response="";
	$scope.ds="";
	$scope.data="";
	$scope.status="";
	$scope.saved="";
	$scope.table="";
	$scope.serie="";
	$scope.lab="";
	$scope.headers="";
	$scope.chart="linear";
	$scope.report="";
	$scope.image;
	$scope.imgarr;
	
	$scope.fetch = function () {
		
		$scope.status="Fetching...";
		$scope.url="http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/"+$scope.dataset+"?precision=1";
		
		$scope.response = JSONstat($scope.url);

		if ($scope.response!="") {
			
		    $scope.data = $scope.response.Dataset(0).label;
			
			$scope.status = "Fetched: " + $scope.data;
			$scope.sv = true;
			
			$scope.grid();

	    	
		}
		
		else {
			$scope.status = "Fetching failed!";
		};
	};
	
	$scope.enableGrid = function(){
	    var el = document.getElementById("grid");
	    if (!el.attributes['ag-grid']) {
	    	el.setAttribute("ag-grid", "gridOptions");
	    	compile(el);
	    	$scope.go = true;
	    	$scope.gg = true;
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
		
		// hiding save btn
		$scope.sv = false;
		
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
		$scope.heads();
	    
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
	
	$scope.heads = function() {
		// getting filtered data
		var sample = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function(node){
			sample.push(node.data);
			
		});
		// setting headers
		$scope.headers = [];

		$.each(sample[0], function(key, element) {
			$scope.headers.push(key);
		});
		$scope.vf = $scope.headers[$scope.headers.length-1];
		$scope.headers=$scope.headers.splice(0,$scope.headers.length-1);
		
		$scope.serie=$scope.headers[0];
		$scope.lab=$scope.headers[1];
		
		$scope.sw = function() {
			var tmp = $scope.serie;
			$scope.serie=$scope.lab;
			$scope.lab=tmp;
		}
		
	}
	
	
	$scope.graph = function() {
		
		$scope.labels = [];
		$scope.series = [];
		$scope.visualize = [];		
		var l = $scope.lab;
		var s = $scope.serie;
		
		var temporary = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function(node){
			temporary.push(node.data);
		});
		
		// set distinct labels and data series
		$.each(temporary, function(i, obj) {
			$.each(obj, function(key, value) {
				if(key==l && $scope.labels.indexOf(value) == -1) {
					$scope.labels.push(value);
				};
				if(key==s && $scope.series.indexOf(value) == -1) {
					$scope.series.push(value);
				};
			});
		});
		
		// setting values
		$.each($scope.series, function (i, vs) {
			var vis = [];
			$.each($scope.labels, function (j, vl) {
				$.each(temporary, function(i, obj) {
					if(obj[s] == vs && obj[l] == vl) {
						vis.push(obj[$scope.vf]);
					}
				});
			});
			$scope.visualize.push(vis);
		});
		
		switch($scope.chart) {
			case "linear":
				$scope.cl = true;
				$scope.cb = false;
				$scope.cp = false;
				break;
			case "bar":
				$scope.cl = false;
				$scope.cb = true;
				$scope.cp = false;
				break;
			case "pie":
				$scope.cl = false;
				$scope.cb = false;
				$scope.cp = true;
				$scope.visualise=[];
				$scope.visualise.push($scope.visualize[0]);
//				$.each($scope.visualize, function(i,v) {
//					$scope.visualise.push(v[0]);
//				});				
				break;
		}
		
		$scope.gc = true;
	    
		/*
			  $scope.onClick = function (points, evt) {
			    console.log(points, evt);
			  };
			  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
			  $scope.options = {
			    scales: {
			      yAxes: [
			        {
			          id: 'y-axis-1',
			          type: 'linear',
			          display: true,
			          position: 'left'
			        },
			        {
			          id: 'y-axis-2',
			          type: 'linear',
			          display: true,
			          position: 'right'
			        }
			      ]
			    }
			  };*/
	};
	
	$scope.pic = function(container) {
		$scope.image = "Loading image src to paste. Click anywhere to check if ready...";
		html2canvas($(document.getElementById(container)), {
	        onrendered: function(canvas) {
	        	
	            // canvas is the final rendered <canvas> element
	            $scope.image = canvas.toDataURL("image/png");
	            console.log($scope.image);
	        }
		});
	};
	
	$scope.windowed = function () {
	swal({
  		title: "The report",
 		text: "Your report will now open in new window",
		icon: "info"
		})
		.then( function() {
	        var nw = $window.open();
	        nw.document.write($scope.report);
		});
    };	
	
})
.filter('hasIntersection', function() {
    return function(item, array) {
      return array.indexOf(item) >= 0;
    };
});
