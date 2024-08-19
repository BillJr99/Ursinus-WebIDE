
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
      var PACKAGE_NAME = '../../dist/nlme/nlme.data';
      var REMOTE_PACKAGE_BASE = 'nlme.data';
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
Module['FS_createPath']("/usr/lib/R/library", "nlme", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "scripts", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "po", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po", "ko", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po/ko", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po", "en@quot", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po/en@quot", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po", "fr", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po/fr", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po", "de", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po/de", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po", "pl", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme/po/pl", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "mlbook", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/nlme", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/nlme/nlme.data');

      };
      Module['addRunDependency']('datafile_../../dist/nlme/nlme.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/nlme/NAMESPACE", "start": 0, "end": 15075}, {"filename": "/usr/lib/R/library/nlme/LICENCE", "start": 15075, "end": 33276}, {"filename": "/usr/lib/R/library/nlme/CITATION", "start": 33276, "end": 33804}, {"filename": "/usr/lib/R/library/nlme/DESCRIPTION", "start": 33804, "end": 35660}, {"filename": "/usr/lib/R/library/nlme/INDEX", "start": 35660, "end": 52128}, {"filename": "/usr/lib/R/library/nlme/html/00Index.html", "start": 52128, "end": 124211}, {"filename": "/usr/lib/R/library/nlme/html/R.css", "start": 124211, "end": 125546}, {"filename": "/usr/lib/R/library/nlme/R/nlme.rdb", "start": 125546, "end": 420194}, {"filename": "/usr/lib/R/library/nlme/R/nlme", "start": 420194, "end": 421252}, {"filename": "/usr/lib/R/library/nlme/R/nlme.rdx", "start": 421252, "end": 427554}, {"filename": "/usr/lib/R/library/nlme/data/Rdata.rdx", "start": 427554, "end": 428394}, {"filename": "/usr/lib/R/library/nlme/data/Rdata.rds", "start": 428394, "end": 428878}, {"filename": "/usr/lib/R/library/nlme/data/Rdata.rdb", "start": 428878, "end": 701471}, {"filename": "/usr/lib/R/library/nlme/scripts/ch08.R", "start": 701471, "end": 713267}, {"filename": "/usr/lib/R/library/nlme/scripts/ch06.R", "start": 713267, "end": 716889}, {"filename": "/usr/lib/R/library/nlme/scripts/ch05.R", "start": 716889, "end": 724392}, {"filename": "/usr/lib/R/library/nlme/scripts/runme.R", "start": 724392, "end": 724942}, {"filename": "/usr/lib/R/library/nlme/scripts/ch04.R", "start": 724942, "end": 732044}, {"filename": "/usr/lib/R/library/nlme/scripts/ch01.R", "start": 732044, "end": 736746}, {"filename": "/usr/lib/R/library/nlme/scripts/sims.rda", "start": 736746, "end": 842629}, {"filename": "/usr/lib/R/library/nlme/scripts/ch02.R", "start": 842629, "end": 845056}, {"filename": "/usr/lib/R/library/nlme/scripts/ch03.R", "start": 845056, "end": 848966}, {"filename": "/usr/lib/R/library/nlme/Meta/features.rds", "start": 848966, "end": 849098}, {"filename": "/usr/lib/R/library/nlme/Meta/package.rds", "start": 849098, "end": 850406}, {"filename": "/usr/lib/R/library/nlme/Meta/links.rds", "start": 850406, "end": 855143}, {"filename": "/usr/lib/R/library/nlme/Meta/nsInfo.rds", "start": 855143, "end": 857684}, {"filename": "/usr/lib/R/library/nlme/Meta/Rd.rds", "start": 857684, "end": 866414}, {"filename": "/usr/lib/R/library/nlme/Meta/hsearch.rds", "start": 866414, "end": 874840}, {"filename": "/usr/lib/R/library/nlme/Meta/data.rds", "start": 874840, "end": 875922}, {"filename": "/usr/lib/R/library/nlme/po/ko/LC_MESSAGES/R-nlme.mo", "start": 875922, "end": 880863}, {"filename": "/usr/lib/R/library/nlme/po/ko/LC_MESSAGES/nlme.mo", "start": 880863, "end": 882315}, {"filename": "/usr/lib/R/library/nlme/po/en@quot/LC_MESSAGES/R-nlme.mo", "start": 882315, "end": 925820}, {"filename": "/usr/lib/R/library/nlme/po/en@quot/LC_MESSAGES/nlme.mo", "start": 925820, "end": 927707}, {"filename": "/usr/lib/R/library/nlme/po/fr/LC_MESSAGES/R-nlme.mo", "start": 927707, "end": 971671}, {"filename": "/usr/lib/R/library/nlme/po/fr/LC_MESSAGES/nlme.mo", "start": 971671, "end": 973779}, {"filename": "/usr/lib/R/library/nlme/po/de/LC_MESSAGES/R-nlme.mo", "start": 973779, "end": 1019236}, {"filename": "/usr/lib/R/library/nlme/po/de/LC_MESSAGES/nlme.mo", "start": 1019236, "end": 1021286}, {"filename": "/usr/lib/R/library/nlme/po/pl/LC_MESSAGES/R-nlme.mo", "start": 1021286, "end": 1065749}, {"filename": "/usr/lib/R/library/nlme/po/pl/LC_MESSAGES/nlme.mo", "start": 1065749, "end": 1067488}, {"filename": "/usr/lib/R/library/nlme/mlbook/README", "start": 1067488, "end": 1067695}, {"filename": "/usr/lib/R/library/nlme/mlbook/ch05.R", "start": 1067695, "end": 1068211}, {"filename": "/usr/lib/R/library/nlme/mlbook/ch04.R", "start": 1068211, "end": 1069131}, {"filename": "/usr/lib/R/library/nlme/libs/nlme.so", "start": 1069131, "end": 1215402}, {"filename": "/usr/lib/R/library/nlme/help/AnIndex", "start": 1215402, "end": 1230642}, {"filename": "/usr/lib/R/library/nlme/help/nlme.rdb", "start": 1230642, "end": 2177254}, {"filename": "/usr/lib/R/library/nlme/help/aliases.rds", "start": 2177254, "end": 2180680}, {"filename": "/usr/lib/R/library/nlme/help/paths.rds", "start": 2180680, "end": 2182685}, {"filename": "/usr/lib/R/library/nlme/help/nlme.rdx", "start": 2182685, "end": 2188507}], "remote_package_size": 2188507, "package_uuid": "4baff391-efc2-4adb-b611-e86e4d880398"});
  
  })();
  