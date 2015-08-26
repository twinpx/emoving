var Modules = (function(self){ return self; }(Modules || {}));

Modules.Accordion = (function($){
	
	var accordion  = function(params){
		var self = this;

		self.settings = {
			$lk: params.$lk,
			parent: params.parent,
			cnt: params.cnt
		}

		self.setData(params).lkClickEvt();

		return self;
	}

	accordion.prototype = {
		constructor: accordion,
		setData: function(params){
			var self = this;

			return self;
		},
		/**
			EVENTS
		*/
		/**
			Link click
		*/
		lkClickEvt: function(){
			var self = this;

			self.settings.$lk.on('click', function(e){
				var $obj = $(this),
					e = e || event,
					$parent = $obj.closest(self.settings.parent),
					$cnt = $parent.find(self.settings.cnt);

				if($parent.hasClass('accordion__it_state_active')){				

					$cnt.stop(true, true).slideUp(300, function(){
						$parent.removeClass('accordion__it_state_active');
					});

				}else{
					$cnt.stop(true, true).slideDown(300, function(){
						$parent.addClass('accordion__it_state_active');
					});
				}

				e.preventDefault();

			});
			
			return self;
		}

	}

	return accordion;

}(jQuery));