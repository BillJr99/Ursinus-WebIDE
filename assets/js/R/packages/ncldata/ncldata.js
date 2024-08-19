
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
      var PACKAGE_NAME = '../../dist/ncldata/ncldata.data';
      var REMOTE_PACKAGE_BASE = 'ncldata.data';
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
Module['FS_createPath']("/usr/lib/R/library", "ncldata", true, true);
Module['FS_createPath']("/usr/lib/R/library/ncldata", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/ncldata", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/ncldata", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/ncldata", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/ncldata", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/ncldata/ncldata.data');

      };
      Module['addRunDependency']('datafile_../../dist/ncldata/ncldata.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/ncldata/NAMESPACE", "start": 0, "end": 123}, {"filename": "/usr/lib/R/library/ncldata/DESCRIPTION", "start": 123, "end": 1037}, {"filename": "/usr/lib/R/library/ncldata/INDEX", "start": 1037, "end": 1615}, {"filename": "/usr/lib/R/library/ncldata/html/00Index.html", "start": 1615, "end": 3499}, {"filename": "/usr/lib/R/library/ncldata/html/R.css", "start": 3499, "end": 4834}, {"filename": "/usr/lib/R/library/ncldata/R/ncldata.rdx", "start": 4834, "end": 5170}, {"filename": "/usr/lib/R/library/ncldata/R/ncldata", "start": 5170, "end": 6228}, {"filename": "/usr/lib/R/library/ncldata/R/ncldata.rdb", "start": 6228, "end": 7997}, {"filename": "/usr/lib/R/library/ncldata/data/Rdata.rdx", "start": 7997, "end": 8222}, {"filename": "/usr/lib/R/library/ncldata/data/Rdata.rds", "start": 8222, "end": 8357}, {"filename": "/usr/lib/R/library/ncldata/data/Rdata.rdb", "start": 8357, "end": 247902}, {"filename": "/usr/lib/R/library/ncldata/Meta/features.rds", "start": 247902, "end": 248034}, {"filename": "/usr/lib/R/library/ncldata/Meta/package.rds", "start": 248034, "end": 248940}, {"filename": "/usr/lib/R/library/ncldata/Meta/links.rds", "start": 248940, "end": 249142}, {"filename": "/usr/lib/R/library/ncldata/Meta/nsInfo.rds", "start": 249142, "end": 249390}, {"filename": "/usr/lib/R/library/ncldata/Meta/Rd.rds", "start": 249390, "end": 249922}, {"filename": "/usr/lib/R/library/ncldata/Meta/hsearch.rds", "start": 249922, "end": 250462}, {"filename": "/usr/lib/R/library/ncldata/Meta/data.rds", "start": 250462, "end": 250749}, {"filename": "/usr/lib/R/library/ncldata/help/ncldata.rdx", "start": 250749, "end": 251049}, {"filename": "/usr/lib/R/library/ncldata/help/AnIndex", "start": 251049, "end": 251147}, {"filename": "/usr/lib/R/library/ncldata/help/aliases.rds", "start": 251147, "end": 251288}, {"filename": "/usr/lib/R/library/ncldata/help/paths.rds", "start": 251288, "end": 251493}, {"filename": "/usr/lib/R/library/ncldata/help/ncldata.rdb", "start": 251493, "end": 265807}], "remote_package_size": 265807, "package_uuid": "488521f6-40fe-494b-adfc-d3aa5b66866d"});
  
  })();
  