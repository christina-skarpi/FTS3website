
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
  Drupal.behaviors.content_type_extras_cancel_button = {
    attach: function(context, settings) {
      
      if($('form.node-form #edit-cancel').hasClass('cte-processed') ||
         $('form.node-form #edit-cancel--2').hasClass('cte-processed')) {
           return;
      }
      else {
        $('form.node-form #edit-cancel, form.node-form #edit-cancel--2').addClass('cte-processed');      
        $('form.node-form #edit-cancel, form.node-form #edit-cancel--2').click(function() {
         var answer = confirm(Drupal.t('Are you sure you want to cancel and lose all changes?'));
          if (answer) {
            history.go(-1);
          }
        });      
      }
    }
  }
})(jQuery);
;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .closest('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;

(function ($) {

/**
 * Auto-hide summary textarea if empty and show hide and unhide links.
 */
Drupal.behaviors.textSummary = {
  attach: function (context, settings) {
    $('.text-summary', context).once('text-summary', function () {
      var $widget = $(this).closest('div.field-type-text-with-summary');
      var $summaries = $widget.find('div.text-summary-wrapper');

      $summaries.once('text-summary-wrapper').each(function(index) {
        var $summary = $(this);
        var $summaryLabel = $summary.find('label');
        var $full = $widget.find('.text-full').eq(index).closest('.form-item');
        var $fullLabel = $full.find('label');

        // Create a placeholder label when the field cardinality is
        // unlimited or greater than 1.
        if ($fullLabel.length == 0) {
          $fullLabel = $('<label></label>').prependTo($full);
        }

        // Setup the edit/hide summary link.
        var $link = $('<span class="field-edit-link">(<a class="link-edit-summary" href="#">' + Drupal.t('Hide summary') + '</a>)</span>').toggle(
          function () {
            $summary.hide();
            $(this).find('a').html(Drupal.t('Edit summary')).end().appendTo($fullLabel);
            return false;
          },
          function () {
            $summary.show();
            $(this).find('a').html(Drupal.t('Hide summary')).end().appendTo($summaryLabel);
            return false;
          }
        ).appendTo($summaryLabel);

        // If no summary is set, hide the summary field.
        if ($(this).find('.text-summary').val() == '') {
          $link.click();
        }
        return;
      });
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.input.value = $(this.selected).data('autocompleteValue');
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.select(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway.
  searchString = searchString.replace(/^\s+|\s+$/, '');
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.pathFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.path-form', context).drupalSetSummary(function (context) {
      var path = $('.form-item-path-alias input').val();
      var automatic = $('.form-item-path-pathauto input').attr('checked');

      if (automatic) {
        return Drupal.t('Automatic alias');
      }
      if (path) {
        return Drupal.t('Alias: @alias', { '@alias': path });
      }
      else {
        return Drupal.t('No alias');
      }
    });
  }
};

})(jQuery);
;
/**
 * @file
 * Javascript behaviors for the Book module.
 */

(function ($) {

Drupal.behaviors.bookFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.book-outline-form', context).drupalSetSummary(function (context) {
      var $select = $('.form-item-book-bid select');
      var val = $select.val();

      if (val === '0') {
        return Drupal.t('Not in book');
      }
      else if (val === 'new') {
        return Drupal.t('New book');
      }
      else {
        return Drupal.checkPlain($select.find(':selected').text());
      }
    });
  }
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.commentFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.comment-node-settings-form', context).drupalSetSummary(function (context) {
      return Drupal.checkPlain($('.form-item-comment input:checked', context).next('label').text());
    });

    // Provide the summary for the node type form.
    $('fieldset.comment-node-type-settings-form', context).drupalSetSummary(function(context) {
      var vals = [];

      // Default comment setting.
      vals.push($(".form-item-comment select option:selected", context).text());

      // Threading.
      var threading = $(".form-item-comment-default-mode input:checked", context).next('label').text();
      if (threading) {
        vals.push(threading);
      }

      // Comments per page.
      var number = $(".form-item-comment-default-per-page select option:selected", context).val();
      vals.push(Drupal.t('@number comments per page', {'@number': number}));

      return Drupal.checkPlain(vals.join(', '));
    });
  }
};

})(jQuery);
;

