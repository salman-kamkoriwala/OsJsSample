/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // WINDOWS
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationPaperTradeSampleWindow(app, metadata, scheme) {
    Window.apply(this, ['ApplicationPaperTradeSampleWindow', {
      icon: metadata.icon,
      title: metadata.name,
      allow_resize: true,
      allow_drop: true,
      allow_resize: true,
      allow_maximize: true,
      allow_session: true,
      width: 800,
      height: 800
    }, app, scheme]);
  }

  ApplicationPaperTradeSampleWindow.prototype = Object.create(Window.prototype);
  ApplicationPaperTradeSampleWindow.constructor = Window.prototype;

  ApplicationPaperTradeSampleWindow.prototype.init = function(wmRef, app, scheme) {
    var root = Window.prototype.init.apply(this, arguments);
    var self = this;

    // Load and render `scheme.html` file
    scheme.render(this, 'PaperTradeSampleWindow', root);

    // Put your GUI code here (or make a new prototype function and call it):
    
    //
    // START EXAMPLE
    //
    // User 
    var listUser = [];
    var container = this._scheme.find(this, 'TabsContainer');
    var header = this._scheme.find(this, 'Header');
    header.set('value', 'Paper Trade Sample Application');
    
    var UserList = document.getElementById("UserList");
    var noRecords = document.getElementById("no-records");

    self._app._api('listUser', null, function(error, result) { // or `this._app`
        if ( error ) {        	
          alert('An error occured: ' + error);
          return;
        }

        // Or else do something with 'result'
        // In this example it should return {foo: bar}
        if (result.success == true) {
        	for (var user in result.data) {
        		if(isEmpty(listUser)) { UserList.removeChild(noRecords); };
        		setUserList({EmpID:result.data[user].EmpID, UserName:result.data[user].UserName, UserUsername:result.data[user].UserUsername, UserEmails:result.data[user].UserEmails});
        	}
        } else {
        	alert(result.message);
        }
    });
    
    var SaveUser = this._scheme.find(this, 'SaveUser');
    SaveUser.on('click', function() {
    	
    	var EmpID = self._scheme.find(self, 'EmpID').get('value');
    	var UserName = self._scheme.find(self, 'UserName').get('value');
    	var UserUsername = self._scheme.find(self, 'UserUsername').get('value');
    	var UserEmails = self._scheme.find(self, 'UserEmails').get('value');
    	
    	var methodName = 'addUser';
    	var methodArgs = {
    			EmpID:EmpID
    			,UserName:UserName
    			,UserUsername:UserUsername
    			,UserEmails:UserEmails
    	};
    	
    	if(isEmpty(UserUsername)) {
    		alert('Username cannot be Empty!');
    		return false;
    	}
    	if(isEmpty(UserEmails)) {
    		alert('User Email cannot be Empty!');
    		return false;
    	}

    	self._app._api(methodName, methodArgs, function(error, result) { // or `this._app`
	        if ( error ) {        	
	          alert('An error occured: ' + error);
	          return;
	        }
	
	        // Or else do something with 'result'
	        // In this example it should return {foo: bar}
	        if (result.success == true) {
		        if(isEmpty(listUser)) { UserList.removeChild(noRecords); };
		    	
		        setUserList({EmpID:EmpID, UserName:UserName, UserUsername:UserUsername, UserEmails:UserEmails});

		        self._scheme.find(self, 'EmpID').set('value','');
		    	self._scheme.find(self, 'UserName').set('value','');
		    	self._scheme.find(self, 'UserUsername').set('value','');
		    	self._scheme.find(self, 'UserEmails').set('value','');
		    	
		    	alert("Record Added Successfully! Check User Listing Tab for Details.");
	        } else {
	        	alert("Cannot add record in DB for some reason! Check your internet connection and Please try again.");
	        }
	        
    	});
    });
    
    function setUserList(userData) {
    	listUser.push({
    		ListEmpID : userData.EmpID
    		,ListUserName : userData.UserName
    		,ListUserUsername : userData.UserUsername
    		,ListUserEmails : userData.UserEmails    			
    	});
    	
    	var row = document.createElement("gui-grid-row");  
        
    	var IDContainer = document.createElement("gui-grid-entry");
    	var ID = document.createElement("gui-label");  
    	ID.innerText = userData.EmpID;
    	IDContainer.appendChild(ID);
        row.appendChild(IDContainer); 
        
        var NameContainer = document.createElement("gui-grid-entry");
    	var Name = document.createElement("gui-label");  
        Name.innerText = userData.UserName;
        NameContainer.appendChild(Name);
        row.appendChild(NameContainer);
        
        var UsernameContainer = document.createElement("gui-grid-entry");
    	var Username = document.createElement("gui-label");  
        Username.innerText = userData.UserUsername;
        UsernameContainer.appendChild(Username);
        row.appendChild(UsernameContainer);
        
        var UseremailContainer = document.createElement("gui-grid-entry");
    	var Useremail = document.createElement("gui-label");  
        Useremail.innerText = userData.UserEmails;
        UseremailContainer.appendChild(Useremail);
        row.appendChild(UseremailContainer);
     
        UserList.appendChild(row);
    }
    // End User
    
    function isEmpty(object) {
    	
    	// null and undefined are "empty"
        if (object == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (object.length > 0)    return false;
        if (object.length === 0)  return true;
        
     // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in object) {
            if (hasOwnProperty.call(object, key)) return false;
        }
        
    	  for(var key in object) {
    	    if(object.hasOwnProperty(key)){
    	      return false;
    	    }
    	  }
    	  return true;
    	}
    //
    // END EXAMPLE
    //
    
    return root;
  };

  ApplicationPaperTradeSampleWindow.prototype.destroy = function() {
    // This is where you remove objects, dom elements etc attached to your
    // instance. You can remove this if not used.
    if ( Window.prototype.destroy.apply(this, arguments) ) {
      return true;
    }
    return false;
  };

  /////////////////////////////////////////////////////////////////////////////
  // APPLICATION
  /////////////////////////////////////////////////////////////////////////////

  function ApplicationPaperTradeSample(args, metadata) {
    Application.apply(this, ['ApplicationPaperTradeSample', args, metadata]);
  }

  ApplicationPaperTradeSample.prototype = Object.create(Application.prototype);
  ApplicationPaperTradeSample.constructor = Application;

  ApplicationPaperTradeSample.prototype.destroy = function() {
    // This is where you remove objects, dom elements etc attached to your
    // instance. You can remove this if not used.
    if ( Application.prototype.destroy.apply(this, arguments) ) {
      return true;
    }
    return false;
  };

  
  ApplicationPaperTradeSample.prototype.init = function(settings, metadata) {
    Application.prototype.init.apply(this, arguments);

    var self = this;
    this._loadScheme('./scheme.html', function(scheme) {
      self._addWindow(new ApplicationPaperTradeSampleWindow(self, metadata, scheme));
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationPaperTradeSample = OSjs.Applications.ApplicationPaperTradeSample || {};
  OSjs.Applications.ApplicationPaperTradeSample.Class = Object.seal(ApplicationPaperTradeSample);

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
