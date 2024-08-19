
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
      var PACKAGE_NAME = '../../dist/fansi/fansi.data';
      var REMOTE_PACKAGE_BASE = 'fansi.data';
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
Module['FS_createPath']("/usr/lib/R/library", "fansi", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/fansi", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/fansi/fansi.data');

      };
      Module['addRunDependency']('datafile_../../dist/fansi/fansi.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/fansi/NAMESPACE", "start": 0, "end": 1031}, {"filename": "/usr/lib/R/library/fansi/NEWS.md", "start": 1031, "end": 12376}, {"filename": "/usr/lib/R/library/fansi/DESCRIPTION", "start": 12376, "end": 13721}, {"filename": "/usr/lib/R/library/fansi/INDEX", "start": 13721, "end": 15283}, {"filename": "/usr/lib/R/library/fansi/html/00Index.html", "start": 15283, "end": 20476}, {"filename": "/usr/lib/R/library/fansi/html/R.css", "start": 20476, "end": 21811}, {"filename": "/usr/lib/R/library/fansi/R/fansi.rdb", "start": 21811, "end": 51220}, {"filename": "/usr/lib/R/library/fansi/R/fansi.rdx", "start": 51220, "end": 52498}, {"filename": "/usr/lib/R/library/fansi/R/fansi", "start": 52498, "end": 53556}, {"filename": "/usr/lib/R/library/fansi/doc/sgr-in-rmd.R", "start": 53556, "end": 55037}, {"filename": "/usr/lib/R/library/fansi/doc/index.html", "start": 55037, "end": 56509}, {"filename": "/usr/lib/R/library/fansi/doc/sgr-in-rmd.html", "start": 56509, "end": 73962}, {"filename": "/usr/lib/R/library/fansi/doc/sgr-in-rmd.Rmd", "start": 73962, "end": 78328}, {"filename": "/usr/lib/R/library/fansi/Meta/features.rds", "start": 78328, "end": 78460}, {"filename": "/usr/lib/R/library/fansi/Meta/package.rds", "start": 78460, "end": 79660}, {"filename": "/usr/lib/R/library/fansi/Meta/links.rds", "start": 79660, "end": 80235}, {"filename": "/usr/lib/R/library/fansi/Meta/nsInfo.rds", "start": 80235, "end": 80841}, {"filename": "/usr/lib/R/library/fansi/Meta/Rd.rds", "start": 80841, "end": 82117}, {"filename": "/usr/lib/R/library/fansi/Meta/hsearch.rds", "start": 82117, "end": 83324}, {"filename": "/usr/lib/R/library/fansi/Meta/vignette.rds", "start": 83324, "end": 83553}, {"filename": "/usr/lib/R/library/fansi/libs/fansi.so", "start": 83553, "end": 319540}, {"filename": "/usr/lib/R/library/fansi/help/fansi.rdb", "start": 319540, "end": 489415}, {"filename": "/usr/lib/R/library/fansi/help/fansi.rdx", "start": 489415, "end": 490281}, {"filename": "/usr/lib/R/library/fansi/help/AnIndex", "start": 490281, "end": 491284}, {"filename": "/usr/lib/R/library/fansi/help/aliases.rds", "start": 491284, "end": 491683}, {"filename": "/usr/lib/R/library/fansi/help/paths.rds", "start": 491683, "end": 492072}], "remote_package_size": 492072, "package_uuid": "376f1823-9223-4363-a361-5cb29f1191a9"});
  
  })();
  