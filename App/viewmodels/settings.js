/***************************************************************************************************
 * ViewModel: Settings
 * Author(s): Sean Malone
 * Description: This VM handles the business logic for the Settings page.
 **************************************************************************************************/
define(function(require) { 
	/*********************************************************************************************** 
	 * Includes
	 **********************************************************************************************/
	var system 		= require('durandal/system');			// System logger
	var custom 	 	= require('durandal/customBindings');	// Custom bindings
	var Structures 	= require('modules/structures');		// Structures
	var Backend     = require('modules/settings');			// Backend
	var self;
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend    = new Backend();
	var userId  	= ko.observable();
	var practiceId 	= ko.observable();
	var newFlag	 	= ko.observable(false);
	var currentUser = ko.observable();
	var users   	= ko.observableArray([]);
	var user		= ko.observable(new structures.User());
	var role		= ko.observable(new structures.Role());
	var roles		= ko.observableArray([]);

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 // var computedFunction = ko.computed(function() {});

	/*********************************************************************************************** 
	 * ViewModel
	 *
	 * For including ko observables and computed functions, add an attribute of the same name.
	 * Ex: observable: observable
	 **********************************************************************************************/
	return {
		/******************************************************************************************* 
		 * Attributes
		 *******************************************************************************************/
		userId: userId,
		practiceId: practiceId,
		newFlag: newFlag,
		user: user,
		users: users,
		role: role,
		roles: roles,
		currentUser: currentUser,
		/******************************************************************************************* 
		 * Methods
		 *******************************************************************************************/
		// This allow manipulation of the DOM
		viewAttached: function() {
			// Change the selected nav item 
			$('.navItem').removeClass('active');
			$('.settingsNav').addClass('active');
			
			// True fit
			var height = parseInt($('.viewHolder').height()) - 12;
			$('.settingsContent > .tab-pane').height(height);
			$('.settingsPills').height(height);
			$('.subSettings .tab-pane').height(height - 50);
			$('.userTableHolder').height(parseInt($('.tab-pane').height()) - 264);
			$('.roleContent').height(parseInt($('.tab-pane').height()) - 200);
			$(window).resize(function() {
				var height = parseInt($('.viewHolder').height()) - 12;
				$('.settingsContent > .tab-pane').height(height);
				$('.settingsPills').height(height);
				$('.subSettings .tab-pane').height(height - 50);
				$('.userTableHolder').height(parseInt($('.tab-pane').height()) - 264);
				$('.roleContent').height(parseInt($('.tab-pane').height()) - 200);
			});
			
			$('.rolesList a').click(function(e) { 
				e.preventDefault();
				 $('.rolesList li').removeClass('active');
				 $(this).parent().addClass('active');
			});
		},
		// Loads when view is loaded
		activate: function(data) {
			self = this;
			self.userId(global.userId);
			self.practiceId(global.practiceId);
			
			// Get currentUser
			backend.getCurrentUser(self.userId()).success(function(data) {
				self.currentUser(new structures.User(data));
			});
			
			// Get users
			backend.getUsers(self.practiceId()).success(function(data) {
				var u = $.map(data, function(item) { return new structures.User(item) });
				self.users(u);
				self.user(u[0]);
			});
			
			// Get Roles
			backend.getRoles(self.practiceId()).success(function(data) {
				var r = $.map(data, function(item) { return new structures.Role(item) });
				self.roles(r);
				self.role(r[0]);
			});
		},
		clickNew: function() {
			self.newFlag(true);
		},
		clickCancel: function() {
			self.newFlag(false);
		},
		clickSave: function() {
			var i = _.findWhere(self.users(), {username: self.user().username()});
			sysetm.log(i);
		},
		clickDelete: function(data) {
			self.users.remove(data);
		},
		selectUser: function(data) {
			self.user(data);
		},
		selectRole: function(data) {
			 self.role(data);
		},
		toggleChild: function(data, event) {
			var e = $(event.currentTarget);
			e.toggleClass('icon-plus').toggleClass('icon-minus');
			e.parent().parent().parent().find('> .child').slideToggle();
		},
		saveRole: function(data) {
			if(self.role().name() != 'Administrator') {
				system.log(backend);
				backend.saveRole(self.role()).complete(function(data) {
					system.log(data);
				});
			}
		}
	};
});