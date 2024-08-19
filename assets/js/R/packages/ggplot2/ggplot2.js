
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
      var PACKAGE_NAME = '../../dist/ggplot2/ggplot2.data';
      var REMOTE_PACKAGE_BASE = 'ggplot2.data';
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
Module['FS_createPath']("/usr/lib/R/library", "ggplot2", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/ggplot2/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/ggplot2/ggplot2.data');

      };
      Module['addRunDependency']('datafile_../../dist/ggplot2/ggplot2.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/ggplot2/NAMESPACE", "start": 0, "end": 15711}, {"filename": "/usr/lib/R/library/ggplot2/NEWS.md", "start": 15711, "end": 109314}, {"filename": "/usr/lib/R/library/ggplot2/CITATION", "start": 109314, "end": 109723}, {"filename": "/usr/lib/R/library/ggplot2/LICENSE", "start": 109723, "end": 109768}, {"filename": "/usr/lib/R/library/ggplot2/DESCRIPTION", "start": 109768, "end": 116250}, {"filename": "/usr/lib/R/library/ggplot2/INDEX", "start": 116250, "end": 123798}, {"filename": "/usr/lib/R/library/ggplot2/html/00Index.html", "start": 123798, "end": 173292}, {"filename": "/usr/lib/R/library/ggplot2/html/R.css", "start": 173292, "end": 174627}, {"filename": "/usr/lib/R/library/ggplot2/R/ggplot2.rdb", "start": 174627, "end": 774590}, {"filename": "/usr/lib/R/library/ggplot2/R/ggplot2.rdx", "start": 774590, "end": 788779}, {"filename": "/usr/lib/R/library/ggplot2/R/ggplot2", "start": 788779, "end": 789837}, {"filename": "/usr/lib/R/library/ggplot2/data/Rdata.rdx", "start": 789837, "end": 790170}, {"filename": "/usr/lib/R/library/ggplot2/data/Rdata.rds", "start": 790170, "end": 790383}, {"filename": "/usr/lib/R/library/ggplot2/data/Rdata.rdb", "start": 790383, "end": 1583583}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-specs.Rmd", "start": 1583583, "end": 1592869}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-in-packages.html", "start": 1592869, "end": 1631108}, {"filename": "/usr/lib/R/library/ggplot2/doc/extending-ggplot2.R", "start": 1631108, "end": 1655766}, {"filename": "/usr/lib/R/library/ggplot2/doc/index.html", "start": 1655766, "end": 1658302}, {"filename": "/usr/lib/R/library/ggplot2/doc/extending-ggplot2.Rmd", "start": 1658302, "end": 1703391}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-in-packages.R", "start": 1703391, "end": 1707324}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-specs.R", "start": 1707324, "end": 1711782}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-specs.html", "start": 1711782, "end": 2081919}, {"filename": "/usr/lib/R/library/ggplot2/doc/ggplot2-in-packages.Rmd", "start": 2081919, "end": 2093787}, {"filename": "/usr/lib/R/library/ggplot2/doc/extending-ggplot2.html", "start": 2093787, "end": 3561891}, {"filename": "/usr/lib/R/library/ggplot2/Meta/features.rds", "start": 3561891, "end": 3562023}, {"filename": "/usr/lib/R/library/ggplot2/Meta/package.rds", "start": 3562023, "end": 3565209}, {"filename": "/usr/lib/R/library/ggplot2/Meta/links.rds", "start": 3565209, "end": 3570134}, {"filename": "/usr/lib/R/library/ggplot2/Meta/nsInfo.rds", "start": 3570134, "end": 3573948}, {"filename": "/usr/lib/R/library/ggplot2/Meta/Rd.rds", "start": 3573948, "end": 3582763}, {"filename": "/usr/lib/R/library/ggplot2/Meta/hsearch.rds", "start": 3582763, "end": 3591399}, {"filename": "/usr/lib/R/library/ggplot2/Meta/data.rds", "start": 3591399, "end": 3591841}, {"filename": "/usr/lib/R/library/ggplot2/Meta/vignette.rds", "start": 3591841, "end": 3592127}, {"filename": "/usr/lib/R/library/ggplot2/help/ggplot2.rdb", "start": 3592127, "end": 4396206}, {"filename": "/usr/lib/R/library/ggplot2/help/AnIndex", "start": 4396206, "end": 4411997}, {"filename": "/usr/lib/R/library/ggplot2/help/aliases.rds", "start": 4411997, "end": 4416166}, {"filename": "/usr/lib/R/library/ggplot2/help/paths.rds", "start": 4416166, "end": 4417772}, {"filename": "/usr/lib/R/library/ggplot2/help/ggplot2.rdx", "start": 4417772, "end": 4422016}, {"filename": "/usr/lib/R/library/ggplot2/help/figures/README-example-1.png", "start": 4422016, "end": 4465967}, {"filename": "/usr/lib/R/library/ggplot2/help/figures/logo.png", "start": 4465967, "end": 4504483}], "remote_package_size": 4504483, "package_uuid": "91913cf0-8ee8-4b66-be59-263ae7ffdaf9"});
  
  })();
  