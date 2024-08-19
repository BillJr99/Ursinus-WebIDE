
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
      var PACKAGE_NAME = '../../dist/vctrs/vctrs.data';
      var REMOTE_PACKAGE_BASE = 'vctrs.data';
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
Module['FS_createPath']("/usr/lib/R/library", "vctrs", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/vctrs/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/vctrs/vctrs.data');

      };
      Module['addRunDependency']('datafile_../../dist/vctrs/vctrs.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/vctrs/NAMESPACE", "start": 0, "end": 18293}, {"filename": "/usr/lib/R/library/vctrs/WORDLIST", "start": 18293, "end": 18304}, {"filename": "/usr/lib/R/library/vctrs/NEWS.md", "start": 18304, "end": 53293}, {"filename": "/usr/lib/R/library/vctrs/LICENSE", "start": 53293, "end": 53336}, {"filename": "/usr/lib/R/library/vctrs/DESCRIPTION", "start": 53336, "end": 55202}, {"filename": "/usr/lib/R/library/vctrs/INDEX", "start": 55202, "end": 57948}, {"filename": "/usr/lib/R/library/vctrs/html/00Index.html", "start": 57948, "end": 70262}, {"filename": "/usr/lib/R/library/vctrs/html/R.css", "start": 70262, "end": 71597}, {"filename": "/usr/lib/R/library/vctrs/include/vctrs.h", "start": 71597, "end": 71861}, {"filename": "/usr/lib/R/library/vctrs/include/vctrs.c", "start": 71861, "end": 72286}, {"filename": "/usr/lib/R/library/vctrs/R/vctrs.rdx", "start": 72286, "end": 83558}, {"filename": "/usr/lib/R/library/vctrs/R/vctrs", "start": 83558, "end": 84616}, {"filename": "/usr/lib/R/library/vctrs/R/vctrs.rdb", "start": 84616, "end": 277010}, {"filename": "/usr/lib/R/library/vctrs/doc/type-size.R", "start": 277010, "end": 282485}, {"filename": "/usr/lib/R/library/vctrs/doc/type-size.html", "start": 282485, "end": 361163}, {"filename": "/usr/lib/R/library/vctrs/doc/stability.Rmd", "start": 361163, "end": 374176}, {"filename": "/usr/lib/R/library/vctrs/doc/pillar.html", "start": 374176, "end": 423730}, {"filename": "/usr/lib/R/library/vctrs/doc/pillar.R", "start": 423730, "end": 428034}, {"filename": "/usr/lib/R/library/vctrs/doc/index.html", "start": 428034, "end": 430882}, {"filename": "/usr/lib/R/library/vctrs/doc/s3-vector.html", "start": 430882, "end": 578944}, {"filename": "/usr/lib/R/library/vctrs/doc/stability.R", "start": 578944, "end": 583974}, {"filename": "/usr/lib/R/library/vctrs/doc/s3-vector.Rmd", "start": 583974, "end": 623734}, {"filename": "/usr/lib/R/library/vctrs/doc/s3-vector.R", "start": 623734, "end": 641321}, {"filename": "/usr/lib/R/library/vctrs/doc/type-size.Rmd", "start": 641321, "end": 654482}, {"filename": "/usr/lib/R/library/vctrs/doc/stability.html", "start": 654482, "end": 710680}, {"filename": "/usr/lib/R/library/vctrs/doc/pillar.Rmd", "start": 710680, "end": 719581}, {"filename": "/usr/lib/R/library/vctrs/Meta/features.rds", "start": 719581, "end": 719713}, {"filename": "/usr/lib/R/library/vctrs/Meta/package.rds", "start": 719713, "end": 721207}, {"filename": "/usr/lib/R/library/vctrs/Meta/links.rds", "start": 721207, "end": 723085}, {"filename": "/usr/lib/R/library/vctrs/Meta/nsInfo.rds", "start": 723085, "end": 725759}, {"filename": "/usr/lib/R/library/vctrs/Meta/Rd.rds", "start": 725759, "end": 729173}, {"filename": "/usr/lib/R/library/vctrs/Meta/hsearch.rds", "start": 729173, "end": 732455}, {"filename": "/usr/lib/R/library/vctrs/Meta/vignette.rds", "start": 732455, "end": 732757}, {"filename": "/usr/lib/R/library/vctrs/libs/vctrs.so", "start": 732757, "end": 1769045}, {"filename": "/usr/lib/R/library/vctrs/help/vctrs.rdx", "start": 1769045, "end": 1770977}, {"filename": "/usr/lib/R/library/vctrs/help/AnIndex", "start": 1770977, "end": 1776071}, {"filename": "/usr/lib/R/library/vctrs/help/aliases.rds", "start": 1776071, "end": 1777669}, {"filename": "/usr/lib/R/library/vctrs/help/paths.rds", "start": 1777669, "end": 1778463}, {"filename": "/usr/lib/R/library/vctrs/help/vctrs.rdb", "start": 1778463, "end": 2049734}, {"filename": "/usr/lib/R/library/vctrs/help/figures/coerce.png", "start": 2049734, "end": 2059128}, {"filename": "/usr/lib/R/library/vctrs/help/figures/cast.png", "start": 2059128, "end": 2074421}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-deprecated.svg", "start": 2074421, "end": 2075391}, {"filename": "/usr/lib/R/library/vctrs/help/figures/vec-count-deps.svg", "start": 2075391, "end": 2086016}, {"filename": "/usr/lib/R/library/vctrs/help/figures/combined.png", "start": 2086016, "end": 2132796}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-questioning.svg", "start": 2132796, "end": 2133768}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-soft-deprecated.svg", "start": 2133768, "end": 2134750}, {"filename": "/usr/lib/R/library/vctrs/help/figures/logo.png", "start": 2134750, "end": 2218394}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-experimental.svg", "start": 2218394, "end": 2219368}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-stable.svg", "start": 2219368, "end": 2220324}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-maturing.svg", "start": 2220324, "end": 2221290}, {"filename": "/usr/lib/R/library/vctrs/help/figures/vec-count-deps.png", "start": 2221290, "end": 2239416}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-archived.svg", "start": 2239416, "end": 2240383}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-defunct.svg", "start": 2240383, "end": 2241347}, {"filename": "/usr/lib/R/library/vctrs/help/figures/lifecycle-superseded.svg", "start": 2241347, "end": 2242318}, {"filename": "/usr/lib/R/library/vctrs/help/figures/sizes-recycling.png", "start": 2242318, "end": 2250593}], "remote_package_size": 2250593, "package_uuid": "c6be4968-9eac-40f4-840f-ddb0bb0692de"});
  
  })();
  