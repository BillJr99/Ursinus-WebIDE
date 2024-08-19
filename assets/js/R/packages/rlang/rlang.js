
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
      var PACKAGE_NAME = '../../dist/rlang/rlang.data';
      var REMOTE_PACKAGE_BASE = 'rlang.data';
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
Module['FS_createPath']("/usr/lib/R/library", "rlang", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/rlang/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/rlang/rlang.data');

      };
      Module['addRunDependency']('datafile_../../dist/rlang/rlang.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/rlang/NAMESPACE", "start": 0, "end": 11426}, {"filename": "/usr/lib/R/library/rlang/NEWS.md", "start": 11426, "end": 101852}, {"filename": "/usr/lib/R/library/rlang/backtrace-ver", "start": 101852, "end": 101858}, {"filename": "/usr/lib/R/library/rlang/LICENSE", "start": 101858, "end": 101901}, {"filename": "/usr/lib/R/library/rlang/DESCRIPTION", "start": 101901, "end": 103640}, {"filename": "/usr/lib/R/library/rlang/INDEX", "start": 103640, "end": 110677}, {"filename": "/usr/lib/R/library/rlang/html/00Index.html", "start": 110677, "end": 148810}, {"filename": "/usr/lib/R/library/rlang/html/R.css", "start": 148810, "end": 150145}, {"filename": "/usr/lib/R/library/rlang/R/rlang.rdb", "start": 150145, "end": 431896}, {"filename": "/usr/lib/R/library/rlang/R/rlang.rdx", "start": 431896, "end": 446459}, {"filename": "/usr/lib/R/library/rlang/R/rlang", "start": 446459, "end": 447517}, {"filename": "/usr/lib/R/library/rlang/Meta/features.rds", "start": 447517, "end": 447649}, {"filename": "/usr/lib/R/library/rlang/Meta/package.rds", "start": 447649, "end": 449118}, {"filename": "/usr/lib/R/library/rlang/Meta/links.rds", "start": 449118, "end": 453601}, {"filename": "/usr/lib/R/library/rlang/Meta/nsInfo.rds", "start": 453601, "end": 456692}, {"filename": "/usr/lib/R/library/rlang/Meta/Rd.rds", "start": 456692, "end": 464674}, {"filename": "/usr/lib/R/library/rlang/Meta/hsearch.rds", "start": 464674, "end": 472237}, {"filename": "/usr/lib/R/library/rlang/libs/rlang.so", "start": 472237, "end": 855435}, {"filename": "/usr/lib/R/library/rlang/help/rlang.rdb", "start": 855435, "end": 1489467}, {"filename": "/usr/lib/R/library/rlang/help/AnIndex", "start": 1489467, "end": 1501183}, {"filename": "/usr/lib/R/library/rlang/help/rlang.rdx", "start": 1501183, "end": 1505836}, {"filename": "/usr/lib/R/library/rlang/help/aliases.rds", "start": 1505836, "end": 1509541}, {"filename": "/usr/lib/R/library/rlang/help/paths.rds", "start": 1509541, "end": 1511360}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-deprecated.svg", "start": 1511360, "end": 1512330}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-retired.svg", "start": 1512330, "end": 1513295}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-questioning.svg", "start": 1513295, "end": 1514267}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-soft-deprecated.svg", "start": 1514267, "end": 1515249}, {"filename": "/usr/lib/R/library/rlang/help/figures/logo.png", "start": 1515249, "end": 1541093}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-experimental.svg", "start": 1541093, "end": 1542067}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-stable.svg", "start": 1542067, "end": 1543023}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-maturing.svg", "start": 1543023, "end": 1543989}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-archived.svg", "start": 1543989, "end": 1544956}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-defunct.svg", "start": 1544956, "end": 1545920}, {"filename": "/usr/lib/R/library/rlang/help/figures/lifecycle-superseded.svg", "start": 1545920, "end": 1546891}], "remote_package_size": 1546891, "package_uuid": "9f9ade04-4493-4c4f-8ca2-24e756ec3dc8"});
  
  })();
  