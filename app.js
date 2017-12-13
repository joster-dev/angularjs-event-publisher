'use strict';

// Sample Objects
var sites = [{
	name: 'Orlando Site',
	address: '2567 Riva Ct.',
	address2: 'Orlando, FL 32817',
	selected: false
}, {
	name: 'Carolina Site',
	address: '1234 IDeclareAThumb War.',
	address2: 'Charlotte, NC 28273',
	selected: false
}, {
	name: 'Texas Site',
	address: '7 Bats Hah.',
	address2: 'Houston, TX 77095',
	selected: false
}, {
	name: 'Jupiter Site',
	address: '56 Pickup Sticks',
	address2: 'Jupiter, FL 33458',
	selected: false
}];

var groups = [{
	name: 'Corporate',
	image: 'assets/corporate.jpg',
	selected: false,
	color: "#555",
	site: "google.com"
}, {
	name: 'Support Network',
	image: 'assets/support.jpg',
	selected: false,
	color: "#04BFBF",
	site: "google.com"
}, {
	name: 'Community Crew',
	image: 'assets/community.jpg',
	selected: false,
	color: "#588F27",
	site: "google.com"
}, {
	name: 'Karate Club',
	image: 'assets/Karate.jpg',
	selected: false,
	color: "#FFCD50",
	site: "google.com"
}, {
	name: 'Swim Team',
	image: 'assets/swim.jpg',
	selected: false,
	color: "#FD7400",
	site: "google.com"
}, {
	name: 'Baseball Leauge',
	image: 'assets/Baseball.jpg',
	selected: false,
	color: "#5B7876",
	site: "google.com"
}, {
	name: 'Yoga Class',
	image: 'assets/Yoga.jpg',
	selected: false,
	color: "#006487",
	site: "google.com"
}, {
	name: 'Computer Lessons',
	image: 'assets/computer.jpg',
	selected: false,
	color: "#DC3522",
	site: "google.com"
}, {
	name: 'Arts & Crafts',
	image: 'assets/crafts.jpg',
	selected: false,
	color: "#412A22",
	site: "google.com"
}, {
	name: 'Wine Tasting',
	image: 'assets/wine.jpg',
	selected: false,
	color: "#004358",
	site: "google.com"
}];

var events = [{
	title : "Come check out our location",
	site : sites[0],
	date : Date.parse("2015-02-23"),
	startTime: Date.parse("09:00"),
	endTime: Date.parse("10:00"),
	details: 'Very cool event',
	location: 'Specific Room',
	groups: groups[0],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "Financial Independence",
	site : sites[0],
	date : Date.parse("2015-04-10"),
	startTime: Date.parse("13:00"),
	endTime: Date.parse("15:00"),
	details: 'Very cool event',
	location: 'Specific Location',
	groups: groups[7],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "Financial Planning for Millennial Generation",
	site : sites[0],
	date : Date.parse("2015-04-03"),
	startTime: Date.parse("13:00"),
	endTime: Date.parse("15:00"),
	details: 'Very cool event',
	location: 'Specific Venue',
	groups: groups[4],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "The Language of Leadership",
	site : sites[0],
	date : Date.parse("2015-02-24"),
	startTime: Date.parse("12:30"),
	endTime: Date.parse("15:00"),
	details: 'Very cool event',
	location: 'Specific Building',
	groups: groups[7],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "Vehicle Showcase",
	site : sites[0],
	date : Date.parse("2015-07-10"),
	startTime: Date.parse("11:00"),
	endTime: Date.parse("13:00"),
	details: 'Featuring several different vehicle designs, including Charlie Carlson’s refurbished 1990 van fully equipped with hand controls for zero effort steering, gas, and braking.',
	location: 'Parking Area',
	groups: groups[1],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "Earth Day",
	site : sites[0],
	date : Date.parse("2015-04-22"),
	startTime: Date.parse("13:00"),
	endTime: Date.parse("15:00"),
	details: 'Completely synergize resource sucking relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service.',
	location: 'Cafe',
	groups: groups[2],
	attendence: 'no',
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}, {
	title : "Team Building Event",
	site : sites[0],
	date : Date.parse("2015-02-28"),
	startTime: Date.parse("12:45"),
	endTime: Date.parse("15:00"),
	details: 'The goal of this event is for our members to develop relationships with each other and to promote collaboration between colleagues.',
	location: 'Low Ropes Challenge Course',
	groups: groups[4],
	attendence: "no",
	rating: 1,
	host: {name: "Your Name", email: "YourEmail@YourDomain.com"},
	speaker: {name: "Your Name", email: "YourEmail@YourDomain.com"}
}];

