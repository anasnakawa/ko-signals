/*!
 * ko-signals.js
 * Anas Nakawa
 * License (MIT)
 */

//
// signal communication utilizing knockout
// components for small size advantage
//

(function( ko ) { 'use strict';

	/**
	 * locals
	 */

	var each = ko.utils.arrayForEach;

	/**
	 * signal class definition
	 */

	function Signal() {
		var signal = ko.observable();
		var handlerCache = [];

		signal.dispatch = function( payload ) {
			if( payload === signal() ) {
				signal.valueHasMutated();
			} else {
				signal( payload );
			}
		}

		// subscribe already there.
		signal.add = function( handler, context ) {
			// handlerCache.push( handler );
			var subscriber = signal.subscribe( handler, context );

			// storing disposal instance for later removal
			handlerCache.push({
				subscriber: subscriber,
				handler: handler
			})
		}

		signal.remove = function( handler ) {
			var handlersAfterRemoval = [];
			var handlersToBeRemoved = [];

			// splitting handler cache into two arrays,
			// one to be removed, and the other to remain after
			// removal
			each( handlerCache, function( handlerItem ) {
				if( handlerItem.handler === handler ) {
					handlersToBeRemoved.push( handlerItem );
				} else {
					handlersAfterRemoval.push( handlerItem );
				}
			})

			if( handlersToBeRemoved.length === 0 ) {
				return;
			}

			// calling all dispose methods
			each( handlersToBeRemoved, function( item ) {
				item.subscriber.dispose();
			})

			// removing all disposed instances from handler cache
			handlerCache = handlersAfterRemoval;
		}

		return signal;
	}

	/**
	 * expose `Signal`
	 */

	window.Signal = Signal;

})( ko );
