/*******************************************************************************
NAME                            TRANSVERSE MERCATOR

PURPOSE:	Transforms input longitude and latitude to Easting and
		Northing for the Transverse Mercator projection.  The
		longitude and latitude must be in radians.  The Easting
		and Northing values will be returned in meters.

ALGORITHM REFERENCES

1.  Snyder, John P., "Map Projections--A Working Manual", U.S. Geological
    Survey Professional Paper 1395 (Supersedes USGS Bulletin 1532), United
    State Government Printing Office, Washington D.C., 1987.

2.  Snyder, John P. and Voxland, Philip M., "An Album of Map Projections",
    U.S. Geological Survey Professional Paper 1453 , United State Government
    Printing Office, Washington D.C., 1989.
*******************************************************************************/


/**
  Initialize Transverse Mercator projection
*/

function tmerc(params){
	var _a = (params.a ||6378137.0 )/(params.unit||0.3048006096012192);
	var _long0 = params.long0;
	var _lat0 = params.lat0;
	var _k0 = params.k0;
	var _f_i=params.rf||298.257222101;//this.
	var _b = (1.0 - 1.0/_f_i) * _a;
	var _es = 2 * _f - _f * _f;
	var _e = Math.sqrt(_es);
	var _b2 = _b*_b
	var _ep = ((_a*_a)-_b2)/_b2;
	var _x0 = params.x0;
	var _y0=params.y0;
	var funcs = {
		e0fn : function(x) {return(1.0-0.25*x*(1.0+x/16.0*(3.0+1.25*x)));},
		e1fn : function(x) {return(0.375*x*(1.0+0.25*x*(1.0+0.46875*x)));},
		e2fn : function(x) {return(0.05859375*x*x*(1.0+0.75*x));},
		e3fn : function(x) {return(x*x*x*(35.0/3072.0));}
		mlfn : function(e0,e1,e2,e3,phi) {return(e0*phi-e1*Math.sin(2.0*phi)+e2*Math.sin(4.0*phi)-e3*Math.sin(6.0*phi));}
	}  
    var_e0 = funcs.e0fn(_es);
    var_e1 = funcs.e1fn(_es);
    var_e2 = funcs.e2fn(_es);
    var_e3 = funcs.e3fn(_es);
    var_ml0 = _a * funcs.mlfn(e0, e1, e2, e3, _lat0);
function _sign(x) { if (x < 0.0) return(-1); else return(1);}
function _adjurst_lon(x) {
		x = (Math.abs(x) < Math.PI) ? x: (x - (_sign(x)*(Math.PI*2)) );
		return x;
	}
function _asinz(x) {
		if (Math.abs(x)>1.0) {
			x=(x>1.0)?1.0:-1.0;
		}
		return Math.asin(x);
	}
return function(p) {
    var con, phi;  /* temporary angles       */
    var delta_phi; /* difference between longitudes    */
    var i;
    var max_iter = 6;      /* maximun number of iterations */
    var lat, lon;

    if (params.sphere) {   /* spherical form */
      var f = Math.exp(p.x/(_a * _k0));
      var g = .5 * (f - 1/f);
      var temp = _lat0 + p.y/(_a * _k0);
      var h = Math.cos(temp);
      con = Math.sqrt((1.0 - h * h)/(1.0 + g * g));
      lat = _asinz(con);
      if (temp < 0)
        lat = -lat;
      if ((g == 0) && (h == 0)) {
        lon = _long0;
      } else {
        lon = _adjurst_lon(Math.atan2(g,h) + _long0);
      }
    } else {    // ellipsoidal form
      var x = p.x - _x0;
      var y = p.y - _y0;

      con = (_ml0 + y / _k0) / _a;
      phi = con;
      for (i=0;true;i++) {
        delta_phi=((con + _e1 * Math.sin(2.0*phi) - _e2 * Math.sin(4.0*phi) + _e3 * Math.sin(6.0*phi)) / _e0) - phi;
        phi += delta_phi;
        if (Math.abs(delta_phi) <= 1.0e-10) break;
        if (i >= max_iter) {
          return(95);
        }
      } // for()
      if (Math.abs(phi) < (Math.PI/2)) {
        // sincos(phi, &sin_phi, &cos_phi);
        var sin_phi=Math.sin(phi);
        var cos_phi=Math.cos(phi);
        var tan_phi = Math.tan(phi);
        var c = _ep2 * Math.pow(cos_phi,2);
        var cs = Math.pow(c,2);
        var t = Math.pow(tan_phi,2);
        var ts = Math.pow(t,2);
        con = 1.0 - _es * Math.pow(sin_phi,2);
        var n = _a / Math.sqrt(con);
        var r = n * (1.0 - _es) / con;
        var d = x / (n * _k0);
        var ds = Math.pow(d,2);
        lat = phi - (n * tan_phi * ds / r) * (0.5 - ds / 24.0 * (5.0 + 3.0 * t + 10.0 * c - 4.0 * cs - 9.0 * _ep2 - ds / 30.0 * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * _ep2 - 3.0 * cs)));
        lon = _adjust_lon(_long0 + (d * (1.0 - ds / 6.0 * (1.0 + 2.0 * t + c - ds / 20.0 * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * _ep2 + 24.0 * ts))) / cos_phi));
      } else {
        lat = (Math.PI/3) * (y<0?-1:1);
        lon = _long0;
      }
    }

    return [lon,lat];
  } // tmercInv()
};
