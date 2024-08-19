
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
      var PACKAGE_NAME = '../../dist/munsell/munsell.data';
      var REMOTE_PACKAGE_BASE = 'munsell.data';
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
Module['FS_createPath']("/usr/lib/R/library", "munsell", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell", "raw", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/munsell/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/munsell/munsell.data');

      };
      Module['addRunDependency']('datafile_../../dist/munsell/munsell.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/munsell/NAMESPACE", "start": 0, "end": 560}, {"filename": "/usr/lib/R/library/munsell/NEWS.md", "start": 560, "end": 2585}, {"filename": "/usr/lib/R/library/munsell/LICENSE", "start": 2585, "end": 2631}, {"filename": "/usr/lib/R/library/munsell/DESCRIPTION", "start": 2631, "end": 3563}, {"filename": "/usr/lib/R/library/munsell/INDEX", "start": 3563, "end": 4853}, {"filename": "/usr/lib/R/library/munsell/raw/real.dat", "start": 4853, "end": 97671}, {"filename": "/usr/lib/R/library/munsell/raw/greys.dat", "start": 97671, "end": 97863}, {"filename": "/usr/lib/R/library/munsell/raw/getmunsellmap.R", "start": 97863, "end": 100146}, {"filename": "/usr/lib/R/library/munsell/html/00Index.html", "start": 100146, "end": 104077}, {"filename": "/usr/lib/R/library/munsell/html/R.css", "start": 104077, "end": 105412}, {"filename": "/usr/lib/R/library/munsell/R/munsell.rdb", "start": 105412, "end": 119983}, {"filename": "/usr/lib/R/library/munsell/R/sysdata.rdx", "start": 119983, "end": 120145}, {"filename": "/usr/lib/R/library/munsell/R/munsell.rdx", "start": 120145, "end": 120791}, {"filename": "/usr/lib/R/library/munsell/R/munsell", "start": 120791, "end": 121849}, {"filename": "/usr/lib/R/library/munsell/R/sysdata.rdb", "start": 121849, "end": 174654}, {"filename": "/usr/lib/R/library/munsell/Meta/features.rds", "start": 174654, "end": 174786}, {"filename": "/usr/lib/R/library/munsell/Meta/package.rds", "start": 174786, "end": 175704}, {"filename": "/usr/lib/R/library/munsell/Meta/links.rds", "start": 175704, "end": 176162}, {"filename": "/usr/lib/R/library/munsell/Meta/nsInfo.rds", "start": 176162, "end": 176568}, {"filename": "/usr/lib/R/library/munsell/Meta/Rd.rds", "start": 176568, "end": 177559}, {"filename": "/usr/lib/R/library/munsell/Meta/hsearch.rds", "start": 177559, "end": 178453}, {"filename": "/usr/lib/R/library/munsell/help/munsell.rdb", "start": 178453, "end": 213474}, {"filename": "/usr/lib/R/library/munsell/help/munsell.rdx", "start": 213474, "end": 214174}, {"filename": "/usr/lib/R/library/munsell/help/AnIndex", "start": 214174, "end": 214748}, {"filename": "/usr/lib/R/library/munsell/help/aliases.rds", "start": 214748, "end": 215056}, {"filename": "/usr/lib/R/library/munsell/help/paths.rds", "start": 215056, "end": 215399}, {"filename": "/usr/lib/R/library/munsell/help/figures/README-complement-slice-1.png", "start": 215399, "end": 277824}, {"filename": "/usr/lib/R/library/munsell/help/figures/README-manipulate-blue-1.png", "start": 277824, "end": 294974}, {"filename": "/usr/lib/R/library/munsell/help/figures/README-palette-1.png", "start": 294974, "end": 308451}], "remote_package_size": 308451, "package_uuid": "96c91099-50db-42a3-b273-61eb101e09c0"});
  
  })();
  