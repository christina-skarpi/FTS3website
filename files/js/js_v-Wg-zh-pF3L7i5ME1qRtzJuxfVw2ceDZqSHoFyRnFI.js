
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

// Global Killswitch
if (Drupal.jsEnabled) {
$(document).ready(function() {
    $("body").append($("#memcache-devel"));
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
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;

(function ($) {
  function teaser_handler(event) {
    if ($("input[name=faq_display]:checked").val() != "new_page") {
      if ($("input[name=faq_use_teaser]:checked").val() == 1) {
        $("input[name=faq_more_link]").removeAttr("disabled");
      }
      else {
        $("input[name=faq_more_link]").attr("disabled", "disabled");
      }
    }
  }

  function faq_display_handler(event) {
    // Enable / disable "questions_inline" and "questions_top" only settings.
    if ($("input[name=faq_display]:checked").val() == "questions_inline" || $("input[name=faq_display]:checked").val() == "questions_top") {
      $("input[name=faq_back_to_top]").removeAttr("disabled");
      $("input[name=faq_qa_mark]").removeAttr("disabled");
      // Enable / disable label settings according to "qa_mark" setting.
      if ($("input[name=faq_qa_mark]:checked").val() == 1) {
        $("input[name=faq_question_label]").removeAttr("disabled");
        $("input[name=faq_answer_label]").removeAttr("disabled");
      }
      else {
        $("input[name=faq_question_label]").attr("disabled", "disabled");
        $("input[name=faq_answer_label]").attr("disabled", "disabled");
      }
    }
    else {
      $("input[name=faq_back_to_top]").attr("disabled", "disabled");
      $("input[name=faq_qa_mark]").attr("disabled", "disabled");
      $("input[name=faq_question_label]").attr("disabled", "disabled");
      $("input[name=faq_answer_label]").attr("disabled", "disabled");
    }

    // Enable / disable "hide_answer" only settings.
    if ($("input[name=faq_display]:checked").val() != "hide_answer") {
      $("input[name=faq_hide_qa_accordion]").attr("disabled", "disabled");
    }
    else {
      $("input[name=faq_hide_qa_accordion]").removeAttr("disabled");
    }

    // Enable / disable "new_page" only settings.
    if ($("input[name=faq_display]:checked").val() != "new_page") {
      $("input[name=faq_use_teaser]").removeAttr("disabled");
      $("input[name=faq_more_link]").removeAttr("disabled");
      $("input[name=faq_disable_node_links]").removeAttr("disabled");
    }
    else {
      $("input[name=faq_use_teaser]").attr("disabled", "disabled");
      $("input[name=faq_more_link]").attr("disabled", "disabled");
      $("input[name=faq_disable_node_links]").attr("disabled", "disabled");
    }
    teaser_handler(event);

    // Enable / disable "new_page" and "questions_top" only settings.
    if ($("input[name=faq_display]:checked").val() == "new_page" ||
      $("input[name=faq_display]:checked").val() == "questions_top") {
      $("select[name=faq_question_listing]").removeAttr("disabled");
    }
    else {
      $("select[name=faq_question_listing]").attr("disabled", "disabled");
    }

  }

  function qa_mark_handler(event) {
    if ($("input[name=faq_display]:checked").val() == "questions_inline") {
      // Enable / disable label settings according to "qa_mark" setting.
      if ($("input[name=faq_qa_mark]:checked").val() == 1) {
        $("input[name=faq_question_label]").removeAttr("disabled");
        $("input[name=faq_answer_label]").removeAttr("disabled");
      }
      else {
        $("input[name=faq_question_label]").attr("disabled", "disabled");
        $("input[name=faq_answer_label]").attr("disabled", "disabled");
      }
    }
  }

  function questions_top_handler(event) {
    $("input[name=faq_display]").val() == "questions_top" ?
      $("input[name=faq_group_questions_top]").removeAttr("disabled"):
      $("input[name=faq_group_questions_top]").attr("disabled", "disabled");

    $("input[name=faq_display]").val() == "questions_top" ?
      $("input[name=faq_answer_category_name]").removeAttr("disabled"):
      $("input[name=faq_answer_category_name]").attr("disabled", "disabled");
  }


  function child_term_handler(event) {
    if ($("input[name=faq_hide_child_terms]:checked").val() == 1) {
      $("input[name=faq_show_term_page_children]").attr("disabled", "disabled");
    }
    else if ($("input[name=faq_category_display]:checked").val() != "categories_inline") {
      $("input[name=faq_show_term_page_children]").removeAttr("disabled");
    }
  }


  function categories_handler(event) {
    if ($("input[name=faq_display]").val() == "questions_top") {
      $("input[name=faq_category_display]:checked").val() == "categories_inline" ?
        $("input[name=faq_group_questions_top]").removeAttr("disabled"):
        $("input[name=faq_group_questions_top]").attr("disabled", "disabled");
      $("input[name=faq_category_display]:checked").val() == "new_page" ?
        $("input[name=faq_answer_category_name]").attr("disabled", "disabled"):
        $("input[name=faq_answer_category_name]").removeAttr("disabled");
    }
    else {
      $("input[name=faq_group_questions_top]").attr("disabled", "disabled");
    }

    // Enable / disable "hide_qa" only settings.
    if ($("input[name=faq_category_display]:checked").val() != "hide_qa") {
      $("input[name=faq_category_hide_qa_accordion]").attr("disabled", "disabled");
    }
    else {
      $("input[name=faq_category_hide_qa_accordion]").removeAttr("disabled");
    }

    $("input[name=faq_category_display]:checked").val() == "categories_inline" ?
      $("input[name=faq_hide_child_terms]").attr("disabled", "disabled"):
      $("input[name=faq_hide_child_terms]").removeAttr("disabled");
    $("input[name=faq_category_display]:checked").val() == "categories_inline" ?
      $("input[name=faq_show_term_page_children]").attr("disabled", "disabled"):
      $("input[name=faq_show_term_page_children]").removeAttr("disabled");
    $("input[name=faq_category_display]:checked").val() == "new_page" ?
      $("select[name=faq_category_listing]").removeAttr("disabled"):
      $("select[name=faq_category_listing]").attr("disabled", "disabled");

    child_term_handler();
  }

  Drupal.behaviors.initFaqModule = {
    attach: function (context) {
      // Hide/show answer for a question.
      var faq_hide_qa_accordion = Drupal.settings.faq.faq_hide_qa_accordion;
      $('div.faq-dd-hide-answer', context).addClass("collapsible collapsed");

      if (!faq_hide_qa_accordion) {
        $('div.faq-dd-hide-answer:not(.faq-processed)', context).addClass('faq-processed').hide();
      }
      $('div.faq-dt-hide-answer:not(.faq-processed)', context).addClass('faq-processed').click(function() {
        if (faq_hide_qa_accordion) {
          $('div.faq-dt-hide-answer').not($(this)).removeClass('faq-qa-visible');
        }
        $(this).toggleClass('faq-qa-visible');
        $(this).parent().addClass('faq-viewed');
        $('div.faq-dd-hide-answer').not($(this).next('div.faq-dd-hide-answer')).addClass("collapsed");
        if (!faq_hide_qa_accordion) {
          $(this).next('div.faq-dd-hide-answer').slideToggle('fast', function() {
            $(this).parent().toggleClass('expanded');
          });
        }
        $(this).next('div.faq-dd-hide-answer').toggleClass("collapsed");

        // Change the fragment, too, for permalink/bookmark.
        // To keep the current page from scrolling, refs
        // http://stackoverflow.com/questions/1489624/modifying-document-location-hash-without-page-scrolling/1489802#1489802
        var hash = $(this).find('a').attr('id');
        var fx, node = $('#' + hash);
        if (node.length) {
          fx = $('<div></div>')
            .css({position: 'absolute', visibility: 'hidden', top: $(window).scrollTop() + 'px'})
            .attr('id', hash)
            .appendTo(document.body);
          node.attr('id', '');
        }
        document.location.hash = hash;
        if (node.length) {
          fx.remove();
          node.attr('id', hash);
        }

        // Scroll the page if the collapsed FAQ is not visible.
        // If we have the toolbar so the title may be hidden by the bar.
        var mainScrollTop = Math.max($('html', context).scrollTop(), $('body', context).scrollTop());
        // We compute mainScrollTop because the behaviour is different on FF, IE and CR
        if (mainScrollTop > $(this).offset().top) {
          $('html, body', context).animate({
            scrollTop: $(this).offset().top
          }, 1);
        }
        
        return false;
      });

      // Show any question identified by a fragment
      if (/^#\w+$/.test(document.location.hash)) {
        $('div.faq-dt-hide-answer ' + document.location.hash).parents('.faq-dt-hide-answer').triggerHandler('click');
      }

      // Hide/show q/a for a category.
      var faq_category_hide_qa_accordion = Drupal.settings.faq.faq_category_hide_qa_accordion;
      $('div.faq-qa-hide', context).addClass("collapsible collapsed");
      if (!faq_category_hide_qa_accordion) {
        $('div.faq-qa-hide', context).hide();
      }
      $('div.faq-qa-header .faq-header:not(.faq-processed)', context).addClass('faq-processed').click(function() {
        if (faq_category_hide_qa_accordion) {
          $('div.faq-qa-header .faq-header').not($(this)).removeClass('faq-category-qa-visible');
        }
        $(this).toggleClass('faq-category-qa-visible');
        $('div.faq-qa-hide').not($(this).parent().next('div.faq-qa-hide')).addClass("collapsed");
        if (!faq_category_hide_qa_accordion) {
          $(this).parent().next('div.faq-qa-hide').slideToggle('fast', function() {
            $(this).parent().toggleClass('expanded');
          });
        }
        $(this).parent().next('div.faq-qa-hide').toggleClass("collapsed");

        // Scroll the page if the collapsed FAQ is not visible.
        // If we have the toolbar so the title may be hidden by the bar.
        var mainScrollTop = Math.max($('html', context).scrollTop(), $('body', context).scrollTop());
        // We compute mainScrollTop because the behaviour is different on FF, IE and CR
        if (mainScrollTop > $(this).offset().top) {
          $('html, body', context).animate({
            scrollTop: $(this).offset().top
          }, 1);
        }
        
        return false;
      });


      // Show expand all link.
      if (!faq_hide_qa_accordion && !faq_category_hide_qa_accordion) {
        $('#faq-expand-all', context).show();
        $('#faq-expand-all a.faq-expand-all-link', context).show();

        // Add collapse link click event.
        $('#faq-expand-all a.faq-collapse-all-link:not(.faq-processed)', context).addClass('faq-processed').click(function () {
          $(this).hide();
          $('#faq-expand-all a.faq-expand-all-link').show();
          $('div.faq-qa-hide').slideUp('slow', function() {
            $(this).removeClass('expanded');
          });
          $('div.faq-dd-hide-answer').slideUp('slow', function() {
            $(this).removeClass('expanded');
          });
        });

        // Add expand link click event.
        $('#faq-expand-all a.faq-expand-all-link:not(.faq-processed)', context).addClass('faq-processed').click(function () {
          $(this).hide();
          $('#faq-expand-all a.faq-collapse-all-link').show();
          $('div.faq-qa-hide').slideDown('slow', function() {
            $(this).addClass('expanded');
          });
          $('div.faq-dd-hide-answer').slideDown('slow', function() {
            $(this).addClass('expanded');
          });
        });
      }



      // Handle faq_category_settings_form.
      faq_display_handler();
      questions_top_handler();
      categories_handler();
      teaser_handler();
      $("input[name=faq_display]:not(.faq-processed)", context).addClass('faq-processed').bind("click", faq_display_handler);
      $("input[name=faq_qa_mark]:not(.faq-processed)", context).addClass('faq-processed').bind("click", qa_mark_handler);
      $("input[name=faq_use_teaser]:not(.faq-processed)", context).addClass('faq-processed').bind("click", teaser_handler);
      $("input[name=faq_category_display]:not(.faq-processed)", context).addClass('faq-processed').bind("click", categories_handler);
      $("input[name=faq_hide_child_terms]:not(.faq-processed)", context).addClass('faq-processed').bind("click", child_term_handler);
    }
  }
})(jQuery);
;
(function ($) {

Drupal.googleanalytics = {};

$(document).ready(function() {

  // Attach mousedown, keyup, touchstart events to document only and catch
  // clicks on all elements.
  $(document.body).bind("mousedown keyup touchstart", function(event) {

    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {

      // Is the clicked URL internal?
      if (Drupal.googleanalytics.isInternal(this.href)) {
        // Skip 'click' tracking, if custom tracking events are bound.
        if ($(this).is('.colorbox')) {
          // Do nothing here. The custom event will handle all tracking.
          //console.info("Click on .colorbox item has been detected.");
        }
        // Is download tracking activated and the file extension configured for download tracking?
        else if (Drupal.settings.googleanalytics.trackDownload && Drupal.googleanalytics.isDownload(this.href)) {
          // Download link clicked.
          ga("send", "event", "Downloads", Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(), Drupal.googleanalytics.getPageUrl(this.href));
        }
        else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
          // Keep the internal URL for Google Analytics website overlay intact.
          ga("send", "pageview", { page: Drupal.googleanalytics.getPageUrl(this.href) });
        }
      }
      else {
        if (Drupal.settings.googleanalytics.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          ga("send", "event", "Mails", "Click", this.href.substring(7));
        }
        else if (Drupal.settings.googleanalytics.trackOutbound && this.href.match(/^\w+:\/\//i)) {
          if (Drupal.settings.googleanalytics.trackDomainMode != 2 && !Drupal.googleanalytics.isCrossDomain(this.hostname, Drupal.settings.googleanalytics.trackCrossDomains)) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", "event", "Outbound links", "Click", this.href);
          }
        }
      }
    });
  });

  // Track hash changes as unique pageviews, if this option has been enabled.
  if (Drupal.settings.googleanalytics.trackUrlFragments) {
    window.onhashchange = function() {
      ga('send', 'pageview', location.pathname + location.search + location.hash);
    }
  }

  // Colorbox: This event triggers when the transition has completed and the
  // newly loaded content has been revealed.
  $(document).bind("cbox_complete", function () {
    var href = $.colorbox.element().attr("href");
    if (href) {
      ga("send", "pageview", { page: Drupal.googleanalytics.getPageUrl(href) });
    }
  });

});

/**
 * Check whether the hostname is part of the cross domains or not.
 *
 * @param string hostname
 *   The hostname of the clicked URL.
 * @param array crossDomains
 *   All cross domain hostnames as JS array.
 *
 * @return boolean
 */
Drupal.googleanalytics.isCrossDomain = function (hostname, crossDomains) {
  /**
   * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
   * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
   * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
   *
   * @todo: Remove/Refactor in D8
   */
  if (!crossDomains) {
    return false;
  }
  else {
    return $.inArray(hostname, crossDomains) > -1 ? true : false;
  }
}

/**
 * Check whether this is a download URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isDownload = function (url) {
  var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  return isDownload.test(url);
}

/**
 * Check whether this is an absolute internal URL or not.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternal = function (url) {
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return isInternal.test(url);
}

/**
 * Check whether this is a special URL or not.
 *
 * URL types:
 *  - gotwo.module /go/* links.
 *
 * @param string url
 *   The web url to check.
 *
 * @return boolean
 */
Drupal.googleanalytics.isInternalSpecial = function (url) {
  var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
  return isInternalSpecial.test(url);
}

/**
 * Extract the relative internal URL from an absolute internal URL.
 *
 * Examples:
 * - http://mydomain.com/node/1 -> /node/1
 * - http://example.com/foo/bar -> http://example.com/foo/bar
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   Internal website URL
 */
Drupal.googleanalytics.getPageUrl = function (url) {
  var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
  return url.replace(extractInternalUrl, '');
}

/**
 * Extract the download file extension from the URL.
 *
 * @param string url
 *   The web url to check.
 *
 * @return string
 *   The file extension of the passed url. e.g. "zip", "txt"
 */
Drupal.googleanalytics.getDownloadExtension = function (url) {
  var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
  var extension = extractDownloadextension.exec(url);
  return (extension === null) ? '' : extension[1];
}

})(jQuery);
;
