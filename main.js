window.onload = function(){
    var canvas = document.getElementById("canvas");
    var raster = new engine2D.raster(canvas);
    var p00 = [100,100,100,1];
    var p10 = [100,-100,100,1];
    var p20 = [-100,-100,100,1];
    var p30 = [-100,100,100,1];
    var p01 = [100,100,-100,1];
    var p11 = [100,-100,-100,1];
    var p21 = [-100,-100,-100,1];
    var p31 = [-100,100,-100,1];
    var ps = [p00,p10,p20,p30,p01,p11,p21,p31];
    var angle = 0;
    var red = {r:255, g:0, b:0};
    var matrix = engine2D.matrix;
    setInterval(function(){
	angle += .1;
	raster.clear();
	var app_matrix = matrix.mulMatrix(
	    matrix.translate(200,200,0),
	    matrix.mulMatrix(
		matrix.rotationX(angle/2),
		matrix.rotationY(angle)))
	var pp = ps.map(
	    function(v){
		return matrix.mulVector(app_matrix,v);});
	raster.drawLine(pp[0],pp[1],red);
	raster.drawLine(pp[1],pp[2],red);
	raster.drawLine(pp[2],pp[3],red);
	raster.drawLine(pp[3],pp[0],red);
	raster.drawLine(pp[4],pp[5],red);
	raster.drawLine(pp[5],pp[6],red);
	raster.drawLine(pp[6],pp[7],red);
	raster.drawLine(pp[7],pp[4],red);
	raster.drawLine(pp[0],pp[4],red);
	raster.drawLine(pp[1],pp[5],red);
	raster.drawLine(pp[2],pp[6],red);
	raster.drawLine(pp[3],pp[7],red);
	raster.render();
    }, 30);
};