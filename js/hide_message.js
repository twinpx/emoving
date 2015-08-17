(function($){
	$(function(){

		$(window).on('load', function(){
			if($('.no-money').length){
				setTimeout(function(){
					$('.no-money').hide(300);
				}, 1500);
			}
		});

	})
})(jQuery);