#ProjForJS

A rewrite of proj4js with the goals of 
- limited scope
- self contained
- covering the 20% that gets used 80% of the time and not the 80% of the projections that are weird edge cases that exactly one department in the basement of some other department uses.
- Useful.

The api I'd like this to have is `somefunction(wkt)->transformerFunction`

Mot of the transformation functions are from the [google maps arcgis server link](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/arcgislink/docs/examples.html) which is apache licensed meaning so is this.