/* Author: Jonathan Martin */

/**
 * Initialize page.
 */
$(document).ready(function() {
	navColors();
	subNav();
	itemTogglers();
	loginForm();
});

/**
 * Initialize navigation button colors.
 */
function navColors() {
	var colorId = 0;
	var numberOfColors = 4;
	$('nav.main a').each( function (index) {
		
		if( (index % numberOfColors) == 0) {
			colorId = 0;
		}
		
		$(this).addClass('color-' + colorId);
		colorId++;
	});
}

/**
 * Iterate over navigation links to initialize sub navigation lists.  
 * Only initialize sub navigation lists for main navigation buttons that 
 * have an 'id' html attribute.
 */
function subNav () {
	
	var subNavSuffix = '-subnav'; 
	var btnSuffix = '-btn';
	var hoverClass = 'hover';
	
	$('nav a').each(function() {
		
		var navId = $(this).attr('id');
		
		if (navId != undefined) {
			
			// get nav id prefix
			navId = navId.split('-')[0];
			var $btn = $('#' + navId + btnSuffix);
			var $subnav = $('#' + navId + subNavSuffix);
			
			if ($subnav.attr('id') != undefined) {

				// navigation button event handlers
				$btn.mouseenter(function () {
					if ( $subnav.is(':visible') ) {
						$subnav.clearQueue(); 
						
					} else {
						
						console.log('subnav is not null? - ' + ($subnav.attr('id') != undefined));
						console.log('subnav attr id - ' + ($subnav.attr('id')) );
						
						$(this).addClass(hoverClass);
						
						$subnav.slideDown(200, 'easeOutCubic').position({
							of: $(this),
							my: 'left top',
							at: 'left bottom',
							offset: '0',
							collision: 'fit flip'
						});
					}
				}).mouseleave(function () {
					$subnav.delay(10).slideUp(200, 'easeOutCubic', function () {
						$btn.removeClass(hoverClass);
					});
				});
				
				// sub navigation list event handlers
				$subnav.mouseenter(function () {
					// clear the animation queue
					$(this).clearQueue();
				}).mouseleave(function () {
					$(this).delay(10).slideUp(200, 'easeOutCubic', function () {
						$btn.removeClass(hoverClass);
					});
				});
			}
		}
	});
}

/**
 * Initialize event handlers for toggling item minimization and maximization.
 * 
 * @return void
 */
function itemTogglers() {
	
	// toggling individual item
	$('.toggle-min-max').click( function( e ) {
		e.preventDefault();
		var showMin = $(this).siblings('.content').children('.max').is(':visible');
		toggleMinMax($(this), showMin);
	});
	
	// toggle all items
	$('.min-all-items, .max-all-items').click( function( e ) {
		e.preventDefault();
		
		// highlight clicked button
		$(this).addClass('active').siblings('a').removeClass('active');
		
		var showMin = $(this).attr('class').indexOf('max') == -1; 
		
		if (showMin) {
			toggleAllMinMax($(this), '.max', true);
		} else {
			toggleAllMinMax($(this), '.min', false);
		}
	});
}

/**
 * Toggle all items for either the filter or product sections.
 * 
 * @depends-on toggleMinMax( toggler, showMin )
 * 
 * @param $item - Element which triggered the toggle min/max all event.
 * @param typeToShow - Classname used to query the DOM to check if the given element is visiable.
 * @param showMin - Boolean to determine whether to show the minimized version of an item or not.
 * @return void
 */
function toggleAllMinMax ($item, typeToShow, showMin) {
	var $itemType = $item.attr('id').indexOf('filter') == -1 ? $('.product') : $('.filter') ;
	
	$itemType.each( function () {
		var showThis = $(this).children('.toggle-min-max').siblings('.content').children( typeToShow ).is(':visible');
		if (showThis) {
			toggleMinMax( $(this).children('.toggle-min-max'), showMin );
		}
	});
}

/**
 * Toggle a single item for either the filter or product section.
 * 
 * Due to the specific way HTML elements are queried, the HTML for 
 * an item must be as follows:
 * 
 *	<div class="[an item name]">
 * 		<a href="#" class="[toggler]">&nbsp;</a>
 * 			
 * 		<div class="content">
 * 			<div class="min">
 * 				Min content here
 * 			</div>
 * 			<div class="max">
 *				Max content here 
 * 			</div>
 * 		</div>
 * 	</div>
 * 
 * @param $toggler - Toggle arrow HTML element for a given item.
 * @referencedBy - toggleAllMinMax, initItemTogglers
 * @return void
 */
function toggleMinMax( $toggler, showMin ) {
	var slideSpeed = 300;
	var easing = 'easeOutCubic';
	var openCSSClass = 'open';
	var minItemClass = 'minimized-item';

	var $content = $toggler.siblings('.content');
	var $minContent = $content.children('.min');
	var $maxContent = $content.children('.max');
	var minHeight = $minContent.height();
	var maxHeight = $maxContent.height();
	var height = showMin ? minHeight : maxHeight;

	$content.animate({ height: 0 }, slideSpeed, easing, function() {
		if (showMin){
			$toggler.removeClass( openCSSClass );
			$toggler.parent().addClass(minItemClass)
			$maxContent.hide();
			$minContent.show();
		} else {
			$toggler.addClass( openCSSClass );
			$toggler.parent().removeClass(minItemClass)
			$minContent.hide();
			$maxContent.show();
		}
	}).animate({ height: height }, slideSpeed, easing);
}

/**
 * @return
 */
function loginForm() {
	
	var animFx = 'fade';
	var modalWidth = 500;
	
	// initialize login form dialog
	var $loginForm = $('#login-form');
	$loginForm.dialog({ 
		modal: 	true,
		autoOpen: false,
		show: animFx,
		hide: animFx,
		width: modalWidth,
		open: function() {
			$('.ui-widget-overlay').hide().fadeTo('fast', .8);
		}
	});
	
	// initialize button event handlers
	$('#login-btn').click( function(e){
		e.preventDefault();
		
		if ($loginForm.dialog('isOpen')) {
				$loginForm.dialog('close');
			
		} else {
				$loginForm.dialog('open');
		}
		
		
	});
}