
/**
 * @file
 * This file contains the javascript functions used to display a map when the
 * entity it is attached to is displayed.
 */

/**
 * Declare global variable by which to identify the map.
 */
var google_map_field_map;

/**
 * Add code to generate the map on page load.
 */
(function ($) {
  Drupal.behaviors.google_map_field = {
    attach: function (context) {
      // Pick up all elements of class google_map_field and loop
      // through them calling the google_map_field_load_map function
      // with the object ID.
      $(".google_map_field_display").each(function(index, item) {
        var objId = $(item).attr('id');
        google_map_field_load_map(objId);
      });
    }
  };
})(jQuery);

/**
 * This function is called by the google_map_field Drupal.behaviour and
 * loads a google map in tot he given map ID container.
 */
function google_map_field_load_map(map_id) {
  // Get the settings for the map from the Drupal.settings object.
  var lat = Drupal.settings.gmf_node_display[map_id]['lat'];
  var lon = Drupal.settings.gmf_node_display[map_id]['lon'];
  var zoom = parseInt(Drupal.settings.gmf_node_display[map_id]['zoom']);
  // Create the map coords and map options.
  var latlng = new google.maps.LatLng(lat, lon);
  var mapOptions = {
    zoom: zoom,
    center: latlng,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // create the map.
  google_map_field_map = new google.maps.Map(document.getElementById(map_id), mapOptions);
  // Drop a marker at the specified position.
  marker = new google.maps.Marker({
    position: latlng,
    optimized: false,
    map: google_map_field_map
  });
}
;
/**
 * @author: Bruno Massa http://drupal.org/user/67164
 * @file slideshow_creator.js
 * The main Javacript for this module
 */

/**
 * Initialize the module's JS functions
 *
 * See http://drupal.org/node/756722
 */

(function ($) {

  Drupal.behaviors.ssc = {
    attach: function (context) {
      if (typeof(window['ssc_settings']) != 'undefined' ) {
        for (var ss in ssc_settings) {
          if (ssc_settings.hasOwnProperty(ss)) {
	    if ( ! ssc_settings[ss].hasOwnProperty('before') ) {
              ssc_settings[ss].before = Drupal.ssc_before;
	    }
	    if (
	      ssc_settings[ss].hasOwnProperty('ssc') &&
		ssc_settings[ss].ssc.hasOwnProperty('pager')
	    ) {
	      eval('Drupal.ssc_pagerfn_' + ssc_settings[ss].ssc.pager + '(ssc_settings[ss], ss)');
	    } else {
	      $("#ssc-content-" + ss).cycle(ssc_settings[ss]);
	    }
          }
        }
      }
    }
  };

  Drupal.ssc_pagerfn_thum = function(ssc_setting, ss) {
    if ( ! ssc_setting.hasOwnProperty('pager') ) {
      ssc_setting.pager = '#ssc-nav-' +ss;
    }
    var width = '50px';
    if (ssc_setting.ssc.hasOwnProperty('thumx')) {
      width = ssc_setting.ssc.thumx;
    }
    var height = '40px';
    if (ssc_setting.ssc.hasOwnProperty('thumy')) {
      height = ssc_setting.ssc.thumy;
    }
    if ( ! ssc_setting.hasOwnProperty('pagerAnchorBuilder') ) {
      ssc_setting.pagerAnchorBuilder = function(idx, slide) {
	return '<li><a href="#"><img src="' +
	  slide.getElementsByTagName('img')[0].src +
	  '" width="' + width + '" height="' + height + '" /></a></li>';
      }
    }
    var pos = 'before';
    if (ssc_setting.ssc.hasOwnProperty('pager_pos')) {
      pos = ssc_setting.ssc.pager_pos;
    }
    if (ssc_setting.ssc.hasOwnProperty('eval_fn')) {
      var ssc_eval_fn = ssc_setting.ssc.eval_fn;
      delete ssc_setting.ssc;
      ssc_eval_fn(ss,ssc_setting);
    } else {
      delete ssc_setting.ssc;
      eval(
	'$("#ssc-content-" + ss).' + pos +
	'(\'<ul class="ssc-nav" id="ssc-nav-\' +ss+ \'">\').cycle(ssc_setting)'
      );
    }
  }

  Drupal.ssc_before = function() {
    var sscid = this.id.replace(/ssc-slide-/, "").replace(/-.*/, "");
    var slide = parseInt(this.id.replace(/ssc-slide-.*-/, ""), 10) + 1;
    $("#ssc-current-" + sscid).html(slide);
  };

}(jQuery));
;
/**
 * @file
 * Implements history using the BBQ plugin.
 * See http://benalman.com/code/projects/jquery-bbq/examples/fragment-jquery-ui-tabs
 */
(function($) {

Drupal.quicktabsBbq = function($tabset, clickSelector, changeSelector) {

  changeSelector = changeSelector || clickSelector;

  // Define our own click handler for the tabs, overriding the default.
  $(clickSelector, $tabset).each(function(i, el){
    this.tabIndex = i;
    $(this).click(function(e){
      e.preventDefault();
      var state = {},
        id = $tabset.attr('id'), // qt container id
        idx = this.tabIndex; // tab index

      state[id] = idx;
      $.bbq.pushState(state);
    });
  });

  $(window).bind('hashchange', function(e) {
    $tabset.each(function() {
      var idx = $.bbq.getState(this.id, true);
      var $active_link = $(this).find(changeSelector).eq(idx);
      $active_link.triggerHandler('change');
    });
  });

  $(window).trigger('hashchange');
}

})(jQuery);;
(function ($) {

Drupal.behaviors.qt_ui_tabs = {
  attach: function (context, settings) {

    $('.quicktabs-ui-wrapper').once('qt-ui-tabs-processed', function() {
      var id = $(this).attr('id');
      var qtKey = 'qt_' + id.substring(id.indexOf('-') +1);
      if (!settings.quicktabs[qtKey].history) {
        $(this).tabs();
      }
      else {
        $(this).tabs({event: 'change'});
        Drupal.quicktabsBbq($(this), 'ul.ui-tabs-nav a');
      }
    });

  }
}

})(jQuery);
;