function createEvent() {
	return {
		title: "",
		site: sites[0],
		date: Date.parse('next week'),
		startTime: Date.parse('13:00'),
		endTime: Date.parse('15:00'),
		image: "",
		hosts: {name: "", email: ""},
		speaker: {name: "", email: ""},
		groups: '',
		rating: 1,
		attendence: 'no',
		feedback: ''
	}
}

function sortNewer(a, b) {
	if(a.date < b.date)
		return -1;
	if(a.date > b.date)
		return 1;
	if(a.startTime < b.startTime)
		return -1;
	if(a.startTime > b.startTime)
		return 1;
	return 0;
}

function sortOlder(a, b) {
	if(a.date > b.date)
		return -1;
	if(a.date < b.date)
		return 1;
	if(a.startTime > b.startTime)
		return -1;
	if(a.startTime < b.startTime)
		return 1;
	return 0;
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

// Angular Handling 
var eventsApp = angular.module('eventsApp', ['ui.bootstrap']);

eventsApp.controller('appCtrl', function($scope){

	$scope.currentEvent = null;
	$scope.myEvents = [];
	$scope.sites = sites;
	$scope.groups = groups;

	$scope.accordian = {
		isFirstOpen: true
	};

	$scope.session = {
		viewHome: true,
		viewEvent: false,
		viewFilter: false,
		editEvent: false,
		rateEvent: false,
		currentEvents: true,
		pastEvents: false
	};

	$scope.formatTime = function(dateObj) {
		return dateObj.toString('h:ss');
	};

	$scope.formatDate = function(dateObj) {
		return dateObj.toString('dddd, MMMM d');
	};
	
	$scope.viewHome = function() {
		// Retreive data from server
		// Load properties from cookie
		$scope.session.viewEvent = false;
		$scope.session.viewFilter = false;
		$scope.session.editEvent = false;
		$scope.session.rateEvent = false;
		$scope.session.viewHome = true;

		$scope.filterEvents();
	};

	$scope.viewEvent = function(event, editable) {
		if(editable) {
			$scope.session.viewHome = false;
			$scope.session.viewFilter = false;
			$scope.session.viewEvent = true;
			$scope.session.editEvent = true;

			$scope.currentEvent = createEvent();

			$('.readonly').removeAttr('readonly', false);
		} else {
			$scope.session.viewHome = false;
			$scope.session.viewEvent = true;
			$scope.session.editEvent = false;

			$scope.currentEvent = event;
			
			if(Date.parse($scope.formatDate(event.date) + " " + $scope.formatTime(event.endTime)) < Date.now()) {
				$scope.session.rateEvent = true;
			} else {
				$scope.session.rateEvent = false;
			}

			$('.readonly').attr('readonly', true);
		}
	};

	$scope.viewFilter = function() {
		$scope.session.viewHome = false;
		$scope.session.viewFilter = true;
	}

	$scope.attendEvent = function() {
		console.log($scope.currentEvent.startTime);

		alert("Event added to your calendar");

		$scope.viewHome();		
	};

	$scope.submitEvent = function() {
		// Post $scope.session.currentEvent to server
		console.log($scope.currentEvent);

		events.push($scope.currentEvent);

		$scope.viewHome();
	};

	$scope.sendFeedback = function() {
		console.log($scope.currentEvent);

		alert("Event feedback sent to host");

		$scope.viewHome();
	};

	$scope.filterEvents = function(click) {
		if(click) {
			$scope.session.currentEvents = $scope.session.currentEvents ? false : true;
			$scope.session.pastEvents = $scope.session.pastEvents ? false : true;
		}

		if($scope.session.currentEvents) {
			$scope.filteredEvents = events.filter(function(item) {
				return item.date >= Date.now();
			});
		} else {
			$scope.filteredEvents = events.filter(function(item) {
				return item.date < Date.now();
			});
		}

		if(!$scope.sites.every(function(e) {return !e.selected})) {
			// Filter Site
			$scope.filteredEvents = $scope.filteredEvents.filter(function(item) {
				var index = arrayObjectIndexOf($scope.sites, item.site.name, 'name');
				return $scope.sites[index] != undefined 
					&&  $scope.sites[index].selected;
			});
		}

		
		if(!$scope.groups.every(function(e) {return !e.selected})) {
			// Filter groups
			$scope.filteredEvents = $scope.filteredEvents.filter(function(item) {
				var index = arrayObjectIndexOf($scope.groups, item.groups.name, 'name');
				return $scope.groups[index] != undefined 
					&&  $scope.groups[index].selected;
			});
		}
		

		if($scope.session.currentEvents) {
			$scope.filteredEvents.sort(sortNewer);
		} else {
			$scope.filteredEvents.sort(sortOlder);
		}
	}

	$scope.addHost = function() {
		$scope.currentEvent.hosts.push({name: "", email: ""});
	};

	$scope.addSpeaker = function() {
		$scope.currentEvent.speakers.push({name: "", email: ""});
	};
});