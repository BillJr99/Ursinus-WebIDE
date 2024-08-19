
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
      var PACKAGE_NAME = '../../dist/stringr/stringr.data';
      var REMOTE_PACKAGE_BASE = 'stringr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "stringr", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "htmlwidgets", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr/htmlwidgets", "lib", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/stringr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/stringr/stringr.data');

      };
      Module['addRunDependency']('datafile_../../dist/stringr/stringr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/stringr/NAMESPACE", "start": 0, "end": 1009}, {"filename": "/usr/lib/R/library/stringr/NEWS.md", "start": 1009, "end": 10374}, {"filename": "/usr/lib/R/library/stringr/LICENSE", "start": 10374, "end": 28466}, {"filename": "/usr/lib/R/library/stringr/DESCRIPTION", "start": 28466, "end": 29782}, {"filename": "/usr/lib/R/library/stringr/INDEX", "start": 29782, "end": 31880}, {"filename": "/usr/lib/R/library/stringr/html/00Index.html", "start": 31880, "end": 39923}, {"filename": "/usr/lib/R/library/stringr/html/R.css", "start": 39923, "end": 41258}, {"filename": "/usr/lib/R/library/stringr/htmlwidgets/str_view.yaml", "start": 41258, "end": 41361}, {"filename": "/usr/lib/R/library/stringr/htmlwidgets/str_view.js", "start": 41361, "end": 41608}, {"filename": "/usr/lib/R/library/stringr/htmlwidgets/lib/str_view.css", "start": 41608, "end": 41792}, {"filename": "/usr/lib/R/library/stringr/R/stringr", "start": 41792, "end": 42850}, {"filename": "/usr/lib/R/library/stringr/R/stringr.rdb", "start": 42850, "end": 62344}, {"filename": "/usr/lib/R/library/stringr/R/stringr.rdx", "start": 62344, "end": 63426}, {"filename": "/usr/lib/R/library/stringr/data/Rdata.rdx", "start": 63426, "end": 63610}, {"filename": "/usr/lib/R/library/stringr/data/Rdata.rds", "start": 63610, "end": 63722}, {"filename": "/usr/lib/R/library/stringr/data/Rdata.rdb", "start": 63722, "end": 82056}, {"filename": "/usr/lib/R/library/stringr/doc/regular-expressions.R", "start": 82056, "end": 87106}, {"filename": "/usr/lib/R/library/stringr/doc/index.html", "start": 87106, "end": 89090}, {"filename": "/usr/lib/R/library/stringr/doc/stringr.html", "start": 89090, "end": 133121}, {"filename": "/usr/lib/R/library/stringr/doc/regular-expressions.Rmd", "start": 133121, "end": 147674}, {"filename": "/usr/lib/R/library/stringr/doc/stringr.R", "start": 147674, "end": 151830}, {"filename": "/usr/lib/R/library/stringr/doc/stringr.Rmd", "start": 151830, "end": 161363}, {"filename": "/usr/lib/R/library/stringr/doc/regular-expressions.html", "start": 161363, "end": 210286}, {"filename": "/usr/lib/R/library/stringr/Meta/features.rds", "start": 210286, "end": 210418}, {"filename": "/usr/lib/R/library/stringr/Meta/package.rds", "start": 210418, "end": 211659}, {"filename": "/usr/lib/R/library/stringr/Meta/links.rds", "start": 211659, "end": 212317}, {"filename": "/usr/lib/R/library/stringr/Meta/nsInfo.rds", "start": 212317, "end": 212827}, {"filename": "/usr/lib/R/library/stringr/Meta/Rd.rds", "start": 212827, "end": 214271}, {"filename": "/usr/lib/R/library/stringr/Meta/hsearch.rds", "start": 214271, "end": 215686}, {"filename": "/usr/lib/R/library/stringr/Meta/data.rds", "start": 215686, "end": 215857}, {"filename": "/usr/lib/R/library/stringr/Meta/vignette.rds", "start": 215857, "end": 216098}, {"filename": "/usr/lib/R/library/stringr/help/AnIndex", "start": 216098, "end": 217264}, {"filename": "/usr/lib/R/library/stringr/help/stringr.rdb", "start": 217264, "end": 288190}, {"filename": "/usr/lib/R/library/stringr/help/aliases.rds", "start": 288190, "end": 288698}, {"filename": "/usr/lib/R/library/stringr/help/paths.rds", "start": 288698, "end": 289046}, {"filename": "/usr/lib/R/library/stringr/help/stringr.rdx", "start": 289046, "end": 289873}, {"filename": "/usr/lib/R/library/stringr/help/figures/logo.png", "start": 289873, "end": 314753}], "remote_package_size": 314753, "package_uuid": "49e46ff6-a0a1-4422-b3c3-954a0f40d158"});
  
  })();
  