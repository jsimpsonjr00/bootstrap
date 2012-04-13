(function ( $ ) {
	$.Bootstrap.ControlGroup = function ( $group, childSelector, firstActive, parentLock ) {
		this.$active 		= null;
		this.bLocked 		= false;
		this.parentLocked	= parentLock ? parentLock : false; //option that requires the parent to clear transition input locks
		
		//setup event handlers
		$group.on( "click.controlGroup", childSelector, { self: this }, this.activate ); 	//handle childSelector clicks
		$group.on( "deactivate.controlGroup", { self: this }, this.deactivate ); 			//custom event to deactivate
		$group.on( "webkitTransitionEnd transitionend oTransitionEnd", { self: this }, this.transitionEnd );
		
		if( firstActive ) {
			$group.find( childSelector ).first().trigger("click", []);
		}
	}
	$.Bootstrap.ControlGroup.prototype = {
		constructor: $.Bootstrap.ControlGroup,
		deactivate: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				if( self.$active ) {
					self.$active.addClass("deactivate")				//execute a deactivate transition
						.removeClass("active")
						.trigger("hidden", [self.$active]);
				
					self.supportTransition(); //support old browsers
					self.$active = null;
				}
			}
		},
		activate: function ( e ) {
			var $selected = $( e.target ),
				self = e.data.self;
			
			if( self.isValid( $selected ) ) {
				self.deactivate( e );
				
				if( $selected ) {
					self.$active = $selected;
					self.$active.addClass("active")
						.trigger("shown", [self.$active]);

					self.lock();
					self.supportTransition(); //support old browsers
				}
			}
			else {
				e.stopImmediatePropagation();
			}
		},
		supportTransition: function () { //Support old browsers by manually triggering a transition end event, if needed
			if( !Bootstrap.support.transition && this.$active ) {
				this.$active.trigger( "transitionend", [] );
			}
		},
		isValid: function ( $selected ) { //Determines if a requested action is valid to execute
			var ready = !this.bLocked; //inverse logic requires !
			
			if( $selected && this.$active && ($selected["0"] == this.$active["0"]) ) { //if optional $selected is $active, return false 
				ready = false;
			}
			
			return ready;
		},
		lock: function () {
			this.bLocked = true;
		},
		unlock: function () {
			this.bLocked = false;
		},
		transitionEnd: function ( e ) {
			var self = (this instanceof Bootstrap.ControlGroup) ? this : e.data.self,
				$target = $(e.target);
			if( !self.parentLocked ) { //only unlock if the parent hasn't taken that responsibility
				self.unlock();
			}
			$target.removeClass("deactivate");
		}
	};
	$.fn.controlGroup = function( childSelector, firstActive, parentLock ) {
		var group;
		this.each( function () {
			group = new $.Bootstrap.ControlGroup( $(this), childSelector, firstActive, parentLock );
		});
		
		return { $element: this, group: group };
	};
}(jQuery));