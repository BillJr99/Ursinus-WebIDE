
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
      var PACKAGE_NAME = '../../dist/utf8/utf8.data';
      var REMOTE_PACKAGE_BASE = 'utf8.data';
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
Module['FS_createPath']("/usr/lib/R/library", "utf8", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/utf8", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/utf8/utf8.data');

      };
      Module['addRunDependency']('datafile_../../dist/utf8/utf8.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/utf8/NAMESPACE", "start": 0, "end": 238}, {"filename": "/usr/lib/R/library/utf8/LICENSE", "start": 238, "end": 11596}, {"filename": "/usr/lib/R/library/utf8/DESCRIPTION", "start": 11596, "end": 12899}, {"filename": "/usr/lib/R/library/utf8/INDEX", "start": 12899, "end": 13292}, {"filename": "/usr/lib/R/library/utf8/html/00Index.html", "start": 13292, "end": 15656}, {"filename": "/usr/lib/R/library/utf8/html/R.css", "start": 15656, "end": 16991}, {"filename": "/usr/lib/R/library/utf8/R/utf8", "start": 16991, "end": 18049}, {"filename": "/usr/lib/R/library/utf8/R/utf8.rdx", "start": 18049, "end": 18741}, {"filename": "/usr/lib/R/library/utf8/R/utf8.rdb", "start": 18741, "end": 31470}, {"filename": "/usr/lib/R/library/utf8/doc/utf8.html", "start": 31470, "end": 70497}, {"filename": "/usr/lib/R/library/utf8/doc/index.html", "start": 70497, "end": 71892}, {"filename": "/usr/lib/R/library/utf8/doc/utf8.Rmd", "start": 71892, "end": 88180}, {"filename": "/usr/lib/R/library/utf8/Meta/features.rds", "start": 88180, "end": 88312}, {"filename": "/usr/lib/R/library/utf8/Meta/package.rds", "start": 88312, "end": 89483}, {"filename": "/usr/lib/R/library/utf8/Meta/links.rds", "start": 89483, "end": 89724}, {"filename": "/usr/lib/R/library/utf8/Meta/nsInfo.rds", "start": 89724, "end": 90081}, {"filename": "/usr/lib/R/library/utf8/Meta/Rd.rds", "start": 90081, "end": 90566}, {"filename": "/usr/lib/R/library/utf8/Meta/hsearch.rds", "start": 90566, "end": 91059}, {"filename": "/usr/lib/R/library/utf8/Meta/vignette.rds", "start": 91059, "end": 91284}, {"filename": "/usr/lib/R/library/utf8/libs/utf8.so", "start": 91284, "end": 458146}, {"filename": "/usr/lib/R/library/utf8/help/AnIndex", "start": 458146, "end": 458385}, {"filename": "/usr/lib/R/library/utf8/help/aliases.rds", "start": 458385, "end": 458576}, {"filename": "/usr/lib/R/library/utf8/help/paths.rds", "start": 458576, "end": 458778}, {"filename": "/usr/lib/R/library/utf8/help/utf8.rdx", "start": 458778, "end": 459126}, {"filename": "/usr/lib/R/library/utf8/help/utf8.rdb", "start": 459126, "end": 484666}], "remote_package_size": 484666, "package_uuid": "5b004f98-6c74-4f3b-8cf6-a1d7aeac9feb"});
  
  })();
  