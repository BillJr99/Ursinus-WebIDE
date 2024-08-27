Ursinus WebIDE

In `config.yml`, set:

```
publickey: |  
  YOUR PUBLIC KEY HERE
```

`canvascourseid: courseid1, courseid2, courseid3`  

`formlink: LINK TO GOOGLE SHEET FOR FORM PROCESSING HERE`  

publickey can be overridden in the layout 
canvascourseid can be overridden in the exercise page
formlink can be overriden in the layout 

Use with formprocessor backend to pull from google sheets


## Pyodide Modules

In the markdown files for the modules you're creating, be sure to specify the <code>packages</code> field nested under <code>info</code> to load the packages that are necessary for the module.  For instance, for a module that creates a plot in matplotlib, you'd say

<code>
packages: "numpy,matplotlib"
</code>

After creating a plot, use the built-in method <code>save_figure_js()</code> in your main code in python to save the figure to the figure area.  You can also then look at the string <code>audioStr</code> in the command line to extract the base64 binary code for the image to create reference solutions

When creating an audio module, use the built-in method 

<code>save_audio_js(y, sr)</code>

which takes in an array of samples and a sample rate.  Then check the global string <code>audioStr</code> for the base64 binary to create reference solutions


## Graphics Modules

Be sure that the relative paths for all meshes in assets/js/ggslac/meshes are correct based on how deep the module is.  For example, in the homer mesh in exercise1-orthographic, we say

"filename":"../../assets/js/ggslac/meshes/homer.off"

since that module is in /Modules/Graphics/OrthographicView
