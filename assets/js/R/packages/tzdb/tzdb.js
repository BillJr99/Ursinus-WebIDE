
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
      var PACKAGE_NAME = '../../dist/tzdb/tzdb.data';
      var REMOTE_PACKAGE_BASE = 'tzdb.data';
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
Module['FS_createPath']("/usr/lib/R/library", "tzdb", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb/include", "date", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb/include", "tzdb", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/tzdb", "tzdata", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/tzdb/tzdb.data');

      };
      Module['addRunDependency']('datafile_../../dist/tzdb/tzdb.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/tzdb/NAMESPACE", "start": 0, "end": 166}, {"filename": "/usr/lib/R/library/tzdb/NEWS.md", "start": 166, "end": 826}, {"filename": "/usr/lib/R/library/tzdb/LICENSE", "start": 826, "end": 868}, {"filename": "/usr/lib/R/library/tzdb/DESCRIPTION", "start": 868, "end": 2638}, {"filename": "/usr/lib/R/library/tzdb/INDEX", "start": 2638, "end": 2874}, {"filename": "/usr/lib/R/library/tzdb/html/00Index.html", "start": 2874, "end": 4431}, {"filename": "/usr/lib/R/library/tzdb/html/R.css", "start": 4431, "end": 5766}, {"filename": "/usr/lib/R/library/tzdb/include/date/iso_week.h", "start": 5766, "end": 48800}, {"filename": "/usr/lib/R/library/tzdb/include/date/date.h", "start": 48800, "end": 286988}, {"filename": "/usr/lib/R/library/tzdb/include/date/ios.h", "start": 286988, "end": 288597}, {"filename": "/usr/lib/R/library/tzdb/include/date/julian.h", "start": 288597, "end": 360581}, {"filename": "/usr/lib/R/library/tzdb/include/date/tz_private.h", "start": 360581, "end": 371271}, {"filename": "/usr/lib/R/library/tzdb/include/date/islamic.h", "start": 371271, "end": 442390}, {"filename": "/usr/lib/R/library/tzdb/include/date/chrono_io.h", "start": 442390, "end": 443857}, {"filename": "/usr/lib/R/library/tzdb/include/date/ptz.h", "start": 443857, "end": 467869}, {"filename": "/usr/lib/R/library/tzdb/include/date/tz.h", "start": 467869, "end": 552486}, {"filename": "/usr/lib/R/library/tzdb/include/date/solar_hijri.h", "start": 552486, "end": 631214}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/iso_week.h", "start": 631214, "end": 631324}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/date.h", "start": 631324, "end": 631422}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/julian.h", "start": 631422, "end": 631526}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/islamic.h", "start": 631526, "end": 631633}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/defines.h", "start": 631633, "end": 632385}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/ptz.h", "start": 632385, "end": 632480}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/tzdb.h", "start": 632480, "end": 633820}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/tz.h", "start": 633820, "end": 633912}, {"filename": "/usr/lib/R/library/tzdb/include/tzdb/solar_hijri.h", "start": 633912, "end": 634031}, {"filename": "/usr/lib/R/library/tzdb/R/tzdb", "start": 634031, "end": 635089}, {"filename": "/usr/lib/R/library/tzdb/R/tzdb.rdx", "start": 635089, "end": 635538}, {"filename": "/usr/lib/R/library/tzdb/R/tzdb.rdb", "start": 635538, "end": 638402}, {"filename": "/usr/lib/R/library/tzdb/Meta/features.rds", "start": 638402, "end": 638534}, {"filename": "/usr/lib/R/library/tzdb/Meta/package.rds", "start": 638534, "end": 639895}, {"filename": "/usr/lib/R/library/tzdb/Meta/links.rds", "start": 639895, "end": 640079}, {"filename": "/usr/lib/R/library/tzdb/Meta/nsInfo.rds", "start": 640079, "end": 640409}, {"filename": "/usr/lib/R/library/tzdb/Meta/Rd.rds", "start": 640409, "end": 640827}, {"filename": "/usr/lib/R/library/tzdb/Meta/hsearch.rds", "start": 640827, "end": 641257}, {"filename": "/usr/lib/R/library/tzdb/libs/tzdb.so", "start": 641257, "end": 2133194}, {"filename": "/usr/lib/R/library/tzdb/help/AnIndex", "start": 2133194, "end": 2133338}, {"filename": "/usr/lib/R/library/tzdb/help/aliases.rds", "start": 2133338, "end": 2133482}, {"filename": "/usr/lib/R/library/tzdb/help/tzdb.rdx", "start": 2133482, "end": 2133761}, {"filename": "/usr/lib/R/library/tzdb/help/paths.rds", "start": 2133761, "end": 2133945}, {"filename": "/usr/lib/R/library/tzdb/help/tzdb.rdb", "start": 2133945, "end": 2140647}, {"filename": "/usr/lib/R/library/tzdb/tzdata/asia", "start": 2140647, "end": 2318745}, {"filename": "/usr/lib/R/library/tzdb/tzdata/africa", "start": 2318745, "end": 2384897}, {"filename": "/usr/lib/R/library/tzdb/tzdata/SECURITY", "start": 2384897, "end": 2385670}, {"filename": "/usr/lib/R/library/tzdb/tzdata/README", "start": 2385670, "end": 2388094}, {"filename": "/usr/lib/R/library/tzdb/tzdata/backzone", "start": 2388094, "end": 2431590}, {"filename": "/usr/lib/R/library/tzdb/tzdata/northamerica", "start": 2431590, "end": 2595934}, {"filename": "/usr/lib/R/library/tzdb/tzdata/checktab.awk", "start": 2595934, "end": 2600408}, {"filename": "/usr/lib/R/library/tzdb/tzdata/zone.tab", "start": 2600408, "end": 2619827}, {"filename": "/usr/lib/R/library/tzdb/tzdata/windowsZones.xml", "start": 2619827, "end": 2669639}, {"filename": "/usr/lib/R/library/tzdb/tzdata/zishrink.awk", "start": 2669639, "end": 2677986}, {"filename": "/usr/lib/R/library/tzdb/tzdata/theory.html", "start": 2677986, "end": 2738686}, {"filename": "/usr/lib/R/library/tzdb/tzdata/calendars", "start": 2738686, "end": 2744253}, {"filename": "/usr/lib/R/library/tzdb/tzdata/leapseconds", "start": 2744253, "end": 2747641}, {"filename": "/usr/lib/R/library/tzdb/tzdata/checklinks.awk", "start": 2747641, "end": 2748649}, {"filename": "/usr/lib/R/library/tzdb/tzdata/version", "start": 2748649, "end": 2748655}, {"filename": "/usr/lib/R/library/tzdb/tzdata/zone1970.tab", "start": 2748655, "end": 2766248}, {"filename": "/usr/lib/R/library/tzdb/tzdata/antarctica", "start": 2766248, "end": 2779093}, {"filename": "/usr/lib/R/library/tzdb/tzdata/ziguard.awk", "start": 2779093, "end": 2783353}, {"filename": "/usr/lib/R/library/tzdb/tzdata/CONTRIBUTING", "start": 2783353, "end": 2786468}, {"filename": "/usr/lib/R/library/tzdb/tzdata/leapseconds.awk", "start": 2786468, "end": 2795357}, {"filename": "/usr/lib/R/library/tzdb/tzdata/iso3166.tab", "start": 2795357, "end": 2799820}, {"filename": "/usr/lib/R/library/tzdb/tzdata/australasia", "start": 2799820, "end": 2899899}, {"filename": "/usr/lib/R/library/tzdb/tzdata/leap-seconds.list", "start": 2899899, "end": 2910558}, {"filename": "/usr/lib/R/library/tzdb/tzdata/etcetera", "start": 2910558, "end": 2913262}, {"filename": "/usr/lib/R/library/tzdb/tzdata/LICENSE", "start": 2913262, "end": 2913514}, {"filename": "/usr/lib/R/library/tzdb/tzdata/NEWS", "start": 2913514, "end": 3112883}, {"filename": "/usr/lib/R/library/tzdb/tzdata/europe", "start": 3112883, "end": 3295717}, {"filename": "/usr/lib/R/library/tzdb/tzdata/factory", "start": 3295717, "end": 3296121}, {"filename": "/usr/lib/R/library/tzdb/tzdata/Makefile", "start": 3296121, "end": 3340735}, {"filename": "/usr/lib/R/library/tzdb/tzdata/backward", "start": 3340735, "end": 3345607}, {"filename": "/usr/lib/R/library/tzdb/tzdata/southamerica", "start": 3345607, "end": 3433805}, {"filename": "/usr/lib/R/library/tzdb/tzdata/zoneinfo2tdf.pl", "start": 3433805, "end": 3435255}], "remote_package_size": 3435255, "package_uuid": "8bf55d06-77af-431c-8c70-18141015ed53"});
  
  })();
  