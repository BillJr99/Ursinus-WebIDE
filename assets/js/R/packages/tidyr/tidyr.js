
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
      var PACKAGE_NAME = '../../dist/tidyr/tidyr.data';
      var REMOTE_PACKAGE_BASE = 'tidyr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "tidyr", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/tidyr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/tidyr/tidyr.data');

      };
      Module['addRunDependency']('datafile_../../dist/tidyr/tidyr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/tidyr/NAMESPACE", "start": 0, "end": 3611}, {"filename": "/usr/lib/R/library/tidyr/NEWS.md", "start": 3611, "end": 47072}, {"filename": "/usr/lib/R/library/tidyr/LICENSE", "start": 47072, "end": 47128}, {"filename": "/usr/lib/R/library/tidyr/DESCRIPTION", "start": 47128, "end": 48827}, {"filename": "/usr/lib/R/library/tidyr/INDEX", "start": 48827, "end": 50960}, {"filename": "/usr/lib/R/library/tidyr/html/00Index.html", "start": 50960, "end": 57609}, {"filename": "/usr/lib/R/library/tidyr/html/R.css", "start": 57609, "end": 58944}, {"filename": "/usr/lib/R/library/tidyr/R/tidyr.rdb", "start": 58944, "end": 124218}, {"filename": "/usr/lib/R/library/tidyr/R/tidyr.rdx", "start": 124218, "end": 126627}, {"filename": "/usr/lib/R/library/tidyr/R/tidyr", "start": 126627, "end": 127685}, {"filename": "/usr/lib/R/library/tidyr/data/Rdata.rdx", "start": 127685, "end": 128055}, {"filename": "/usr/lib/R/library/tidyr/data/Rdata.rds", "start": 128055, "end": 128300}, {"filename": "/usr/lib/R/library/tidyr/data/Rdata.rdb", "start": 128300, "end": 450992}, {"filename": "/usr/lib/R/library/tidyr/doc/in-packages.R", "start": 450992, "end": 455021}, {"filename": "/usr/lib/R/library/tidyr/doc/rectangle.html", "start": 455021, "end": 539821}, {"filename": "/usr/lib/R/library/tidyr/doc/tidy-data.html", "start": 539821, "end": 619952}, {"filename": "/usr/lib/R/library/tidyr/doc/rectangle.R", "start": 619952, "end": 626309}, {"filename": "/usr/lib/R/library/tidyr/doc/pivot.R", "start": 626309, "end": 638988}, {"filename": "/usr/lib/R/library/tidyr/doc/programming.html", "start": 638988, "end": 663255}, {"filename": "/usr/lib/R/library/tidyr/doc/rectangle.Rmd", "start": 663255, "end": 674600}, {"filename": "/usr/lib/R/library/tidyr/doc/index.html", "start": 674600, "end": 678319}, {"filename": "/usr/lib/R/library/tidyr/doc/pivot.html", "start": 678319, "end": 865867}, {"filename": "/usr/lib/R/library/tidyr/doc/programming.Rmd", "start": 865867, "end": 870952}, {"filename": "/usr/lib/R/library/tidyr/doc/nest.Rmd", "start": 870952, "end": 873834}, {"filename": "/usr/lib/R/library/tidyr/doc/pivot.Rmd", "start": 873834, "end": 901361}, {"filename": "/usr/lib/R/library/tidyr/doc/programming.R", "start": 901361, "end": 902658}, {"filename": "/usr/lib/R/library/tidyr/doc/in-packages.html", "start": 902658, "end": 955647}, {"filename": "/usr/lib/R/library/tidyr/doc/tidy-data.Rmd", "start": 955647, "end": 977647}, {"filename": "/usr/lib/R/library/tidyr/doc/tidy-data.R", "start": 977647, "end": 981671}, {"filename": "/usr/lib/R/library/tidyr/doc/nest.R", "start": 981671, "end": 983098}, {"filename": "/usr/lib/R/library/tidyr/doc/in-packages.Rmd", "start": 983098, "end": 996822}, {"filename": "/usr/lib/R/library/tidyr/doc/nest.html", "start": 996822, "end": 1022304}, {"filename": "/usr/lib/R/library/tidyr/Meta/features.rds", "start": 1022304, "end": 1022436}, {"filename": "/usr/lib/R/library/tidyr/Meta/package.rds", "start": 1022436, "end": 1024038}, {"filename": "/usr/lib/R/library/tidyr/Meta/links.rds", "start": 1024038, "end": 1024952}, {"filename": "/usr/lib/R/library/tidyr/Meta/nsInfo.rds", "start": 1024952, "end": 1026082}, {"filename": "/usr/lib/R/library/tidyr/Meta/Rd.rds", "start": 1026082, "end": 1028063}, {"filename": "/usr/lib/R/library/tidyr/Meta/hsearch.rds", "start": 1028063, "end": 1029911}, {"filename": "/usr/lib/R/library/tidyr/Meta/data.rds", "start": 1029911, "end": 1030311}, {"filename": "/usr/lib/R/library/tidyr/Meta/vignette.rds", "start": 1030311, "end": 1030633}, {"filename": "/usr/lib/R/library/tidyr/libs/tidyr.so", "start": 1030633, "end": 1592003}, {"filename": "/usr/lib/R/library/tidyr/help/tidyr.rdb", "start": 1592003, "end": 1734106}, {"filename": "/usr/lib/R/library/tidyr/help/tidyr.rdx", "start": 1734106, "end": 1735168}, {"filename": "/usr/lib/R/library/tidyr/help/AnIndex", "start": 1735168, "end": 1736923}, {"filename": "/usr/lib/R/library/tidyr/help/aliases.rds", "start": 1736923, "end": 1737654}, {"filename": "/usr/lib/R/library/tidyr/help/paths.rds", "start": 1737654, "end": 1738128}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-deprecated.svg", "start": 1738128, "end": 1739098}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-questioning.svg", "start": 1739098, "end": 1740070}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-soft-deprecated.svg", "start": 1740070, "end": 1741052}, {"filename": "/usr/lib/R/library/tidyr/help/figures/logo.png", "start": 1741052, "end": 1799931}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-experimental.svg", "start": 1799931, "end": 1800905}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-stable.svg", "start": 1800905, "end": 1801861}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-maturing.svg", "start": 1801861, "end": 1802827}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-archived.svg", "start": 1802827, "end": 1803794}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-defunct.svg", "start": 1803794, "end": 1804758}, {"filename": "/usr/lib/R/library/tidyr/help/figures/lifecycle-superseded.svg", "start": 1804758, "end": 1805729}], "remote_package_size": 1805729, "package_uuid": "2d1214d9-e1b8-41a9-b4e4-ed9c21ab330e"});
  
  })();
  