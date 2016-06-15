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
      width: 400,
      height: 200
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

    // Bind button to call server API
    this._find('Button').on('click', function() { // Expects you to have a button with data-id="Button"

      var methodName = 'info';
      var methodArgs = {'test': '1234'};

      self._app._api(methodName, methodArgs, function(error, result) { // or `this._app`
        if ( error ) {        	
          alert('An error occured: ' + error);
          return;
        }

        // Or else do something with 'result'
        // In this example it should return {foo: bar}
        alert(result.foo);
      });
    });

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
