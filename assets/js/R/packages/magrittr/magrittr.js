
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
      var PACKAGE_NAME = '../../dist/magrittr/magrittr.data';
      var REMOTE_PACKAGE_BASE = 'magrittr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "magrittr", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/magrittr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/magrittr/magrittr.data');

      };
      Module['addRunDependency']('datafile_../../dist/magrittr/magrittr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/magrittr/NAMESPACE", "start": 0, "end": 925}, {"filename": "/usr/lib/R/library/magrittr/logo-hex.svg", "start": 925, "end": 23386}, {"filename": "/usr/lib/R/library/magrittr/NEWS.md", "start": 23386, "end": 29877}, {"filename": "/usr/lib/R/library/magrittr/logo.png", "start": 29877, "end": 57276}, {"filename": "/usr/lib/R/library/magrittr/logo-hex.png", "start": 57276, "end": 73693}, {"filename": "/usr/lib/R/library/magrittr/LICENSE", "start": 73693, "end": 73761}, {"filename": "/usr/lib/R/library/magrittr/DESCRIPTION", "start": 73761, "end": 75530}, {"filename": "/usr/lib/R/library/magrittr/INDEX", "start": 75530, "end": 76235}, {"filename": "/usr/lib/R/library/magrittr/logo.svg", "start": 76235, "end": 98563}, {"filename": "/usr/lib/R/library/magrittr/html/00Index.html", "start": 98563, "end": 104135}, {"filename": "/usr/lib/R/library/magrittr/html/R.css", "start": 104135, "end": 105470}, {"filename": "/usr/lib/R/library/magrittr/R/magrittr.rdb", "start": 105470, "end": 112941}, {"filename": "/usr/lib/R/library/magrittr/R/magrittr.rdx", "start": 112941, "end": 113782}, {"filename": "/usr/lib/R/library/magrittr/R/magrittr", "start": 113782, "end": 114840}, {"filename": "/usr/lib/R/library/magrittr/doc/tradeoffs.R", "start": 114840, "end": 121837}, {"filename": "/usr/lib/R/library/magrittr/doc/magrittr.html", "start": 121837, "end": 151690}, {"filename": "/usr/lib/R/library/magrittr/doc/index.html", "start": 151690, "end": 153634}, {"filename": "/usr/lib/R/library/magrittr/doc/tradeoffs.html", "start": 153634, "end": 215005}, {"filename": "/usr/lib/R/library/magrittr/doc/magrittr.R", "start": 215005, "end": 217135}, {"filename": "/usr/lib/R/library/magrittr/doc/magrittr.Rmd", "start": 217135, "end": 225080}, {"filename": "/usr/lib/R/library/magrittr/doc/tradeoffs.Rmd", "start": 225080, "end": 242029}, {"filename": "/usr/lib/R/library/magrittr/Meta/features.rds", "start": 242029, "end": 242161}, {"filename": "/usr/lib/R/library/magrittr/Meta/package.rds", "start": 242161, "end": 243430}, {"filename": "/usr/lib/R/library/magrittr/Meta/links.rds", "start": 243430, "end": 244011}, {"filename": "/usr/lib/R/library/magrittr/Meta/nsInfo.rds", "start": 244011, "end": 244617}, {"filename": "/usr/lib/R/library/magrittr/Meta/Rd.rds", "start": 244617, "end": 245522}, {"filename": "/usr/lib/R/library/magrittr/Meta/hsearch.rds", "start": 245522, "end": 246431}, {"filename": "/usr/lib/R/library/magrittr/Meta/vignette.rds", "start": 246431, "end": 246663}, {"filename": "/usr/lib/R/library/magrittr/libs/magrittr.so", "start": 246663, "end": 260359}, {"filename": "/usr/lib/R/library/magrittr/help/magrittr.rdb", "start": 260359, "end": 291957}, {"filename": "/usr/lib/R/library/magrittr/help/AnIndex", "start": 291957, "end": 292927}, {"filename": "/usr/lib/R/library/magrittr/help/aliases.rds", "start": 292927, "end": 293440}, {"filename": "/usr/lib/R/library/magrittr/help/magrittr.rdx", "start": 293440, "end": 293947}, {"filename": "/usr/lib/R/library/magrittr/help/paths.rds", "start": 293947, "end": 294220}, {"filename": "/usr/lib/R/library/magrittr/help/figures/exposition-1.png", "start": 294220, "end": 331713}, {"filename": "/usr/lib/R/library/magrittr/help/figures/logo.png", "start": 331713, "end": 361008}], "remote_package_size": 361008, "package_uuid": "785577da-23d2-4082-a459-cf2cffde9c59"});
  
  })();
  