(function ($) {

Drupal.behaviors.nodeFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.node-form-revision-information', context).drupalSetSummary(function (context) {
      var revisionCheckbox = $('.form-item-revision input', context);

      // Return 'New revision' if the 'Create new revision' checkbox is checked,
      // or if the checkbox doesn't exist, but the revision log does. For users
      // without the "Administer content" permission the checkbox won't appear,
      // but the revision log will if the content type is set to auto-revision.
      if (revisionCheckbox.is(':checked') || (!revisionCheckbox.length && $('.form-item-log textarea', context).length)) {
        return Drupal.t('New revision');
      }

      return Drupal.t('No revision');
    });

    $('fieldset.node-form-author', context).drupalSetSummary(function (context) {
      var name = $('.form-item-name input', context).val() || Drupal.settings.anonymous,
        date = $('.form-item-date input', context).val();
      return date ?
        Drupal.t('By @name on @date', { '@name': name, '@date': date }) :
        Drupal.t('By @name', { '@name': name });
    });

    $('fieldset.node-form-options', context).drupalSetSummary(function (context) {
      var vals = [];

      $('input:checked', context).parent().each(function () {
        vals.push(Drupal.checkPlain($.trim($(this).text())));
      });

      if (!$('.form-item-status input', context).is(':checked')) {
        vals.unshift(Drupal.t('Not published'));
      }
      return vals.join(', ');
    });
  }
};

})(jQuery);
;
/**
 * @file
 * Drupal to Google Maps API bridge.
 */

/*global jQuery, Drupal, GLatLng, GSmallZoomControl, GLargeMapControl, GMap2 */
/*global GMapTypeControl, GSmallMapControl, G_HYBRID_MAP, G_NORMAL_MAP */
/*global G_PHYSICAL_MAP, G_SATELLITE_MAP, GHierarchicalMapTypeControl */
/*global GKeyboardHandler, GLatLngBounds, GMenuMapTypeControl, GEvent */
/*global GOverviewMapControl, GScaleControl, GUnload */

(function () { // BEGIN closure
    var handlers = {};
    var maps = {};
    var ajaxoffset = 0;

    Drupal.gmap = {

        /**
         * Retrieve a map object for use by a non-widget.
         * Use this if you need to be able to fire events against a certain map
         * which you have the mapid for.
         * Be a good GMap citizen! Remember to send change()s after modifying variables!
         */
        getMap: function (mapid) {
            if (maps[mapid]) {
                return maps[mapid];
            }
            else {
                // Perhaps the user passed a widget id instead?
                mapid = mapid.split('-').slice(1, -1).join('-');
                if (maps[mapid]) {
                    return maps[mapid];
                }
            }
            return false;
        },

        unloadMap: function (mapid) {
            delete maps[mapid];
        },

        addHandler: function (handler, callback) {
            if (!handlers[handler]) {
                handlers[handler] = [];
            }
            handlers[handler].push(callback);
        },

        globalChange: function (name, userdata) {
            for (var mapid in Drupal.settings.gmap) {
                if (Drupal.settings.gmap.hasOwnProperty(mapid)) {
                    // Skip maps that are set up but not shown, etc.
                    if (maps[mapid]) {
                        maps[mapid].change(name, -1, userdata);
                    }
                }
            }
        },

        setup: function (settings) {
            var obj = this;

            var initcallback = function (mapid) {
                return (function () {
                    maps[mapid].change("bootstrap_options", -1);
                    maps[mapid].change("boot", -1);
                    maps[mapid].change("init", -1);
                    // Send some changed events to fire up the rest of the initial settings..
                    maps[mapid].change("maptypechange", -1);
                    maps[mapid].change("controltypechange", -1);
                    maps[mapid].change("alignchange", -1);
                    // Set ready to put the event system into action.
                    maps[mapid].ready = true;
                    maps[mapid].change("ready", -1);
                });
            };

            if (settings || (Drupal.settings && Drupal.settings.gmap)) {
                var mapid = obj.id.split('-');
                if (Drupal.settings['gmap_remap_widgets']) {
                    if (Drupal.settings['gmap_remap_widgets'][obj.id]) {
                        jQuery.each(Drupal.settings['gmap_remap_widgets'][obj.id].classes, function () {
                            jQuery(obj).addClass(this);
                        });
                        mapid = Drupal.settings['gmap_remap_widgets'][obj.id].id.split('-');
                    }
                }
                var instanceid = mapid.pop();
                mapid.shift();
                mapid = mapid.join('-');
                var control = instanceid.replace(/\d+$/, '');

                // Lazy init the map object.
                if (!maps[mapid]) {
                    if (settings) {
                        maps[mapid] = new Drupal.gmap.map(settings);
                    }
                    else {
                        maps[mapid] = new Drupal.gmap.map(Drupal.settings.gmap[mapid]);
                    }
                    // Prepare the initialization callback.
                    var callback = initcallback(mapid);
                    setTimeout(callback, 0);
                }

                if (handlers[control]) {
                    for (var i = 0; i < handlers[control].length; i++) {
                        handlers[control][i].call(maps[mapid], obj);
                    }
                }
                else {
                    // Element with wrong class?
                }
            }
        }
    };

    jQuery.fn.createGMap = function (settings, mapid) {
        return this.each(function () {
            if (!mapid) {
                mapid = 'auto' + ajaxoffset + 'ajax';
                ajaxoffset++;
            }
            settings.id = mapid;
            jQuery(this)
                .attr('id', 'gmap-' + mapid + '-gmap0')
                .css('width', settings.width)
                .css('height', settings.height)
                .addClass('gmap-control')
                .addClass('gmap-gmap')
                .addClass('gmap')
                .addClass('gmap-map')
                .addClass('gmap-' + mapid + '-gmap')
                .addClass('gmap-processed')
                .each(function () {
                    Drupal.gmap.setup.call(this, settings)
                });
        });
    };

})(); // END closure

