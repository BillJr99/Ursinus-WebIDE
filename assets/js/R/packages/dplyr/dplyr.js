
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
      var PACKAGE_NAME = '../../dist/dplyr/dplyr.data';
      var REMOTE_PACKAGE_BASE = 'dplyr.data';
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
Module['FS_createPath']("/usr/lib/R/library", "dplyr", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/dplyr/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/dplyr/dplyr.data');

      };
      Module['addRunDependency']('datafile_../../dist/dplyr/dplyr.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/dplyr/NAMESPACE", "start": 0, "end": 12206}, {"filename": "/usr/lib/R/library/dplyr/NEWS.md", "start": 12206, "end": 119791}, {"filename": "/usr/lib/R/library/dplyr/LICENSE", "start": 119791, "end": 119833}, {"filename": "/usr/lib/R/library/dplyr/DESCRIPTION", "start": 119833, "end": 122011}, {"filename": "/usr/lib/R/library/dplyr/INDEX", "start": 122011, "end": 125142}, {"filename": "/usr/lib/R/library/dplyr/html/00Index.html", "start": 125142, "end": 141810}, {"filename": "/usr/lib/R/library/dplyr/html/R.css", "start": 141810, "end": 143145}, {"filename": "/usr/lib/R/library/dplyr/R/dplyr.rdx", "start": 143145, "end": 151710}, {"filename": "/usr/lib/R/library/dplyr/R/dplyr", "start": 151710, "end": 152768}, {"filename": "/usr/lib/R/library/dplyr/R/dplyr.rdb", "start": 152768, "end": 368024}, {"filename": "/usr/lib/R/library/dplyr/data/Rdata.rdx", "start": 368024, "end": 368249}, {"filename": "/usr/lib/R/library/dplyr/data/Rdata.rds", "start": 368249, "end": 368395}, {"filename": "/usr/lib/R/library/dplyr/data/Rdata.rdb", "start": 368395, "end": 453900}, {"filename": "/usr/lib/R/library/dplyr/doc/rowwise.R", "start": 453900, "end": 460423}, {"filename": "/usr/lib/R/library/dplyr/doc/grouping.html", "start": 460423, "end": 533818}, {"filename": "/usr/lib/R/library/dplyr/doc/dplyr.R", "start": 533818, "end": 539107}, {"filename": "/usr/lib/R/library/dplyr/doc/programming.html", "start": 539107, "end": 587149}, {"filename": "/usr/lib/R/library/dplyr/doc/window-functions.html", "start": 587149, "end": 626924}, {"filename": "/usr/lib/R/library/dplyr/doc/index.html", "start": 626924, "end": 632074}, {"filename": "/usr/lib/R/library/dplyr/doc/base.html", "start": 632074, "end": 731582}, {"filename": "/usr/lib/R/library/dplyr/doc/two-table.R", "start": 731582, "end": 734225}, {"filename": "/usr/lib/R/library/dplyr/doc/window-functions.Rmd", "start": 734225, "end": 743663}, {"filename": "/usr/lib/R/library/dplyr/doc/grouping.R", "start": 743663, "end": 748277}, {"filename": "/usr/lib/R/library/dplyr/doc/two-table.Rmd", "start": 748277, "end": 755569}, {"filename": "/usr/lib/R/library/dplyr/doc/colwise.R", "start": 755569, "end": 761195}, {"filename": "/usr/lib/R/library/dplyr/doc/dplyr.Rmd", "start": 761195, "end": 775032}, {"filename": "/usr/lib/R/library/dplyr/doc/base.Rmd", "start": 775032, "end": 787114}, {"filename": "/usr/lib/R/library/dplyr/doc/programming.Rmd", "start": 787114, "end": 801076}, {"filename": "/usr/lib/R/library/dplyr/doc/rowwise.Rmd", "start": 801076, "end": 814983}, {"filename": "/usr/lib/R/library/dplyr/doc/colwise.html", "start": 814983, "end": 881091}, {"filename": "/usr/lib/R/library/dplyr/doc/base.R", "start": 881091, "end": 887265}, {"filename": "/usr/lib/R/library/dplyr/doc/compatibility.html", "start": 887265, "end": 925359}, {"filename": "/usr/lib/R/library/dplyr/doc/programming.R", "start": 925359, "end": 930417}, {"filename": "/usr/lib/R/library/dplyr/doc/rowwise.html", "start": 930417, "end": 1016723}, {"filename": "/usr/lib/R/library/dplyr/doc/grouping.Rmd", "start": 1016723, "end": 1025185}, {"filename": "/usr/lib/R/library/dplyr/doc/colwise.Rmd", "start": 1025185, "end": 1037371}, {"filename": "/usr/lib/R/library/dplyr/doc/compatibility.R", "start": 1037371, "end": 1041039}, {"filename": "/usr/lib/R/library/dplyr/doc/window-functions.R", "start": 1041039, "end": 1044665}, {"filename": "/usr/lib/R/library/dplyr/doc/compatibility.Rmd", "start": 1044665, "end": 1054729}, {"filename": "/usr/lib/R/library/dplyr/doc/two-table.html", "start": 1054729, "end": 1102112}, {"filename": "/usr/lib/R/library/dplyr/doc/dplyr.html", "start": 1102112, "end": 1193947}, {"filename": "/usr/lib/R/library/dplyr/Meta/features.rds", "start": 1193947, "end": 1194079}, {"filename": "/usr/lib/R/library/dplyr/Meta/package.rds", "start": 1194079, "end": 1195875}, {"filename": "/usr/lib/R/library/dplyr/Meta/links.rds", "start": 1195875, "end": 1198564}, {"filename": "/usr/lib/R/library/dplyr/Meta/nsInfo.rds", "start": 1198564, "end": 1201472}, {"filename": "/usr/lib/R/library/dplyr/Meta/Rd.rds", "start": 1201472, "end": 1206268}, {"filename": "/usr/lib/R/library/dplyr/Meta/hsearch.rds", "start": 1206268, "end": 1210942}, {"filename": "/usr/lib/R/library/dplyr/Meta/data.rds", "start": 1210942, "end": 1211121}, {"filename": "/usr/lib/R/library/dplyr/Meta/vignette.rds", "start": 1211121, "end": 1211534}, {"filename": "/usr/lib/R/library/dplyr/libs/dplyr.so", "start": 1211534, "end": 1375192}, {"filename": "/usr/lib/R/library/dplyr/help/dplyr.rdx", "start": 1375192, "end": 1377491}, {"filename": "/usr/lib/R/library/dplyr/help/AnIndex", "start": 1377491, "end": 1384435}, {"filename": "/usr/lib/R/library/dplyr/help/aliases.rds", "start": 1384435, "end": 1386832}, {"filename": "/usr/lib/R/library/dplyr/help/dplyr.rdb", "start": 1386832, "end": 1712440}, {"filename": "/usr/lib/R/library/dplyr/help/paths.rds", "start": 1712440, "end": 1713314}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-deprecated.svg", "start": 1713314, "end": 1714284}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-retired.svg", "start": 1714284, "end": 1715249}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-questioning.svg", "start": 1715249, "end": 1716221}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-soft-deprecated.svg", "start": 1716221, "end": 1717203}, {"filename": "/usr/lib/R/library/dplyr/help/figures/logo.png", "start": 1717203, "end": 1762578}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-experimental.svg", "start": 1762578, "end": 1763552}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-stable.svg", "start": 1763552, "end": 1764508}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-maturing.svg", "start": 1764508, "end": 1765474}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-archived.svg", "start": 1765474, "end": 1766441}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-defunct.svg", "start": 1766441, "end": 1767405}, {"filename": "/usr/lib/R/library/dplyr/help/figures/lifecycle-superseded.svg", "start": 1767405, "end": 1768376}], "remote_package_size": 1768376, "package_uuid": "b74980a8-7231-48ca-84c1-e204d927a1b3"});
  
  })();
  