
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
      var PACKAGE_NAME = '../../dist/purrr/purrr.data';
      var REMOTE_PACKAGE_BASE = 'purrr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "purrr", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/purrr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/purrr/purrr.data');

      };
      Module['addRunDependency']('datafile_../../dist/purrr/purrr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/purrr/NAMESPACE", "start": 0, "end": 4236}, {"filename": "/usr/lib/R/library/purrr/NEWS.md", "start": 4236, "end": 30459}, {"filename": "/usr/lib/R/library/purrr/LICENSE", "start": 30459, "end": 65606}, {"filename": "/usr/lib/R/library/purrr/DESCRIPTION", "start": 65606, "end": 66814}, {"filename": "/usr/lib/R/library/purrr/INDEX", "start": 66814, "end": 69873}, {"filename": "/usr/lib/R/library/purrr/html/00Index.html", "start": 69873, "end": 90417}, {"filename": "/usr/lib/R/library/purrr/html/R.css", "start": 90417, "end": 91752}, {"filename": "/usr/lib/R/library/purrr/R/purrr.rdb", "start": 91752, "end": 159989}, {"filename": "/usr/lib/R/library/purrr/R/purrr.rdx", "start": 159989, "end": 163467}, {"filename": "/usr/lib/R/library/purrr/R/purrr", "start": 163467, "end": 164525}, {"filename": "/usr/lib/R/library/purrr/doc/other-langs.Rmd", "start": 164525, "end": 166630}, {"filename": "/usr/lib/R/library/purrr/doc/index.html", "start": 166630, "end": 168052}, {"filename": "/usr/lib/R/library/purrr/doc/other-langs.html", "start": 168052, "end": 174144}, {"filename": "/usr/lib/R/library/purrr/Meta/features.rds", "start": 174144, "end": 174276}, {"filename": "/usr/lib/R/library/purrr/Meta/package.rds", "start": 174276, "end": 175444}, {"filename": "/usr/lib/R/library/purrr/Meta/links.rds", "start": 175444, "end": 176980}, {"filename": "/usr/lib/R/library/purrr/Meta/nsInfo.rds", "start": 176980, "end": 178305}, {"filename": "/usr/lib/R/library/purrr/Meta/Rd.rds", "start": 178305, "end": 181114}, {"filename": "/usr/lib/R/library/purrr/Meta/hsearch.rds", "start": 181114, "end": 183846}, {"filename": "/usr/lib/R/library/purrr/Meta/vignette.rds", "start": 183846, "end": 184069}, {"filename": "/usr/lib/R/library/purrr/libs/purrr.so", "start": 184069, "end": 223815}, {"filename": "/usr/lib/R/library/purrr/help/purrr.rdb", "start": 223815, "end": 382706}, {"filename": "/usr/lib/R/library/purrr/help/AnIndex", "start": 382706, "end": 386217}, {"filename": "/usr/lib/R/library/purrr/help/purrr.rdx", "start": 386217, "end": 387530}, {"filename": "/usr/lib/R/library/purrr/help/aliases.rds", "start": 387530, "end": 388824}, {"filename": "/usr/lib/R/library/purrr/help/paths.rds", "start": 388824, "end": 389367}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-deprecated.svg", "start": 389367, "end": 390337}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-retired.svg", "start": 390337, "end": 391302}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-questioning.svg", "start": 391302, "end": 392274}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-soft-deprecated.svg", "start": 392274, "end": 393256}, {"filename": "/usr/lib/R/library/purrr/help/figures/logo.png", "start": 393256, "end": 424323}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-experimental.svg", "start": 424323, "end": 425297}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-stable.svg", "start": 425297, "end": 426253}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-maturing.svg", "start": 426253, "end": 427219}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-archived.svg", "start": 427219, "end": 428186}, {"filename": "/usr/lib/R/library/purrr/help/figures/lifecycle-defunct.svg", "start": 428186, "end": 429150}], "remote_package_size": 429150, "package_uuid": "4e559866-e05f-486f-841f-643a47787127"});
  
  })();
  