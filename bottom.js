var projes = {};
projes.lcc = lcc;
projes.tmerc = tmerc;

exports.proj = function(wkt){
	var projObj = parseWKT(wkt);
	var projection = projes[projObj.projName];
	var projFunc = projection(projObj);
	return projFunc;
};

})(window);