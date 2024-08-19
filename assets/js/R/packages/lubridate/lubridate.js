
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
      var PACKAGE_NAME = '../../dist/lubridate/lubridate.data';
      var REMOTE_PACKAGE_BASE = 'lubridate.data';
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
Module['FS_createPath']("/usr/lib/R/library", "lubridate", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "pkgdown", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate/pkgdown", "assets", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/lubridate/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/lubridate/lubridate.data');

      };
      Module['addRunDependency']('datafile_../../dist/lubridate/lubridate.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/lubridate/NAMESPACE", "start": 0, "end": 5889}, {"filename": "/usr/lib/R/library/lubridate/NEWS.md", "start": 5889, "end": 45147}, {"filename": "/usr/lib/R/library/lubridate/CITATION", "start": 45147, "end": 45837}, {"filename": "/usr/lib/R/library/lubridate/DESCRIPTION", "start": 45837, "end": 49618}, {"filename": "/usr/lib/R/library/lubridate/INDEX", "start": 49618, "end": 53663}, {"filename": "/usr/lib/R/library/lubridate/cctz.sh", "start": 53663, "end": 54034}, {"filename": "/usr/lib/R/library/lubridate/html/00Index.html", "start": 54034, "end": 80089}, {"filename": "/usr/lib/R/library/lubridate/html/R.css", "start": 80089, "end": 81424}, {"filename": "/usr/lib/R/library/lubridate/R/lubridate", "start": 81424, "end": 82482}, {"filename": "/usr/lib/R/library/lubridate/R/lubridate.rdx", "start": 82482, "end": 89539}, {"filename": "/usr/lib/R/library/lubridate/R/lubridate.rdb", "start": 89539, "end": 367497}, {"filename": "/usr/lib/R/library/lubridate/data/Rdata.rdx", "start": 367497, "end": 367654}, {"filename": "/usr/lib/R/library/lubridate/data/Rdata.rds", "start": 367654, "end": 367743}, {"filename": "/usr/lib/R/library/lubridate/data/Rdata.rdb", "start": 367743, "end": 611456}, {"filename": "/usr/lib/R/library/lubridate/doc/lubridate.Rmd", "start": 611456, "end": 619980}, {"filename": "/usr/lib/R/library/lubridate/doc/lubridate.html", "start": 619980, "end": 647723}, {"filename": "/usr/lib/R/library/lubridate/doc/index.html", "start": 647723, "end": 649212}, {"filename": "/usr/lib/R/library/lubridate/doc/lubridate.R", "start": 649212, "end": 652188}, {"filename": "/usr/lib/R/library/lubridate/Meta/features.rds", "start": 652188, "end": 652320}, {"filename": "/usr/lib/R/library/lubridate/Meta/package.rds", "start": 652320, "end": 654345}, {"filename": "/usr/lib/R/library/lubridate/Meta/links.rds", "start": 654345, "end": 657531}, {"filename": "/usr/lib/R/library/lubridate/Meta/nsInfo.rds", "start": 657531, "end": 659265}, {"filename": "/usr/lib/R/library/lubridate/Meta/Rd.rds", "start": 659265, "end": 663938}, {"filename": "/usr/lib/R/library/lubridate/Meta/hsearch.rds", "start": 663938, "end": 668659}, {"filename": "/usr/lib/R/library/lubridate/Meta/data.rds", "start": 668659, "end": 668785}, {"filename": "/usr/lib/R/library/lubridate/Meta/vignette.rds", "start": 668785, "end": 669003}, {"filename": "/usr/lib/R/library/lubridate/pkgdown/assets/tidyverse.css", "start": 669003, "end": 844427}, {"filename": "/usr/lib/R/library/lubridate/pkgdown/assets/tidyverse.css.map", "start": 844427, "end": 938900}, {"filename": "/usr/lib/R/library/lubridate/libs/lubridate.so", "start": 938900, "end": 2782410}, {"filename": "/usr/lib/R/library/lubridate/help/lubridate.rdx", "start": 2782410, "end": 2783990}, {"filename": "/usr/lib/R/library/lubridate/help/AnIndex", "start": 2783990, "end": 2799678}, {"filename": "/usr/lib/R/library/lubridate/help/aliases.rds", "start": 2799678, "end": 2802683}, {"filename": "/usr/lib/R/library/lubridate/help/paths.rds", "start": 2802683, "end": 2803363}, {"filename": "/usr/lib/R/library/lubridate/help/lubridate.rdb", "start": 2803363, "end": 2984318}, {"filename": "/usr/lib/R/library/lubridate/help/figures/logo.png", "start": 2984318, "end": 3001194}], "remote_package_size": 3001194, "package_uuid": "25f10e69-8485-4859-b8e9-720aaabb4316"});
  
  })();
  