
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
      var PACKAGE_NAME = '../../dist/jsonlite/jsonlite.data';
      var REMOTE_PACKAGE_BASE = 'jsonlite.data';
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
Module['FS_createPath']("/usr/lib/R/library", "jsonlite", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/jsonlite", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/jsonlite/jsonlite.data');

      };
      Module['addRunDependency']('datafile_../../dist/jsonlite/jsonlite.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/jsonlite/NAMESPACE", "start": 0, "end": 1203}, {"filename": "/usr/lib/R/library/jsonlite/CITATION", "start": 1203, "end": 1807}, {"filename": "/usr/lib/R/library/jsonlite/LICENSE", "start": 1807, "end": 1848}, {"filename": "/usr/lib/R/library/jsonlite/NEWS", "start": 1848, "end": 10745}, {"filename": "/usr/lib/R/library/jsonlite/DESCRIPTION", "start": 10745, "end": 12434}, {"filename": "/usr/lib/R/library/jsonlite/INDEX", "start": 12434, "end": 12940}, {"filename": "/usr/lib/R/library/jsonlite/html/00Index.html", "start": 12940, "end": 16667}, {"filename": "/usr/lib/R/library/jsonlite/html/R.css", "start": 16667, "end": 18002}, {"filename": "/usr/lib/R/library/jsonlite/R/jsonlite", "start": 18002, "end": 19060}, {"filename": "/usr/lib/R/library/jsonlite/R/jsonlite.rdb", "start": 19060, "end": 63325}, {"filename": "/usr/lib/R/library/jsonlite/R/jsonlite.rdx", "start": 63325, "end": 64760}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-mapping.pdf", "start": 64760, "end": 272926}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-opencpu.pdf", "start": 272926, "end": 337053}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-mapping.pdf.asis", "start": 337053, "end": 337249}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-apis.html", "start": 337249, "end": 975933}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-paging.html", "start": 975933, "end": 1604421}, {"filename": "/usr/lib/R/library/jsonlite/doc/index.html", "start": 1604421, "end": 1607733}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-aaquickstart.R", "start": 1607733, "end": 1609520}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-paging.Rmd", "start": 1609520, "end": 1613911}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-opencpu.pdf.asis", "start": 1613911, "end": 1614094}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-aaquickstart.html", "start": 1614094, "end": 2243573}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-apis.Rmd", "start": 2243573, "end": 2256865}, {"filename": "/usr/lib/R/library/jsonlite/doc/json-aaquickstart.Rmd", "start": 2256865, "end": 2261090}, {"filename": "/usr/lib/R/library/jsonlite/Meta/features.rds", "start": 2261090, "end": 2261222}, {"filename": "/usr/lib/R/library/jsonlite/Meta/package.rds", "start": 2261222, "end": 2262627}, {"filename": "/usr/lib/R/library/jsonlite/Meta/links.rds", "start": 2262627, "end": 2262972}, {"filename": "/usr/lib/R/library/jsonlite/Meta/nsInfo.rds", "start": 2262972, "end": 2263594}, {"filename": "/usr/lib/R/library/jsonlite/Meta/Rd.rds", "start": 2263594, "end": 2264201}, {"filename": "/usr/lib/R/library/jsonlite/Meta/hsearch.rds", "start": 2264201, "end": 2264825}, {"filename": "/usr/lib/R/library/jsonlite/Meta/vignette.rds", "start": 2264825, "end": 2265239}, {"filename": "/usr/lib/R/library/jsonlite/libs/jsonlite.so", "start": 2265239, "end": 2403011}, {"filename": "/usr/lib/R/library/jsonlite/help/AnIndex", "start": 2403011, "end": 2403462}, {"filename": "/usr/lib/R/library/jsonlite/help/aliases.rds", "start": 2403462, "end": 2403737}, {"filename": "/usr/lib/R/library/jsonlite/help/paths.rds", "start": 2403737, "end": 2403973}, {"filename": "/usr/lib/R/library/jsonlite/help/jsonlite.rdb", "start": 2403973, "end": 2432455}, {"filename": "/usr/lib/R/library/jsonlite/help/jsonlite.rdx", "start": 2432455, "end": 2432854}], "remote_package_size": 2432854, "package_uuid": "e4ebe202-8c1c-49a8-a218-3de920b7fef0"});
  
  })();
  