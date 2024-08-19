
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
      var PACKAGE_NAME = '../../dist/mario/mario.data';
      var REMOTE_PACKAGE_BASE = 'mario.data';
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
Module['FS_createPath']("/usr/lib/R/library", "mario", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario", "test", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test", "scratch", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test", "pg-dump_2021-11-05", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "across-stuff", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "data-pronouns", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "other-verbs", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "nonpipe-expressions", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "groupby-most-important", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "slice-variants", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test/pg-dump_2021-11-05", "tibble-bugs", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test", "correct", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario/test", "code", true, true);
Module['FS_createPath']("/usr/lib/R/library/mario", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/mario/mario.data');

      };
      Module['addRunDependency']('datafile_../../dist/mario/mario.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/mario/NAMESPACE", "start": 0, "end": 1796}, {"filename": "/usr/lib/R/library/mario/LICENSE", "start": 1796, "end": 1839}, {"filename": "/usr/lib/R/library/mario/DESCRIPTION", "start": 1839, "end": 2487}, {"filename": "/usr/lib/R/library/mario/INDEX", "start": 2487, "end": 3351}, {"filename": "/usr/lib/R/library/mario/html/00Index.html", "start": 3351, "end": 5939}, {"filename": "/usr/lib/R/library/mario/html/R.css", "start": 5939, "end": 7274}, {"filename": "/usr/lib/R/library/mario/R/mario", "start": 7274, "end": 8332}, {"filename": "/usr/lib/R/library/mario/R/mario.rdx", "start": 8332, "end": 9317}, {"filename": "/usr/lib/R/library/mario/R/mario.rdb", "start": 9317, "end": 29324}, {"filename": "/usr/lib/R/library/mario/Meta/features.rds", "start": 29324, "end": 29456}, {"filename": "/usr/lib/R/library/mario/Meta/package.rds", "start": 29456, "end": 30379}, {"filename": "/usr/lib/R/library/mario/Meta/links.rds", "start": 30379, "end": 30660}, {"filename": "/usr/lib/R/library/mario/Meta/nsInfo.rds", "start": 30660, "end": 31435}, {"filename": "/usr/lib/R/library/mario/Meta/Rd.rds", "start": 31435, "end": 32078}, {"filename": "/usr/lib/R/library/mario/Meta/hsearch.rds", "start": 32078, "end": 32707}, {"filename": "/usr/lib/R/library/mario/test/test.md", "start": 32707, "end": 33198}, {"filename": "/usr/lib/R/library/mario/test/test.Rmd", "start": 33198, "end": 33525}, {"filename": "/usr/lib/R/library/mario/test/scratch/summ_vis.R", "start": 33525, "end": 35211}, {"filename": "/usr/lib/R/library/mario/test/scratch/parse-everything.R", "start": 35211, "end": 35663}, {"filename": "/usr/lib/R/library/mario/test/scratch/summarize-template.txt", "start": 35663, "end": 36286}, {"filename": "/usr/lib/R/library/mario/test/scratch/summarize-big.R", "start": 36286, "end": 36760}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/across-stuff/arrange-across.txt", "start": 36760, "end": 36984}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/across-stuff/mutate-across.txt", "start": 36984, "end": 37227}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/across-stuff/arrange-across-2.txt", "start": 37227, "end": 37457}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/data-pronouns/filter-data-pronoun.txt", "start": 37457, "end": 37784}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/data-pronouns/mutate-data-pronoun.txt", "start": 37784, "end": 38072}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/summarise-single.txt", "start": 38072, "end": 38318}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/count-1.txt", "start": 38318, "end": 38431}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/rename_with-simple.txt", "start": 38431, "end": 38671}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/pivot_longer-1.txt", "start": 38671, "end": 38818}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/rename_with-complex.txt", "start": 38818, "end": 39268}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/mutate-to-delete-columns.txt", "start": 39268, "end": 39547}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/transmute-1.txt", "start": 39547, "end": 39676}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/rename_with-complex-2.txt", "start": 39676, "end": 40140}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/rowwise-1.txt", "start": 40140, "end": 40291}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/other-verbs/pivot_longer-2.txt", "start": 40291, "end": 40455}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/tibble-create-2.txt", "start": 40455, "end": 40659}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/arrange-nonpipe-2.txt", "start": 40659, "end": 40909}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/tibble-create-1.txt", "start": 40909, "end": 41140}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/filter-two-conditions-nonpipe.txt", "start": 41140, "end": 41287}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/filter-nonpipe.txt", "start": 41287, "end": 41411}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/arrange-nonpipe-1.txt", "start": 41411, "end": 41654}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/nonpipe-expressions/starwars-solo.txt", "start": 41654, "end": 41884}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/summarise-groupby.txt", "start": 41884, "end": 42064}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/arrange-and-groupby.txt", "start": 42064, "end": 42231}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/groupby-summarise-arrange.txt", "start": 42231, "end": 42433}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/mutate-and-groupby-2.txt", "start": 42433, "end": 42662}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/mutate-and-groupby.txt", "start": 42662, "end": 42855}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/arrange-and-groupby-2.txt", "start": 42855, "end": 43072}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/summarise-groupby-multi-value.txt", "start": 43072, "end": 43304}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/groupby-summarise-filter.txt", "start": 43304, "end": 43520}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/groupby-most-important/filter-and-groupby.txt", "start": 43520, "end": 43730}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_head.txt", "start": 43730, "end": 43824}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_sample-2.txt", "start": 43824, "end": 44011}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_max.txt", "start": 44011, "end": 44164}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_min.txt", "start": 44164, "end": 44317}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_tail.txt", "start": 44317, "end": 44411}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/slice-variants/slice_sample.txt", "start": 44411, "end": 44582}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/tibble-bugs/tibble-create-select-2.txt", "start": 44582, "end": 44807}, {"filename": "/usr/lib/R/library/mario/test/pg-dump_2021-11-05/tibble-bugs/tibble-create-select-1.txt", "start": 44807, "end": 45059}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-1.json", "start": 45059, "end": 48477}, {"filename": "/usr/lib/R/library/mario/test/correct/error-parse.json", "start": 48477, "end": 48845}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-none.json", "start": 48845, "end": 50604}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-from-value-1.json", "start": 50604, "end": 55354}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-add-group.json", "start": 55354, "end": 65062}, {"filename": "/usr/lib/R/library/mario/test/correct/slice-1.json", "start": 65062, "end": 66999}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-arrange-1.json", "start": 66999, "end": 73925}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-4.json", "start": 73925, "end": 75113}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-arrange-2.json", "start": 75113, "end": 82075}, {"filename": "/usr/lib/R/library/mario/test/correct/slice-4.json", "start": 82075, "end": 84024}, {"filename": "/usr/lib/R/library/mario/test/correct/error-big-object.json", "start": 84024, "end": 84441}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-7.json", "start": 84441, "end": 86311}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-in-place-1.json", "start": 86311, "end": 88757}, {"filename": "/usr/lib/R/library/mario/test/correct/error-3.json", "start": 88757, "end": 89763}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-1.json", "start": 89763, "end": 98935}, {"filename": "/usr/lib/R/library/mario/test/correct/slice-3.json", "start": 98935, "end": 101118}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-select-1.json", "start": 101118, "end": 106455}, {"filename": "/usr/lib/R/library/mario/test/correct/rename-1.json", "start": 106455, "end": 108618}, {"filename": "/usr/lib/R/library/mario/test/correct/rename-3.json", "start": 108618, "end": 110595}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-chained-1.json", "start": 110595, "end": 113011}, {"filename": "/usr/lib/R/library/mario/test/correct/arrange-1.json", "start": 113011, "end": 116049}, {"filename": "/usr/lib/R/library/mario/test/correct/error-missing-library.json", "start": 116049, "end": 116431}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-mutate-3.json", "start": 116431, "end": 121220}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-3.json", "start": 121220, "end": 125037}, {"filename": "/usr/lib/R/library/mario/test/correct/unknown-1.json", "start": 125037, "end": 128015}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-rename-3.json", "start": 128015, "end": 133397}, {"filename": "/usr/lib/R/library/mario/test/correct/filter-arrow-assignment.json", "start": 133397, "end": 135492}, {"filename": "/usr/lib/R/library/mario/test/correct/rename-2.json", "start": 135492, "end": 137209}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-6.json", "start": 137209, "end": 139255}, {"filename": "/usr/lib/R/library/mario/test/correct/slice-2.json", "start": 139255, "end": 152364}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-big.json", "start": 152364, "end": 158087}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-select-drop.json", "start": 158087, "end": 163251}, {"filename": "/usr/lib/R/library/mario/test/correct/select-rename.json", "start": 163251, "end": 165309}, {"filename": "/usr/lib/R/library/mario/test/correct/rename-4.json", "start": 165309, "end": 167007}, {"filename": "/usr/lib/R/library/mario/test/correct/ungroup-4.json", "start": 167007, "end": 175042}, {"filename": "/usr/lib/R/library/mario/test/correct/filter-1.json", "start": 175042, "end": 177136}, {"filename": "/usr/lib/R/library/mario/test/correct/error-1.json", "start": 177136, "end": 178246}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-slice-1.json", "start": 178246, "end": 183009}, {"filename": "/usr/lib/R/library/mario/test/correct/ggplot-1.json", "start": 183009, "end": 219044}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-6.json", "start": 219044, "end": 229723}, {"filename": "/usr/lib/R/library/mario/test/correct/select-2.json", "start": 229723, "end": 231236}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-rename-1.json", "start": 231236, "end": 236392}, {"filename": "/usr/lib/R/library/mario/test/correct/error-2.json", "start": 236392, "end": 242569}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-11.json", "start": 242569, "end": 245219}, {"filename": "/usr/lib/R/library/mario/test/correct/arrange-2.json", "start": 245219, "end": 248417}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-filter-1.json", "start": 248417, "end": 253989}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-5.json", "start": 253989, "end": 257516}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-2.json", "start": 257516, "end": 268427}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-3.json", "start": 268427, "end": 270893}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-4.json", "start": 270893, "end": 273491}, {"filename": "/usr/lib/R/library/mario/test/correct/ungroup-2.json", "start": 273491, "end": 280985}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-2.json", "start": 280985, "end": 284601}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-1.json", "start": 284601, "end": 287074}, {"filename": "/usr/lib/R/library/mario/test/correct/error-only-comments.json", "start": 287074, "end": 288113}, {"filename": "/usr/lib/R/library/mario/test/correct/filter-equal-assignment.json", "start": 288113, "end": 289871}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-change-group.json", "start": 289871, "end": 298830}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-9.json", "start": 298830, "end": 301898}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-2.json", "start": 301898, "end": 306476}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-4.json", "start": 306476, "end": 315641}, {"filename": "/usr/lib/R/library/mario/test/correct/ungroup-3.json", "start": 315641, "end": 324786}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-rename-2.json", "start": 324786, "end": 329903}, {"filename": "/usr/lib/R/library/mario/test/correct/rename-5.json", "start": 329903, "end": 331718}, {"filename": "/usr/lib/R/library/mario/test/correct/filter-tibble.json", "start": 331718, "end": 333078}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-mutate-2.json", "start": 333078, "end": 339480}, {"filename": "/usr/lib/R/library/mario/test/correct/group-by-mutate-1.json", "start": 339480, "end": 344715}, {"filename": "/usr/lib/R/library/mario/test/correct/select-3.json", "start": 344715, "end": 349368}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-8.json", "start": 349368, "end": 351288}, {"filename": "/usr/lib/R/library/mario/test/correct/filter-arrange-slice.json", "start": 351288, "end": 356088}, {"filename": "/usr/lib/R/library/mario/test/correct/ungroup-1.json", "start": 356088, "end": 362606}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-12.json", "start": 362606, "end": 365381}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-10.json", "start": 365381, "end": 367215}, {"filename": "/usr/lib/R/library/mario/test/correct/arrange-assign-t.json", "start": 367215, "end": 369184}, {"filename": "/usr/lib/R/library/mario/test/correct/error-blank-file.json", "start": 369184, "end": 369449}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-3.json", "start": 369449, "end": 380327}, {"filename": "/usr/lib/R/library/mario/test/correct/error-no-pipe.json", "start": 380327, "end": 380662}, {"filename": "/usr/lib/R/library/mario/test/correct/mutate-null.json", "start": 380662, "end": 382933}, {"filename": "/usr/lib/R/library/mario/test/correct/summarize-5.json", "start": 382933, "end": 387557}, {"filename": "/usr/lib/R/library/mario/test/correct/select-1.json", "start": 387557, "end": 389094}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-2.R", "start": 389094, "end": 389253}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-mutate-2.R", "start": 389253, "end": 389427}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-none.R", "start": 389427, "end": 389575}, {"filename": "/usr/lib/R/library/mario/test/code/error-missing-library.R", "start": 389575, "end": 389668}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-select-drop.R", "start": 389668, "end": 389837}, {"filename": "/usr/lib/R/library/mario/test/code/arrange-1.R", "start": 389837, "end": 389879}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-filter-1.R", "start": 389879, "end": 390470}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-big.R", "start": 390470, "end": 391147}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-10.R", "start": 391147, "end": 391192}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-mutate-3.R", "start": 391192, "end": 391331}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-7.R", "start": 391331, "end": 391380}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-rename-3.R", "start": 391380, "end": 391536}, {"filename": "/usr/lib/R/library/mario/test/code/ungroup-4.R", "start": 391536, "end": 391705}, {"filename": "/usr/lib/R/library/mario/test/code/filter-arrange-slice.R", "start": 391705, "end": 391802}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-4.R", "start": 391802, "end": 392009}, {"filename": "/usr/lib/R/library/mario/test/code/select-2.R", "start": 392009, "end": 392060}, {"filename": "/usr/lib/R/library/mario/test/code/rename-4.R", "start": 392060, "end": 392116}, {"filename": "/usr/lib/R/library/mario/test/code/error-blank-file.R", "start": 392116, "end": 392116}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-from-value-1.R", "start": 392116, "end": 392212}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-arrange-2.R", "start": 392212, "end": 392825}, {"filename": "/usr/lib/R/library/mario/test/code/select-rename.R", "start": 392825, "end": 392896}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-in-place-1.R", "start": 392896, "end": 392976}, {"filename": "/usr/lib/R/library/mario/test/code/ungroup-1.R", "start": 392976, "end": 393143}, {"filename": "/usr/lib/R/library/mario/test/code/error-3.R", "start": 393143, "end": 393186}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-5.R", "start": 393186, "end": 393286}, {"filename": "/usr/lib/R/library/mario/test/code/slice-1.R", "start": 393286, "end": 393332}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-3.R", "start": 393332, "end": 393552}, {"filename": "/usr/lib/R/library/mario/test/code/error-1.R", "start": 393552, "end": 393600}, {"filename": "/usr/lib/R/library/mario/test/code/rename-5.R", "start": 393600, "end": 393676}, {"filename": "/usr/lib/R/library/mario/test/code/rename-1.R", "start": 393676, "end": 393767}, {"filename": "/usr/lib/R/library/mario/test/code/rename-3.R", "start": 393767, "end": 393836}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-5.R", "start": 393836, "end": 394052}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-change-group.R", "start": 394052, "end": 394271}, {"filename": "/usr/lib/R/library/mario/test/code/error-only-comments.R", "start": 394271, "end": 395026}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-select-1.R", "start": 395026, "end": 395203}, {"filename": "/usr/lib/R/library/mario/test/code/arrange-assign-t.R", "start": 395203, "end": 395288}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-1.R", "start": 395288, "end": 395439}, {"filename": "/usr/lib/R/library/mario/test/code/error-2.R", "start": 395439, "end": 395562}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-6.R", "start": 395562, "end": 395812}, {"filename": "/usr/lib/R/library/mario/test/code/filter-1.R", "start": 395812, "end": 395868}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-rename-1.R", "start": 395868, "end": 396020}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-rename-2.R", "start": 396020, "end": 396165}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-11.R", "start": 396165, "end": 396239}, {"filename": "/usr/lib/R/library/mario/test/code/filter-equal-assignment.R", "start": 396239, "end": 396297}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-1.R", "start": 396297, "end": 396387}, {"filename": "/usr/lib/R/library/mario/test/code/select-1.R", "start": 396387, "end": 396437}, {"filename": "/usr/lib/R/library/mario/test/code/ungroup-2.R", "start": 396437, "end": 396608}, {"filename": "/usr/lib/R/library/mario/test/code/slice-4.R", "start": 396608, "end": 396660}, {"filename": "/usr/lib/R/library/mario/test/code/filter-arrow-assignment.R", "start": 396660, "end": 396719}, {"filename": "/usr/lib/R/library/mario/test/code/ggplot-1.R", "start": 396719, "end": 396872}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-9.R", "start": 396872, "end": 396953}, {"filename": "/usr/lib/R/library/mario/test/code/slice-3.R", "start": 396953, "end": 397083}, {"filename": "/usr/lib/R/library/mario/test/code/rename-2.R", "start": 397083, "end": 397138}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-3.R", "start": 397138, "end": 397232}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-12.R", "start": 397232, "end": 397376}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-8.R", "start": 397376, "end": 397450}, {"filename": "/usr/lib/R/library/mario/test/code/unknown-1.R", "start": 397450, "end": 397514}, {"filename": "/usr/lib/R/library/mario/test/code/arrange-2.R", "start": 397514, "end": 397568}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-slice-1.R", "start": 397568, "end": 397734}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-arrange-1.R", "start": 397734, "end": 398329}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-null.R", "start": 398329, "end": 398405}, {"filename": "/usr/lib/R/library/mario/test/code/select-3.R", "start": 398405, "end": 398550}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-3.R", "start": 398550, "end": 398730}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-4.R", "start": 398730, "end": 398806}, {"filename": "/usr/lib/R/library/mario/test/code/error-no-pipe.R", "start": 398806, "end": 398864}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-mutate-1.R", "start": 398864, "end": 399010}, {"filename": "/usr/lib/R/library/mario/test/code/slice-2.R", "start": 399010, "end": 399089}, {"filename": "/usr/lib/R/library/mario/test/code/ungroup-3.R", "start": 399089, "end": 399262}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-1.R", "start": 399262, "end": 399478}, {"filename": "/usr/lib/R/library/mario/test/code/error-parse.R", "start": 399478, "end": 399522}, {"filename": "/usr/lib/R/library/mario/test/code/summarize-2.R", "start": 399522, "end": 399758}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-6.R", "start": 399758, "end": 399913}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-4.R", "start": 399913, "end": 400004}, {"filename": "/usr/lib/R/library/mario/test/code/error-big-object.R", "start": 400004, "end": 400067}, {"filename": "/usr/lib/R/library/mario/test/code/filter-tibble.R", "start": 400067, "end": 400144}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-add-group.R", "start": 400144, "end": 400376}, {"filename": "/usr/lib/R/library/mario/test/code/group-by-2.R", "start": 400376, "end": 400580}, {"filename": "/usr/lib/R/library/mario/test/code/mutate-chained-1.R", "start": 400580, "end": 400661}, {"filename": "/usr/lib/R/library/mario/help/AnIndex", "start": 400661, "end": 400966}, {"filename": "/usr/lib/R/library/mario/help/aliases.rds", "start": 400966, "end": 401164}, {"filename": "/usr/lib/R/library/mario/help/mario.rdx", "start": 401164, "end": 401588}, {"filename": "/usr/lib/R/library/mario/help/paths.rds", "start": 401588, "end": 401827}, {"filename": "/usr/lib/R/library/mario/help/mario.rdb", "start": 401827, "end": 414839}], "remote_package_size": 414839, "package_uuid": "4765feb3-806a-4b3e-95f1-1121fab35a38"});
  
  })();
  