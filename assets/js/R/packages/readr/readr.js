
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
      var PACKAGE_NAME = '../../dist/readr/readr.data';
      var REMOTE_PACKAGE_BASE = 'readr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "readr", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "extdata", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/readr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/readr/readr.data');

      };
      Module['addRunDependency']('datafile_../../dist/readr/readr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/readr/NAMESPACE", "start": 0, "end": 3522}, {"filename": "/usr/lib/R/library/readr/WORDLIST", "start": 3522, "end": 4293}, {"filename": "/usr/lib/R/library/readr/NEWS.md", "start": 4293, "end": 46159}, {"filename": "/usr/lib/R/library/readr/LICENSE", "start": 46159, "end": 46202}, {"filename": "/usr/lib/R/library/readr/DESCRIPTION", "start": 46202, "end": 48533}, {"filename": "/usr/lib/R/library/readr/INDEX", "start": 48533, "end": 50958}, {"filename": "/usr/lib/R/library/readr/html/00Index.html", "start": 50958, "end": 63114}, {"filename": "/usr/lib/R/library/readr/html/R.css", "start": 63114, "end": 64449}, {"filename": "/usr/lib/R/library/readr/extdata/example.log", "start": 64449, "end": 64657}, {"filename": "/usr/lib/R/library/readr/extdata/mtcars.csv.bz2", "start": 64657, "end": 65210}, {"filename": "/usr/lib/R/library/readr/extdata/mtcars.csv.zip", "start": 65210, "end": 65921}, {"filename": "/usr/lib/R/library/readr/extdata/fwf-sample.txt", "start": 65921, "end": 66050}, {"filename": "/usr/lib/R/library/readr/extdata/massey-rating.txt", "start": 66050, "end": 66808}, {"filename": "/usr/lib/R/library/readr/extdata/whitespace-sample.txt", "start": 66808, "end": 66915}, {"filename": "/usr/lib/R/library/readr/extdata/mtcars.csv", "start": 66915, "end": 68218}, {"filename": "/usr/lib/R/library/readr/extdata/challenge.csv", "start": 68218, "end": 106259}, {"filename": "/usr/lib/R/library/readr/extdata/epa78.txt", "start": 106259, "end": 108439}, {"filename": "/usr/lib/R/library/readr/extdata/chickens.csv", "start": 108439, "end": 108775}, {"filename": "/usr/lib/R/library/readr/R/readr.rdx", "start": 108775, "end": 112228}, {"filename": "/usr/lib/R/library/readr/R/readr.rdb", "start": 112228, "end": 222863}, {"filename": "/usr/lib/R/library/readr/R/readr", "start": 222863, "end": 223921}, {"filename": "/usr/lib/R/library/readr/R/sysdata.rdx", "start": 223921, "end": 224083}, {"filename": "/usr/lib/R/library/readr/R/sysdata.rdb", "start": 224083, "end": 260864}, {"filename": "/usr/lib/R/library/readr/doc/readr.R", "start": 260864, "end": 263554}, {"filename": "/usr/lib/R/library/readr/doc/readr.Rmd", "start": 263554, "end": 273905}, {"filename": "/usr/lib/R/library/readr/doc/locales.html", "start": 273905, "end": 314422}, {"filename": "/usr/lib/R/library/readr/doc/index.html", "start": 314422, "end": 316783}, {"filename": "/usr/lib/R/library/readr/doc/readr.html", "start": 316783, "end": 362184}, {"filename": "/usr/lib/R/library/readr/doc/column-types.html", "start": 362184, "end": 396911}, {"filename": "/usr/lib/R/library/readr/doc/column-types.R", "start": 396911, "end": 398397}, {"filename": "/usr/lib/R/library/readr/doc/column-types.Rmd", "start": 398397, "end": 404626}, {"filename": "/usr/lib/R/library/readr/doc/locales.Rmd", "start": 404626, "end": 413364}, {"filename": "/usr/lib/R/library/readr/doc/locales.R", "start": 413364, "end": 417325}, {"filename": "/usr/lib/R/library/readr/Meta/features.rds", "start": 417325, "end": 417457}, {"filename": "/usr/lib/R/library/readr/Meta/package.rds", "start": 417457, "end": 419285}, {"filename": "/usr/lib/R/library/readr/Meta/links.rds", "start": 419285, "end": 420477}, {"filename": "/usr/lib/R/library/readr/Meta/nsInfo.rds", "start": 420477, "end": 421721}, {"filename": "/usr/lib/R/library/readr/Meta/Rd.rds", "start": 421721, "end": 423912}, {"filename": "/usr/lib/R/library/readr/Meta/hsearch.rds", "start": 423912, "end": 426046}, {"filename": "/usr/lib/R/library/readr/Meta/vignette.rds", "start": 426046, "end": 426313}, {"filename": "/usr/lib/R/library/readr/libs/readr.so", "start": 426313, "end": 5554979}, {"filename": "/usr/lib/R/library/readr/help/readr.rdx", "start": 5554979, "end": 5556206}, {"filename": "/usr/lib/R/library/readr/help/readr.rdb", "start": 5556206, "end": 5754219}, {"filename": "/usr/lib/R/library/readr/help/AnIndex", "start": 5754219, "end": 5757147}, {"filename": "/usr/lib/R/library/readr/help/aliases.rds", "start": 5757147, "end": 5758110}, {"filename": "/usr/lib/R/library/readr/help/paths.rds", "start": 5758110, "end": 5758642}, {"filename": "/usr/lib/R/library/readr/help/figures/lifecycle-deprecated.svg", "start": 5758642, "end": 5759612}, {"filename": "/usr/lib/R/library/readr/help/figures/logo.png", "start": 5759612, "end": 5775995}, {"filename": "/usr/lib/R/library/readr/help/figures/lifecycle-superseded.svg", "start": 5775995, "end": 5776966}], "remote_package_size": 5776966, "package_uuid": "1d7077ec-aa31-4039-a3c2-53e12a23530c"});
  
  })();
  