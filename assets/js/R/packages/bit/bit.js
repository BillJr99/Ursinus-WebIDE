
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
      var PACKAGE_NAME = '../../dist/bit/bit.data';
      var REMOTE_PACKAGE_BASE = 'bit.data';
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
Module['FS_createPath']("/usr/lib/R/library", "bit", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/bit/bit.data');

      };
      Module['addRunDependency']('datafile_../../dist/bit/bit.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/bit/NAMESPACE", "start": 0, "end": 6279}, {"filename": "/usr/lib/R/library/bit/NEWS", "start": 6279, "end": 19449}, {"filename": "/usr/lib/R/library/bit/DESCRIPTION", "start": 19449, "end": 20482}, {"filename": "/usr/lib/R/library/bit/INDEX", "start": 20482, "end": 24177}, {"filename": "/usr/lib/R/library/bit/html/00Index.html", "start": 24177, "end": 62072}, {"filename": "/usr/lib/R/library/bit/html/R.css", "start": 62072, "end": 63407}, {"filename": "/usr/lib/R/library/bit/R/bit", "start": 63407, "end": 64465}, {"filename": "/usr/lib/R/library/bit/R/bit.rdb", "start": 64465, "end": 140419}, {"filename": "/usr/lib/R/library/bit/R/bit.rdx", "start": 140419, "end": 143531}, {"filename": "/usr/lib/R/library/bit/doc/bit-usage.Rmd", "start": 143531, "end": 174722}, {"filename": "/usr/lib/R/library/bit/doc/bit-performance.html", "start": 174722, "end": 374831}, {"filename": "/usr/lib/R/library/bit/doc/bit-demo.html", "start": 374831, "end": 394787}, {"filename": "/usr/lib/R/library/bit/doc/index.html", "start": 394787, "end": 397185}, {"filename": "/usr/lib/R/library/bit/doc/bit-performance.R", "start": 397185, "end": 416427}, {"filename": "/usr/lib/R/library/bit/doc/bit-usage.html", "start": 416427, "end": 479200}, {"filename": "/usr/lib/R/library/bit/doc/bit-demo.Rmd", "start": 479200, "end": 481243}, {"filename": "/usr/lib/R/library/bit/doc/bit-usage.R", "start": 481243, "end": 492269}, {"filename": "/usr/lib/R/library/bit/doc/bit-performance.Rmd", "start": 492269, "end": 511946}, {"filename": "/usr/lib/R/library/bit/doc/bit-demo.R", "start": 511946, "end": 514122}, {"filename": "/usr/lib/R/library/bit/Meta/features.rds", "start": 514122, "end": 514254}, {"filename": "/usr/lib/R/library/bit/Meta/package.rds", "start": 514254, "end": 515366}, {"filename": "/usr/lib/R/library/bit/Meta/links.rds", "start": 515366, "end": 517376}, {"filename": "/usr/lib/R/library/bit/Meta/nsInfo.rds", "start": 517376, "end": 518836}, {"filename": "/usr/lib/R/library/bit/Meta/Rd.rds", "start": 518836, "end": 522149}, {"filename": "/usr/lib/R/library/bit/Meta/hsearch.rds", "start": 522149, "end": 525395}, {"filename": "/usr/lib/R/library/bit/Meta/vignette.rds", "start": 525395, "end": 525667}, {"filename": "/usr/lib/R/library/bit/libs/bit.so", "start": 525667, "end": 806862}, {"filename": "/usr/lib/R/library/bit/help/bit.rdb", "start": 806862, "end": 972630}, {"filename": "/usr/lib/R/library/bit/help/bit.rdx", "start": 972630, "end": 974160}, {"filename": "/usr/lib/R/library/bit/help/AnIndex", "start": 974160, "end": 980302}, {"filename": "/usr/lib/R/library/bit/help/aliases.rds", "start": 980302, "end": 982046}, {"filename": "/usr/lib/R/library/bit/help/paths.rds", "start": 982046, "end": 982667}], "remote_package_size": 982667, "package_uuid": "5097cb87-7a60-4546-8133-28e330b09542"});
  
  })();
  