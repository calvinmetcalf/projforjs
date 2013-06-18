module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat:{
				'./proj.js':['./top.js','./parseWKT.js','./lcc.js','./tmerc.js','./bottom.js'],
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['concat']);
}
