
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
      var PACKAGE_NAME = '../../dist/colorspace/colorspace.data';
      var REMOTE_PACKAGE_BASE = 'colorspace.data';
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
Module['FS_createPath']("/usr/lib/R/library", "colorspace", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "hclcolorpicker", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/hclcolorpicker", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/hclcolorpicker", "www", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "R", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "data", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "doc", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "Meta", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "demo", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "cvdemulator", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/cvdemulator", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/cvdemulator", "www", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/cvdemulator/www", "images", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "hclwizard", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/hclwizard", "html", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/hclwizard", "www", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace/hclwizard/www", "images", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "libs", true, true);
Module['FS_createPath']("/usr/lib/R/library/colorspace", "help", true, true);

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
                Module['removeRunDependency']('datafile_../../dist/colorspace/colorspace.data');

      };
      Module['addRunDependency']('datafile_../../dist/colorspace/colorspace.data');
    
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
   loadPackage({"files": [{"filename": "/usr/lib/R/library/colorspace/NAMESPACE", "start": 0, "end": 3820}, {"filename": "/usr/lib/R/library/colorspace/NEWS.md", "start": 3820, "end": 18475}, {"filename": "/usr/lib/R/library/colorspace/CITATION", "start": 18475, "end": 21375}, {"filename": "/usr/lib/R/library/colorspace/LICENSE", "start": 21375, "end": 21663}, {"filename": "/usr/lib/R/library/colorspace/DESCRIPTION", "start": 21663, "end": 25481}, {"filename": "/usr/lib/R/library/colorspace/INDEX", "start": 25481, "end": 29498}, {"filename": "/usr/lib/R/library/colorspace/html/00Index.html", "start": 29498, "end": 48580}, {"filename": "/usr/lib/R/library/colorspace/html/R.css", "start": 48580, "end": 49915}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/server.R", "start": 49915, "end": 79010}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/prepareStaticContent.R", "start": 79010, "end": 82654}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/ui.R", "start": 82654, "end": 89052}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/html/info.html", "start": 89052, "end": 90046}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/www/hclcolorpicker.css", "start": 90046, "end": 91048}, {"filename": "/usr/lib/R/library/colorspace/hclcolorpicker/www/hclcolorpicker_darkmode.css", "start": 91048, "end": 92858}, {"filename": "/usr/lib/R/library/colorspace/R/colorspace.rdx", "start": 92858, "end": 95470}, {"filename": "/usr/lib/R/library/colorspace/R/colorspace", "start": 95470, "end": 96528}, {"filename": "/usr/lib/R/library/colorspace/R/colorspace.rdb", "start": 96528, "end": 285074}, {"filename": "/usr/lib/R/library/colorspace/data/Rdata.rdx", "start": 285074, "end": 285265}, {"filename": "/usr/lib/R/library/colorspace/data/Rdata.rds", "start": 285265, "end": 285388}, {"filename": "/usr/lib/R/library/colorspace/data/Rdata.rdb", "start": 285388, "end": 487666}, {"filename": "/usr/lib/R/library/colorspace/doc/hcl-colors.R", "start": 487666, "end": 497764}, {"filename": "/usr/lib/R/library/colorspace/doc/index.html", "start": 497764, "end": 499807}, {"filename": "/usr/lib/R/library/colorspace/doc/colorspace.Rmd", "start": 499807, "end": 512510}, {"filename": "/usr/lib/R/library/colorspace/doc/hcl-colors.pdf", "start": 512510, "end": 711945}, {"filename": "/usr/lib/R/library/colorspace/doc/colorspace.R", "start": 711945, "end": 715961}, {"filename": "/usr/lib/R/library/colorspace/doc/colorspace.html", "start": 715961, "end": 2511684}, {"filename": "/usr/lib/R/library/colorspace/doc/hcl-colors.Rnw", "start": 2511684, "end": 2533067}, {"filename": "/usr/lib/R/library/colorspace/Meta/demo.rds", "start": 2533067, "end": 2533279}, {"filename": "/usr/lib/R/library/colorspace/Meta/features.rds", "start": 2533279, "end": 2533411}, {"filename": "/usr/lib/R/library/colorspace/Meta/package.rds", "start": 2533411, "end": 2535650}, {"filename": "/usr/lib/R/library/colorspace/Meta/links.rds", "start": 2535650, "end": 2536879}, {"filename": "/usr/lib/R/library/colorspace/Meta/nsInfo.rds", "start": 2536879, "end": 2538068}, {"filename": "/usr/lib/R/library/colorspace/Meta/Rd.rds", "start": 2538068, "end": 2540330}, {"filename": "/usr/lib/R/library/colorspace/Meta/hsearch.rds", "start": 2540330, "end": 2542486}, {"filename": "/usr/lib/R/library/colorspace/Meta/data.rds", "start": 2542486, "end": 2542704}, {"filename": "/usr/lib/R/library/colorspace/Meta/vignette.rds", "start": 2542704, "end": 2543140}, {"filename": "/usr/lib/R/library/colorspace/demo/brewer.R", "start": 2543140, "end": 2543686}, {"filename": "/usr/lib/R/library/colorspace/demo/viridis.R", "start": 2543686, "end": 2544210}, {"filename": "/usr/lib/R/library/colorspace/demo/carto.R", "start": 2544210, "end": 2544825}, {"filename": "/usr/lib/R/library/colorspace/demo/scico.R", "start": 2544825, "end": 2545397}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/server.R", "start": 2545397, "end": 2554033}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/prepareStaticContent.R", "start": 2554033, "end": 2557869}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/ui.R", "start": 2557869, "end": 2563509}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/html/appInfo.html", "start": 2563509, "end": 2564344}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/html/info.html", "start": 2564344, "end": 2565184}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/cvdemulator.css", "start": 2565184, "end": 2567437}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/cvdemulator_darkmode.css", "start": 2567437, "end": 2569247}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/rainbow_tritan.png", "start": 2569247, "end": 2730995}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/rainbow_orig.png", "start": 2730995, "end": 2889581}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/rainbow_protan.png", "start": 2889581, "end": 3052474}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/descimage.png", "start": 3052474, "end": 3094242}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/rainbow_deutan.png", "start": 3094242, "end": 3276293}, {"filename": "/usr/lib/R/library/colorspace/cvdemulator/www/images/rainbow_desaturate.png", "start": 3276293, "end": 3342066}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/server.R", "start": 3342066, "end": 3370589}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/prepareStaticContent.R", "start": 3370589, "end": 3376740}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/ui.R", "start": 3376740, "end": 3394022}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/python-example.html", "start": 3394022, "end": 3395527}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/colorplane.html", "start": 3395527, "end": 3395897}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/RReg.html", "start": 3395897, "end": 3396743}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/RegisterRcode.html", "start": 3396743, "end": 3397099}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/Register.html", "start": 3397099, "end": 3397571}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/python.html", "start": 3397571, "end": 3398198}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/GrADS.html", "start": 3398198, "end": 3398789}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/R.html", "start": 3398789, "end": 3399449}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/matlab.html", "start": 3399449, "end": 3399803}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/html/info.html", "start": 3399803, "end": 3415550}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/hclwizard.css", "start": 3415550, "end": 3422070}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/hclwizard_darkmode.css", "start": 3422070, "end": 3423965}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_pastel_1.png", "start": 3423965, "end": 3424081}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_sunsetdark.png", "start": 3424081, "end": 3424200}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-yellow_2.png", "start": 3424200, "end": 3424319}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purple-yellow.png", "start": 3424319, "end": 3424438}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_light_grays.png", "start": 3424438, "end": 3424557}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_orrd.png", "start": 3424557, "end": 3424676}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-red_2.png", "start": 3424676, "end": 3424795}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_bupu.png", "start": 3424795, "end": 3424914}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ylorrd.png", "start": 3424914, "end": 3425033}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_rdpu.png", "start": 3425033, "end": 3425152}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-red_3.png", "start": 3425152, "end": 3425271}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purple-blue.png", "start": 3425271, "end": 3425390}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_terrain_2.png", "start": 3425390, "end": 3425509}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_pinkyl.png", "start": 3425509, "end": 3425628}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_reds_2.png", "start": 3425628, "end": 3425747}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_topo.colors.png", "start": 3425747, "end": 3425866}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_oryel.png", "start": 3425866, "end": 3425985}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-red.png", "start": 3425985, "end": 3426104}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_inferno.png", "start": 3426104, "end": 3426223}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_teal.png", "start": 3426223, "end": 3426342}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ylgn.png", "start": 3426342, "end": 3426461}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_dynamic.png", "start": 3426461, "end": 3426577}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purd.png", "start": 3426577, "end": 3426696}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_redor.png", "start": 3426696, "end": 3426815}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-yellow_3.png", "start": 3426815, "end": 3426934}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_terrain.colors.png", "start": 3426934, "end": 3427053}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_harmonic.png", "start": 3427053, "end": 3427172}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ag_grnyl.png", "start": 3427172, "end": 3427291}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_set_3.png", "start": 3427291, "end": 3427407}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_cm.colors.png", "start": 3427407, "end": 3427526}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_burg.png", "start": 3427526, "end": 3427645}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_dark_mint.png", "start": 3427645, "end": 3427764}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ylgnbu.png", "start": 3427764, "end": 3427883}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_dark_2.png", "start": 3427883, "end": 3427999}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_tropic.png", "start": 3427999, "end": 3428118}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_magenta.png", "start": 3428118, "end": 3428237}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_bluyl.png", "start": 3428237, "end": 3428356}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_emrld.png", "start": 3428356, "end": 3428475}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_terrain.png", "start": 3428475, "end": 3428594}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blue-yellow.png", "start": 3428594, "end": 3428713}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purple-orange.png", "start": 3428713, "end": 3428832}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_plasma.png", "start": 3428832, "end": 3428951}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purples_3.png", "start": 3428951, "end": 3429070}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purpor.png", "start": 3429070, "end": 3429189}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_greens_2.png", "start": 3429189, "end": 3429308}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_dark_3.png", "start": 3429308, "end": 3429424}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_mint.png", "start": 3429424, "end": 3429543}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_gnbu.png", "start": 3429543, "end": 3429662}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_tofino.png", "start": 3429662, "end": 3429781}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_cork.png", "start": 3429781, "end": 3429900}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_tealgrn.png", "start": 3429900, "end": 3430019}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_heat.png", "start": 3430019, "end": 3430138}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_batlow.png", "start": 3430138, "end": 3430257}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_heat_2.png", "start": 3430257, "end": 3430376}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_red-blue.png", "start": 3430376, "end": 3430495}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_cyan-magenta.png", "start": 3430495, "end": 3430614}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_red-green.png", "start": 3430614, "end": 3430733}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_greens.png", "start": 3430733, "end": 3430852}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_hawaii.png", "start": 3430852, "end": 3430971}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_warm.png", "start": 3430971, "end": 3431090}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_pubu.png", "start": 3431090, "end": 3431209}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purp.png", "start": 3431209, "end": 3431328}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_oslo.png", "start": 3431328, "end": 3431447}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_set_2.png", "start": 3431447, "end": 3431563}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_viridis.png", "start": 3431563, "end": 3431682}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_cold.png", "start": 3431682, "end": 3431801}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_bpy.png", "start": 3431801, "end": 3431920}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_lisbon.png", "start": 3431920, "end": 3432039}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_rainbow.png", "start": 3432039, "end": 3432158}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purple-green.png", "start": 3432158, "end": 3432277}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_brwnyl.png", "start": 3432277, "end": 3432396}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_heat.colors.png", "start": 3432396, "end": 3432515}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_reds.png", "start": 3432515, "end": 3432634}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_reds_3.png", "start": 3432634, "end": 3432753}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_oranges.png", "start": 3432753, "end": 3432872}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blues_2.png", "start": 3432872, "end": 3432991}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_lajolla.png", "start": 3432991, "end": 3433110}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_turku.png", "start": 3433110, "end": 3433229}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_green-orange.png", "start": 3433229, "end": 3433348}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_burgyl.png", "start": 3433348, "end": 3433467}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purples_2.png", "start": 3433467, "end": 3433586}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_green-brown.png", "start": 3433586, "end": 3433705}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_sunset.png", "start": 3433705, "end": 3433824}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purple-brown.png", "start": 3433824, "end": 3433943}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ylorbr.png", "start": 3433943, "end": 3434062}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blugrn.png", "start": 3434062, "end": 3434181}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_bugn.png", "start": 3434181, "end": 3434300}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_pubugn.png", "start": 3434300, "end": 3434419}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_green-yellow.png", "start": 3434419, "end": 3434538}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_red-purple.png", "start": 3434538, "end": 3434657}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_berlin.png", "start": 3434657, "end": 3434776}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_grays.png", "start": 3434776, "end": 3434895}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_red-yellow.png", "start": 3434895, "end": 3435014}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_greens_3.png", "start": 3435014, "end": 3435133}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_ag_sunset.png", "start": 3435133, "end": 3435252}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blues_3.png", "start": 3435252, "end": 3435371}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_purples.png", "start": 3435371, "end": 3435490}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_peach.png", "start": 3435490, "end": 3435609}, {"filename": "/usr/lib/R/library/colorspace/hclwizard/www/images/pal_blues.png", "start": 3435609, "end": 3435728}, {"filename": "/usr/lib/R/library/colorspace/libs/colorspace.so", "start": 3435728, "end": 3520764}, {"filename": "/usr/lib/R/library/colorspace/help/colorspace.rdx", "start": 3520764, "end": 3522036}, {"filename": "/usr/lib/R/library/colorspace/help/AnIndex", "start": 3522036, "end": 3526476}, {"filename": "/usr/lib/R/library/colorspace/help/colorspace.rdb", "start": 3526476, "end": 3712652}, {"filename": "/usr/lib/R/library/colorspace/help/aliases.rds", "start": 3712652, "end": 3713684}, {"filename": "/usr/lib/R/library/colorspace/help/paths.rds", "start": 3713684, "end": 3714239}], "remote_package_size": 3714239, "package_uuid": "cee33de4-8fb2-42ae-8d8b-023dfdcfff7c"});
  
  })();
  