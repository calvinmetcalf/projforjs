function parseWKT(wkt,robj) {
	robj=robj||{};
	var projections = {
		"Lambert Tangential Conformal Conic Projection": "lcc",
		"Lambert_Conformal_Conic": "lcc",
		"Mercator": "merc",
		"Popular Visualisation Pseudo Mercator": "merc",
		"Mercator_1SP": "merc",
		"Transverse_Mercator": "tmerc",
		"Transverse Mercator": "tmerc",
		"Lambert Azimuthal Equal Area": "laea",
		"Universal Transverse Mercator System": "utm"
	};
	var wktMatch = wkt.match(/^(\w+)\[(.*)\]$/);
		if (!wktMatch){
			return;
		}
		var wktObject = wktMatch[1];
		var wktContent = wktMatch[2];
		var wktTemp = wktContent.split(",");
		var wktName;
		if (wktObject.toUpperCase() == "TOWGS84") {
			wktName = wktObject;  //no name supplied for the TOWGS84 array
		} else {
			wktName = wktTemp.shift();
		}
		wktName = wktName.replace(/^\"/,"");
		wktName = wktName.replace(/\"$/,"");

		var wktArray = [];
		var bkCount = 0;
		var obj = "";
		var token;
		for (var i=0, len = wktTemp.length; i<len; ++i) {
			token = wktTemp[i];
			for (var j=0; j<token.length; ++j) {
				if (token.charAt(j) == "["){
					++bkCount;
				}
				if (token.charAt(j) == "]"){
					--bkCount;
				}
			}
			obj += token;
			if (bkCount === 0) {
				wktArray.push(obj);
				obj = "";
			} else {
				obj += ",";
			}
		}

		//do something based on the type of the wktObject being parsed
		//add in variations in the spelling as required
		switch (wktObject) {
			case 'LOCAL_CS':
				robj.projName = 'identity';
				robj.localCS = true;
				robj.srsCode = wktName;
				break;
			case 'GEOGCS':
				robj.projName = 'longlat';
				robj.geocsCode = wktName;
				if (!robj.srsCode){
					robj.srsCode = wktName;
				}
				break;
			case 'PROJCS':
				robj.srsCode = wktName;
				break;
			case 'GEOCCS':
				break;
			case 'PROJECTION':
				robj.projName = projections[wktName];
				break;
			case 'DATUM':
				robj.datumName = wktName;
				break;
			case 'LOCAL_DATUM':
				robj.datumCode = 'none';
				break;
			case 'SPHEROID':
				robj.ellps = wktName;
				robj.a = parseFloat(wktArray.shift());
				robj.rf = parseFloat(wktArray.shift());
				break;
			case 'PRIMEM':
				robj.from_greenwich = parseFloat(wktArray.shift()); //to radians?
				break;
			case 'UNIT':
				robj.units = wktName;
				robj.unitsPerMeter = parseFloat(wktArray.shift());
				break;
			case 'PARAMETER':
				var name = wktName.toLowerCase();
				var value = parseFloat(wktArray.shift());
				//there may be many variations on the wktName values, add in case
				//statements as required
				switch (name) {
					case 'false_easting':
						robj.x0 = value;
						break;
					case 'false_northing':
						robj.y0 = value;
						break;
					case 'scale_factor':
						robj.k0 = value;
						break;
					case 'central_meridian':
						robj.long0 = value;
						break;
					case 'latitude_of_origin':
						robj.lat0 = value;
						break;
					case 'standard_parallel_1':
						robj.sp1=value;
						break;
					case 'standard_parallel_2':
						robj.sp2=value;
						break;
					default:
						break;
					}
				break;
			case 'TOWGS84':
				robj.datum_params = wktArray;
				break;
				//DGR 2010-11-12: AXIS
			case 'AXIS':
				var axisName= wktName.toLowerCase();
				var axisValue= wktArray.shift();
				switch (value) {
					case 'EAST' :
						axisValue= 'e';
						break;
					case 'WEST' :
						axisValue= 'w';
						break;
					case 'NORTH':
						axisValue= 'n';
						break;
					case 'SOUTH':
						axisValue= 's';
						break;
					case 'UP'   :
						axisValue= 'u';
						break;
					case 'DOWN' : 
						axisValue= 'd';
						break;
					//case 'OTHER': 
					default : 
						axisValue= ' ';
						break;//
				}
				if (!robj.axis) {
					robj.axis= "enu";
				}
				switch(axisName) {
					case 'x':
						robj.axis= axisValue + robj.axis.substr(1,2);
						break;
					case 'y':
						robj.axis= robj.axis.substr(0,1) + axisValue + robj.axis.substr(2,1);
						break;
					case 'z':
						robj.axis = robj.axis.substr(0,2) + axisValue;
						break;
					default :
						break;
				}
			break;
		case 'MORE_HERE':
			break;
		default:
			break;
	}
	for (var ji=0,lenj=wktArray.length; ji<lenj; ++ji) {
		parseWKT(wktArray[ji],robj);
	}
	return robj;
}