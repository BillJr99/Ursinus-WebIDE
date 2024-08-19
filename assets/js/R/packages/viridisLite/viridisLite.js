
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
      var PACKAGE_NAME = '../../dist/viridisLite/viridisLite.data';
      var REMOTE_PACKAGE_BASE = 'viridisLite.data';
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
Module['FS_createPath']("/usr/lib/R/library", "viridisLite", true, true);
Module['FS_createPath']("/usr/lib/R/library/viridisLite", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/viridisLite", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/viridisLite", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/viridisLite", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/viridisLite/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/viridisLite/viridisLite.data');

      };
      Module['addRunDependency']('datafile_../../dist/viridisLite/viridisLite.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/viridisLite/NAMESPACE", "start": 0, "end": 204}, {"filename": "/usr/lib/R/library/viridisLite/NEWS.md", "start": 204, "end": 383}, {"filename": "/usr/lib/R/library/viridisLite/CITATION", "start": 383, "end": 1209}, {"filename": "/usr/lib/R/library/viridisLite/LICENSE", "start": 1209, "end": 1252}, {"filename": "/usr/lib/R/library/viridisLite/DESCRIPTION", "start": 1252, "end": 3075}, {"filename": "/usr/lib/R/library/viridisLite/INDEX", "start": 3075, "end": 3161}, {"filename": "/usr/lib/R/library/viridisLite/html/00Index.html", "start": 3161, "end": 5295}, {"filename": "/usr/lib/R/library/viridisLite/html/R.css", "start": 5295, "end": 6630}, {"filename": "/usr/lib/R/library/viridisLite/R/viridisLite.rdx", "start": 6630, "end": 7000}, {"filename": "/usr/lib/R/library/viridisLite/R/viridisLite.rdb", "start": 7000, "end": 54649}, {"filename": "/usr/lib/R/library/viridisLite/R/viridisLite", "start": 54649, "end": 55707}, {"filename": "/usr/lib/R/library/viridisLite/Meta/features.rds", "start": 55707, "end": 55839}, {"filename": "/usr/lib/R/library/viridisLite/Meta/package.rds", "start": 55839, "end": 57192}, {"filename": "/usr/lib/R/library/viridisLite/Meta/links.rds", "start": 57192, "end": 57380}, {"filename": "/usr/lib/R/library/viridisLite/Meta/nsInfo.rds", "start": 57380, "end": 57649}, {"filename": "/usr/lib/R/library/viridisLite/Meta/Rd.rds", "start": 57649, "end": 57975}, {"filename": "/usr/lib/R/library/viridisLite/Meta/hsearch.rds", "start": 57975, "end": 58352}, {"filename": "/usr/lib/R/library/viridisLite/help/viridisLite.rdx", "start": 58352, "end": 58549}, {"filename": "/usr/lib/R/library/viridisLite/help/AnIndex", "start": 58549, "end": 58711}, {"filename": "/usr/lib/R/library/viridisLite/help/viridisLite.rdb", "start": 58711, "end": 66324}, {"filename": "/usr/lib/R/library/viridisLite/help/aliases.rds", "start": 66324, "end": 66483}, {"filename": "/usr/lib/R/library/viridisLite/help/paths.rds", "start": 66483, "end": 66628}, {"filename": "/usr/lib/R/library/viridisLite/help/figures/logo.png", "start": 66628, "end": 105176}, {"filename": "/usr/lib/R/library/viridisLite/help/figures/maps.png", "start": 105176, "end": 1269595}, {"filename": "/usr/lib/R/library/viridisLite/help/figures/viridis-scales.png", "start": 1269595, "end": 1345327}], "remote_package_size": 1345327, "package_uuid": "ee2f90a0-e316-46d8-8852-45db7f6e2897"});
  
  })();
  