function llc(params){
	/*
	based off http://gmaps-utility-gis.googlecode.com/svn/trunk/v3samples/customprojection.html
	*/

	/*=========parameters=================*/

	params=params||{};

	var _a = (params.a ||6378137.0 )/(params.unit||0.3048006096012192);
	var _f_i=params.rf||298.257222101;//this.
	var _phi1 = (params.sp1||34.33333333333334) * (Math.PI / 180);
	var _phi2 = (params.sp2||36.16666666666666) * (Math.PI / 180);
	var _phiF = (params.lat0||33.75) * (Math.PI / 180);
	var _lamdaF = (params.long0||-79.0)* (Math.PI / 180);
	var _FE = params.x0||2000000.002616666;//this.
	var _FN = params.y0||0.0;//this.
	/*========== functions to calc values, potentially can move outside as static methods=========*/
	var calc_m = function(phi, es){
		var sinphi = Math.sin(phi);
			return Math.cos(phi) / Math.sqrt(1 - es * sinphi * sinphi);
		};

	var calc_t = function(phi, e){
		var esinphi = e * Math.sin(phi);
		return Math.tan(Math.PI / 4 - phi / 2) / Math.pow((1 - esinphi) / (1 + esinphi), e / 2);
	};
	var calc_r = function(a, F, t, n){
		return a * F * Math.pow(t, n);
	};
	var calc_phi = function(t_i, e, phi){
		var esinphi = e * Math.sin(phi);
		return Math.PI / 2 - 2 * Math.atan(t_i * Math.pow((1 - esinphi) / (1 + esinphi), e / 2));
	};
	var solve_phi = function(t_i, e, init){
		// iteration
		var i = 0;
		var phi = init;
		var newphi = calc_phi(t_i, e, phi);//this.
		while (Math.abs(newphi - phi) > 0.000000001 && i++ < 10) {
			phi = newphi;
			newphi = calc_phi(t_i, e, phi);//this.
		}
		return newphi;
	};
	/*=========shared, not point specific params or intermediate values========*/
	var _f = 1.0 /_f_i;//this.
	/*e: eccentricity of the ellipsoid where e^2 = 2f - f^2 */
	var _es = 2 * _f - _f * _f;
	var _e = Math.sqrt(_es);
	var _m1 = calc_m(_phi1, _es);//this.
	var _m2 = calc_m(_phi2, _es);//this.
	var _tF = calc_t(_phiF, _e);//this.
	var _t1 = calc_t(_phi1, _e);//this.
	var _t2 = calc_t(_phi2, _e);//this.
	var _n = Math.log(_m1 / _m2) / Math.log(_t1 / _t2);
	var _F = _m1 / (_n * Math.pow(_t1, _n));
	var _rF = calc_r(_a, _F, _tF, _n);//this.
   /**

	* convert lat lng to coordinates 

	* @param {Array<double>} latlng array with 2 double: [lat,lng]

 */

	return function(xy){
		var E = xy[0];
		var N = xy[1];
		var theta_i = Math.atan((E - _FE) / (_rF - (N - _FN)));
		var r_i = (_n > 0 ? 1 : -1) * Math.sqrt((E - _FE) * (E - _FE) + (_rF - (N - _FN)) * (_rF - (N - _FN)));
		var t_i = Math.pow((r_i / (_a * _F)), 1 / _n);
		var phi = solve_phi(t_i, _e, 0);
		var lamda = theta_i / _n + _lamdaF;
		return  [phi * (180 / Math.PI),lamda * (180 / Math.PI)];
	


}
