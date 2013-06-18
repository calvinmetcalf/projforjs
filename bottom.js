var projes = {};
projes.lcc = lcc;
projes.tmerc = tmerc;

exports.proj = function(wkt){
	var projObj = parseWKT(wkt);
	var projection = projes[projObj.projName];
	if(projection){
		return projection(projObj);
	}
};

})(window);