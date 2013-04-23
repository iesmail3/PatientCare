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
	var app			= require('durandal/app');				// App
	var self;
	
	/*********************************************************************************************** 
	 * KO Observables
	 **********************************************************************************************/
	var structures = new Structures();
	var backend    = new Backend();
	var userId  	= ko.observable();
	var practiceId 	= ko.observable();
	var newFlag	 	= ko.observable(false);
	var newRoleFlag = ko.observable(false);
	var currentUser = ko.observable();
	var users   	= ko.observableArray([]);
	var user		= ko.observable(new structures.User());
	var tempUser	= ko.observable();
	var role		= ko.observable(new structures.Role());
	var roles		= ko.observableArray([]);
	var tempRole	= ko.observable();
	var password	= ko.observable();

	/*********************************************************************************************** 
	 * KO Computed Functions
	 **********************************************************************************************/
	 var getRoleName = function(data) {
		var name = _.find(roles(), function(item) { return item.id() == data.roleId() });
		return name.name();
	}

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
		newRoleFlag: newRoleFlag,
		user: user,
		users: users,
		tempUser: tempUser,
		role: role,
		roles: roles,
		currentUser: currentUser,
		tempRole: tempRole,
		password: password,
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
			$('.userTableHolder').height(parseInt($('.tab-pane').height()) - 362);
			$('.roleContent').height(parseInt($('.tab-pane').height()) - 200);
			$(window).resize(function() {
				var height = parseInt($('.viewHolder').height()) - 12;
				$('.settingsContent > .tab-pane').height(height);
				$('.settingsPills').height(height);
				$('.subSettings .tab-pane').height(height - 50);
				$('.userTableHolder').height(parseInt($('.tab-pane').height()) - 362);
				$('.roleContent').height(parseInt($('.tab-pane').height()) - 200);
			});
			
			// Change class for active role
			$('.rolesList a').click(function(e) { 
				e.preventDefault();
				 $('.rolesList li').removeClass('active');
				 $(this).parent().addClass('active');
			});
			
			// Password popover
			$('.control-label i').popover({
				title: 'Password',
				html: true,
				content: '<p>This will reset the user\'s password.</p>' +
						 '<p style="color: red; font-weight: bold;">Use with caution!</p>', 
				placement: 'bottom',
				trigger: 'hover'
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
		newUser: function() {
			self.tempUser(self.user());
			self.user(new structures.User());
			self.newFlag(true);
		},
		cancelUser: function() {
			self.user(self.tempUser());
			self.newFlag(false);
		},
		saveUser: function() {
			self.user().practiceId(self.practiceId());
			/**********************************************************************************
			 * Check for duplicate username
		 	 *********************************************************************************/
			var name = self.user().username();
			var match = _.find(self.users(), function(item) { return item.username() == name});
			if(match == undefined || self.user().id() != undefined) {
				/**********************************************************************************
				 * Check for errors
				 *********************************************************************************/
				if(self.user().errors().length > 0) {
					if(self.user().errors().length > 1)
						$('.allAlert').fadeIn().delay(3000).fadeOut();
					else if(self.user().errors()[0] == 'user')
						$('.userAlert').fadeIn().delay(3000).fadeOut();
					else if(self.user().errors()[0] == 'email' && self.user().email() != undefined)
						$('.emailInvalidAlert').fadeIn().delay(5000).fadeOut();
					else if(self.user().errors()[0] == 'email')
						$('.emailAlert').fadeIn().delay(3000).fadeOut();
				}
				else {
					/******************************************************************************
				 	 * Save User
				 	 *****************************************************************************/
					backend.saveUser(self.user(), self.password()).complete(function(data) {
						var response = $.parseJSON(data.responseText);
						if(response.result.toLowerCase().indexOf('success') >= 0) {
							// Insert
							if(response.result.toLowerCase().indexOf('insert') >= 0) {
								// Update new users fields
								self.user().id(response.id);
								self.user().password(response.password);
								// Add user to table
								self.users.push(self.user());
							}
							// Clear password
							self.password('');
							
							$.get('php/emailPass.php', {user: JSON.stringify(ko.toJS(self.user())), method: 'new'});
							
							// Success message
							$('.alert-success').fadeIn().delay(3000).fadeOut();
						}
					});
				}
			}
			else
				$('.userTakenAlert').fadeIn().delay(3000).fadeOut();
		},
		deleteUser: function(data) {
			self.users.remove(data);
		},
		selectUser: function(data) {
			system.log(data.id());
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
		newRole: function(data) {
			self.tempRole(self.role());
			self.role(new structures.Role());
			self.newRoleFlag(true);
		},
		cancelRole: function(data) {
			self.role(self.tempRole());
			self.newRoleFlag(false);
		},
		saveRole: function(data) {
			// Check for duplicate role names
			var name = self.role().name();
			var match = _.find(self.roles(), function(item) { return item.name() == name});
			// If is new and no duplicate name
			if(match == undefined || self.role().id() != undefined) {
				// Add practice id
				self.role().practiceId(self.practiceId());
				// Don't save if administrator
				if(self.role().name() != 'Administrator') {
					// Save role
					backend.saveRole(self.role()).complete(function(d) {
						// Insert successful
						if(d.responseText.indexOf('id') >= 0) {
							self.roles.push(self.role());
							self.newRoleFlag(false);
						}
						
						// Successful	
						if(d.responseText.toLowerCase().indexOf('fail') < 0) 
							$('.alert-success').fadeIn().delay(3000).fadeOut();
					});
				}
			}
			// Duplicate name
			else
				$('.nameAlert').fadeIn().delay(3000).fadeOut();
		},
		deleteRole: function() {
			app.showMessage('Are you sure you want to delete ' + self.role().name() + '?',
						    'Delete Role', ['Yes', 'No']).done(function(result) {
				if(result == 'Yes') {
					backend.deleteRole(self.role().id());
					self.roles.remove(self.role());
					self.role(new structures.Role());
				}						 	
			});
		},
		resetPassword: function() {
			// Email
			app.showMessage(
				'Are you sure you want to reset ' + user().firstName() + " " + user().lastName() + "'s password?", 
				'Rest Password', 
				['Yes', 'No']
			).then(function(response) {
				if(response == 'Yes')
					$.get('php/emailPass.php', {user: JSON.stringify(ko.toJS(self.user())), method: 'reset'});
			});
		},
		getRoleName: getRoleName
	};
});