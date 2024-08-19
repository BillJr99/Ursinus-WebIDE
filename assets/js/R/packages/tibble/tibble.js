
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
      var PACKAGE_NAME = '../../dist/tibble/tibble.data';
      var REMOTE_PACKAGE_BASE = 'tibble.data';
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
Module['FS_createPath']("/usr/lib/R/library", "tibble", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/tibble/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/tibble/tibble.data');

      };
      Module['addRunDependency']('datafile_../../dist/tibble/tibble.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/tibble/NAMESPACE", "start": 0, "end": 2681}, {"filename": "/usr/lib/R/library/tibble/NEWS.md", "start": 2681, "end": 42030}, {"filename": "/usr/lib/R/library/tibble/LICENSE", "start": 42030, "end": 42072}, {"filename": "/usr/lib/R/library/tibble/DESCRIPTION", "start": 42072, "end": 44092}, {"filename": "/usr/lib/R/library/tibble/INDEX", "start": 44092, "end": 45061}, {"filename": "/usr/lib/R/library/tibble/html/00Index.html", "start": 45061, "end": 51892}, {"filename": "/usr/lib/R/library/tibble/html/R.css", "start": 51892, "end": 53227}, {"filename": "/usr/lib/R/library/tibble/R/tibble.rdb", "start": 53227, "end": 145292}, {"filename": "/usr/lib/R/library/tibble/R/tibble.rdx", "start": 145292, "end": 149960}, {"filename": "/usr/lib/R/library/tibble/R/tibble", "start": 149960, "end": 151018}, {"filename": "/usr/lib/R/library/tibble/doc/extending.Rmd", "start": 151018, "end": 151320}, {"filename": "/usr/lib/R/library/tibble/doc/formats.html", "start": 151320, "end": 1357304}, {"filename": "/usr/lib/R/library/tibble/doc/digits.R", "start": 1357304, "end": 1359365}, {"filename": "/usr/lib/R/library/tibble/doc/numbers.Rmd", "start": 1359365, "end": 1363875}, {"filename": "/usr/lib/R/library/tibble/doc/numbers.html", "start": 1363875, "end": 1400170}, {"filename": "/usr/lib/R/library/tibble/doc/digits.html", "start": 1400170, "end": 1433800}, {"filename": "/usr/lib/R/library/tibble/doc/extending.html", "start": 1433800, "end": 1441035}, {"filename": "/usr/lib/R/library/tibble/doc/index.html", "start": 1441035, "end": 1445224}, {"filename": "/usr/lib/R/library/tibble/doc/types.R", "start": 1445224, "end": 1448263}, {"filename": "/usr/lib/R/library/tibble/doc/formats.Rmd", "start": 1448263, "end": 1452537}, {"filename": "/usr/lib/R/library/tibble/doc/tibble.R", "start": 1452537, "end": 1455062}, {"filename": "/usr/lib/R/library/tibble/doc/types.Rmd", "start": 1455062, "end": 1458427}, {"filename": "/usr/lib/R/library/tibble/doc/digits.Rmd", "start": 1458427, "end": 1462588}, {"filename": "/usr/lib/R/library/tibble/doc/numbers.R", "start": 1462588, "end": 1464903}, {"filename": "/usr/lib/R/library/tibble/doc/formats.R", "start": 1464903, "end": 1467424}, {"filename": "/usr/lib/R/library/tibble/doc/invariants.html", "start": 1467424, "end": 1676891}, {"filename": "/usr/lib/R/library/tibble/doc/tibble.html", "start": 1676891, "end": 1720409}, {"filename": "/usr/lib/R/library/tibble/doc/invariants.Rmd", "start": 1720409, "end": 1742776}, {"filename": "/usr/lib/R/library/tibble/doc/invariants.R", "start": 1742776, "end": 1760585}, {"filename": "/usr/lib/R/library/tibble/doc/tibble.Rmd", "start": 1760585, "end": 1766048}, {"filename": "/usr/lib/R/library/tibble/doc/types.html", "start": 1766048, "end": 1788643}, {"filename": "/usr/lib/R/library/tibble/Meta/features.rds", "start": 1788643, "end": 1788775}, {"filename": "/usr/lib/R/library/tibble/Meta/package.rds", "start": 1788775, "end": 1790556}, {"filename": "/usr/lib/R/library/tibble/Meta/links.rds", "start": 1790556, "end": 1791330}, {"filename": "/usr/lib/R/library/tibble/Meta/nsInfo.rds", "start": 1791330, "end": 1792385}, {"filename": "/usr/lib/R/library/tibble/Meta/Rd.rds", "start": 1792385, "end": 1793712}, {"filename": "/usr/lib/R/library/tibble/Meta/hsearch.rds", "start": 1793712, "end": 1795038}, {"filename": "/usr/lib/R/library/tibble/Meta/vignette.rds", "start": 1795038, "end": 1795419}, {"filename": "/usr/lib/R/library/tibble/libs/tibble.so", "start": 1795419, "end": 1806191}, {"filename": "/usr/lib/R/library/tibble/help/tibble.rdb", "start": 1806191, "end": 1887094}, {"filename": "/usr/lib/R/library/tibble/help/tibble.rdx", "start": 1887094, "end": 1887842}, {"filename": "/usr/lib/R/library/tibble/help/AnIndex", "start": 1887842, "end": 1889527}, {"filename": "/usr/lib/R/library/tibble/help/aliases.rds", "start": 1889527, "end": 1890202}, {"filename": "/usr/lib/R/library/tibble/help/paths.rds", "start": 1890202, "end": 1890559}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-deprecated.svg", "start": 1890559, "end": 1891529}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-questioning.svg", "start": 1891529, "end": 1892501}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-soft-deprecated.svg", "start": 1892501, "end": 1893483}, {"filename": "/usr/lib/R/library/tibble/help/figures/logo.png", "start": 1893483, "end": 1920619}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-experimental.svg", "start": 1920619, "end": 1921593}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-stable.svg", "start": 1921593, "end": 1922549}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-maturing.svg", "start": 1922549, "end": 1923515}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-archived.svg", "start": 1923515, "end": 1924482}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-defunct.svg", "start": 1924482, "end": 1925446}, {"filename": "/usr/lib/R/library/tibble/help/figures/lifecycle-superseded.svg", "start": 1925446, "end": 1926417}], "remote_package_size": 1926417, "package_uuid": "eac167f0-0c4b-4d77-8f70-9e6f5fc13ab0"});
  
  })();
  