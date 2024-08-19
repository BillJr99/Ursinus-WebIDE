
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
      var PACKAGE_NAME = '../../dist/bit64/bit64.data';
      var REMOTE_PACKAGE_BASE = 'bit64.data';
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
Module['FS_createPath']("/usr/lib/R/library", "bit64", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "exec", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/bit64", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/bit64/bit64.data');

      };
      Module['addRunDependency']('datafile_../../dist/bit64/bit64.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/bit64/NAMESPACE", "start": 0, "end": 11785}, {"filename": "/usr/lib/R/library/bit64/NEWS", "start": 11785, "end": 19108}, {"filename": "/usr/lib/R/library/bit64/DESCRIPTION", "start": 19108, "end": 20591}, {"filename": "/usr/lib/R/library/bit64/INDEX", "start": 20591, "end": 23281}, {"filename": "/usr/lib/R/library/bit64/html/00Index.html", "start": 23281, "end": 58473}, {"filename": "/usr/lib/R/library/bit64/html/R.css", "start": 58473, "end": 59808}, {"filename": "/usr/lib/R/library/bit64/R/bit64.rdx", "start": 59808, "end": 62640}, {"filename": "/usr/lib/R/library/bit64/R/bit64.rdb", "start": 62640, "end": 147037}, {"filename": "/usr/lib/R/library/bit64/R/bit64", "start": 147037, "end": 148095}, {"filename": "/usr/lib/R/library/bit64/data/optimizer64.data.rda", "start": 148095, "end": 150256}, {"filename": "/usr/lib/R/library/bit64/data/benchmark64.data.rda", "start": 150256, "end": 151045}, {"filename": "/usr/lib/R/library/bit64/doc/ANNOUNCEMENT-0.9-Details.txt", "start": 151045, "end": 160768}, {"filename": "/usr/lib/R/library/bit64/doc/README_devel.txt", "start": 160768, "end": 161200}, {"filename": "/usr/lib/R/library/bit64/doc/ANNOUNCEMENT-0.8.txt", "start": 161200, "end": 164422}, {"filename": "/usr/lib/R/library/bit64/doc/ANNOUNCEMENT-0.9.txt", "start": 164422, "end": 166323}, {"filename": "/usr/lib/R/library/bit64/exec/make_rd.pl", "start": 166323, "end": 167234}, {"filename": "/usr/lib/R/library/bit64/exec/prebuild.sh", "start": 167234, "end": 167586}, {"filename": "/usr/lib/R/library/bit64/Meta/features.rds", "start": 167586, "end": 167718}, {"filename": "/usr/lib/R/library/bit64/Meta/package.rds", "start": 167718, "end": 169048}, {"filename": "/usr/lib/R/library/bit64/Meta/links.rds", "start": 169048, "end": 170651}, {"filename": "/usr/lib/R/library/bit64/Meta/nsInfo.rds", "start": 170651, "end": 172915}, {"filename": "/usr/lib/R/library/bit64/Meta/Rd.rds", "start": 172915, "end": 175578}, {"filename": "/usr/lib/R/library/bit64/Meta/hsearch.rds", "start": 175578, "end": 178292}, {"filename": "/usr/lib/R/library/bit64/Meta/data.rds", "start": 178292, "end": 178490}, {"filename": "/usr/lib/R/library/bit64/libs/bit64.so", "start": 178490, "end": 456159}, {"filename": "/usr/lib/R/library/bit64/help/bit64.rdx", "start": 456159, "end": 457160}, {"filename": "/usr/lib/R/library/bit64/help/AnIndex", "start": 457160, "end": 463776}, {"filename": "/usr/lib/R/library/bit64/help/bit64.rdb", "start": 463776, "end": 649464}, {"filename": "/usr/lib/R/library/bit64/help/aliases.rds", "start": 649464, "end": 650968}, {"filename": "/usr/lib/R/library/bit64/help/paths.rds", "start": 650968, "end": 651421}], "remote_package_size": 651421, "package_uuid": "4acdc771-5a5a-45ac-9abb-9473dbdd0c60"});
  
  })();
  