Drupal.gmap.factory = {};

Drupal.gmap.map = function (v) {
    this.vars = v;
    this.map = undefined;
    this.ready = false;
    var _bindings = {};

    /**
     * Register interest in a change.
     */
    this.bind = function (name, callback) {
        if (!_bindings[name]) {
            _bindings[name] = [];
        }
        return _bindings[name].push(callback) - 1;
    };

    /**
     * Change notification.
     * Interested parties can act on changes.
     */
    this.change = function (name, id, userdata) {
        var c;
        if (_bindings[name]) {
            for (c = 0; c < _bindings[name].length; c++) {
                if (c !== id) {
                    _bindings[name][c](userdata);
                }
            }
        }
        if (name !== 'all') {
            this.change('all', -1, name, userdata);
        }
    };

    /**
     * Deferred change notification.
     * This will cause a change notification to be tacked on to the *end* of the event queue.
     */
    this.deferChange = function (name, id, userdata) {
        var obj = this;
        // This will move the function call to the end of the event loop.
        setTimeout(function () {
            obj.change(name, id, userdata);
        }, 0);
    };

    this.getMapTypeName = function (type) {
        if (type == 'map' || type == 'roadmap') return 'Map';
        if (type == 'hybrid') return 'Hybrid';
        if (type == 'physical' || type == 'terrain') return 'Physical';
        if (type == 'satellite') return 'Satellite';
    };

    this.getMapTypeId = function (type) {
        if (type == 'Map' || type == 'Roadmap') return google.maps.MapTypeId.ROADMAP;
        if (type == 'Hybrid') return google.maps.MapTypeId.HYBRID;
        if (type == 'Physical' || type == 'Terrain') return google.maps.MapTypeId.TERRAIN;
        if (type == 'Satellite') return google.maps.MapTypeId.SATELLITE;
    };
};

