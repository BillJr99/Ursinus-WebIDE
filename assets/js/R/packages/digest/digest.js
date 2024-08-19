
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
      var PACKAGE_NAME = '../dist/digest/digest.data';
      var REMOTE_PACKAGE_BASE = 'digest.data';
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
Module['FS_createPath']("/usr/lib/R/library", "digest", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "demo", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "tinytest", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/digest", "help", true, true);

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
                Module['removeRunDependency']('datafile_../dist/digest/digest.data');

      };
      Module['addRunDependency']('datafile_../dist/digest/digest.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/digest/NAMESPACE", "start": 0, "end": 1074}, {"filename": "/usr/lib/R/library/digest/DESCRIPTION", "start": 1074, "end": 2645}, {"filename": "/usr/lib/R/library/digest/INDEX", "start": 2645, "end": 3176}, {"filename": "/usr/lib/R/library/digest/GPL-2", "start": 3176, "end": 21268}, {"filename": "/usr/lib/R/library/digest/html/00Index.html", "start": 21268, "end": 26669}, {"filename": "/usr/lib/R/library/digest/html/R.css", "start": 26669, "end": 28004}, {"filename": "/usr/lib/R/library/digest/include/pmurhashAPI.h", "start": 28004, "end": 31169}, {"filename": "/usr/lib/R/library/digest/R/digest", "start": 31169, "end": 32227}, {"filename": "/usr/lib/R/library/digest/R/digest.rdx", "start": 32227, "end": 33265}, {"filename": "/usr/lib/R/library/digest/R/digest.rdb", "start": 33265, "end": 50868}, {"filename": "/usr/lib/R/library/digest/doc/sha1.html", "start": 50868, "end": 118817}, {"filename": "/usr/lib/R/library/digest/doc/sha1.md", "start": 118817, "end": 126116}, {"filename": "/usr/lib/R/library/digest/doc/index.html", "start": 126116, "end": 127550}, {"filename": "/usr/lib/R/library/digest/doc/sha1.R", "start": 127550, "end": 130358}, {"filename": "/usr/lib/R/library/digest/Meta/demo.rds", "start": 130358, "end": 130501}, {"filename": "/usr/lib/R/library/digest/Meta/features.rds", "start": 130501, "end": 130633}, {"filename": "/usr/lib/R/library/digest/Meta/package.rds", "start": 130633, "end": 131999}, {"filename": "/usr/lib/R/library/digest/Meta/links.rds", "start": 131999, "end": 132410}, {"filename": "/usr/lib/R/library/digest/Meta/nsInfo.rds", "start": 132410, "end": 133028}, {"filename": "/usr/lib/R/library/digest/Meta/Rd.rds", "start": 133028, "end": 133710}, {"filename": "/usr/lib/R/library/digest/Meta/hsearch.rds", "start": 133710, "end": 134410}, {"filename": "/usr/lib/R/library/digest/Meta/vignette.rds", "start": 134410, "end": 134620}, {"filename": "/usr/lib/R/library/digest/demo/vectorised.R", "start": 134620, "end": 135538}, {"filename": "/usr/lib/R/library/digest/tinytest/test_encoding.R", "start": 135538, "end": 136283}, {"filename": "/usr/lib/R/library/digest/tinytest/test_aes.R", "start": 136283, "end": 141034}, {"filename": "/usr/lib/R/library/digest/tinytest/test_digest.R", "start": 141034, "end": 150837}, {"filename": "/usr/lib/R/library/digest/tinytest/test_sha1.R", "start": 150837, "end": 164434}, {"filename": "/usr/lib/R/library/digest/tinytest/test_raw.R", "start": 164434, "end": 165126}, {"filename": "/usr/lib/R/library/digest/tinytest/test_digest2int.R", "start": 165126, "end": 165661}, {"filename": "/usr/lib/R/library/digest/tinytest/test_blake3.R", "start": 165661, "end": 167221}, {"filename": "/usr/lib/R/library/digest/tinytest/test_crc32.R", "start": 167221, "end": 167770}, {"filename": "/usr/lib/R/library/digest/tinytest/test_new_matrix_behaviour.R", "start": 167770, "end": 171319}, {"filename": "/usr/lib/R/library/digest/tinytest/test_num2hex.R", "start": 171319, "end": 172983}, {"filename": "/usr/lib/R/library/digest/tinytest/test_hmac.R", "start": 172983, "end": 176636}, {"filename": "/usr/lib/R/library/digest/tinytest/test_misc.R", "start": 176636, "end": 178821}, {"filename": "/usr/lib/R/library/digest/libs/digest.so", "start": 178821, "end": 729658}, {"filename": "/usr/lib/R/library/digest/help/digest.rdx", "start": 729658, "end": 729969}, {"filename": "/usr/lib/R/library/digest/help/AnIndex", "start": 729969, "end": 730572}, {"filename": "/usr/lib/R/library/digest/help/digest.rdb", "start": 730572, "end": 766671}, {"filename": "/usr/lib/R/library/digest/help/aliases.rds", "start": 766671, "end": 767012}, {"filename": "/usr/lib/R/library/digest/help/paths.rds", "start": 767012, "end": 767190}], "remote_package_size": 767190, "package_uuid": "0a1271d9-7da4-48a8-9d7c-36683574e285"});
  
  })();
  