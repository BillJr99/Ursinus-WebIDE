
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
      var PACKAGE_NAME = '../../dist/Matrix/Matrix.data';
      var REMOTE_PACKAGE_BASE = 'Matrix.data';
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
Module['FS_createPath']("/usr/lib/R/library", "Matrix", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "external", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/doc", "SuiteSparse", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "po", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "ko", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/ko", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "it", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/it", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "lt", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/lt", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "en@quot", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/en@quot", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "fr", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/fr", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "de", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/de", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po", "pl", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix/po/pl", "LC_MESSAGES", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/Matrix", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/Matrix/Matrix.data');

      };
      Module['addRunDependency']('datafile_../../dist/Matrix/Matrix.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/Matrix/NAMESPACE", "start": 0, "end": 8790}, {"filename": "/usr/lib/R/library/Matrix/test-tools-Matrix.R", "start": 8790, "end": 36264}, {"filename": "/usr/lib/R/library/Matrix/LICENCE", "start": 36264, "end": 72713}, {"filename": "/usr/lib/R/library/Matrix/test-tools-1.R", "start": 72713, "end": 90328}, {"filename": "/usr/lib/R/library/Matrix/NEWS.Rd", "start": 90328, "end": 133776}, {"filename": "/usr/lib/R/library/Matrix/test-tools.R", "start": 133776, "end": 134367}, {"filename": "/usr/lib/R/library/Matrix/Copyrights", "start": 134367, "end": 136800}, {"filename": "/usr/lib/R/library/Matrix/Doxyfile", "start": 136800, "end": 251264}, {"filename": "/usr/lib/R/library/Matrix/DESCRIPTION", "start": 251264, "end": 253970}, {"filename": "/usr/lib/R/library/Matrix/INDEX", "start": 253970, "end": 263499}, {"filename": "/usr/lib/R/library/Matrix/html/00Index.html", "start": 263499, "end": 355860}, {"filename": "/usr/lib/R/library/Matrix/html/R.css", "start": 355860, "end": 357195}, {"filename": "/usr/lib/R/library/Matrix/include/cholmod.h", "start": 357195, "end": 409087}, {"filename": "/usr/lib/R/library/Matrix/include/Matrix_stubs.c", "start": 409087, "end": 429528}, {"filename": "/usr/lib/R/library/Matrix/include/Matrix.h", "start": 429528, "end": 434162}, {"filename": "/usr/lib/R/library/Matrix/R/Matrix.rdx", "start": 434162, "end": 446741}, {"filename": "/usr/lib/R/library/Matrix/R/Matrix", "start": 446741, "end": 447799}, {"filename": "/usr/lib/R/library/Matrix/R/Matrix.rdb", "start": 447799, "end": 1425326}, {"filename": "/usr/lib/R/library/Matrix/data/KNex.R", "start": 1425326, "end": 1425707}, {"filename": "/usr/lib/R/library/Matrix/data/datalist", "start": 1425707, "end": 1425738}, {"filename": "/usr/lib/R/library/Matrix/data/CAex.R", "start": 1425738, "end": 1426266}, {"filename": "/usr/lib/R/library/Matrix/data/wrld_1deg.R", "start": 1426266, "end": 1426709}, {"filename": "/usr/lib/R/library/Matrix/data/USCounties.R", "start": 1426709, "end": 1427186}, {"filename": "/usr/lib/R/library/Matrix/external/KNex_slots.rda", "start": 1427186, "end": 1483634}, {"filename": "/usr/lib/R/library/Matrix/external/USCounties_slots.rda", "start": 1483634, "end": 1513981}, {"filename": "/usr/lib/R/library/Matrix/external/symA.rda", "start": 1513981, "end": 1514844}, {"filename": "/usr/lib/R/library/Matrix/external/wrong.mtx", "start": 1514844, "end": 1514911}, {"filename": "/usr/lib/R/library/Matrix/external/test3comp.rda", "start": 1514911, "end": 1519408}, {"filename": "/usr/lib/R/library/Matrix/external/symW.rda", "start": 1519408, "end": 1520760}, {"filename": "/usr/lib/R/library/Matrix/external/jgl009.mtx", "start": 1520760, "end": 1521016}, {"filename": "/usr/lib/R/library/Matrix/external/CAex_slots.rda", "start": 1521016, "end": 1522688}, {"filename": "/usr/lib/R/library/Matrix/external/utm300.rua", "start": 1522688, "end": 1607517}, {"filename": "/usr/lib/R/library/Matrix/external/wrld_1deg_slots.rda", "start": 1607517, "end": 1726751}, {"filename": "/usr/lib/R/library/Matrix/external/Z_NA_rnk.rds", "start": 1726751, "end": 1732407}, {"filename": "/usr/lib/R/library/Matrix/external/lund_a.mtx", "start": 1732407, "end": 1768228}, {"filename": "/usr/lib/R/library/Matrix/external/lund_a.rsa", "start": 1768228, "end": 1797064}, {"filename": "/usr/lib/R/library/Matrix/external/pores_1.mtx", "start": 1797064, "end": 1801874}, {"filename": "/usr/lib/R/library/Matrix/doc/Design-issues.Rnw", "start": 1801874, "end": 1808010}, {"filename": "/usr/lib/R/library/Matrix/doc/Intro2Matrix.R", "start": 1808010, "end": 1810505}, {"filename": "/usr/lib/R/library/Matrix/doc/sparseModels.R", "start": 1810505, "end": 1815721}, {"filename": "/usr/lib/R/library/Matrix/doc/Comparisons.R", "start": 1815721, "end": 1820854}, {"filename": "/usr/lib/R/library/Matrix/doc/Intro2Matrix.Rnw", "start": 1820854, "end": 1839613}, {"filename": "/usr/lib/R/library/Matrix/doc/Comparisons.Rnw", "start": 1839613, "end": 1848639}, {"filename": "/usr/lib/R/library/Matrix/doc/Design-issues.R", "start": 1848639, "end": 1849909}, {"filename": "/usr/lib/R/library/Matrix/doc/index.html", "start": 1849909, "end": 1853770}, {"filename": "/usr/lib/R/library/Matrix/doc/sparseModels.pdf", "start": 1853770, "end": 2139579}, {"filename": "/usr/lib/R/library/Matrix/doc/Announce.txt", "start": 2139579, "end": 2143374}, {"filename": "/usr/lib/R/library/Matrix/doc/Introduction.R", "start": 2143374, "end": 2143589}, {"filename": "/usr/lib/R/library/Matrix/doc/Introduction.pdf", "start": 2143589, "end": 2325659}, {"filename": "/usr/lib/R/library/Matrix/doc/Introduction.Rnw", "start": 2325659, "end": 2333687}, {"filename": "/usr/lib/R/library/Matrix/doc/Design-issues.pdf", "start": 2333687, "end": 2510201}, {"filename": "/usr/lib/R/library/Matrix/doc/Intro2Matrix.pdf", "start": 2510201, "end": 2833570}, {"filename": "/usr/lib/R/library/Matrix/doc/Comparisons.pdf", "start": 2833570, "end": 3096079}, {"filename": "/usr/lib/R/library/Matrix/doc/sparseModels.Rnw", "start": 3096079, "end": 3106961}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/AMD.txt", "start": 3106961, "end": 3114210}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/CHOLMOD.txt", "start": 3114210, "end": 3117381}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/COLAMD.txt", "start": 3117381, "end": 3122745}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/SPQR.txt", "start": 3122745, "end": 3125020}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/SuiteSparse_config.txt", "start": 3125020, "end": 3127364}, {"filename": "/usr/lib/R/library/Matrix/doc/SuiteSparse/UserGuides.txt", "start": 3127364, "end": 3128099}, {"filename": "/usr/lib/R/library/Matrix/Meta/features.rds", "start": 3128099, "end": 3128231}, {"filename": "/usr/lib/R/library/Matrix/Meta/package.rds", "start": 3128231, "end": 3130023}, {"filename": "/usr/lib/R/library/Matrix/Meta/links.rds", "start": 3130023, "end": 3142713}, {"filename": "/usr/lib/R/library/Matrix/Meta/nsInfo.rds", "start": 3142713, "end": 3144795}, {"filename": "/usr/lib/R/library/Matrix/Meta/Rd.rds", "start": 3144795, "end": 3159907}, {"filename": "/usr/lib/R/library/Matrix/Meta/hsearch.rds", "start": 3159907, "end": 3175618}, {"filename": "/usr/lib/R/library/Matrix/Meta/data.rds", "start": 3175618, "end": 3175876}, {"filename": "/usr/lib/R/library/Matrix/Meta/vignette.rds", "start": 3175876, "end": 3176256}, {"filename": "/usr/lib/R/library/Matrix/po/ko/LC_MESSAGES/Matrix.mo", "start": 3176256, "end": 3204356}, {"filename": "/usr/lib/R/library/Matrix/po/ko/LC_MESSAGES/R-Matrix.mo", "start": 3204356, "end": 3237421}, {"filename": "/usr/lib/R/library/Matrix/po/it/LC_MESSAGES/Matrix.mo", "start": 3237421, "end": 3265869}, {"filename": "/usr/lib/R/library/Matrix/po/it/LC_MESSAGES/R-Matrix.mo", "start": 3265869, "end": 3297530}, {"filename": "/usr/lib/R/library/Matrix/po/lt/LC_MESSAGES/Matrix.mo", "start": 3297530, "end": 3325161}, {"filename": "/usr/lib/R/library/Matrix/po/lt/LC_MESSAGES/R-Matrix.mo", "start": 3325161, "end": 3355863}, {"filename": "/usr/lib/R/library/Matrix/po/en@quot/LC_MESSAGES/Matrix.mo", "start": 3355863, "end": 3382720}, {"filename": "/usr/lib/R/library/Matrix/po/en@quot/LC_MESSAGES/R-Matrix.mo", "start": 3382720, "end": 3412641}, {"filename": "/usr/lib/R/library/Matrix/po/fr/LC_MESSAGES/Matrix.mo", "start": 3412641, "end": 3441879}, {"filename": "/usr/lib/R/library/Matrix/po/fr/LC_MESSAGES/R-Matrix.mo", "start": 3441879, "end": 3474656}, {"filename": "/usr/lib/R/library/Matrix/po/de/LC_MESSAGES/Matrix.mo", "start": 3474656, "end": 3502901}, {"filename": "/usr/lib/R/library/Matrix/po/de/LC_MESSAGES/R-Matrix.mo", "start": 3502901, "end": 3533491}, {"filename": "/usr/lib/R/library/Matrix/po/pl/LC_MESSAGES/Matrix.mo", "start": 3533491, "end": 3559327}, {"filename": "/usr/lib/R/library/Matrix/po/pl/LC_MESSAGES/R-Matrix.mo", "start": 3559327, "end": 3587164}, {"filename": "/usr/lib/R/library/Matrix/libs/Matrix.so", "start": 3587164, "end": 6768900}, {"filename": "/usr/lib/R/library/Matrix/help/Matrix.rdx", "start": 6768900, "end": 6771576}, {"filename": "/usr/lib/R/library/Matrix/help/Matrix.rdb", "start": 6771576, "end": 7378426}, {"filename": "/usr/lib/R/library/Matrix/help/AnIndex", "start": 7378426, "end": 7483259}, {"filename": "/usr/lib/R/library/Matrix/help/aliases.rds", "start": 7483259, "end": 7496743}, {"filename": "/usr/lib/R/library/Matrix/help/paths.rds", "start": 7496743, "end": 7497748}], "remote_package_size": 7497748, "package_uuid": "85c15d2a-1557-4cdc-81b0-6673b1b52e63"});
  
  })();
  