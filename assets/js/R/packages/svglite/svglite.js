
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
      var PACKAGE_NAME = '../../dist/svglite/svglite.data';
      var REMOTE_PACKAGE_BASE = 'svglite.data';
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
Module['FS_createPath']("/usr/lib/R/library", "svglite", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/svglite/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/svglite/svglite.data');

      };
      Module['addRunDependency']('datafile_../../dist/svglite/svglite.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/svglite/NAMESPACE", "start": 0, "end": 270}, {"filename": "/usr/lib/R/library/svglite/NEWS.md", "start": 270, "end": 5923}, {"filename": "/usr/lib/R/library/svglite/DESCRIPTION", "start": 5923, "end": 8003}, {"filename": "/usr/lib/R/library/svglite/INDEX", "start": 8003, "end": 8163}, {"filename": "/usr/lib/R/library/svglite/html/00Index.html", "start": 8163, "end": 9646}, {"filename": "/usr/lib/R/library/svglite/html/R.css", "start": 9646, "end": 10981}, {"filename": "/usr/lib/R/library/svglite/R/svglite.rdb", "start": 10981, "end": 22208}, {"filename": "/usr/lib/R/library/svglite/R/svglite.rdx", "start": 22208, "end": 23059}, {"filename": "/usr/lib/R/library/svglite/R/svglite", "start": 23059, "end": 24117}, {"filename": "/usr/lib/R/library/svglite/doc/fonts.html", "start": 24117, "end": 52804}, {"filename": "/usr/lib/R/library/svglite/doc/scaling.Rmd", "start": 52804, "end": 59914}, {"filename": "/usr/lib/R/library/svglite/doc/index.html", "start": 59914, "end": 61757}, {"filename": "/usr/lib/R/library/svglite/doc/scaling.html", "start": 61757, "end": 82528}, {"filename": "/usr/lib/R/library/svglite/doc/fonts.Rmd", "start": 82528, "end": 88600}, {"filename": "/usr/lib/R/library/svglite/doc/fonts.R", "start": 88600, "end": 90939}, {"filename": "/usr/lib/R/library/svglite/Meta/features.rds", "start": 90939, "end": 91071}, {"filename": "/usr/lib/R/library/svglite/Meta/package.rds", "start": 91071, "end": 92530}, {"filename": "/usr/lib/R/library/svglite/Meta/links.rds", "start": 92530, "end": 92794}, {"filename": "/usr/lib/R/library/svglite/Meta/nsInfo.rds", "start": 92794, "end": 93162}, {"filename": "/usr/lib/R/library/svglite/Meta/Rd.rds", "start": 93162, "end": 93793}, {"filename": "/usr/lib/R/library/svglite/Meta/hsearch.rds", "start": 93793, "end": 94429}, {"filename": "/usr/lib/R/library/svglite/Meta/vignette.rds", "start": 94429, "end": 94653}, {"filename": "/usr/lib/R/library/svglite/libs/svglite.so", "start": 94653, "end": 1535642}, {"filename": "/usr/lib/R/library/svglite/help/AnIndex", "start": 1535642, "end": 1535882}, {"filename": "/usr/lib/R/library/svglite/help/svglite.rdb", "start": 1535882, "end": 1557897}, {"filename": "/usr/lib/R/library/svglite/help/aliases.rds", "start": 1557897, "end": 1558098}, {"filename": "/usr/lib/R/library/svglite/help/svglite.rdx", "start": 1558098, "end": 1558468}, {"filename": "/usr/lib/R/library/svglite/help/paths.rds", "start": 1558468, "end": 1558672}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-deprecated.svg", "start": 1558672, "end": 1559642}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-questioning.svg", "start": 1559642, "end": 1560614}, {"filename": "/usr/lib/R/library/svglite/help/figures/logo.png", "start": 1560614, "end": 1584019}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-experimental.svg", "start": 1584019, "end": 1584993}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-stable.svg", "start": 1584993, "end": 1585949}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-maturing.svg", "start": 1585949, "end": 1586915}, {"filename": "/usr/lib/R/library/svglite/help/figures/README-unnamed-chunk-3-1.png", "start": 1586915, "end": 1615202}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-archived.svg", "start": 1615202, "end": 1616169}, {"filename": "/usr/lib/R/library/svglite/help/figures/logo.svg", "start": 1616169, "end": 1626075}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-defunct.svg", "start": 1626075, "end": 1627039}, {"filename": "/usr/lib/R/library/svglite/help/figures/lifecycle-superseded.svg", "start": 1627039, "end": 1628010}], "remote_package_size": 1628010, "package_uuid": "9690a05a-140f-4289-bc6e-6b9dd231a906"});
  
  })();
  