////////////////////////////////////////
//             Map widget             //
////////////////////////////////////////
Drupal.gmap.addHandler('gmap', function (elem) {
    var obj = this;
    var _ib = {};

    // Respond to incoming zooms
    _ib.zoom = obj.bind("zoom", function (zoom) {
        obj.map.setZoom(obj.vars.zoom);
    });

    // Respond to incoming moves
    _ib.move = obj.bind("move", function () {
        obj.map.panTo(new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude));
    });

    // Respond to incoming width changes.
    _ib.width = obj.bind("widthchange", function (w) {
        obj.map.getDiv().style.width = w;
        google.maps.event.trigger(obj.map);
    });
    // Send out outgoing width changes.
    // N/A
    // Respond to incoming height changes.
    _ib.height = obj.bind("heightchange", function (h) {
        obj.map.getDiv().style.height = h;
        google.maps.event.trigger(obj.map);
    });
    // Send out outgoing height changes.
    // N/A

    // Respond to incoming control type changes.
    _ib.ctc = obj.bind("controltypechange", function () {
        if (obj.vars.controltype === 'Small') {
            obj.map.setOptions({zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL}});
        }
        else if (obj.vars.controltype === 'Large') {
            obj.map.setOptions({zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE}});
        }
        // obsolete
        else if (obj.vars.controltype === 'Android') {
            obj.map.setOptions({zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL}});
        }
    });
    // Send out outgoing control type changes.
    // N/A

    // Respond to incoming map type changes.
    _ib.mtc = obj.bind("maptypechange", function () {
        obj.map.setMapTypeId(obj.getMapTypeId(obj.vars.maptype));
    });
    // Send out outgoing map type changes.
    // N/A

    obj.bind("bootstrap_options", function () {
        // Bootup options.
        var opts = {}; // Object literal google.maps.MapOptions
        obj.opts = opts;

        // Disable default UI for custom options
        opts.disableDefaultUI = true;

        // Set draggable property
        if (obj.vars.behavior.nodrag) {
            opts.draggable = false;
        }
        else if (obj.vars.behavior.nokeyboard) {
            opts.keyboardShortcuts = false;
        }

        // Set default map type (set to road map if nothing selected)
        switch (obj.vars.maptype) {
            case 'Hybrid':
                opts.mapTypeId = google.maps.MapTypeId.HYBRID;
                break;
            case 'Physical':
                opts.mapTypeId = google.maps.MapTypeId.TERRAIN;
                break;
            case 'Satellite':
                opts.mapTypeId = google.maps.MapTypeId.SATELLITE;
                break;
            case 'Map':
            default:
                opts.mapTypeId = google.maps.MapTypeId.ROADMAP;
                break;
        }

        // Null out the enabled types.
        opts.mapTypeIds = [];

        if (obj.vars.baselayers.Map) {
            opts.mapTypeIds.push(google.maps.MapTypeId.ROADMAP);
        }
        if (obj.vars.baselayers.Hybrid) {
            opts.mapTypeIds.push(google.maps.MapTypeId.HYBRID);
        }
        if (obj.vars.baselayers.Physical) {
            opts.mapTypeIds.push(google.maps.MapTypeId.TERRAIN);
        }
        if (obj.vars.baselayers.Satellite) {
            opts.mapTypeIds.push(google.maps.MapTypeId.SATELLITE);
        }

        if (obj.vars.draggableCursor) {
            opts.draggableCursor = obj.vars.draggableCursor;
        }
        if (obj.vars.draggingCursor) {
            opts.draggingCursor = obj.vars.draggingCursor;
        }
        if (obj.vars.backgroundColor) {
            opts.backgroundColor = obj.vars.backgroundColor;
        }

        // Map type control
        opts.mapTypeControl = true;
        opts.mapTypeControlOptions = {};
        if (obj.vars.mtc === 'standard') {
            opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.DEFAULT;
        }
        else if (obj.vars.mtc === 'horiz') {
            opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
        }
        else if (obj.vars.mtc === 'menu') {
            opts.mapTypeControlOptions.style = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
        }
        else if (obj.vars.mtc === 'none') {
            opts.mapTypeControl = false;
        }

        // Navigation control type
        if (obj.vars.controltype !== 'None') {
            opts.zoomControl = true;
        }
        if (obj.vars.pancontrol) {
            opts.panControl = true;
        }
        if (obj.vars.streetviewcontrol) {
            opts.streetViewControl = true;
        }
        if (obj.vars.controltype === 'Small') {
            obj.zoomControlOptions = {style: google.maps.ZoomControlStyle.SMALL};
        }
        else if (obj.vars.controltype === 'Large') {
            obj.zoomControlOptions = {style: google.maps.ZoomControlStyle.LARGE};
        }


        // Set scale control visibility
        opts.scaleControl = obj.vars.behavior.scale;

        // Scroll wheel control
        if (obj.vars.behavior.nomousezoom) {
            opts.scrollwheel = false;
        }
        // Disable double-click zoom
        if (obj.vars.behavior.nocontzoom) {
            opts.disableDoubleClickZoom = true;
        }
        // Overview Map
        if (obj.vars.behavior.overview) {
            opts.overviewMapControl = true;
            opts.overviewMapControlOptions = {opened: true};
        }

    });

    obj.bind("boot", function () {
        obj.map = new google.maps.Map(elem, obj.opts);
        //console.log(obj.map);
    });

    obj.bind("init", function () {
        var map = obj.map;

        // Not implemented in API v3
        // if (obj.vars.behavior.overview) {
        //   map.addControl(new GOverviewMapControl());
        // }
        // if (obj.vars.behavior.googlebar) {
        //   map.enableGoogleBar();
        // }

        if (obj.vars.extent) {
            var c = obj.vars.extent;
            var extent = new google.maps.LatLngBounds(new google.maps.LatLng(c[0][0], c[0][1]), new google.maps.LatLng(c[1][0], c[1][1]));
            obj.vars.latitude = extent.getCenter().lat();
            obj.vars.longitude = extent.getCenter().lng();
            obj.vars.zoom = map.getBoundsZoomLevel(extent);
        }
        if (obj.vars.behavior.collapsehack) {
            // Modify collapsable fieldsets to make maps check dom state when the resize handle
            // is clicked. This may not necessarily be the correct thing to do in all themes,
            // hence it being a behavior.
            setTimeout(function () {
                var r = function () {
                    var coord = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(new google.maps.LatLng(coord.lat(), coord.lng()), obj.vars.zoom);
                };
                jQuery(elem).parents('fieldset.collapsible').children('legend').children('a').click(r);
                jQuery('.vertical-tab-button', jQuery(elem).parents('.vertical-tabs')).children('a').click(r);
                jQuery(window).bind('hashchange', r);
                // Would be nice, but doesn't work.
                //$(elem).parents('fieldset.collapsible').children('.fieldset-wrapper').scroll(r);
            }, 0);
        }
        map.setCenter(new google.maps.LatLng(obj.vars.latitude, obj.vars.longitude));
        map.setZoom(obj.vars.zoom);

        // Send out outgoing zooms
        google.maps.event.addListener(map, "zoom_changed", function () {
            obj.vars.zoom = map.getZoom();
            obj.change("zoom", _ib.zoom);
        });

        // Send out outgoing moves
        google.maps.event.addListener(map, "center_changed", function () {
            var coord = map.getCenter();
            obj.vars.latitude = coord.lat();
            obj.vars.longitude = coord.lng();
            obj.change("move", _ib.move);
        });

        // Send out outgoing map type changes.
        google.maps.event.addListener(map, "maptypeid_changed", function () {
            // If the map isn't ready yet, ignore it.
            if (obj.ready) {
                obj.vars.maptype = obj.getMapTypeName(map.getMapTypeId());
                obj.change("maptypechange", _ib.mtc);
            }
        });

        /*
         google.maps.event.addListener(map, 'click', function(event) {
         alert(Drupal.gmap.getIcon("big blue", 0));
         var marker = new google.maps.Marker({
         position: event.latLng,
         map: map
         });
         google.maps.event.addListener(marker, 'click', function() {
         marker.setMap(null);
         });
         });
         */
    });
});

