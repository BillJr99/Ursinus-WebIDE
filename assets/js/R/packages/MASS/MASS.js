
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
      var PACKAGE_NAME = '../dist/MASS/MASS.data';
      var REMOTE_PACKAGE_BASE = 'MASS.data';
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
Module['FS_createPath']("/usr/lib/R/library", "MASS", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "scripts", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "po", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "ko", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/ko", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "it", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/it", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "en@quot", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/en@quot", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "fr", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/fr", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "de", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/de", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po", "pl", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS/po/pl", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/MASS", "help", true, true);

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
                Module['removeRunDependency']('datafile_../dist/MASS/MASS.data');

      };
      Module['addRunDependency']('datafile_../dist/MASS/MASS.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/MASS/NAMESPACE", "start": 0, "end": 6350}, {"filename": "/usr/lib/R/library/MASS/CITATION", "start": 6350, "end": 7041}, {"filename": "/usr/lib/R/library/MASS/NEWS", "start": 7041, "end": 18101}, {"filename": "/usr/lib/R/library/MASS/DESCRIPTION", "start": 18101, "end": 19552}, {"filename": "/usr/lib/R/library/MASS/INDEX", "start": 19552, "end": 29687}, {"filename": "/usr/lib/R/library/MASS/html/00Index.html", "start": 29687, "end": 62128}, {"filename": "/usr/lib/R/library/MASS/html/R.css", "start": 62128, "end": 63463}, {"filename": "/usr/lib/R/library/MASS/R/MASS", "start": 63463, "end": 64521}, {"filename": "/usr/lib/R/library/MASS/R/MASS.rdb", "start": 64521, "end": 192552}, {"filename": "/usr/lib/R/library/MASS/R/MASS.rdx", "start": 192552, "end": 195382}, {"filename": "/usr/lib/R/library/MASS/data/Rdata.rdx", "start": 195382, "end": 196611}, {"filename": "/usr/lib/R/library/MASS/data/Rdata.rds", "start": 196611, "end": 197399}, {"filename": "/usr/lib/R/library/MASS/data/Rdata.rdb", "start": 197399, "end": 366734}, {"filename": "/usr/lib/R/library/MASS/scripts/ch15.R", "start": 366734, "end": 372930}, {"filename": "/usr/lib/R/library/MASS/scripts/ch08.R", "start": 372930, "end": 387408}, {"filename": "/usr/lib/R/library/MASS/scripts/ch11.R", "start": 387408, "end": 394473}, {"filename": "/usr/lib/R/library/MASS/scripts/ch16.R", "start": 394473, "end": 399795}, {"filename": "/usr/lib/R/library/MASS/scripts/ch06.R", "start": 399795, "end": 410663}, {"filename": "/usr/lib/R/library/MASS/scripts/ch14.R", "start": 410663, "end": 417777}, {"filename": "/usr/lib/R/library/MASS/scripts/ch05.R", "start": 417777, "end": 424898}, {"filename": "/usr/lib/R/library/MASS/scripts/ch04.R", "start": 424898, "end": 432971}, {"filename": "/usr/lib/R/library/MASS/scripts/ch09.R", "start": 432971, "end": 435410}, {"filename": "/usr/lib/R/library/MASS/scripts/ch01.R", "start": 435410, "end": 437573}, {"filename": "/usr/lib/R/library/MASS/scripts/ch13.R", "start": 437573, "end": 448156}, {"filename": "/usr/lib/R/library/MASS/scripts/ch12.R", "start": 448156, "end": 462722}, {"filename": "/usr/lib/R/library/MASS/scripts/ch02.R", "start": 462722, "end": 466605}, {"filename": "/usr/lib/R/library/MASS/scripts/ch03.R", "start": 466605, "end": 470412}, {"filename": "/usr/lib/R/library/MASS/scripts/ch10.R", "start": 470412, "end": 479362}, {"filename": "/usr/lib/R/library/MASS/scripts/ch07.R", "start": 479362, "end": 485263}, {"filename": "/usr/lib/R/library/MASS/Meta/features.rds", "start": 485263, "end": 485395}, {"filename": "/usr/lib/R/library/MASS/Meta/package.rds", "start": 485395, "end": 486586}, {"filename": "/usr/lib/R/library/MASS/Meta/links.rds", "start": 486586, "end": 489077}, {"filename": "/usr/lib/R/library/MASS/Meta/nsInfo.rds", "start": 489077, "end": 491033}, {"filename": "/usr/lib/R/library/MASS/Meta/Rd.rds", "start": 491033, "end": 497488}, {"filename": "/usr/lib/R/library/MASS/Meta/hsearch.rds", "start": 497488, "end": 503418}, {"filename": "/usr/lib/R/library/MASS/Meta/data.rds", "start": 503418, "end": 505748}, {"filename": "/usr/lib/R/library/MASS/po/ko/LC_MESSAGES/R-MASS.mo", "start": 505748, "end": 518665}, {"filename": "/usr/lib/R/library/MASS/po/it/LC_MESSAGES/R-MASS.mo", "start": 518665, "end": 536419}, {"filename": "/usr/lib/R/library/MASS/po/en@quot/LC_MESSAGES/R-MASS.mo", "start": 536419, "end": 553511}, {"filename": "/usr/lib/R/library/MASS/po/fr/LC_MESSAGES/R-MASS.mo", "start": 553511, "end": 572002}, {"filename": "/usr/lib/R/library/MASS/po/de/LC_MESSAGES/R-MASS.mo", "start": 572002, "end": 590252}, {"filename": "/usr/lib/R/library/MASS/po/pl/LC_MESSAGES/R-MASS.mo", "start": 590252, "end": 609081}, {"filename": "/usr/lib/R/library/MASS/libs/MASS.so", "start": 609081, "end": 649630}, {"filename": "/usr/lib/R/library/MASS/help/AnIndex", "start": 649630, "end": 654111}, {"filename": "/usr/lib/R/library/MASS/help/MASS.rdb", "start": 654111, "end": 1097978}, {"filename": "/usr/lib/R/library/MASS/help/MASS.rdx", "start": 1097978, "end": 1101240}, {"filename": "/usr/lib/R/library/MASS/help/aliases.rds", "start": 1101240, "end": 1103039}, {"filename": "/usr/lib/R/library/MASS/help/paths.rds", "start": 1103039, "end": 1104218}], "remote_package_size": 1104218, "package_uuid": "150c034f-179f-4f2e-9393-d61ab3758433"});
  
  })();
  