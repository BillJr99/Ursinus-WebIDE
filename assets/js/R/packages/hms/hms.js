
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
      var PACKAGE_NAME = '../../dist/hms/hms.data';
      var REMOTE_PACKAGE_BASE = 'hms.data';
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
Module['FS_createPath']("/usr/lib/R/library", "hms", true, true);
Module['FS_createPath']("/usr/lib/R/library/hms", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/hms", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/hms", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/hms", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/hms/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/hms/hms.data');

      };
      Module['addRunDependency']('datafile_../../dist/hms/hms.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/hms/NAMESPACE", "start": 0, "end": 1423}, {"filename": "/usr/lib/R/library/hms/NEWS.md", "start": 1423, "end": 7347}, {"filename": "/usr/lib/R/library/hms/LICENSE", "start": 7347, "end": 7388}, {"filename": "/usr/lib/R/library/hms/DESCRIPTION", "start": 7388, "end": 8426}, {"filename": "/usr/lib/R/library/hms/INDEX", "start": 8426, "end": 8719}, {"filename": "/usr/lib/R/library/hms/html/00Index.html", "start": 8719, "end": 11671}, {"filename": "/usr/lib/R/library/hms/html/R.css", "start": 11671, "end": 13006}, {"filename": "/usr/lib/R/library/hms/R/hms.rdx", "start": 13006, "end": 14645}, {"filename": "/usr/lib/R/library/hms/R/hms", "start": 14645, "end": 15703}, {"filename": "/usr/lib/R/library/hms/R/hms.rdb", "start": 15703, "end": 42499}, {"filename": "/usr/lib/R/library/hms/Meta/features.rds", "start": 42499, "end": 42631}, {"filename": "/usr/lib/R/library/hms/Meta/package.rds", "start": 42631, "end": 43740}, {"filename": "/usr/lib/R/library/hms/Meta/links.rds", "start": 43740, "end": 44045}, {"filename": "/usr/lib/R/library/hms/Meta/nsInfo.rds", "start": 44045, "end": 44619}, {"filename": "/usr/lib/R/library/hms/Meta/Rd.rds", "start": 44619, "end": 45176}, {"filename": "/usr/lib/R/library/hms/Meta/hsearch.rds", "start": 45176, "end": 45752}, {"filename": "/usr/lib/R/library/hms/help/AnIndex", "start": 45752, "end": 46176}, {"filename": "/usr/lib/R/library/hms/help/hms.rdx", "start": 46176, "end": 46495}, {"filename": "/usr/lib/R/library/hms/help/aliases.rds", "start": 46495, "end": 46758}, {"filename": "/usr/lib/R/library/hms/help/paths.rds", "start": 46758, "end": 46954}, {"filename": "/usr/lib/R/library/hms/help/hms.rdb", "start": 46954, "end": 60723}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-deprecated.svg", "start": 60723, "end": 61693}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-questioning.svg", "start": 61693, "end": 62665}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-soft-deprecated.svg", "start": 62665, "end": 63647}, {"filename": "/usr/lib/R/library/hms/help/figures/logo.png", "start": 63647, "end": 85657}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-experimental.svg", "start": 85657, "end": 86631}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-stable.svg", "start": 86631, "end": 87587}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-maturing.svg", "start": 87587, "end": 88553}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-archived.svg", "start": 88553, "end": 89520}, {"filename": "/usr/lib/R/library/hms/help/figures/lifecycle-defunct.svg", "start": 89520, "end": 90484}], "remote_package_size": 90484, "package_uuid": "9be724c6-5e20-4474-8d61-aff9c5a09421"});
  
  })();
  