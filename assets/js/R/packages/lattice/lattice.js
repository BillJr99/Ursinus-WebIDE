
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
    // When running as a pthread, FS operations are proxied to the main thread, so we don't need to
    // fetch the .data bundle on the worker
    if (Module['ENVIRONMENT_IS_PTHREAD']) return;
    var loadPackage = function(metadata) {
  
      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = '../dist/lattice/lattice.data';
      var REMOTE_PACKAGE_BASE = 'lattice.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        
        if (typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
          require('fs').readFile(packageName, function(err, contents) {
            if (err) {
              errback(err);
            } else {
              callback(contents.buffer);
            }
          });
          return;
        }
      
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "usr", true, true);
Module['FS_createPath']("/usr", "lib", true, true);
Module['FS_createPath']("/usr/lib", "R", true, true);
Module['FS_createPath']("/usr/lib/R", "library", true, true);
Module['FS_createPath']("/usr/lib/R/library", "lattice", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "demo", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "po", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "ko", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/ko", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "it", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/it", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "en@quot", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/en@quot", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "fr", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/fr", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "de", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/de", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po", "pl", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice/po/pl", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/lattice", "help", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio'] || 0).open('GET', files[i]['filename']);
              }
      
        
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../dist/lattice/lattice.data');

      };
      Module['addRunDependency']('datafile_../dist/lattice/lattice.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/usr/lib/R/library/lattice/NAMESPACE", "start": 0, "end": 7031}, {"filename": "/usr/lib/R/library/lattice/CITATION", "start": 7031, "end": 7687}, {"filename": "/usr/lib/R/library/lattice/NEWS", "start": 7687, "end": 43667}, {"filename": "/usr/lib/R/library/lattice/DESCRIPTION", "start": 43667, "end": 45339}, {"filename": "/usr/lib/R/library/lattice/INDEX", "start": 45339, "end": 49367}, {"filename": "/usr/lib/R/library/lattice/html/00Index.html", "start": 49367, "end": 80438}, {"filename": "/usr/lib/R/library/lattice/html/R.css", "start": 80438, "end": 81773}, {"filename": "/usr/lib/R/library/lattice/R/lattice.rdb", "start": 81773, "end": 273529}, {"filename": "/usr/lib/R/library/lattice/R/lattice.rdx", "start": 273529, "end": 277452}, {"filename": "/usr/lib/R/library/lattice/R/lattice", "start": 277452, "end": 278510}, {"filename": "/usr/lib/R/library/lattice/data/Rdata.rdx", "start": 278510, "end": 278781}, {"filename": "/usr/lib/R/library/lattice/data/Rdata.rds", "start": 278781, "end": 278958}, {"filename": "/usr/lib/R/library/lattice/data/Rdata.rdb", "start": 278958, "end": 287763}, {"filename": "/usr/lib/R/library/lattice/Meta/demo.rds", "start": 287763, "end": 287947}, {"filename": "/usr/lib/R/library/lattice/Meta/features.rds", "start": 287947, "end": 288079}, {"filename": "/usr/lib/R/library/lattice/Meta/package.rds", "start": 288079, "end": 289429}, {"filename": "/usr/lib/R/library/lattice/Meta/links.rds", "start": 289429, "end": 291424}, {"filename": "/usr/lib/R/library/lattice/Meta/nsInfo.rds", "start": 291424, "end": 293238}, {"filename": "/usr/lib/R/library/lattice/Meta/Rd.rds", "start": 293238, "end": 296845}, {"filename": "/usr/lib/R/library/lattice/Meta/hsearch.rds", "start": 296845, "end": 300522}, {"filename": "/usr/lib/R/library/lattice/Meta/data.rds", "start": 300522, "end": 300845}, {"filename": "/usr/lib/R/library/lattice/demo/labels.R", "start": 300845, "end": 302513}, {"filename": "/usr/lib/R/library/lattice/demo/intervals.R", "start": 302513, "end": 304545}, {"filename": "/usr/lib/R/library/lattice/demo/panel.R", "start": 304545, "end": 308141}, {"filename": "/usr/lib/R/library/lattice/demo/lattice.R", "start": 308141, "end": 314430}, {"filename": "/usr/lib/R/library/lattice/po/ko/LC_MESSAGES/R-lattice.mo", "start": 314430, "end": 329254}, {"filename": "/usr/lib/R/library/lattice/po/it/LC_MESSAGES/R-lattice.mo", "start": 329254, "end": 339099}, {"filename": "/usr/lib/R/library/lattice/po/en@quot/LC_MESSAGES/R-lattice.mo", "start": 339099, "end": 351391}, {"filename": "/usr/lib/R/library/lattice/po/fr/LC_MESSAGES/R-lattice.mo", "start": 351391, "end": 364976}, {"filename": "/usr/lib/R/library/lattice/po/de/LC_MESSAGES/R-lattice.mo", "start": 364976, "end": 378226}, {"filename": "/usr/lib/R/library/lattice/po/pl/LC_MESSAGES/R-lattice.mo", "start": 378226, "end": 391598}, {"filename": "/usr/lib/R/library/lattice/libs/lattice.so", "start": 391598, "end": 413585}, {"filename": "/usr/lib/R/library/lattice/help/lattice.rdb", "start": 413585, "end": 873484}, {"filename": "/usr/lib/R/library/lattice/help/AnIndex", "start": 873484, "end": 879236}, {"filename": "/usr/lib/R/library/lattice/help/aliases.rds", "start": 879236, "end": 881043}, {"filename": "/usr/lib/R/library/lattice/help/paths.rds", "start": 881043, "end": 881708}, {"filename": "/usr/lib/R/library/lattice/help/lattice.rdx", "start": 881708, "end": 883315}], "remote_package_size": 883315, "package_uuid": "1c9abc23-82df-4cf0-b1da-7a08c3b64e0a"});
  
  })();
  