window.onload = function(){
    var canvas = document.getElementById("canvas");
    var raster = new engine2D.raster(canvas);
    var p0 = [100,100,0,1];
    var p1 = [100,-100,0,1];
    var p2 = [-100,-100,0,1];
    var p3 = [-100,100,0,1];
    var ps = [p0,p1,p2,p3];
    var angle = 0;
    var red = {r:255, g:0, b:0};
    var matrix = engine2D.matrix;
    setInterval(function(){
	angle += .1;
	raster.clear();
	var pp = ps.map(
	    function(v){
		return matrix.mulVector(
		    matrix.translate(200,200,0),
		    matrix.mulVector(
			matrix.rotationZ(angle),
			v));});
	raster.drawLine(pp[0],pp[1],red);
	raster.drawLine(pp[1],pp[2],red);
	raster.drawLine(pp[2],pp[3],red);
	raster.drawLine(pp[3],pp[0],red);
	raster.render();
    }, 30);
};