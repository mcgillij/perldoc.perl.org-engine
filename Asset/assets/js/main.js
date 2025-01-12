'use strict';

if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, 'assign', {
		value: function assign(target, varArgs) {
			// .length of function is 2
			'use strict';

			if (target == null) {
				// TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) {
					// Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback /*, thisArg*/) {
		var T, k;

		if (this == null) {
			throw new TypeError('this is null or not defined');
		}

		// 1. Let O be the result of calling toObject() passing the
		// |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get() internal
		// method of O with the argument "length".
		// 3. Let len be toUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If isCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let
		// T be undefined.
		if (arguments.length > 1) {
			T = arguments[1];
		}

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat while k < len.
		while (k < len) {
			var kValue;

			// a. Let Pk be ToString(k).
			//    This is implicit for LHS operands of the in operator.
			// b. Let kPresent be the result of calling the HasProperty
			//    internal method of O with argument Pk.
			//    This step can be combined with c.
			// c. If kPresent is true, then
			if (k in O) {
				// i. Let kValue be the result of calling the Get internal
				// method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as
				// the this value and argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined.
	};
}
function navHeight() {
	var navHeight = document.querySelector('nav').offsetHeight;
	$('.wrapper').css({
		'padding-top': navHeight + 'px'
	});
}
window.addEventListener('DOMContentLoaded', function() {
	navHeight();

	var menuItems;
	var latestVersions;
	var checkMenuItems = function checkMenuItems() {
		fetch('/versions.json')
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				menuItems = Object.assign({}, data.versions);
				latestVersions = Object.assign({}, data.latest);
			});
	};

	checkMenuItems();

	setTimeout(function() {
		var allversions = document.getElementById('dropdown-menu-links');

		// create array of major versions
		var menuItemsArray = Object.keys(menuItems).map(function(key) {
			return [
				Number(key),
				Object.keys(menuItems[key]).map(function(lastKey) {
					return Number(lastKey);
				})
			];
		});
		menuItemsArray = menuItemsArray.sort().reverse();

		if (allversions) {
			menuItemsArray.forEach(function(el, index) {
				var majorVersion = document.createElement('p');
				majorVersion.classList.add('dropdown-item', 'major-version');
				var dividerDiv = document.createElement('div');
				dividerDiv.classList.add('dropdown-divider');
				majorVersion.innerHTML = el[0];
				allversions.appendChild(majorVersion);

				el[1].forEach(function(minorEl) {
					var minorVersion = document.createElement('a');
					minorVersion.classList.add('dropdown-item', 'minor-version');
					minorVersion.innerHTML = '5.' + el[0] + '.' + minorEl;
					minorVersion.setAttribute('href', '/5.' + el[0] + '.' + minorEl);
					allversions.appendChild(minorVersion);
					allversions.appendChild(dividerDiv);
				});
			});
		}
	}, 250);
});
window.addEventListener('resize', navHeight);
window.addEventListener('orientationchange', navHeight);
