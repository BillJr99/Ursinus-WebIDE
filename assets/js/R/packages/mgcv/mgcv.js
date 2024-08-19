
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
      var PACKAGE_NAME = '../../dist/mgcv/mgcv.data';
      var REMOTE_PACKAGE_BASE = 'mgcv.data';
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
Module['FS_createPath']("/usr/lib/R/library", "mgcv", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "po", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "ko", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/ko", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "it", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/it", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "en@quot", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/en@quot", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "fr", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/fr", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "de", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/de", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po", "pl", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv/po/pl", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/mgcv", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/mgcv/mgcv.data');

      };
      Module['addRunDependency']('datafile_../../dist/mgcv/mgcv.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/mgcv/NAMESPACE", "start": 0, "end": 7391}, {"filename": "/usr/lib/R/library/mgcv/CITATION", "start": 7391, "end": 9749}, {"filename": "/usr/lib/R/library/mgcv/DESCRIPTION", "start": 9749, "end": 10947}, {"filename": "/usr/lib/R/library/mgcv/INDEX", "start": 10947, "end": 23143}, {"filename": "/usr/lib/R/library/mgcv/html/00Index.html", "start": 23143, "end": 60352}, {"filename": "/usr/lib/R/library/mgcv/html/R.css", "start": 60352, "end": 61687}, {"filename": "/usr/lib/R/library/mgcv/R/mgcv", "start": 61687, "end": 62745}, {"filename": "/usr/lib/R/library/mgcv/R/mgcv.rdx", "start": 62745, "end": 68096}, {"filename": "/usr/lib/R/library/mgcv/R/mgcv.rdb", "start": 68096, "end": 520659}, {"filename": "/usr/lib/R/library/mgcv/data/columb.polys.rda", "start": 520659, "end": 528921}, {"filename": "/usr/lib/R/library/mgcv/data/columb.rda", "start": 528921, "end": 531810}, {"filename": "/usr/lib/R/library/mgcv/Meta/features.rds", "start": 531810, "end": 531942}, {"filename": "/usr/lib/R/library/mgcv/Meta/package.rds", "start": 531942, "end": 533133}, {"filename": "/usr/lib/R/library/mgcv/Meta/links.rds", "start": 533133, "end": 535789}, {"filename": "/usr/lib/R/library/mgcv/Meta/nsInfo.rds", "start": 535789, "end": 538373}, {"filename": "/usr/lib/R/library/mgcv/Meta/Rd.rds", "start": 538373, "end": 544785}, {"filename": "/usr/lib/R/library/mgcv/Meta/hsearch.rds", "start": 544785, "end": 551001}, {"filename": "/usr/lib/R/library/mgcv/Meta/data.rds", "start": 551001, "end": 551143}, {"filename": "/usr/lib/R/library/mgcv/po/ko/LC_MESSAGES/mgcv.mo", "start": 551143, "end": 552094}, {"filename": "/usr/lib/R/library/mgcv/po/ko/LC_MESSAGES/R-mgcv.mo", "start": 552094, "end": 575911}, {"filename": "/usr/lib/R/library/mgcv/po/it/LC_MESSAGES/mgcv.mo", "start": 575911, "end": 578088}, {"filename": "/usr/lib/R/library/mgcv/po/it/LC_MESSAGES/R-mgcv.mo", "start": 578088, "end": 622991}, {"filename": "/usr/lib/R/library/mgcv/po/en@quot/LC_MESSAGES/mgcv.mo", "start": 622991, "end": 624981}, {"filename": "/usr/lib/R/library/mgcv/po/en@quot/LC_MESSAGES/R-mgcv.mo", "start": 624981, "end": 672613}, {"filename": "/usr/lib/R/library/mgcv/po/fr/LC_MESSAGES/mgcv.mo", "start": 672613, "end": 674820}, {"filename": "/usr/lib/R/library/mgcv/po/fr/LC_MESSAGES/R-mgcv.mo", "start": 674820, "end": 727964}, {"filename": "/usr/lib/R/library/mgcv/po/de/LC_MESSAGES/mgcv.mo", "start": 727964, "end": 730116}, {"filename": "/usr/lib/R/library/mgcv/po/de/LC_MESSAGES/R-mgcv.mo", "start": 730116, "end": 781575}, {"filename": "/usr/lib/R/library/mgcv/po/pl/LC_MESSAGES/mgcv.mo", "start": 781575, "end": 783888}, {"filename": "/usr/lib/R/library/mgcv/po/pl/LC_MESSAGES/R-mgcv.mo", "start": 783888, "end": 816053}, {"filename": "/usr/lib/R/library/mgcv/libs/mgcv.so", "start": 816053, "end": 3584186}, {"filename": "/usr/lib/R/library/mgcv/help/AnIndex", "start": 3584186, "end": 3591146}, {"filename": "/usr/lib/R/library/mgcv/help/aliases.rds", "start": 3591146, "end": 3593176}, {"filename": "/usr/lib/R/library/mgcv/help/paths.rds", "start": 3593176, "end": 3594473}, {"filename": "/usr/lib/R/library/mgcv/help/mgcv.rdx", "start": 3594473, "end": 3597911}, {"filename": "/usr/lib/R/library/mgcv/help/mgcv.rdb", "start": 3597911, "end": 4391456}], "remote_package_size": 4391456, "package_uuid": "c5ab0302-8fb0-49fb-8e67-761e585776e6"});
  
  })();
  