////////////////////////////////////////
//            Zoom widget             //
////////////////////////////////////////
Drupal.gmap.addHandler('zoom', function (elem) {
    var obj = this;
    // Respond to incoming zooms
    var binding = obj.bind("zoom", function () {
        elem.value = obj.vars.zoom;
    });
    // Send out outgoing zooms
    jQuery(elem).change(function () {
        obj.vars.zoom = parseInt(elem.value, 10);
        obj.change("zoom", binding);
    });
});

////////////////////////////////////////
//          Latitude widget           //
////////////////////////////////////////
Drupal.gmap.addHandler('latitude', function (elem) {
//  var obj = this;
//  // Respond to incoming movements.
//  var binding = obj.bind("move", function () {
//    elem.value = '' + obj.vars.latitude;
//  });
//  // Send out outgoing movements.
//  $(elem).change(function () {
//    obj.vars.latitude = Number(this.value);
//    obj.change("move", binding);
//  });
});

////////////////////////////////////////
//         Longitude widget           //
////////////////////////////////////////
Drupal.gmap.addHandler('longitude', function (elem) {
//  var obj = this;
//  // Respond to incoming movements.
//  var binding = obj.bind("move", function () {
//    elem.value = '' + obj.vars.longitude;
//  });
//  // Send out outgoing movements.
//  $(elem).change(function () {
//    obj.vars.longitude = Number(this.value);
//    obj.change("move", binding);
//  });
});

