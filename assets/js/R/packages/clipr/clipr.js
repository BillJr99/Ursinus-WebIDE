
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
      var PACKAGE_NAME = '../../dist/clipr/clipr.data';
      var REMOTE_PACKAGE_BASE = 'clipr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "clipr", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "rstudio", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/clipr", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/clipr/clipr.data');

      };
      Module['addRunDependency']('datafile_../../dist/clipr/clipr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/clipr/NAMESPACE", "start": 0, "end": 189}, {"filename": "/usr/lib/R/library/clipr/NEWS.md", "start": 189, "end": 5939}, {"filename": "/usr/lib/R/library/clipr/DESCRIPTION", "start": 5939, "end": 7406}, {"filename": "/usr/lib/R/library/clipr/INDEX", "start": 7406, "end": 7861}, {"filename": "/usr/lib/R/library/clipr/html/00Index.html", "start": 7861, "end": 10027}, {"filename": "/usr/lib/R/library/clipr/html/R.css", "start": 10027, "end": 11362}, {"filename": "/usr/lib/R/library/clipr/rstudio/addins.dcf", "start": 11362, "end": 11665}, {"filename": "/usr/lib/R/library/clipr/R/clipr.rdx", "start": 11665, "end": 12412}, {"filename": "/usr/lib/R/library/clipr/R/clipr", "start": 12412, "end": 13470}, {"filename": "/usr/lib/R/library/clipr/R/clipr.rdb", "start": 13470, "end": 23134}, {"filename": "/usr/lib/R/library/clipr/doc/index.html", "start": 23134, "end": 24647}, {"filename": "/usr/lib/R/library/clipr/doc/developing-with-clipr.R", "start": 24647, "end": 24790}, {"filename": "/usr/lib/R/library/clipr/doc/developing-with-clipr.html", "start": 24790, "end": 35587}, {"filename": "/usr/lib/R/library/clipr/doc/developing-with-clipr.Rmd", "start": 35587, "end": 38865}, {"filename": "/usr/lib/R/library/clipr/Meta/features.rds", "start": 38865, "end": 38997}, {"filename": "/usr/lib/R/library/clipr/Meta/package.rds", "start": 38997, "end": 40217}, {"filename": "/usr/lib/R/library/clipr/Meta/links.rds", "start": 40217, "end": 40429}, {"filename": "/usr/lib/R/library/clipr/Meta/nsInfo.rds", "start": 40429, "end": 40692}, {"filename": "/usr/lib/R/library/clipr/Meta/Rd.rds", "start": 40692, "end": 41176}, {"filename": "/usr/lib/R/library/clipr/Meta/hsearch.rds", "start": 41176, "end": 41650}, {"filename": "/usr/lib/R/library/clipr/Meta/vignette.rds", "start": 41650, "end": 41868}, {"filename": "/usr/lib/R/library/clipr/help/clipr.rdx", "start": 41868, "end": 42185}, {"filename": "/usr/lib/R/library/clipr/help/AnIndex", "start": 42185, "end": 42378}, {"filename": "/usr/lib/R/library/clipr/help/aliases.rds", "start": 42378, "end": 42534}, {"filename": "/usr/lib/R/library/clipr/help/paths.rds", "start": 42534, "end": 42729}, {"filename": "/usr/lib/R/library/clipr/help/clipr.rdb", "start": 42729, "end": 56813}], "remote_package_size": 56813, "package_uuid": "9498b7f1-e93e-40af-af4a-9eaa7eb6e2c9"});
  
  })();
  