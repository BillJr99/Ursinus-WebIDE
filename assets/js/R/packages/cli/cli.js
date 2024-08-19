
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
      var PACKAGE_NAME = '../../dist/cli/cli.data';
      var REMOTE_PACKAGE_BASE = 'cli.data';
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
Module['FS_createPath']("/usr/lib/R/library", "cli", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "include", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/include", "cli", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "scripts", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "shiny", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/shiny", "nested", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/shiny", "format", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/shiny", "output", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/shiny", "along", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/shiny", "simple", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "examples", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/examples", "apps", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli", "help", true, true);
Module['FS_createPath']("/usr/lib/R/library/cli/help", "figures", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/cli/cli.data');

      };
      Module['addRunDependency']('datafile_../../dist/cli/cli.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/cli/NAMESPACE", "start": 0, "end": 5389}, {"filename": "/usr/lib/R/library/cli/logo.txt", "start": 5389, "end": 8131}, {"filename": "/usr/lib/R/library/cli/NEWS.md", "start": 8131, "end": 19348}, {"filename": "/usr/lib/R/library/cli/LICENSE", "start": 19348, "end": 19389}, {"filename": "/usr/lib/R/library/cli/DESCRIPTION", "start": 19389, "end": 21046}, {"filename": "/usr/lib/R/library/cli/INDEX", "start": 21046, "end": 27309}, {"filename": "/usr/lib/R/library/cli/html/00Index.html", "start": 27309, "end": 60025}, {"filename": "/usr/lib/R/library/cli/html/R.css", "start": 60025, "end": 61360}, {"filename": "/usr/lib/R/library/cli/include/cli/progress.h", "start": 61360, "end": 73108}, {"filename": "/usr/lib/R/library/cli/R/sysdata.rdx", "start": 73108, "end": 73370}, {"filename": "/usr/lib/R/library/cli/R/cli.rdb", "start": 73370, "end": 293123}, {"filename": "/usr/lib/R/library/cli/R/sysdata.rdb", "start": 293123, "end": 432438}, {"filename": "/usr/lib/R/library/cli/R/cli", "start": 432438, "end": 433496}, {"filename": "/usr/lib/R/library/cli/R/cli.rdx", "start": 433496, "end": 441057}, {"filename": "/usr/lib/R/library/cli/scripts/news.R", "start": 441057, "end": 444044}, {"filename": "/usr/lib/R/library/cli/scripts/outdated.R", "start": 444044, "end": 446077}, {"filename": "/usr/lib/R/library/cli/scripts/search.R", "start": 446077, "end": 448148}, {"filename": "/usr/lib/R/library/cli/scripts/up.R", "start": 448148, "end": 449676}, {"filename": "/usr/lib/R/library/cli/shiny/nested/app.R", "start": 449676, "end": 451370}, {"filename": "/usr/lib/R/library/cli/shiny/format/app.R", "start": 451370, "end": 452765}, {"filename": "/usr/lib/R/library/cli/shiny/output/app.R", "start": 452765, "end": 454180}, {"filename": "/usr/lib/R/library/cli/shiny/along/app.R", "start": 454180, "end": 455524}, {"filename": "/usr/lib/R/library/cli/shiny/simple/app.R", "start": 455524, "end": 456881}, {"filename": "/usr/lib/R/library/cli/Meta/features.rds", "start": 456881, "end": 457013}, {"filename": "/usr/lib/R/library/cli/Meta/package.rds", "start": 457013, "end": 458603}, {"filename": "/usr/lib/R/library/cli/Meta/links.rds", "start": 458603, "end": 460972}, {"filename": "/usr/lib/R/library/cli/Meta/nsInfo.rds", "start": 460972, "end": 462749}, {"filename": "/usr/lib/R/library/cli/Meta/Rd.rds", "start": 462749, "end": 467375}, {"filename": "/usr/lib/R/library/cli/Meta/hsearch.rds", "start": 467375, "end": 471603}, {"filename": "/usr/lib/R/library/cli/examples/apps/news.R", "start": 471603, "end": 474590}, {"filename": "/usr/lib/R/library/cli/examples/apps/outdated.R", "start": 474590, "end": 476662}, {"filename": "/usr/lib/R/library/cli/examples/apps/search.R", "start": 476662, "end": 478736}, {"filename": "/usr/lib/R/library/cli/examples/apps/up.R", "start": 478736, "end": 480270}, {"filename": "/usr/lib/R/library/cli/libs/cli.so", "start": 480270, "end": 615961}, {"filename": "/usr/lib/R/library/cli/help/AnIndex", "start": 615961, "end": 622835}, {"filename": "/usr/lib/R/library/cli/help/cli.rdb", "start": 622835, "end": 963616}, {"filename": "/usr/lib/R/library/cli/help/aliases.rds", "start": 963616, "end": 965505}, {"filename": "/usr/lib/R/library/cli/help/paths.rds", "start": 965505, "end": 966493}, {"filename": "/usr/lib/R/library/cli/help/cli.rdx", "start": 966493, "end": 968979}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-collapse.svg", "start": 968979, "end": 970744}, {"filename": "/usr/lib/R/library/cli/help/figures/unnamed-chunk-1.svg", "start": 970744, "end": 971669}, {"filename": "/usr/lib/R/library/cli/help/figures/cnt-auto-close.svg", "start": 971669, "end": 973187}, {"filename": "/usr/lib/R/library/cli/help/figures/ansi-column.svg", "start": 973187, "end": 976070}, {"filename": "/usr/lib/R/library/cli/help/figures/spark-line.svg", "start": 976070, "end": 977089}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-ol-3.svg", "start": 977089, "end": 978547}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-timestamp.svg", "start": 978547, "end": 979683}, {"filename": "/usr/lib/R/library/cli/help/figures/alert-info.svg", "start": 979683, "end": 981055}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-ol-2.svg", "start": 981055, "end": 982330}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-cli.svg", "start": 982330, "end": 984209}, {"filename": "/usr/lib/R/library/cli/help/figures/cnt-theme.svg", "start": 984209, "end": 985321}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-vec-2.svg", "start": 985321, "end": 986616}, {"filename": "/usr/lib/R/library/cli/help/figures/alert-wrap.svg", "start": 986616, "end": 990676}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-elapsed.svg", "start": 990676, "end": 991888}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-glue-style.svg", "start": 991888, "end": 993369}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-div.svg", "start": 993369, "end": 994481}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-style.svg", "start": 994481, "end": 998121}, {"filename": "/usr/lib/R/library/cli/help/figures/cnt-debug.svg", "start": 998121, "end": 999658}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-ul-2.svg", "start": 999658, "end": 1000936}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-h1.svg", "start": 1000936, "end": 1002839}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-end-debug.svg", "start": 1002839, "end": 1004403}, {"filename": "/usr/lib/R/library/cli/help/figures/tree-colored.svg", "start": 1004403, "end": 1009404}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-format-num.svg", "start": 1009404, "end": 1011047}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-examples.svg", "start": 1011047, "end": 1015587}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-custom-line.svg", "start": 1015587, "end": 1016769}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-step-dynamic.svg", "start": 1016769, "end": 1040025}, {"filename": "/usr/lib/R/library/cli/help/figures/ansi-align.svg", "start": 1040025, "end": 1042028}, {"filename": "/usr/lib/R/library/cli/help/figures/demo-spinners.svg", "start": 1042028, "end": 1047415}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-current-bytes.svg", "start": 1047415, "end": 1048625}, {"filename": "/usr/lib/R/library/cli/help/figures/get-spinner.svg", "start": 1048625, "end": 1072565}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-format-default.svg", "start": 1072565, "end": 1073933}, {"filename": "/usr/lib/R/library/cli/help/figures/box-padding.svg", "start": 1073933, "end": 1076153}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-natotal.svg", "start": 1076153, "end": 1095988}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-left-label.svg", "start": 1095988, "end": 1097279}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-along-1.svg", "start": 1097279, "end": 1118399}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-format.svg", "start": 1118399, "end": 1123978}, {"filename": "/usr/lib/R/library/cli/help/figures/box-text-color.svg", "start": 1123978, "end": 1125602}, {"filename": "/usr/lib/R/library/cli/help/figures/make-spinner-custom.svg", "start": 1125602, "end": 1130790}, {"filename": "/usr/lib/R/library/cli/help/figures/box-label-align.svg", "start": 1130790, "end": 1133630}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-plural.svg", "start": 1133630, "end": 1135656}, {"filename": "/usr/lib/R/library/cli/help/figures/box-default.svg", "start": 1135656, "end": 1137193}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-text-2.svg", "start": 1137193, "end": 1138394}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-id.svg", "start": 1138394, "end": 1139703}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-colored-line.svg", "start": 1139703, "end": 1141064}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-custom-line-3.svg", "start": 1141064, "end": 1142497}, {"filename": "/usr/lib/R/library/cli/help/figures/alert-warning.svg", "start": 1142497, "end": 1143969}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-newline.svg", "start": 1143969, "end": 1145154}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-eta-str.svg", "start": 1145154, "end": 1146465}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-collapse-2.svg", "start": 1146465, "end": 1147921}, {"filename": "/usr/lib/R/library/cli/help/figures/alert-success.svg", "start": 1147921, "end": 1149335}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-elapsed-raw.svg", "start": 1149335, "end": 1150547}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-markup.svg", "start": 1150547, "end": 1152028}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-custom-line-2.svg", "start": 1152028, "end": 1153251}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-status.svg", "start": 1153251, "end": 1154577}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-text.svg", "start": 1154577, "end": 1155782}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-li.svg", "start": 1155782, "end": 1157274}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-end-noid.svg", "start": 1157274, "end": 1158442}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-collapse-trunc.svg", "start": 1158442, "end": 1159830}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-bar.svg", "start": 1159830, "end": 1161093}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-escape.svg", "start": 1161093, "end": 1162683}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-end.svg", "start": 1162683, "end": 1163853}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-step-msg.svg", "start": 1163853, "end": 1171552}, {"filename": "/usr/lib/R/library/cli/help/figures/ansi-align-right.svg", "start": 1171552, "end": 1173595}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-code.svg", "start": 1173595, "end": 1175807}, {"filename": "/usr/lib/R/library/cli/help/figures/format-error.svg", "start": 1175807, "end": 1177844}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-blockquote.svg", "start": 1177844, "end": 1181496}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-output2.svg", "start": 1181496, "end": 1209167}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-eta.svg", "start": 1209167, "end": 1210478}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-newclass.svg", "start": 1210478, "end": 1211785}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-rule.svg", "start": 1211785, "end": 1213139}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-tasks.svg", "start": 1213139, "end": 1215825}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-dl.svg", "start": 1215825, "end": 1217044}, {"filename": "/usr/lib/R/library/cli/help/figures/box-border-color.svg", "start": 1217044, "end": 1219321}, {"filename": "/usr/lib/R/library/cli/help/figures/simple-theme.svg", "start": 1219321, "end": 1226288}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-rate-raw.svg", "start": 1226288, "end": 1227503}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-simple.svg", "start": 1227503, "end": 1228717}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-bars.svg", "start": 1228717, "end": 1230191}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-abort-2.svg", "start": 1230191, "end": 1232789}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-containers.svg", "start": 1232789, "end": 1234524}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-escape-2.svg", "start": 1234524, "end": 1235859}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-rule-line-type.svg", "start": 1235859, "end": 1237253}, {"filename": "/usr/lib/R/library/cli/help/figures/make-spinner-default.svg", "start": 1237253, "end": 1245349}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-ol.svg", "start": 1245349, "end": 1246565}, {"filename": "/usr/lib/R/library/cli/help/figures/box-custom.svg", "start": 1246565, "end": 1249146}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-eta-raw.svg", "start": 1249146, "end": 1250458}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-center-label.svg", "start": 1250458, "end": 1251819}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-along-3.svg", "start": 1251819, "end": 1265840}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-colored-label.svg", "start": 1265840, "end": 1267242}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-after.svg", "start": 1267242, "end": 1282046}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-format-class.svg", "start": 1282046, "end": 1283389}, {"filename": "/usr/lib/R/library/cli/help/figures/make-spinner-template.svg", "start": 1283389, "end": 1291914}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-rate-bytes.svg", "start": 1291914, "end": 1293228}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-verbatim-2.svg", "start": 1293228, "end": 1294555}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-percent.svg", "start": 1294555, "end": 1295709}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text.svg", "start": 1295709, "end": 1299334}, {"filename": "/usr/lib/R/library/cli/help/figures/tree.svg", "start": 1299334, "end": 1300630}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-vec.svg", "start": 1300630, "end": 1301968}, {"filename": "/usr/lib/R/library/cli/help/figures/spark-bar-2.svg", "start": 1301968, "end": 1302990}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-glue.svg", "start": 1302990, "end": 1304466}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-rate.svg", "start": 1304466, "end": 1305681}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-abort.svg", "start": 1305681, "end": 1308145}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-end-many.svg", "start": 1308145, "end": 1309877}, {"filename": "/usr/lib/R/library/cli/help/figures/box-float.svg", "start": 1309877, "end": 1312141}, {"filename": "/usr/lib/R/library/cli/help/figures/spark-bar-1.svg", "start": 1312141, "end": 1313163}, {"filename": "/usr/lib/R/library/cli/help/figures/rule-double.svg", "start": 1313163, "end": 1314377}, {"filename": "/usr/lib/R/library/cli/help/figures/format-error-2.svg", "start": 1314377, "end": 1316477}, {"filename": "/usr/lib/R/library/cli/help/figures/ansi-align-center.svg", "start": 1316477, "end": 1318520}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-clear.svg", "start": 1318520, "end": 1354219}, {"filename": "/usr/lib/R/library/cli/help/figures/tree-root.svg", "start": 1354219, "end": 1357589}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-message.svg", "start": 1357589, "end": 1362192}, {"filename": "/usr/lib/R/library/cli/help/figures/box-border.svg", "start": 1362192, "end": 1363729}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-ul.svg", "start": 1363729, "end": 1364948}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-verbatim.svg", "start": 1364948, "end": 1366065}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-output.svg", "start": 1366065, "end": 1393311}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-current.svg", "start": 1393311, "end": 1394474}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-bullets.svg", "start": 1394474, "end": 1396289}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-div-close.svg", "start": 1396289, "end": 1397807}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-elapsed-clock.svg", "start": 1397807, "end": 1399025}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-along-2.svg", "start": 1399025, "end": 1420384}, {"filename": "/usr/lib/R/library/cli/help/figures/spark-bar-na.svg", "start": 1420384, "end": 1421481}, {"filename": "/usr/lib/R/library/cli/help/figures/alert-danger.svg", "start": 1421481, "end": 1422964}, {"filename": "/usr/lib/R/library/cli/help/figures/builtin-theme.svg", "start": 1422964, "end": 1429818}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-step-spin.svg", "start": 1429818, "end": 1448351}, {"filename": "/usr/lib/R/library/cli/help/figures/box-lines.svg", "start": 1448351, "end": 1449905}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-step.svg", "start": 1449905, "end": 1454952}, {"filename": "/usr/lib/R/library/cli/help/figures/tree-trimming.svg", "start": 1454952, "end": 1459855}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-format-theme.svg", "start": 1459855, "end": 1461376}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-text-concat.svg", "start": 1461376, "end": 1462641}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-current.svg", "start": 1462641, "end": 1491246}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-extra.svg", "start": 1491246, "end": 1492604}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-dl-2.svg", "start": 1492604, "end": 1493882}, {"filename": "/usr/lib/R/library/cli/help/figures/cli-par.svg", "start": 1493882, "end": 1501588}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-1.svg", "start": 1501588, "end": 1531230}, {"filename": "/usr/lib/R/library/cli/help/figures/box-bg-color.svg", "start": 1531230, "end": 1533767}, {"filename": "/usr/lib/R/library/cli/help/figures/progress-var-name.svg", "start": 1533767, "end": 1535080}, {"filename": "/usr/lib/R/library/cli/help/figures/spark-bar-3.svg", "start": 1535080, "end": 1536108}, {"filename": "/usr/lib/R/library/cli/help/figures/inline-text-3.svg", "start": 1536108, "end": 1537399}, {"filename": "/usr/lib/R/library/cli/help/figures/tree-trim-mark.svg", "start": 1537399, "end": 1543108}], "remote_package_size": 1543108, "package_uuid": "41c04218-81c8-4f8a-927a-9488da8e97df"});
  
  })();
  