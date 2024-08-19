
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
      var PACKAGE_NAME = '../dist/gtable/gtable.data';
      var REMOTE_PACKAGE_BASE = 'gtable.data';
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
Module['FS_createPath']("/usr/lib/R/library", "gtable", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/gtable/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../dist/gtable/gtable.data');

      };
      Module['addRunDependency']('datafile_../dist/gtable/gtable.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/gtable/NAMESPACE", "start": 0, "end": 858}, {"filename": "/usr/lib/R/library/gtable/NEWS.md", "start": 858, "end": 2511}, {"filename": "/usr/lib/R/library/gtable/DESCRIPTION", "start": 2511, "end": 4081}, {"filename": "/usr/lib/R/library/gtable/INDEX", "start": 4081, "end": 5197}, {"filename": "/usr/lib/R/library/gtable/html/00Index.html", "start": 5197, "end": 9377}, {"filename": "/usr/lib/R/library/gtable/html/R.css", "start": 9377, "end": 10712}, {"filename": "/usr/lib/R/library/gtable/R/gtable.rdx", "start": 10712, "end": 11685}, {"filename": "/usr/lib/R/library/gtable/R/gtable.rdb", "start": 11685, "end": 31198}, {"filename": "/usr/lib/R/library/gtable/R/gtable", "start": 31198, "end": 32256}, {"filename": "/usr/lib/R/library/gtable/doc/profiling.html", "start": 32256, "end": 1869885}, {"filename": "/usr/lib/R/library/gtable/doc/index.html", "start": 1869885, "end": 1871344}, {"filename": "/usr/lib/R/library/gtable/doc/profiling.R", "start": 1871344, "end": 1871943}, {"filename": "/usr/lib/R/library/gtable/doc/profiling.Rmd", "start": 1871943, "end": 1874452}, {"filename": "/usr/lib/R/library/gtable/Meta/features.rds", "start": 1874452, "end": 1874584}, {"filename": "/usr/lib/R/library/gtable/Meta/package.rds", "start": 1874584, "end": 1875848}, {"filename": "/usr/lib/R/library/gtable/Meta/links.rds", "start": 1875848, "end": 1876220}, {"filename": "/usr/lib/R/library/gtable/Meta/nsInfo.rds", "start": 1876220, "end": 1876662}, {"filename": "/usr/lib/R/library/gtable/Meta/Rd.rds", "start": 1876662, "end": 1877591}, {"filename": "/usr/lib/R/library/gtable/Meta/hsearch.rds", "start": 1877591, "end": 1878491}, {"filename": "/usr/lib/R/library/gtable/Meta/vignette.rds", "start": 1878491, "end": 1878701}, {"filename": "/usr/lib/R/library/gtable/help/gtable.rdx", "start": 1878701, "end": 1879276}, {"filename": "/usr/lib/R/library/gtable/help/gtable.rdb", "start": 1879276, "end": 1919651}, {"filename": "/usr/lib/R/library/gtable/help/AnIndex", "start": 1919651, "end": 1920309}, {"filename": "/usr/lib/R/library/gtable/help/aliases.rds", "start": 1920309, "end": 1920581}, {"filename": "/usr/lib/R/library/gtable/help/paths.rds", "start": 1920581, "end": 1920860}, {"filename": "/usr/lib/R/library/gtable/help/figures/README-unnamed-chunk-2-1.png", "start": 1920860, "end": 1943000}, {"filename": "/usr/lib/R/library/gtable/help/figures/logo.png", "start": 1943000, "end": 1961816}, {"filename": "/usr/lib/R/library/gtable/help/figures/README-unnamed-chunk-3-1.png", "start": 1961816, "end": 1982801}], "remote_package_size": 1982801, "package_uuid": "02a8fed5-6986-4da8-95fe-c5e41544e6ca"});
  
  })();
  