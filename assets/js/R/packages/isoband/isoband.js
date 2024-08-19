
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
      var PACKAGE_NAME = '../dist/isoband/isoband.data';
      var REMOTE_PACKAGE_BASE = 'isoband.data';
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
Module['FS_createPath']("/usr/lib/R/library", "isoband", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "extdata", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/isoband/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../dist/isoband/isoband.data');

      };
      Module['addRunDependency']('datafile_../dist/isoband/isoband.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/isoband/NAMESPACE", "start": 0, "end": 703}, {"filename": "/usr/lib/R/library/isoband/NEWS.md", "start": 703, "end": 1784}, {"filename": "/usr/lib/R/library/isoband/LICENSE", "start": 1784, "end": 1828}, {"filename": "/usr/lib/R/library/isoband/DESCRIPTION", "start": 1828, "end": 3459}, {"filename": "/usr/lib/R/library/isoband/INDEX", "start": 3459, "end": 4135}, {"filename": "/usr/lib/R/library/isoband/html/00Index.html", "start": 4135, "end": 7682}, {"filename": "/usr/lib/R/library/isoband/html/R.css", "start": 7682, "end": 9017}, {"filename": "/usr/lib/R/library/isoband/extdata/ocean-cat.jpg", "start": 9017, "end": 728890}, {"filename": "/usr/lib/R/library/isoband/R/isoband.rdb", "start": 728890, "end": 742749}, {"filename": "/usr/lib/R/library/isoband/R/isoband.rdx", "start": 742749, "end": 743490}, {"filename": "/usr/lib/R/library/isoband/R/isoband", "start": 743490, "end": 744548}, {"filename": "/usr/lib/R/library/isoband/doc/isoband3.R", "start": 744548, "end": 747258}, {"filename": "/usr/lib/R/library/isoband/doc/isoband1.R", "start": 747258, "end": 749220}, {"filename": "/usr/lib/R/library/isoband/doc/isoband1.Rmd", "start": 749220, "end": 753922}, {"filename": "/usr/lib/R/library/isoband/doc/isoband1.html", "start": 753922, "end": 842035}, {"filename": "/usr/lib/R/library/isoband/doc/index.html", "start": 842035, "end": 843975}, {"filename": "/usr/lib/R/library/isoband/doc/isoband3.html", "start": 843975, "end": 1442899}, {"filename": "/usr/lib/R/library/isoband/doc/isoband3.Rmd", "start": 1442899, "end": 1446786}, {"filename": "/usr/lib/R/library/isoband/Meta/features.rds", "start": 1446786, "end": 1446918}, {"filename": "/usr/lib/R/library/isoband/Meta/package.rds", "start": 1446918, "end": 1448166}, {"filename": "/usr/lib/R/library/isoband/Meta/links.rds", "start": 1448166, "end": 1448499}, {"filename": "/usr/lib/R/library/isoband/Meta/nsInfo.rds", "start": 1448499, "end": 1448999}, {"filename": "/usr/lib/R/library/isoband/Meta/Rd.rds", "start": 1448999, "end": 1449697}, {"filename": "/usr/lib/R/library/isoband/Meta/hsearch.rds", "start": 1449697, "end": 1450406}, {"filename": "/usr/lib/R/library/isoband/Meta/vignette.rds", "start": 1450406, "end": 1450634}, {"filename": "/usr/lib/R/library/isoband/libs/isoband.so", "start": 1450634, "end": 6466593}, {"filename": "/usr/lib/R/library/isoband/help/AnIndex", "start": 6466593, "end": 6467143}, {"filename": "/usr/lib/R/library/isoband/help/isoband.rdb", "start": 6467143, "end": 6490022}, {"filename": "/usr/lib/R/library/isoband/help/isoband.rdx", "start": 6490022, "end": 6490441}, {"filename": "/usr/lib/R/library/isoband/help/aliases.rds", "start": 6490441, "end": 6490715}, {"filename": "/usr/lib/R/library/isoband/help/paths.rds", "start": 6490715, "end": 6490950}, {"filename": "/usr/lib/R/library/isoband/help/figures/README-basic-example-plot-1.png", "start": 6490950, "end": 6533342}, {"filename": "/usr/lib/R/library/isoband/help/figures/README-volcano-1.png", "start": 6533342, "end": 6804291}, {"filename": "/usr/lib/R/library/isoband/help/figures/isoband-logo.png", "start": 6804291, "end": 6842551}], "remote_package_size": 6842551, "package_uuid": "c440acb0-f7ce-4c2e-938d-c21dd34226d7"});
  
  })();
  