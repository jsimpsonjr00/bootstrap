(function ( $ ) {
	var Bootstrap = $.TwitterBootstrap;
	
	$.Bootstrap.TabView = function ( element ) {
		var $this  = $(element),
			tabs  = $this.find(".control-group").controlGroup( "button", true, true ),
			panes = $this.find(".pane-group").controlGroup( ".pane", true, false );
		
		tabs.$element.on( "click.tabView", "button", { self: this }, this.click ); //capture button clicks
		panes.$element.on( "webkitTransitionEnd transitionend oTransitionEnd", ".pane", { self: this }, this.transitionEnd );
		this.tabGroup  = tabs.group;
	}
	$.Bootstrap.TabView.prototype = {
		constructor: $.Bootstrap.TabView,
		click: function ( e ) {
			var $button = $(e.target);
			$( $button.attr("data-pane") ).trigger("click", []);
			e.data.self.lock();
		},
		lock: function () {
			this.tabGroup.lock();
		},
		unlock: function () {
			this.tabGroup.unlock();
		},
		transitionEnd: function ( e ) {
			if( $(e.target).hasClass("pane") ) {
				e.data.self.unlock();
			}
		}
	};
	$.fn.tabView = function () {
		return this.each( function () { //return for chaining
			var view = new $.Bootstrap.TabView( this );
		});
	};
}(jQuery));