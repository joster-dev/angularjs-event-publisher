// Author  : Jacob Osterhout
// Contact : jacob.osterhout@siemens.com

'use strict';

var hrData = [
	{'name' : 'Jacob Osterhout', 'gid' : 'Z0038ANH', 'email' : 'jacob.osterhout@siemens.com'}
//	{'name' : 'Gary Barter'}
];

var ebpSodData = [
	{'name' : 'Jacob Osterhout', 'gid' : 'Z0038ANH', 'email' : 'jacob.osterhout@siemens.com'}
];

var ebpAdminData = [
	{'name' : 'Jacob Osterhout', 'gid' : 'Z0038ANH', 'email' : 'jacob.osterhout@siemens.com'}
];

var Rqst = {
	requestNumber        : '',
	submitter            : '',
	requestDate          : '',
	requestStatus        : 'Draft',
	ebpRole              : 'Requestor',
	ebpAction            : 'Create',
	ebpUserId            : '',
	sapSystem            : 'PD2/WW001', 
	requestRemarks       : '',

	fullName             : '',
	lastName             : '',
	firstName            : '',
	middleInitial        : '',
	ntId                 : '',
	email                : '',
	gid                  : '',
	employeeType         : '',
	employeeStatus       : '',
	bellPhone            : '',
	bellFax              : '',
	jobTitle             : '',
	businessUnit         : '',
	division             : '',
	department           : '',
	manager              : '',
	managerGid           : '',
	managerBellPhone     : '',
	managerEmail         : '',
	primarySite          : '',
	officeBay            : '',
	address              : '',
	company              : '',
	country              : '',
	scnCode              : '',
	costCenter           : '',
	spendLimit           : '',
	orgCode              : '',
	gg                   : '',

	mgrDateApproved      : '',
	mgrRemarks           : '',

	hrApprover           : '',
	hrDateApproved       : '',
	paLoa                : '',
	hrRemarks            : '',

	ebpSodApprover       : '',
	ebpSodDateApproved   : '',
	ebpSodRemarks        : '',

	ebpAdminApprover     : '',
	ebpAdminDateApproved : '',
	ebpOrgId             : '',
	ebpDeliveryId        : '',
	approverCc           : '',
	expenseCc            : '',
	ebpAdminRemarks      : '',

	workflowLog          : [],
	assignedTo           : []
};

var Workflow = function(){
	this.step       = '';
	this.action     = '';
	this.assignedTo = '';
	this.assignedBy = '';
	this.date       = '';
};

jQuery.ajaxSetup({async: false});

// Angular Handling 
var ebpApp = angular.module('ebpApp', []);

