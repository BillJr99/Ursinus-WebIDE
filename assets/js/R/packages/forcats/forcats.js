
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
      var PACKAGE_NAME = '../../dist/forcats/forcats.data';
      var REMOTE_PACKAGE_BASE = 'forcats.data';
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
Module['FS_createPath']("/usr/lib/R/library", "forcats", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/forcats/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/forcats/forcats.data');

      };
      Module['addRunDependency']('datafile_../../dist/forcats/forcats.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/forcats/NAMESPACE", "start": 0, "end": 903}, {"filename": "/usr/lib/R/library/forcats/NEWS.md", "start": 903, "end": 6090}, {"filename": "/usr/lib/R/library/forcats/LICENSE", "start": 6090, "end": 6135}, {"filename": "/usr/lib/R/library/forcats/DESCRIPTION", "start": 6135, "end": 7399}, {"filename": "/usr/lib/R/library/forcats/INDEX", "start": 7399, "end": 9165}, {"filename": "/usr/lib/R/library/forcats/html/00Index.html", "start": 9165, "end": 15658}, {"filename": "/usr/lib/R/library/forcats/html/R.css", "start": 15658, "end": 16993}, {"filename": "/usr/lib/R/library/forcats/R/forcats.rdx", "start": 16993, "end": 17894}, {"filename": "/usr/lib/R/library/forcats/R/forcats.rdb", "start": 17894, "end": 35924}, {"filename": "/usr/lib/R/library/forcats/R/forcats", "start": 35924, "end": 36982}, {"filename": "/usr/lib/R/library/forcats/data/Rdata.rdx", "start": 36982, "end": 37142}, {"filename": "/usr/lib/R/library/forcats/data/Rdata.rds", "start": 37142, "end": 37232}, {"filename": "/usr/lib/R/library/forcats/data/Rdata.rdb", "start": 37232, "end": 143380}, {"filename": "/usr/lib/R/library/forcats/doc/forcats.html", "start": 143380, "end": 240774}, {"filename": "/usr/lib/R/library/forcats/doc/index.html", "start": 240774, "end": 242231}, {"filename": "/usr/lib/R/library/forcats/doc/forcats.R", "start": 242231, "end": 244738}, {"filename": "/usr/lib/R/library/forcats/doc/forcats.Rmd", "start": 244738, "end": 249959}, {"filename": "/usr/lib/R/library/forcats/Meta/features.rds", "start": 249959, "end": 250091}, {"filename": "/usr/lib/R/library/forcats/Meta/package.rds", "start": 250091, "end": 251290}, {"filename": "/usr/lib/R/library/forcats/Meta/links.rds", "start": 251290, "end": 251844}, {"filename": "/usr/lib/R/library/forcats/Meta/nsInfo.rds", "start": 251844, "end": 252334}, {"filename": "/usr/lib/R/library/forcats/Meta/Rd.rds", "start": 252334, "end": 253622}, {"filename": "/usr/lib/R/library/forcats/Meta/hsearch.rds", "start": 253622, "end": 254852}, {"filename": "/usr/lib/R/library/forcats/Meta/data.rds", "start": 254852, "end": 255009}, {"filename": "/usr/lib/R/library/forcats/Meta/vignette.rds", "start": 255009, "end": 255219}, {"filename": "/usr/lib/R/library/forcats/help/forcats.rdx", "start": 255219, "end": 255947}, {"filename": "/usr/lib/R/library/forcats/help/AnIndex", "start": 255947, "end": 256890}, {"filename": "/usr/lib/R/library/forcats/help/aliases.rds", "start": 256890, "end": 257308}, {"filename": "/usr/lib/R/library/forcats/help/forcats.rdb", "start": 257308, "end": 301876}, {"filename": "/usr/lib/R/library/forcats/help/paths.rds", "start": 301876, "end": 302204}, {"filename": "/usr/lib/R/library/forcats/help/figures/README-ordered-plot-1.png", "start": 302204, "end": 330159}, {"filename": "/usr/lib/R/library/forcats/help/figures/logo.png", "start": 330159, "end": 376079}, {"filename": "/usr/lib/R/library/forcats/help/figures/README-unordered-plot-1.png", "start": 376079, "end": 404080}], "remote_package_size": 404080, "package_uuid": "c1b1e877-9050-41dc-ad18-6a36fb851bbb"});
  
  })();
  