(function ( $ ) {
	$.Bootstrap.CarouselView = function ( element, opts ) {
		var $this 	= $(element),
			$navs  	= $this.find(".control-group"),
			panes 	= $this.find(".pane-group").controlGroup( ".pane", true );
		
		this.opts		= opts;
		this.$items 	= panes.$element.find(".pane");
		this.$inner		= $this.find(".inner");
		this.panesGroup	= panes.group;
		
		this.bLocked 	= false;				//flag used to lockout transitions
		
		this.transitionClass = {
			vertical: {
				next: "transition-slide-up",
				prev: "transition-slide-down"
			},
			horizontal: {
				next: "transition-slide-left",
				prev: "transition-slide-right"
			}
		};
		
		if( this.$items.length > 0 ) {
			this.nCurrent = 0;
		}
		$navs.find(".nav-next").on("click.carouselView",  {self: this}, this.next );
		$navs.find(".nav-prev").on("click.carouselView",  {self: this}, this.prev );
		
		$this.on( "webkitTransitionEnd transitionend oTransitionEnd", {self: this }, this.transitionEnd );
		
		return this;
	};
	$.Bootstrap.CarouselView.prototype = {
		constructor: $.Bootstrap.Carousel,
		$items: null,
		nCurrent: null,
		next: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				self.nCurrent++;
			
				if( self.nCurrent == self.$items.length) { //nav past the end, start over
					self.nCurrent = 0;
				}
				
				self.$inner.addClass( self.transitionClass[self.opts.transition].next ).removeClass( self.transitionClass[self.opts.transition].prev );
				self.activate();
			}
		},
		prev: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				self.nCurrent--;
				
				if( self.nCurrent < 0) { //nav past the end, start over
					self.nCurrent = self.$items.length - 1;
				}
				
				self.$inner.addClass( self.transitionClass.prev ).removeClass( self.transitionClass.next );
				self.activate();
			}
		},
		transitionEnd: function ( e ) {
			e.data.self.unlock();
		},
		isValid: function () {
			return !this.bLocked;
		},
		lock: function () {
			this.bLocked = true;
		},
		unlock: function () {
			this.bLocked = false;
		},
		activate: function () {
			var $pane = $(this.$items[this.nCurrent]);
			
			this.lock();				//lockout further activations until current ends
			$pane.offset();  			//force reflow so that the left position is correct
			$pane.trigger("click", []);	
		}
	};
	$.fn.carouselView = function ( opts ) {
		return this.each( function () { //return for chaining
			var carousel = new $.Bootstrap.CarouselView( this, opts );
		});
	};
}(jQuery));