////////////////////////////////////////
//          Latlon widget             //
////////////////////////////////////////
Drupal.gmap.addHandler('latlon', function (elem) {
    var obj = this;
    // Respond to incoming movements.
    var binding = obj.bind("move", function () {
        elem.value = '' + obj.vars.latitude + ',' + obj.vars.longitude;
    });
    // Send out outgoing movements.
    jQuery(elem).change(function () {
        var t = this.value.split(',');
        obj.vars.latitude = Number(t[0]);
        obj.vars.longitude = Number(t[1]);
        obj.change("move", binding);
    });
});

////////////////////////////////////////
//          Maptype widget            //
////////////////////////////////////////
Drupal.gmap.addHandler('maptype', function (elem) {
    var obj = this;
    // Respond to incoming movements.
    var binding = obj.bind("maptypechange", function () {
        elem.value = obj.vars.maptype;
    });
    // Send out outgoing movements.
    jQuery(elem).change(function () {
        obj.vars.maptype = elem.value;
        obj.change("maptypechange", binding);
    });
});

(function () { // BEGIN CLOSURE
    var re = /([0-9.]+)\s*(em|ex|px|in|cm|mm|pt|pc|%)/;
    var normalize = function (str) {
        var ar;
        if ((ar = re.exec(str.toLowerCase()))) {
            return ar[1] + ar[2];
        }
        return null;
    };

    ////////////////////////////////////////
    //           Width widget             //
    ////////////////////////////////////////
    Drupal.gmap.addHandler('width', function (elem) {
        var obj = this;
        // Respond to incoming width changes.
        var binding = obj.bind("widthchange", function (w) {
            elem.value = normalize(w);
        });
        // Send out outgoing width changes.
        jQuery(elem).change(function () {
            var n;
            if ((n = normalize(elem.value))) {
                elem.value = n;
                obj.change('widthchange', binding, n);
            }
        });
        obj.bind('init', function () {
            jQuery(elem).change();
        });
    });

    ////////////////////////////////////////
    //           Height widget            //
    ////////////////////////////////////////
    Drupal.gmap.addHandler('height', function (elem) {
        var obj = this;
        // Respond to incoming height changes.
        var binding = obj.bind("heightchange", function (h) {
            elem.value = normalize(h);
        });
        // Send out outgoing height changes.
        jQuery(elem).change(function () {
            var n;
            if ((n = normalize(elem.value))) {
                elem.value = n;
                obj.change('heightchange', binding, n);
            }
        });
        obj.bind('init', function () {
            jQuery(elem).change();
        });
    });
})(); // END CLOSURE

////////////////////////////////////////
//        Control type widget         //
////////////////////////////////////////
Drupal.gmap.addHandler('controltype', function (elem) {
    var obj = this;
    // Respond to incoming height changes.
    var binding = obj.bind("controltypechange", function () {
        elem.value = obj.vars.controltype;
    });
    // Send out outgoing height changes.
    jQuery(elem).change(function () {
        obj.vars.controltype = elem.value
        obj.change("controltypechange", binding);
    });
});

// // Map cleanup.
// if (Drupal.jsEnabled) {
//   $(document).unload(GUnload);
// }

Drupal.behaviors.GMap = {
    attach: function (context, settings) {
        if (Drupal.settings && Drupal.settings['gmap_remap_widgets']) {
            jQuery.each(Drupal.settings['gmap_remap_widgets'], function (key, val) {
                jQuery('#' + key).addClass('gmap-control');
            });
        }
        jQuery('.gmap-gmap:not(.gmap-processed)', context).addClass('gmap-processed').each(function () {
            Drupal.gmap.setup.call(this)
        });
        jQuery('.gmap-control:not(.gmap-processed)', context).addClass('gmap-processed').each(function () {
            Drupal.gmap.setup.call(this)
        });
    },
    detach: function (context, settings) {
        jQuery('.gmap-processed', context).each(function (element) {
            //find mapid
            var id = jQuery(this).attr('id');
            var mapid = id.split('-', 2);

            //unload map
            Drupal.gmap.unloadMap(mapid[1]);
        });
    }
};
;
