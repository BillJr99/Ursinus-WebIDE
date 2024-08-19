
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
      var PACKAGE_NAME = '../../dist/pillar/pillar.data';
      var REMOTE_PACKAGE_BASE = 'pillar.data';
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
Module['FS_createPath']("/usr/lib/R/library", "pillar", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/pillar/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/pillar/pillar.data');

      };
      Module['addRunDependency']('datafile_../../dist/pillar/pillar.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/pillar/NAMESPACE", "start": 0, "end": 5783}, {"filename": "/usr/lib/R/library/pillar/WORDLIST", "start": 5783, "end": 6174}, {"filename": "/usr/lib/R/library/pillar/NEWS.md", "start": 6174, "end": 24311}, {"filename": "/usr/lib/R/library/pillar/LICENSE", "start": 24311, "end": 24355}, {"filename": "/usr/lib/R/library/pillar/DESCRIPTION", "start": 24355, "end": 26138}, {"filename": "/usr/lib/R/library/pillar/INDEX", "start": 26138, "end": 27384}, {"filename": "/usr/lib/R/library/pillar/html/00Index.html", "start": 27384, "end": 34102}, {"filename": "/usr/lib/R/library/pillar/html/R.css", "start": 34102, "end": 35437}, {"filename": "/usr/lib/R/library/pillar/R/pillar", "start": 35437, "end": 36495}, {"filename": "/usr/lib/R/library/pillar/R/pillar.rdx", "start": 36495, "end": 42058}, {"filename": "/usr/lib/R/library/pillar/R/pillar.rdb", "start": 42058, "end": 157382}, {"filename": "/usr/lib/R/library/pillar/doc/printing.Rmd", "start": 157382, "end": 165829}, {"filename": "/usr/lib/R/library/pillar/doc/extending.Rmd", "start": 165829, "end": 172843}, {"filename": "/usr/lib/R/library/pillar/doc/printing.html", "start": 172843, "end": 1236096}, {"filename": "/usr/lib/R/library/pillar/doc/numbers.Rmd", "start": 1236096, "end": 1239441}, {"filename": "/usr/lib/R/library/pillar/doc/numbers.html", "start": 1239441, "end": 1246541}, {"filename": "/usr/lib/R/library/pillar/doc/digits.html", "start": 1246541, "end": 1253629}, {"filename": "/usr/lib/R/library/pillar/doc/extending.html", "start": 1253629, "end": 1300133}, {"filename": "/usr/lib/R/library/pillar/doc/index.html", "start": 1300133, "end": 1303440}, {"filename": "/usr/lib/R/library/pillar/doc/extending.R", "start": 1303440, "end": 1307711}, {"filename": "/usr/lib/R/library/pillar/doc/debugme.R", "start": 1307711, "end": 1308274}, {"filename": "/usr/lib/R/library/pillar/doc/debugme.Rmd", "start": 1308274, "end": 1309393}, {"filename": "/usr/lib/R/library/pillar/doc/digits.Rmd", "start": 1309393, "end": 1309658}, {"filename": "/usr/lib/R/library/pillar/doc/numbers.R", "start": 1309658, "end": 1313249}, {"filename": "/usr/lib/R/library/pillar/doc/debugme.html", "start": 1313249, "end": 1333831}, {"filename": "/usr/lib/R/library/pillar/doc/printing.R", "start": 1333831, "end": 1341635}, {"filename": "/usr/lib/R/library/pillar/Meta/features.rds", "start": 1341635, "end": 1341767}, {"filename": "/usr/lib/R/library/pillar/Meta/package.rds", "start": 1341767, "end": 1343422}, {"filename": "/usr/lib/R/library/pillar/Meta/links.rds", "start": 1343422, "end": 1344227}, {"filename": "/usr/lib/R/library/pillar/Meta/nsInfo.rds", "start": 1344227, "end": 1345636}, {"filename": "/usr/lib/R/library/pillar/Meta/Rd.rds", "start": 1345636, "end": 1347144}, {"filename": "/usr/lib/R/library/pillar/Meta/hsearch.rds", "start": 1347144, "end": 1348612}, {"filename": "/usr/lib/R/library/pillar/Meta/vignette.rds", "start": 1348612, "end": 1348968}, {"filename": "/usr/lib/R/library/pillar/help/AnIndex", "start": 1348968, "end": 1350814}, {"filename": "/usr/lib/R/library/pillar/help/pillar.rdx", "start": 1350814, "end": 1351705}, {"filename": "/usr/lib/R/library/pillar/help/aliases.rds", "start": 1351705, "end": 1352327}, {"filename": "/usr/lib/R/library/pillar/help/paths.rds", "start": 1352327, "end": 1352738}, {"filename": "/usr/lib/R/library/pillar/help/pillar.rdb", "start": 1352738, "end": 1437281}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-deprecated.svg", "start": 1437281, "end": 1438251}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-questioning.svg", "start": 1438251, "end": 1439223}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-soft-deprecated.svg", "start": 1439223, "end": 1440205}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-experimental.svg", "start": 1440205, "end": 1441179}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-stable.svg", "start": 1441179, "end": 1442135}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-maturing.svg", "start": 1442135, "end": 1443101}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-archived.svg", "start": 1443101, "end": 1444068}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-defunct.svg", "start": 1444068, "end": 1445032}, {"filename": "/usr/lib/R/library/pillar/help/figures/lifecycle-superseded.svg", "start": 1445032, "end": 1446003}], "remote_package_size": 1446003, "package_uuid": "c5761ff4-3b80-4a80-ba08-14ac87f2730b"});
  
  })();
  