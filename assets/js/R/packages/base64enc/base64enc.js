
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
      var PACKAGE_NAME = '../../dist/base64enc/base64enc.data';
      var REMOTE_PACKAGE_BASE = 'base64enc.data';
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
Module['FS_createPath']("/usr/lib/R/library", "base64enc", true, true);
Module['FS_createPath']("/usr/lib/R/library/base64enc", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/base64enc", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/base64enc", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/base64enc", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/base64enc", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/base64enc/base64enc.data');

      };
      Module['addRunDependency']('datafile_../../dist/base64enc/base64enc.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/base64enc/NAMESPACE", "start": 0, "end": 125}, {"filename": "/usr/lib/R/library/base64enc/NEWS", "start": 125, "end": 639}, {"filename": "/usr/lib/R/library/base64enc/DESCRIPTION", "start": 639, "end": 1222}, {"filename": "/usr/lib/R/library/base64enc/INDEX", "start": 1222, "end": 1451}, {"filename": "/usr/lib/R/library/base64enc/html/00Index.html", "start": 1451, "end": 3187}, {"filename": "/usr/lib/R/library/base64enc/html/R.css", "start": 3187, "end": 4522}, {"filename": "/usr/lib/R/library/base64enc/R/base64enc.rdx", "start": 4522, "end": 4846}, {"filename": "/usr/lib/R/library/base64enc/R/base64enc", "start": 4846, "end": 5904}, {"filename": "/usr/lib/R/library/base64enc/R/base64enc.rdb", "start": 5904, "end": 9004}, {"filename": "/usr/lib/R/library/base64enc/Meta/features.rds", "start": 9004, "end": 9136}, {"filename": "/usr/lib/R/library/base64enc/Meta/package.rds", "start": 9136, "end": 9857}, {"filename": "/usr/lib/R/library/base64enc/Meta/links.rds", "start": 9857, "end": 10019}, {"filename": "/usr/lib/R/library/base64enc/Meta/nsInfo.rds", "start": 10019, "end": 10363}, {"filename": "/usr/lib/R/library/base64enc/Meta/Rd.rds", "start": 10363, "end": 10728}, {"filename": "/usr/lib/R/library/base64enc/Meta/hsearch.rds", "start": 10728, "end": 11137}, {"filename": "/usr/lib/R/library/base64enc/libs/base64enc.so", "start": 11137, "end": 40004}, {"filename": "/usr/lib/R/library/base64enc/help/base64enc.rdx", "start": 40004, "end": 40226}, {"filename": "/usr/lib/R/library/base64enc/help/AnIndex", "start": 40226, "end": 40316}, {"filename": "/usr/lib/R/library/base64enc/help/aliases.rds", "start": 40316, "end": 40446}, {"filename": "/usr/lib/R/library/base64enc/help/base64enc.rdb", "start": 40446, "end": 48021}, {"filename": "/usr/lib/R/library/base64enc/help/paths.rds", "start": 48021, "end": 48180}], "remote_package_size": 48180, "package_uuid": "9e2e66fb-f95f-47a1-929d-1f882d90693e"});
  
  })();
  