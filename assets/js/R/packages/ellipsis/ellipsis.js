
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
      var PACKAGE_NAME = '../../dist/ellipsis/ellipsis.data';
      var REMOTE_PACKAGE_BASE = 'ellipsis.data';
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
Module['FS_createPath']("/usr/lib/R/library", "ellipsis", true, true);
Module['FS_createPath']("/usr/lib/R/library/ellipsis", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/ellipsis", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/ellipsis", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/ellipsis", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/ellipsis", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/ellipsis/ellipsis.data');

      };
      Module['addRunDependency']('datafile_../../dist/ellipsis/ellipsis.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/ellipsis/NAMESPACE", "start": 0, "end": 228}, {"filename": "/usr/lib/R/library/ellipsis/NEWS.md", "start": 228, "end": 1514}, {"filename": "/usr/lib/R/library/ellipsis/LICENSE", "start": 1514, "end": 1560}, {"filename": "/usr/lib/R/library/ellipsis/DESCRIPTION", "start": 1560, "end": 2578}, {"filename": "/usr/lib/R/library/ellipsis/INDEX", "start": 2578, "end": 2791}, {"filename": "/usr/lib/R/library/ellipsis/html/00Index.html", "start": 2791, "end": 4470}, {"filename": "/usr/lib/R/library/ellipsis/html/R.css", "start": 4470, "end": 5805}, {"filename": "/usr/lib/R/library/ellipsis/R/ellipsis", "start": 5805, "end": 6863}, {"filename": "/usr/lib/R/library/ellipsis/R/ellipsis.rdb", "start": 6863, "end": 15022}, {"filename": "/usr/lib/R/library/ellipsis/R/ellipsis.rdx", "start": 15022, "end": 15566}, {"filename": "/usr/lib/R/library/ellipsis/Meta/features.rds", "start": 15566, "end": 15698}, {"filename": "/usr/lib/R/library/ellipsis/Meta/package.rds", "start": 15698, "end": 16737}, {"filename": "/usr/lib/R/library/ellipsis/Meta/links.rds", "start": 16737, "end": 16968}, {"filename": "/usr/lib/R/library/ellipsis/Meta/nsInfo.rds", "start": 16968, "end": 17325}, {"filename": "/usr/lib/R/library/ellipsis/Meta/Rd.rds", "start": 17325, "end": 17816}, {"filename": "/usr/lib/R/library/ellipsis/Meta/hsearch.rds", "start": 17816, "end": 18320}, {"filename": "/usr/lib/R/library/ellipsis/libs/ellipsis.so", "start": 18320, "end": 22579}, {"filename": "/usr/lib/R/library/ellipsis/help/AnIndex", "start": 22579, "end": 22841}, {"filename": "/usr/lib/R/library/ellipsis/help/aliases.rds", "start": 22841, "end": 23017}, {"filename": "/usr/lib/R/library/ellipsis/help/ellipsis.rdb", "start": 23017, "end": 33459}, {"filename": "/usr/lib/R/library/ellipsis/help/ellipsis.rdx", "start": 33459, "end": 33791}, {"filename": "/usr/lib/R/library/ellipsis/help/paths.rds", "start": 33791, "end": 34000}], "remote_package_size": 34000, "package_uuid": "b686a04c-77fa-4b12-b065-4009d1634eb0"});
  
  })();
  