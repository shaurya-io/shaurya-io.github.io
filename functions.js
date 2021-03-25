

$('#image1').click(function(){
	count++;
	var currentimage = document.getElementById("image1");
	if(count == 1){
		currentimage.src = "data/context.gif";
	}
	else if(count == 2){
		currentimage.src = "data/img1play.png";
	}
	else if(count == 3){
		currentimage.src = "data/playButtontoHeart.gif";
	}
	else if(count == 4){
		$('#image1').animate({opacity:0});
	}
}); 

$('#reset').click(function(){
	location.reload();
});