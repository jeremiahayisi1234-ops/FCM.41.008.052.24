Examination — VR Neoclassical Mansion (A-Frame)
================================================

CONTENTS
--------
  index.html              Main scene (open in a browser or static host)
  js/water-shader.js      Custom pool water shader + time uniform animation
  js/pool-area-animations.js  Children + dog path animation components
  design-document.html    Printable report (use browser Print > Save as PDF)
  assets/                 Reserved for optional textures (currently minimal)

LOCAL PREVIEW
-------------
  From this folder, serve over HTTP (required for some browsers loading modules):

  Python 3:
    python -m http.server 8080

  Then open: http://localhost:8080/

SUBMISSION
----------
  1. Zip this entire "Examination" folder for the VLE.
  2. Host the same folder on your HTTPS host so it is available at:
       https://<IndexNumber>.ceiscy.com/Examination
     Replace <IndexNumber> with your assigned index. Upload files so that
     index.html loads at .../Examination/index.html (or .../Examination/ with
     default index).
  3. Export design-document.html to PDF (Ctrl+P > Save as PDF) and submit.

CONTROLS
--------
  Desktop: WASD or arrow keys to walk; mouse drag to look. Click the 3D view once if keys do not respond.
  VR: follow headset + controller locomotion per browser/device.
