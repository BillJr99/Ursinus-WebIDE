
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
      var PACKAGE_NAME = '../../dist/pkgconfig/pkgconfig.data';
      var REMOTE_PACKAGE_BASE = 'pkgconfig.data';
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
Module['FS_createPath']("/usr/lib/R/library", "pkgconfig", true, true);
Module['FS_createPath']("/usr/lib/R/library/pkgconfig", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/pkgconfig", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/pkgconfig", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/pkgconfig", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/pkgconfig/pkgconfig.data');

      };
      Module['addRunDependency']('datafile_../../dist/pkgconfig/pkgconfig.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/pkgconfig/NAMESPACE", "start": 0, "end": 144}, {"filename": "/usr/lib/R/library/pkgconfig/README.Rmd", "start": 144, "end": 3738}, {"filename": "/usr/lib/R/library/pkgconfig/NEWS.markdown", "start": 3738, "end": 4381}, {"filename": "/usr/lib/R/library/pkgconfig/LICENSE", "start": 4381, "end": 4431}, {"filename": "/usr/lib/R/library/pkgconfig/DESCRIPTION", "start": 4431, "end": 5146}, {"filename": "/usr/lib/R/library/pkgconfig/INDEX", "start": 5146, "end": 5392}, {"filename": "/usr/lib/R/library/pkgconfig/README.markdown", "start": 5392, "end": 8986}, {"filename": "/usr/lib/R/library/pkgconfig/html/00Index.html", "start": 8986, "end": 10582}, {"filename": "/usr/lib/R/library/pkgconfig/html/R.css", "start": 10582, "end": 11917}, {"filename": "/usr/lib/R/library/pkgconfig/R/pkgconfig", "start": 11917, "end": 12975}, {"filename": "/usr/lib/R/library/pkgconfig/R/pkgconfig.rdx", "start": 12975, "end": 13354}, {"filename": "/usr/lib/R/library/pkgconfig/R/pkgconfig.rdb", "start": 13354, "end": 16068}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/features.rds", "start": 16068, "end": 16200}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/package.rds", "start": 16200, "end": 17049}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/links.rds", "start": 17049, "end": 17209}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/nsInfo.rds", "start": 17209, "end": 17453}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/Rd.rds", "start": 17453, "end": 17808}, {"filename": "/usr/lib/R/library/pkgconfig/Meta/hsearch.rds", "start": 17808, "end": 18169}, {"filename": "/usr/lib/R/library/pkgconfig/help/AnIndex", "start": 18169, "end": 18277}, {"filename": "/usr/lib/R/library/pkgconfig/help/pkgconfig.rdx", "start": 18277, "end": 18522}, {"filename": "/usr/lib/R/library/pkgconfig/help/pkgconfig.rdb", "start": 18522, "end": 23903}, {"filename": "/usr/lib/R/library/pkgconfig/help/aliases.rds", "start": 23903, "end": 24022}, {"filename": "/usr/lib/R/library/pkgconfig/help/paths.rds", "start": 24022, "end": 24190}], "remote_package_size": 24190, "package_uuid": "cb64fe42-c443-4d0f-8252-8740d82d04c2"});
  
  })();
  