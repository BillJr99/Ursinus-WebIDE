
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
      var PACKAGE_NAME = '../../dist/lifecycle/lifecycle.data';
      var REMOTE_PACKAGE_BASE = 'lifecycle.data';
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
Module['FS_createPath']("/usr/lib/R/library", "lifecycle", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle/help", "macros", true, true);
Module['FS_createPath']("/usr/lib/R/library/lifecycle/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/lifecycle/lifecycle.data');

      };
      Module['addRunDependency']('datafile_../../dist/lifecycle/lifecycle.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/lifecycle/NAMESPACE", "start": 0, "end": 525}, {"filename": "/usr/lib/R/library/lifecycle/NEWS.md", "start": 525, "end": 3802}, {"filename": "/usr/lib/R/library/lifecycle/LICENSE", "start": 3802, "end": 3839}, {"filename": "/usr/lib/R/library/lifecycle/DESCRIPTION", "start": 3839, "end": 5223}, {"filename": "/usr/lib/R/library/lifecycle/INDEX", "start": 5223, "end": 5882}, {"filename": "/usr/lib/R/library/lifecycle/html/00Index.html", "start": 5882, "end": 9033}, {"filename": "/usr/lib/R/library/lifecycle/html/R.css", "start": 9033, "end": 10368}, {"filename": "/usr/lib/R/library/lifecycle/R/lifecycle.rdb", "start": 10368, "end": 31009}, {"filename": "/usr/lib/R/library/lifecycle/R/lifecycle.rdx", "start": 31009, "end": 32185}, {"filename": "/usr/lib/R/library/lifecycle/R/lifecycle", "start": 32185, "end": 33243}, {"filename": "/usr/lib/R/library/lifecycle/doc/stages.Rmd", "start": 33243, "end": 40533}, {"filename": "/usr/lib/R/library/lifecycle/doc/index.html", "start": 40533, "end": 43013}, {"filename": "/usr/lib/R/library/lifecycle/doc/manage.Rmd", "start": 43013, "end": 45675}, {"filename": "/usr/lib/R/library/lifecycle/doc/stages.html", "start": 45675, "end": 75892}, {"filename": "/usr/lib/R/library/lifecycle/doc/manage.html", "start": 75892, "end": 94348}, {"filename": "/usr/lib/R/library/lifecycle/doc/communicate.Rmd", "start": 94348, "end": 106211}, {"filename": "/usr/lib/R/library/lifecycle/doc/manage.R", "start": 106211, "end": 107561}, {"filename": "/usr/lib/R/library/lifecycle/doc/stages.R", "start": 107561, "end": 107936}, {"filename": "/usr/lib/R/library/lifecycle/doc/communicate.R", "start": 107936, "end": 113928}, {"filename": "/usr/lib/R/library/lifecycle/doc/communicate.html", "start": 113928, "end": 161739}, {"filename": "/usr/lib/R/library/lifecycle/Meta/features.rds", "start": 161739, "end": 161871}, {"filename": "/usr/lib/R/library/lifecycle/Meta/package.rds", "start": 161871, "end": 163112}, {"filename": "/usr/lib/R/library/lifecycle/Meta/links.rds", "start": 163112, "end": 163464}, {"filename": "/usr/lib/R/library/lifecycle/Meta/nsInfo.rds", "start": 163464, "end": 163854}, {"filename": "/usr/lib/R/library/lifecycle/Meta/Rd.rds", "start": 163854, "end": 164579}, {"filename": "/usr/lib/R/library/lifecycle/Meta/hsearch.rds", "start": 164579, "end": 165324}, {"filename": "/usr/lib/R/library/lifecycle/Meta/vignette.rds", "start": 165324, "end": 165606}, {"filename": "/usr/lib/R/library/lifecycle/help/lifecycle.rdb", "start": 165606, "end": 189925}, {"filename": "/usr/lib/R/library/lifecycle/help/lifecycle.rdx", "start": 189925, "end": 190335}, {"filename": "/usr/lib/R/library/lifecycle/help/AnIndex", "start": 190335, "end": 190894}, {"filename": "/usr/lib/R/library/lifecycle/help/aliases.rds", "start": 190894, "end": 191170}, {"filename": "/usr/lib/R/library/lifecycle/help/paths.rds", "start": 191170, "end": 191421}, {"filename": "/usr/lib/R/library/lifecycle/help/macros/lifecycle.Rd", "start": 191421, "end": 191504}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-deprecated.svg", "start": 191504, "end": 192474}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-retired.svg", "start": 192474, "end": 193439}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-questioning.svg", "start": 193439, "end": 194411}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-soft-deprecated.svg", "start": 194411, "end": 195393}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-experimental.svg", "start": 195393, "end": 196367}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-stable.svg", "start": 196367, "end": 197323}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-maturing.svg", "start": 197323, "end": 198289}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-archived.svg", "start": 198289, "end": 199256}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-defunct.svg", "start": 199256, "end": 200220}, {"filename": "/usr/lib/R/library/lifecycle/help/figures/lifecycle-superseded.svg", "start": 200220, "end": 201191}], "remote_package_size": 201191, "package_uuid": "0af18ada-4915-46a5-99da-89487ad66042"});
  
  })();
  