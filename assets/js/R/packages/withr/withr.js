
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
      var PACKAGE_NAME = '../../dist/withr/withr.data';
      var REMOTE_PACKAGE_BASE = 'withr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "withr", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/withr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/withr/withr.data');

      };
      Module['addRunDependency']('datafile_../../dist/withr/withr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/withr/NAMESPACE", "start": 0, "end": 1743}, {"filename": "/usr/lib/R/library/withr/NEWS.md", "start": 1743, "end": 6906}, {"filename": "/usr/lib/R/library/withr/LICENSE", "start": 6906, "end": 6949}, {"filename": "/usr/lib/R/library/withr/DESCRIPTION", "start": 6949, "end": 9471}, {"filename": "/usr/lib/R/library/withr/INDEX", "start": 9471, "end": 10575}, {"filename": "/usr/lib/R/library/withr/html/00Index.html", "start": 10575, "end": 20813}, {"filename": "/usr/lib/R/library/withr/html/R.css", "start": 20813, "end": 22148}, {"filename": "/usr/lib/R/library/withr/R/withr.rdx", "start": 22148, "end": 23862}, {"filename": "/usr/lib/R/library/withr/R/withr.rdb", "start": 23862, "end": 62733}, {"filename": "/usr/lib/R/library/withr/R/withr", "start": 62733, "end": 63791}, {"filename": "/usr/lib/R/library/withr/doc/index.html", "start": 63791, "end": 65346}, {"filename": "/usr/lib/R/library/withr/doc/changing-and-restoring-state.html", "start": 65346, "end": 111096}, {"filename": "/usr/lib/R/library/withr/doc/changing-and-restoring-state.Rmd", "start": 111096, "end": 122296}, {"filename": "/usr/lib/R/library/withr/doc/changing-and-restoring-state.R", "start": 122296, "end": 126621}, {"filename": "/usr/lib/R/library/withr/Meta/features.rds", "start": 126621, "end": 126753}, {"filename": "/usr/lib/R/library/withr/Meta/package.rds", "start": 126753, "end": 128331}, {"filename": "/usr/lib/R/library/withr/Meta/links.rds", "start": 128331, "end": 129089}, {"filename": "/usr/lib/R/library/withr/Meta/nsInfo.rds", "start": 129089, "end": 129739}, {"filename": "/usr/lib/R/library/withr/Meta/Rd.rds", "start": 129739, "end": 131075}, {"filename": "/usr/lib/R/library/withr/Meta/hsearch.rds", "start": 131075, "end": 132414}, {"filename": "/usr/lib/R/library/withr/Meta/vignette.rds", "start": 132414, "end": 132639}, {"filename": "/usr/lib/R/library/withr/help/withr.rdx", "start": 132639, "end": 133379}, {"filename": "/usr/lib/R/library/withr/help/AnIndex", "start": 133379, "end": 135429}, {"filename": "/usr/lib/R/library/withr/help/aliases.rds", "start": 135429, "end": 136079}, {"filename": "/usr/lib/R/library/withr/help/paths.rds", "start": 136079, "end": 136418}, {"filename": "/usr/lib/R/library/withr/help/withr.rdb", "start": 136418, "end": 210005}, {"filename": "/usr/lib/R/library/withr/help/figures/logo.png", "start": 210005, "end": 224937}, {"filename": "/usr/lib/R/library/withr/help/figures/README-unnamed-chunk-3-1.png", "start": 224937, "end": 248961}], "remote_package_size": 248961, "package_uuid": "5e20c5e8-eaac-4819-a73b-f12c121dadce"});
  
  })();
  