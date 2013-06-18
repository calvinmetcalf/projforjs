// from http://gmaps-utility-gis.googlecode.com/svn/trunk/arcgislink/src/arcgislink_code.js apache lisensed
function tmerc(params) {
	var RAD_DEG = (Math.PI / 180);
	params = params || {};
	var _a = (params.a ||6378137.0 )/(params.unit||0.3048006096012192);
	var f_i=params.rf||298.257222101;//this.
	var _k0 = params.k0;
	var phi0 = (params.lat0||33.75) * RAD_DEG;
	var _lamda0 =(params.long0||-79.0)* RAD_DEG;
	var _FE = params.x0||2000000.002616666;
	var _FN =  params.y0||0.0;//this.
	var f = 1.0 / f_i;//this.
	/*e: eccentricity of the ellipsoid where e^2  =  2f - f^2 */
	var _es = 2 * f - f * f;
	//var _e  =  Math.sqrt(_es);
	/* e^4 */
	var _ep4 = _es * _es;
	/* e^6 */
	var _ep6 = _ep4 * _es;
	/* e'  second eccentricity where e'^2  =  e^2 / (1-e^2) */
	var _eas = _es / (1 - _es);
	function _calc_m(phi, a, es, ep4, ep6) {
		return a * ((1 - es / 4 - 3 * ep4 / 64 - 5 * ep6 / 256) * phi - (3 * es / 8 + 3 * ep4 / 32 + 45 * ep6 / 1024) * Math.sin(2 * phi) + (15 * ep4 / 256 + 45 * ep6 / 1024) * Math.sin(4 * phi) - (35 * ep6 / 3072) * Math.sin(6 * phi));
	}
	var _M0 = _calc_m(phi0, _a, _es, _ep4, _ep6);
	return function(coords) {
		var E = coords[0];
		var N = coords[1];
		var e1 = (1 - Math.sqrt(1 - _es)) / (1 + Math.sqrt(1 - _es));
		var M1 = _M0 + (N - _FN) / _k0;
		var mu1 = M1 / (_a * (1 - _es / 4 - 3 * _ep4 / 64 - 5 * _ep6 / 256));
		var phi1 = mu1 + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu1) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu1) + (151 * Math.pow(e1, 3) / 6) * Math.sin(6 * mu1) + (1097 * Math.pow(e1, 4) / 512) * Math.sin(8 * mu1);
		var C1 = _eas * Math.pow(Math.cos(phi1), 2);
		var T1 = Math.pow(Math.tan(phi1), 2);
		var N1 = _a / Math.sqrt(1 - _es * Math.pow(Math.sin(phi1), 2));
		var R1 = _a * (1 - _es) / Math.pow((1 - _es * Math.pow(Math.sin(phi1), 2)), 3 / 2);
		var D = (E - _FE) / (N1 * _k0);
		var phi = phi1 - (N1 * Math.tan(phi1) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * _eas) * Math.pow(D, 4) / 24 + (61 + 90 * T1 + 28 * C1 + 45 * T1 * T1 - 252 * _eas - 3 * C1 * C1) * Math.pow(D, 6) / 720);
		var lamda = _lamda0 + (D - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * _eas + 24 * T1 * T1) * Math.pow(D, 5) / 120) / Math.cos(phi1);
		return [lamda / RAD_DEG, phi / RAD_DEG];
	};
}