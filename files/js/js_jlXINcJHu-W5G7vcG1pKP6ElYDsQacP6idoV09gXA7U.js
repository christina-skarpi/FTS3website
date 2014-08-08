
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
