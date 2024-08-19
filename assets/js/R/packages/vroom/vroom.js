
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
      var PACKAGE_NAME = '../../dist/vroom/vroom.data';
      var REMOTE_PACKAGE_BASE = 'vroom.data';
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
Module['FS_createPath']("/usr/lib/R/library", "vroom", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "extdata", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "words", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "bench", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "all_character-long", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "all_character-wide", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "fwf", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "taxi", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "taxi_multiple", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "all_numeric-long", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "all_numeric-wide", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/bench", "taxi_writing", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/vroom/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/vroom/vroom.data');

      };
      Module['addRunDependency']('datafile_../../dist/vroom/vroom.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/vroom/NAMESPACE", "start": 0, "end": 2696}, {"filename": "/usr/lib/R/library/vroom/COPYRIGHTS", "start": 2696, "end": 5441}, {"filename": "/usr/lib/R/library/vroom/WORDLIST", "start": 5441, "end": 6160}, {"filename": "/usr/lib/R/library/vroom/NEWS.md", "start": 6160, "end": 22784}, {"filename": "/usr/lib/R/library/vroom/LICENSE", "start": 22784, "end": 22827}, {"filename": "/usr/lib/R/library/vroom/DESCRIPTION", "start": 22827, "end": 25783}, {"filename": "/usr/lib/R/library/vroom/INDEX", "start": 25783, "end": 26923}, {"filename": "/usr/lib/R/library/vroom/html/00Index.html", "start": 26923, "end": 34540}, {"filename": "/usr/lib/R/library/vroom/html/R.css", "start": 34540, "end": 35875}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars.csv.gz", "start": 35875, "end": 36745}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars.csv.bz2", "start": 36745, "end": 37585}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars-8.csv", "start": 37585, "end": 38385}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars-6.csv", "start": 38385, "end": 38785}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars.csv.zip", "start": 38785, "end": 39796}, {"filename": "/usr/lib/R/library/vroom/extdata/fwf-sample.txt", "start": 39796, "end": 39925}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars.csv", "start": 39925, "end": 41625}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars-4.csv", "start": 41625, "end": 42227}, {"filename": "/usr/lib/R/library/vroom/extdata/mtcars.csv.xz", "start": 42227, "end": 43111}, {"filename": "/usr/lib/R/library/vroom/R/vroom.rdb", "start": 43111, "end": 101153}, {"filename": "/usr/lib/R/library/vroom/R/sysdata.rdx", "start": 101153, "end": 101315}, {"filename": "/usr/lib/R/library/vroom/R/sysdata.rdb", "start": 101315, "end": 140046}, {"filename": "/usr/lib/R/library/vroom/R/vroom.rdx", "start": 140046, "end": 142657}, {"filename": "/usr/lib/R/library/vroom/R/vroom", "start": 142657, "end": 143715}, {"filename": "/usr/lib/R/library/vroom/words/adjectives.txt", "start": 143715, "end": 145197}, {"filename": "/usr/lib/R/library/vroom/words/animals.txt", "start": 145197, "end": 146430}, {"filename": "/usr/lib/R/library/vroom/doc/benchmarks.R", "start": 146430, "end": 153118}, {"filename": "/usr/lib/R/library/vroom/doc/benchmarks.html", "start": 153118, "end": 693159}, {"filename": "/usr/lib/R/library/vroom/doc/vroom.R", "start": 693159, "end": 698894}, {"filename": "/usr/lib/R/library/vroom/doc/vroom.html", "start": 698894, "end": 779043}, {"filename": "/usr/lib/R/library/vroom/doc/index.html", "start": 779043, "end": 780946}, {"filename": "/usr/lib/R/library/vroom/doc/benchmarks.Rmd", "start": 780946, "end": 795611}, {"filename": "/usr/lib/R/library/vroom/doc/vroom.Rmd", "start": 795611, "end": 807697}, {"filename": "/usr/lib/R/library/vroom/Meta/features.rds", "start": 807697, "end": 807829}, {"filename": "/usr/lib/R/library/vroom/Meta/package.rds", "start": 807829, "end": 809918}, {"filename": "/usr/lib/R/library/vroom/Meta/links.rds", "start": 809918, "end": 810639}, {"filename": "/usr/lib/R/library/vroom/Meta/nsInfo.rds", "start": 810639, "end": 811649}, {"filename": "/usr/lib/R/library/vroom/Meta/Rd.rds", "start": 811649, "end": 812953}, {"filename": "/usr/lib/R/library/vroom/Meta/hsearch.rds", "start": 812953, "end": 814225}, {"filename": "/usr/lib/R/library/vroom/Meta/vignette.rds", "start": 814225, "end": 814460}, {"filename": "/usr/lib/R/library/vroom/libs/vroom.so", "start": 814460, "end": 11812069}, {"filename": "/usr/lib/R/library/vroom/bench/taxi.tsv", "start": 11812069, "end": 11820025}, {"filename": "/usr/lib/R/library/vroom/bench/README.md", "start": 11820025, "end": 11820774}, {"filename": "/usr/lib/R/library/vroom/bench/GNUmakefile", "start": 11820774, "end": 11822037}, {"filename": "/usr/lib/R/library/vroom/bench/summarise-benchmarks.R", "start": 11822037, "end": 11823928}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide.tsv", "start": 11823928, "end": 11832014}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide.tsv", "start": 11832014, "end": 11841455}, {"filename": "/usr/lib/R/library/vroom/bench/fwf.tsv", "start": 11841455, "end": 11847875}, {"filename": "/usr/lib/R/library/vroom/bench/run-bench-fwf.R", "start": 11847875, "end": 11851646}, {"filename": "/usr/lib/R/library/vroom/bench/session_info.tsv", "start": 11851646, "end": 11852538}, {"filename": "/usr/lib/R/library/vroom/bench/download-data.sh", "start": 11852538, "end": 11853090}, {"filename": "/usr/lib/R/library/vroom/bench/session_info.R", "start": 11853090, "end": 11853326}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple.tsv", "start": 11853326, "end": 11860200}, {"filename": "/usr/lib/R/library/vroom/bench/script.sh", "start": 11860200, "end": 11862255}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long.tsv", "start": 11862255, "end": 11870092}, {"filename": "/usr/lib/R/library/vroom/bench/run-bench.R", "start": 11870092, "end": 11870630}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing.tsv", "start": 11870630, "end": 11875703}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long.tsv", "start": 11875703, "end": 11884917}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/readr-dplyr.R", "start": 11884917, "end": 11885181}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/vroom-dplyr.R", "start": 11885181, "end": 11885465}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/vroom-base.R", "start": 11885465, "end": 11885720}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/data.table-data.table.R", "start": 11885720, "end": 11885959}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/vroom_no_altrep-dplyr.R", "start": 11885959, "end": 11886257}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/input.R", "start": 11886257, "end": 11886935}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-long/read.delim-base.R", "start": 11886935, "end": 11887182}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/readr-dplyr.R", "start": 11887182, "end": 11887446}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/vroom-dplyr.R", "start": 11887446, "end": 11887730}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/vroom-base.R", "start": 11887730, "end": 11887985}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/data.table-data.table.R", "start": 11887985, "end": 11888224}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/vroom_no_altrep-dplyr.R", "start": 11888224, "end": 11888522}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/input.R", "start": 11888522, "end": 11889200}, {"filename": "/usr/lib/R/library/vroom/bench/all_character-wide/read.delim-base.R", "start": 11889200, "end": 11889447}, {"filename": "/usr/lib/R/library/vroom/bench/fwf/readr-dplyr.R", "start": 11889447, "end": 11889688}, {"filename": "/usr/lib/R/library/vroom/bench/fwf/vroom-dplyr.R", "start": 11889688, "end": 11889930}, {"filename": "/usr/lib/R/library/vroom/bench/fwf/vroom-base.R", "start": 11889930, "end": 11890135}, {"filename": "/usr/lib/R/library/vroom/bench/fwf/vroom_no_altrep-dplyr.R", "start": 11890135, "end": 11890396}, {"filename": "/usr/lib/R/library/vroom/bench/fwf/read.delim-base.R", "start": 11890396, "end": 11890616}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/readr-dplyr.R", "start": 11890616, "end": 11890926}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/vroom-dplyr.R", "start": 11890926, "end": 11891256}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/vroom-base.R", "start": 11891256, "end": 11891544}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/data.table-data.table.R", "start": 11891544, "end": 11891792}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/vroom_no_altrep-dplyr.R", "start": 11891792, "end": 11892136}, {"filename": "/usr/lib/R/library/vroom/bench/taxi/read.delim-base.R", "start": 11892136, "end": 11892389}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple/readr-dplyr.R", "start": 11892389, "end": 11892758}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple/vroom-dplyr.R", "start": 11892758, "end": 11893114}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple/vroom-base.R", "start": 11893114, "end": 11893440}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple/data.table-data.table.R", "start": 11893440, "end": 11893749}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_multiple/vroom_no_altrep-dplyr.R", "start": 11893749, "end": 11894106}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/readr-dplyr.R", "start": 11894106, "end": 11894356}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/vroom-dplyr.R", "start": 11894356, "end": 11894626}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/vroom-base.R", "start": 11894626, "end": 11894855}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/vroom_no_altrep-base.R", "start": 11894855, "end": 11895100}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/data.table-data.table.R", "start": 11895100, "end": 11895328}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/vroom_no_altrep-dplyr.R", "start": 11895328, "end": 11895614}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/input.R", "start": 11895614, "end": 11895876}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-long/read.delim-base.R", "start": 11895876, "end": 11896097}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/readr-dplyr.R", "start": 11896097, "end": 11896347}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/vroom-dplyr.R", "start": 11896347, "end": 11896617}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/vroom-base.R", "start": 11896617, "end": 11896846}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/vroom_no_altrep-base.R", "start": 11896846, "end": 11897091}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/data.table-data.table.R", "start": 11897091, "end": 11897319}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/vroom_no_altrep-dplyr.R", "start": 11897319, "end": 11897605}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/input.R", "start": 11897605, "end": 11897867}, {"filename": "/usr/lib/R/library/vroom/bench/all_numeric-wide/read.delim-base.R", "start": 11897867, "end": 11898088}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/base-multithreaded_gzip.R", "start": 11898088, "end": 11898377}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/base-gzip.R", "start": 11898377, "end": 11898646}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/vroom-zstandard.R", "start": 11898646, "end": 11898866}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/vroom-uncompressed.R", "start": 11898866, "end": 11899058}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/base-uncompressed.R", "start": 11899058, "end": 11899282}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/base-zstandard.R", "start": 11899282, "end": 11899572}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/vroom-gzip.R", "start": 11899572, "end": 11899763}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/data.table-multithreaded_gzip.R", "start": 11899763, "end": 11899959}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/data.table-uncompressed.R", "start": 11899959, "end": 11900156}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/readr-multithreaded_gzip.R", "start": 11900156, "end": 11900366}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/readr-uncompressed.R", "start": 11900366, "end": 11900549}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/readr-gzip.R", "start": 11900549, "end": 11900731}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/data.table-gzip.R", "start": 11900731, "end": 11900940}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/readr-zstandard.R", "start": 11900940, "end": 11901151}, {"filename": "/usr/lib/R/library/vroom/bench/taxi_writing/vroom-multithreaded_gzip.R", "start": 11901151, "end": 11901370}, {"filename": "/usr/lib/R/library/vroom/help/vroom.rdb", "start": 11901370, "end": 11971232}, {"filename": "/usr/lib/R/library/vroom/help/AnIndex", "start": 11971232, "end": 11972609}, {"filename": "/usr/lib/R/library/vroom/help/aliases.rds", "start": 11972609, "end": 11973195}, {"filename": "/usr/lib/R/library/vroom/help/paths.rds", "start": 11973195, "end": 11973524}, {"filename": "/usr/lib/R/library/vroom/help/vroom.rdx", "start": 11973524, "end": 11974200}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-deprecated.svg", "start": 11974200, "end": 11975170}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-retired.svg", "start": 11975170, "end": 11976135}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-questioning.svg", "start": 11976135, "end": 11977107}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-soft-deprecated.svg", "start": 11977107, "end": 11978089}, {"filename": "/usr/lib/R/library/vroom/help/figures/logo.png", "start": 11978089, "end": 12000802}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-experimental.svg", "start": 12000802, "end": 12001776}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-stable.svg", "start": 12001776, "end": 12002732}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-maturing.svg", "start": 12002732, "end": 12003698}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-archived.svg", "start": 12003698, "end": 12004665}, {"filename": "/usr/lib/R/library/vroom/help/figures/lifecycle-defunct.svg", "start": 12004665, "end": 12005629}], "remote_package_size": 12005629, "package_uuid": "e29bca8f-437b-48c8-b763-2ec4f7c2489d"});
  
  })();
  