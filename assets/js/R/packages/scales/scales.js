
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
      var PACKAGE_NAME = '../../dist/scales/scales.data';
      var REMOTE_PACKAGE_BASE = 'scales.data';
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
Module['FS_createPath']("/usr/lib/R/library", "scales", true, true);
Module['FS_createPath']("/usr/lib/R/library/scales", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/scales", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/scales", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/scales", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/scales/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/scales/scales.data');

      };
      Module['addRunDependency']('datafile_../../dist/scales/scales.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/scales/NAMESPACE", "start": 0, "end": 3573}, {"filename": "/usr/lib/R/library/scales/NEWS.md", "start": 3573, "end": 18359}, {"filename": "/usr/lib/R/library/scales/LICENSE", "start": 18359, "end": 18408}, {"filename": "/usr/lib/R/library/scales/DESCRIPTION", "start": 18408, "end": 19631}, {"filename": "/usr/lib/R/library/scales/INDEX", "start": 19631, "end": 23462}, {"filename": "/usr/lib/R/library/scales/html/00Index.html", "start": 23462, "end": 42187}, {"filename": "/usr/lib/R/library/scales/html/R.css", "start": 42187, "end": 43522}, {"filename": "/usr/lib/R/library/scales/R/scales.rdb", "start": 43522, "end": 116569}, {"filename": "/usr/lib/R/library/scales/R/scales.rdx", "start": 116569, "end": 119328}, {"filename": "/usr/lib/R/library/scales/R/scales", "start": 119328, "end": 120386}, {"filename": "/usr/lib/R/library/scales/Meta/features.rds", "start": 120386, "end": 120518}, {"filename": "/usr/lib/R/library/scales/Meta/package.rds", "start": 120518, "end": 121739}, {"filename": "/usr/lib/R/library/scales/Meta/links.rds", "start": 121739, "end": 123257}, {"filename": "/usr/lib/R/library/scales/Meta/nsInfo.rds", "start": 123257, "end": 124452}, {"filename": "/usr/lib/R/library/scales/Meta/Rd.rds", "start": 124452, "end": 127579}, {"filename": "/usr/lib/R/library/scales/Meta/hsearch.rds", "start": 127579, "end": 130498}, {"filename": "/usr/lib/R/library/scales/help/AnIndex", "start": 130498, "end": 134157}, {"filename": "/usr/lib/R/library/scales/help/scales.rdb", "start": 134157, "end": 280983}, {"filename": "/usr/lib/R/library/scales/help/aliases.rds", "start": 280983, "end": 282172}, {"filename": "/usr/lib/R/library/scales/help/paths.rds", "start": 282172, "end": 282896}, {"filename": "/usr/lib/R/library/scales/help/scales.rdx", "start": 282896, "end": 284671}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-deprecated.svg", "start": 284671, "end": 285641}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-retired.svg", "start": 285641, "end": 286606}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-questioning.svg", "start": 286606, "end": 287578}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-soft-deprecated.svg", "start": 287578, "end": 288560}, {"filename": "/usr/lib/R/library/scales/help/figures/README-labels-2.png", "start": 288560, "end": 315450}, {"filename": "/usr/lib/R/library/scales/help/figures/logo.png", "start": 315450, "end": 345335}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-experimental.svg", "start": 345335, "end": 346309}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-stable.svg", "start": 346309, "end": 347265}, {"filename": "/usr/lib/R/library/scales/help/figures/README-transforms-1.png", "start": 347265, "end": 373088}, {"filename": "/usr/lib/R/library/scales/help/figures/README-labels-1.png", "start": 373088, "end": 429404}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-maturing.svg", "start": 429404, "end": 430370}, {"filename": "/usr/lib/R/library/scales/help/figures/README-palettes-1.png", "start": 430370, "end": 459107}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-archived.svg", "start": 459107, "end": 460074}, {"filename": "/usr/lib/R/library/scales/help/figures/lifecycle-defunct.svg", "start": 460074, "end": 461038}], "remote_package_size": 461038, "package_uuid": "c9b31f27-c73b-498b-b401-cc11c59fdd4e"});
  
  })();
  