ebpApp.controller('appCtrl', function($scope){		// Angular Controller
	
	var sessionCons = function(){					// Constructor for session information.
		return {
			displayedPage : 'Home',
			showHome : false,
			showView : false,
			showSearch : false,

			showGdpSearch : false,
			
			currentUser :							// employee's information currently using system.
			{'name' : 'Jacob Osterhout', 'gid' : 'Z0038ANH', 'email' : 'jacob.osterhout@siemens.com'},
			currentRequest : null,					// Request being displayed on view request page.
			searhTerm : '',							// Server query for search page.
			searchFilter : 'User',					// Server column for search query.
			searchToggle : false,					// toggle for searching open tickets.
			gdpInputId : null,						// for tracking which gdp search button was clicked.
			searchResults : [],						// Stores server query results.
			actions : []							// Tracks actions currently displayed in the sidebar.
		};
	};
	$scope.session = sessionCons();					// Create an session instance for model use.

	$scope.changeViews = function(id){
		switch(id){
			case -1: 	// Home screen
				if($scope.session.showHome) break;
				$scope.session.displayedPage  = 'Home';
				$scope.session.showHome       = true;
				$scope.session.showView       = false;
				$scope.session.showSearch     = false;
				$scope.session.showGdpSearch  = false;

				$scope.session.currentRequest = null;

				$scope.session.searchResults  = [];
				$scope.session.actions        = [];

				var data = {'fullName' : $scope.session.currentUser.name};

				$.post("http://127.0.0.1:4000/quickTickets", {'data': data})
					.done(function(data){
					console.log(data);
					if(data.data.result === 'Success'){
						$scope.session.searchResults = data.data.tickets;
					}
				}, 'json');
				break;
			case -2: 	// Search Requests
				if($scope.session.showSearch) break;
				$scope.session.currentRequest = null;
				$scope.session.searhTerm      = '';
				$scope.session.searchFilter   = 'User';
				$scope.session.searchToggle   = false;

				$scope.session.searchResults  = [];
				$scope.session.actions        = [];

				$scope.session.displayedPage  = 'Search Requests';
				$scope.session.showHome       = false;
				$scope.session.showView       = false;
				$scope.session.showSearch     = true;
				$scope.session.showGdpSearch  = false;
				break;
			case -3: 	// GDP Request Screen
				$scope.session.searchResults  = [];
				$scope.session.searhTerm      = '';
				$scope.session.searchFilter   = 'User';
				$scope.session.searchToggle   = false;
				$scope.session.showGdpSearch  = true;
				break;
			case 0: 	// View Create Request screen
				$scope.session.displayedPage  = 'Create Request';
				$scope.session.showHome       = false;
				$scope.session.showView       = true;
				$scope.session.showSearch     = false;
				$scope.session.searchResults  = [];
				$scope.session.actions        = [];

				$scope.session.currentRequest = Object.create(Rqst);
				$scope.session.currentRequest.assignedTo.push($scope.session.currentUser);
				$scope.session.currentRequest.submitter = $scope.session.currentUser.name;
				$scope.session.actions = Logic.setActions($scope.session.currentRequest, $scope.session.currentUser);
				break;
			default: 	// View Request Page, id is ticket number
				$scope.session.displayedPage  = 'Request #' + id;
				$scope.session.showHome       = false;
				$scope.session.showView       = true;
				$scope.session.showSearch     = false;
				$scope.session.searchResults  = [];
				$scope.session.actions        = [];

				var data = {'requestNumber' : id};

				$.post("http://127.0.0.1:4000/viewTicket", {'data': data})
					.done(function(data){			// Lookup ticket by Id
					console.log(data);
					if(data.data.result === 'Success'){
						$scope.session.currentRequest = data.data.ticket;	// Save results from lookup in search results
						if($scope.session.currentRequest.workflowLog.length !== 0) {
							$scope.session.currentRequest.workflowLog = JSON.parse($scope.session.currentRequest.workflowLog);
							$scope.session.currentRequest.assignedTo = JSON.parse($scope.session.currentRequest.assignedTo);
						}
					}
				}, 'json');

				$scope.session.actions = Logic.setActions($scope.session.currentRequest, $scope.session.currentUser);
				break;
		};
	};

	$scope.gdpClick = function(object){		//Inside the GDP page a User returned from the server is selected
		switch($scope.session.gdpInputId){
			case 0: 						// Assign object to currentUser User fields.
				$scope.session.currentRequest.fullName         = object.firstName + ' ' + object.lastName;
				$scope.session.currentRequest.lastName         = object.lastName;
				$scope.session.currentRequest.firstName        = object.firstName;
				$scope.session.currentRequest.middleInitial    = object.middleInitial;
				$scope.session.currentRequest.email            = object.mail;
				$scope.session.currentRequest.gid              = object.GID;
				$scope.session.currentRequest.employeeType     = object.employeeType;
				$scope.session.currentRequest.employeeStatus   = object.Status;
				$scope.session.currentRequest.bellPhone        = object.PGTelephoneNumber;
				$scope.session.currentRequest.bellFax          = object.PGfacsimileTelephoneNumber;
				$scope.session.currentRequest.jobTitle         = object.jobcodedescription;
				$scope.session.currentRequest.businessUnit     = object.o;
				$scope.session.currentRequest.division         = object.division;
				$scope.session.currentRequest.department       = object.subDivision;
				$scope.session.currentRequest.primarySite      = object.l;
				$scope.session.currentRequest.officeBay        = object.roomNumber;
				$scope.session.currentRequest.address          = object.street;
				$scope.session.currentRequest.company          = object.company;
				$scope.session.currentRequest.country          = object.c;
				$scope.session.currentRequest.scnCode          = object.locationShort;
				$scope.session.currentRequest.costCenter       = object.accountingCode;
				$scope.session.currentRequest.orgCode          = object.orgCode;
				break;
			case 1: 						// Assign object to currentUser User Manager fields.
				$scope.session.currentRequest.manager          = object.firstName + ' ' + object.lastName;
				$scope.session.currentRequest.managerGid       = object.GID;
				$scope.session.currentRequest.managerBellPhone = object.PGTelephoneNumber;
				$scope.session.currentRequest.managerEmail     = object.mail;
				break;
		}
		$scope.session.showGdpSearch = false;
	};

	$scope.exportCsvClick = function(){
		var csvContent = "data:text/csv;charset=utf-8,";
		for(var i = 0; i < $scope.session.searchResults.length; i++){
			csvContent += JSON.stringify($scope.session.searchResults[i]);
			if(i < $scope.session.searchResults.length-1) csvContent += '\n';
		}
		
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "searchExport.csv");

		link.click();
	};

	$scope.actionClick = function(action){
		var data;
		switch(action){
			case 'Resubmit':
				if($scope.session.currentRequest.managerEmail === '') break;
				$scope.session.currentRequest.requestStatus = 'Submitted';
				// Add workflow step
				var wk = new Workflow();
				wk.step = $scope.session.currentRequest.workflowLog.length + 1;
				wk.action = 'Resubmitted';
				wk.assignedTo = $scope.session.currentRequest.manager;
				wk.assignedBy = $scope.session.currentRequest.fullName;
				wk.date = Logic.getCurrentDate();
				$scope.session.currentRequest.workflowLog.push(wk);
				// Send currentRequest to server as update
				$scope.session.currentRequest.requestDate = Logic.getCurrentDate;
				data = $scope.session.currentRequest;

				$.post("http://127.0.0.1:4000/createTicket", {'data': data})
					.done(function(data){
						console.log(data);
						console.log(data.data.tickets);
				}, 'json');
				$scope.changeViews(-1);
				break;
			case 'Submit':
				if($scope.session.currentRequest.managerEmail === '') break;
				$scope.session.currentRequest.requestStatus = 'Submitted';
				$scope.session.currentRequest.submitter = $scope.session.currentUser.name;
				$scope.session.currentRequest.requestDate = Logic.getCurrentDate;
				var tempMan = {
					'name' : $scope.session.currentRequest.manager,
					'gid' : $scope.session.currentRequest.managerGid,
					'email' : $scope.session.currentRequest.managerEmail
				};
				$scope.session.currentRequest.assignedTo = [];
				$scope.session.currentRequest.assignedTo.push(tempMan);
				var wk = new Workflow();
				wk.step = $scope.session.currentRequest.workflowLog.length + 1;
				wk.action = 'Submitted';
				wk.assignedTo = $scope.session.currentRequest.manager;
				wk.assignedBy = $scope.session.currentUser.name;
				wk.date = Logic.getCurrentDate();
				$scope.session.currentRequest.workflowLog.push(wk);
				// Create Request
				$scope.session.currentRequest.workflowLog = JSON.stringify($scope.session.currentRequest.workflowLog);
				$scope.session.currentRequest.assignedTo = JSON.stringify($scope.session.currentRequest.assignedTo);
				data = $scope.session.currentRequest;
				$.post("http://127.0.0.1:4000/createTicket", {'data': data})
					.done(function(data){
						console.log(data);
						console.log(data.data.requestNumber);
						$scope.session.currentRequest.requestNumber = data.data.requestNumber;
				}, 'json');
				$scope.changeViews(-1);
				break;
			case 'Cancel':
				$scope.changeViews(-1);
				break;
			case 'Save Draft':
				// push currentrequest assignedTo to currentuser
				$scope.session.currentRequest.assignedTo = [];
				$scope.session.currentRequest.assignedTo.push($scope.session.currentUser);
				$scope.session.currentRequest.submitter = $scope.session.currentUser.name;
				// Add workflow step
				var wk = new Workflow();
				wk.step = $scope.session.currentRequest.workflowLog.length + 1;
				wk.action = 'Saved as Draft';
				wk.assignedTo = $scope.session.currentUser.name;
				wk.assignedBy = $scope.session.currentUser.name;
				wk.date = Logic.getCurrentDate();
				//$scope.session.currentRequest.workflowLog.push(wk);

				$scope.session.currentRequest.workflowLog = JSON.stringify($scope.session.currentRequest.workflowLog);
				$scope.session.currentRequest.assignedTo = JSON.stringify($scope.session.currentRequest.assignedTo);
				data = $scope.session.currentRequest;
				$.post("http://127.0.0.1:4000/createTicket", {'data': data})
					.done(function(data){
						console.log(data.data.tickets);
						$scope.session.currentRequest.requestNumber = data.data.requestNumber;
				}, 'json');
				$scope.changeViews(-1);
				break;
			case 'Approve':
				var wk = new Workflow();
				switch($scope.session.currentRequest.requestStatus){
					case 'Submitted':
						$scope.session.currentRequest.requestStatus = 'Manager Approved';
						console.log('here');
						wk.action = 'Manager Approved';
						$scope.session.currentRequest.mgrDateApproved = Logic.getCurrentDate;
						if($scope.session.currentRequest.ebpRole === 'Approver'){
							$scope.session.currentRequest.assignedTo = hrData;
							wk.assignedTo = 'HR';
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						else {
							$scope.session.currentRequest.assignedTo = ebpSodData;
							wk.assignedTo = 'EBP SoD Admins';
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						break;
					case 'Manager Approved':
						if($scope.session.currentRequest.assignedTo === hrData){
							$scope.session.currentRequest.requestStatus = 'HR Approved';
							$scope.session.currentRequest.hrDateApproved = Logic.getCurrentDate;
							wk.action = 'HR Approved';
							wk.assignedTo = 'EBP SoD Admins';
							$scope.session.currentRequest.assignedTo = ebpSodData;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						else {
							$scope.session.currentRequest.requestStatus = 'EBP SoD Approved';
							$scope.session.currentRequest.ebpSodDateApproved = Logic.getCurrentDate;
							wk.action = 'EBP SoD Approved';
							wk.assignedTo = 'EBP Administrators';
							$scope.session.currentRequest.assignedTo = ebpAdminData;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						break;
					case 'HR Approved':
							$scope.session.currentRequest.requestStatus = 'EBP SoD Approved';
							$scope.session.currentRequest.ebpSodDateApproved = Logic.getCurrentDate;
							wk.action = 'EBP SoD Approved';
							wk.assignedTo = 'EBP Administrators';
							$scope.session.currentRequest.assignedTo = ebpAdminData;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						break;
					case 'EBP SoD Approved':
							$scope.session.currentRequest.requestStatus = 'Complete';
							$scope.session.currentRequest.ebpAdminDateApproved = Logic.getCurrentDate;
							wk.action = 'Request Approved';
							wk.assignedTo = '';
							$scope.session.currentRequest.assignedTo = [];
						break;
				};
				// Add workflow step
				
				wk.step = $scope.session.currentRequest.workflowLog.length + 1;
				wk.assignedBy = $scope.session.currentUser.name;
				wk.date = Logic.getCurrentDate();
				//$scope.session.currentRequest.workflowLog.push(wk);

				$scope.session.currentRequest.workflowLog = JSON.stringify($scope.session.currentRequest.workflowLog);
				$scope.session.currentRequest.assignedTo = JSON.stringify($scope.session.currentRequest.assignedTo);
				data = $scope.session.currentRequest;
				$.post("http://127.0.0.1:4000/createTicket", {'data': data})
					.done(function(data){
						console.log(data);
				}, 'json');
				$scope.changeViews(-1);
				break;
			case 'Reject':
				var usrTmp = {
					name : $scope.session.currentRequest.fullName,
					gid : $scope.session.currentRequest.gid,
					email : $scope.session.currentRequest.email
				};
				var wk = new Workflow();
				switch($scope.session.currentRequest.requestStatus){
					case 'Submitted':
						$scope.session.currentRequest.requestStatus = 'Manager Rejected';
						wk.action = 'Manager Rejected';
						wk.assignedTo = usrTmp.email;
						if($scope.session.currentRequest.ebpRole === 'Approver'){
							$scope.session.currentRequest.assignedTo = usrTmp;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						else {
							$scope.session.currentRequest.assignedTo = ebpSodData;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						break;
					case 'Manager Approved':
						if($scope.session.currentRequest.assignedTo === hrData){
							$scope.session.currentrequest.requestStatus = 'HR Rejected';
							wk.action = 'HR Rejected';
							wk.assignedTo = usrTmp.email;
							$scope.session.currentRequest.assignedTo = usrTmp;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						else {
							$scope.session.currentRequest.requestStatus = 'EBP SoD Rejected';
							wk.action = 'EBP SoD Rejected';
							wk.assignedTo = usrTmp.email;
							$scope.session.currentrequest.assignedTo = usrTmp;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						}
						break;
					case 'HR Approved':
							$scope.session.currentRequest.requestStatus = 'EBP SoD Rejected';
							wk.action = 'EBP SoD Rejected';
							wk.assignedTo = usrTmp.email;
							$scope.session.currentrequest.assignedTo = usrTmp;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						break;
					case 'EBP SoD Approved':
							$scope.session.currentRequest.requestStatus = 'EBP Admin Rejected';
							wk.action = 'EBP Admin Rejected';
							wk.assignedTo = usrTmp.email;
							$scope.session.currentRequest.assignedTo = usrTmp;
							Logic.sendEmails($scope.session.currentRequest.assignedTo);
						break;
				};
				wk.step = $scope.session.currentRequest.workflowLog.length + 1;
				wk.assignedBy = $scope.session.currentUser.name;
				wk.date = Logic.getCurrentDate();
				//$scope.session.currentRequest.workflowLog.push(wk);

				$scope.session.currentRequest.workflowLog = JSON.stringify($scope.session.currentRequest.workflowLog);
				$scope.session.currentRequest.assignedTo = JSON.stringify($scope.session.currentRequest.assignedTo);
				data = $scope.session.currentRequest;
				$.post("http://127.0.0.1:4000/createTicket", {'data': data})
					.done(function(data){
						console.log(data.data.tickets);
						$scope.session.currentRequest.requestNumber = data.data.requestNumber;
				}, 'json');
				$scope.changeViews(-1);
				break;
		}
	};

	$scope.searchClick = function(id){
		var data;
		switch(id){
			case 0: 		// request
				switch($scope.session.searchFilter){
					case 'User':
						data = { 'fullName': $scope.session.searchTerm };
						break;
					case 'Status':
						data = { 'requestStatus': $scope.session.searchTerm };
						break;
					case 'Role':
						data = { 'ebpRole': $scope.session.searchTerm };
						break;
					case 'Last Name':
						data = { 'lastName': $scope.session.searchTerm };
						break;
					case 'Request Number':
						data = { 'requestNumber': $scope.session.searchTerm };
						break;
					case 'All':
						data = { 'fullName': $scope.session.searchTerm };
						break;
				}
				$.post("http://127.0.0.1:4000/ticketSearch", {'data': data})
					.done(function(data){
						if(data.data.result === 'Success'){
							$scope.session.searchResults = data.data.tickets;
						}
						console.log(data);
				}, 'json');

				if($scope.session.searchToggle) $scope.session.searchResults = Logic.setFilter(id, $scope.session.searchResults);
				break;
			case 1: 		// user
				switch($scope.session.searchFilter){
					case 'User':
						var tmp = $scope.session.searchTerm.split(' ');
						data = { 'firstName': tmp[0], 
								 'lastName' : tmp[1] };

						$.post("http://127.0.0.1:4000/userSearch", {'data': data})
							.done(function(data){
								if(data.data.result === 'Success'){
									$scope.session.searchResults = data.data.user;
								}
								console.log(data);
						}, 'json');

						if($scope.session.searchToggle) $scope.session.searchResults = Logic.setFilter(id, $scope.session.searchResults);
						break;
					case 'GID':
						data = { 'gid': $scope.session.searhTerm };

						$.post("http://127.0.0.1:4000/userSearch", {'data': data})
							.done(function(data){
								if(data.data.result === 'Success'){
									console.log(data.data.user);
									$scope.session.searchResults = data.data.user;
								}
								console.log(data);
								console.log(data.data.tickets);
						}, 'json');

						if($scope.session.searchToggle) $scope.session.searchResults = Logic.setFilter(id, $scope.session.searchResults);
						break;
					case 'All':
						break;
				}
				break;
		}
	};
});

var Logic = {
	sendEmails : function(object){		// Send emails to specified object (assignedTo array) and alert user after sent.
		var recipients = '';
		for(var i = 0; i < object.length; i++){
			recipients += object[i].email;
			if(i !== object.length-1) recipients += ';';
		}
		if(recipients.length > 0);
			window.open('mailto:' + recipients + '?subject=New EBP User ID Request&body=Please log onto the EBP User ID Request Application and approve my request.');
	},

	setActions : function(request, currentUser){	// Set user actions based on requestStatus
		var actions = new Array();
		for(var i = 0; i < request.assignedTo.length; i++){
			if(request.assignedTo[i].name === currentUser.name){
				if(	request.requestStatus === 'Cancelled' ||
					request.requestStatus === 'Manager Rejected' ||
					request.requestStatus === 'HR Rejected' ||
					request.requestStatus === 'EBP SoD Rejected' ||
					request.requestStatus === 'EBP Admin Rejected'){
					actions.push('Resubmit');

					$('.requestInput').attr('readonly', false);
					$('.requestSelect').prop('disabled', false);
					$('.userInput').attr('readonly', false);
					$('.managerInput').attr('readonly', true);
					$('.hrInput').attr('readonly', true);
					$('.ebpRoleInput').attr('readonly', true);
					$('.ebpAdminInput').attr('readonly', true);
					break;
				}
				else if(request.requestStatus === 'Submitted'){
					actions.push('Approve');
					actions.push('Reject');

					$('.requestInput').attr('readonly', true);
					$('.requestSelect').prop('disabled', true);
					$('.userInput').attr('readonly', true);
					$('.managerInput').attr('readonly', false);
					$('.hrInput').attr('readonly', true);
					$('.ebpRoleInput').attr('readonly', true);
					$('.ebpAdminInput').attr('readonly', true);
				}
				else if(request.requestStatus === 'Manager Approved'){
					if(request.assignedTo === hrData){
						actions.push('Approve');
						actions.push('Reject');

						$('.requestInput').attr('readonly', true);
						$('.requestSelect').prop('disabled', true);
						$('.userInput').attr('readonly', true);
						$('.managerInput').attr('readonly', true);
						$('.hrInput').attr('readonly', false);
						$('.ebpRoleInput').attr('readonly', true);
						$('.ebpAdminInput').attr('readonly', true);
					}
					else{
						actions.push('Approve');
						actions.push('Reject');

						$('.requestInput').attr('readonly', true);
						$('.requestSelect').prop('disabled', true);
						$('.userInput').attr('readonly', true);
						$('.managerInput').attr('readonly', true);
						$('.hrInput').attr('readonly', true);
						$('.ebpRoleInput').attr('readonly', false);
						$('.ebpAdminInput').attr('readonly', true);
					}
				}
				else if(request.requestStatus === 'HR Approved'){
					actions.push('Approve');
					actions.push('Reject');

					$('.requestInput').attr('readonly', true);
					$('.requestSelect').prop('disabled', true);
					$('.userInput').attr('readonly', true);
					$('.managerInput').attr('readonly', true);
					$('.hrInput').attr('readonly', true);
					$('.ebpRoleInput').attr('readonly', false);
					$('.ebpAdminInput').attr('readonly', true);
				}
				else if(request.requestStatus === 'EBP SoD Approved'){
					actions.push('Approve');
					actions.push('Reject');

					$('.requestInput').attr('readonly', true);
					$('.requestSelect').prop('disabled', true);
					$('.userInput').attr('readonly', true);
					$('.managerInput').attr('readonly', true);
					$('.hrInput').attr('readonly', true);
					$('.ebpRoleInput').attr('readonly', true);
					$('.ebpAdminInput').attr('readonly', false);
					break;
				}
				else if(request.requestStatus === 'Draft'){
					actions.push('Submit');
					actions.push('Cancel');
					actions.push('Save Draft');

					$('.requestInput').attr('readonly', false);
					$('.requestSelect').prop('disabled', false);
					$('.userInput').attr('readonly', false);
					$('.managerInput').attr('readonly', true);
					$('.hrInput').attr('readonly', true);
					$('.ebpRoleInput').attr('readonly', true);
					$('.ebpAdminInput').attr('readonly', true);
				}
				break;
			}
		}
		if(actions.length === 0) {
			$('.requestInput').attr('readonly', true);
			$('.requestSelect').prop('disabled', true);
			$('.userInput').attr('readonly', true);
			$('.managerInput').attr('readonly', true);
			$('.hrInput').attr('readonly', true);
			$('.ebpRoleInput').attr('readonly', true);
			$('.ebpAdminInput').attr('readonly', true);
		}
		return actions;
	},

	getCurrentDate : function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		var h = today.getHours();
		var min = today.getMinutes();
		var sec = today.getSeconds();
		if(dd<10){dd='0'+dd};
		if(mm<10){mm='0'+mm};
		if(h<10){h='0'+h};
		if(min<10){min='0'+min};
		if(sec<10){sec='0'+sec};
		today = mm+'/'+dd+'/'+yyyy+' '+h+':'+min+':'+sec;
		return today;
	},

	setFilter : function(id, searchResults){
		var searchTemp = [];
		switch(id){
			case 0: // request
				for(var i = 0; i < searchResults.length; i++){
					if( searchResults[i].requestStatus !== 'Complete' &&
						searchResults[i].requestStatus !== 'Cancelled')
						searchTemp.push(searchResults[i]);
				}
				break;
			case 1: // gdp
				for(var i = 0; i < searchResults.length; i++){
					if( searchResults[i].Status === 'Active'){
						searchTemp.push(searchResults[i]);
					}
				}
				break;
		}
		console.log(searchTemp);
		return searchTemp;
	}
};