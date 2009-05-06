﻿/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Christian Schmidt (chris_schmidt)

************************************************************************ */

/**
 * This mixin links all methods to manage the multi selection from the
 * internal selection manager to the widget.
 */
qx.Mixin.define("qx.ui.core.MMultiSelectionHandling",
{
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    // Create selection manager
    var clazz = this.SELECTION_MANAGER;
    var manager = this.__manager = new clazz(this);

    // Add widget event listeners
    this.addListener("mousedown", manager.handleMouseDown, manager);
    this.addListener("mouseup", manager.handleMouseUp, manager);
    this.addListener("mouseover", manager.handleMouseOver, manager);
    this.addListener("mousemove", manager.handleMouseMove, manager);
    this.addListener("losecapture", manager.handleLoseCapture, manager);
    this.addListener("keypress", manager.handleKeyPress, manager);

    this.addListener("addItem", manager.handleAddItem, manager);
    this.addListener("removeItem", manager.handleRemoveItem, manager);

    // Add manager listeners
    manager.addListener("changeSelection", this._onSelectionChange, this);
  },


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fires after the selection was modified */
    "changeSelection" : "qx.event.type.Data"
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  
  properties :
  {
    /**
     * The selection mode to use.
     *
     * For further details please have a look at:
     * {@link qx.ui.core.selection.Abstract#mode}
     */
    selectionMode :
    {
      check : [ "single", "multi", "additive", "one" ],
      init : "single",
      apply : "_applySelectionMode"
    },

    /**
     * Enable drag selection (multi selection of items through
     * dragging the mouse in pressed states).
     *
     * Only possible for the selection modes <code>multi</code> and <code>additive</code>
     */
    dragSelection :
    {
      check : "Boolean",
      init : false,
      apply : "_applyDragSelection"
    },

    /**
     * Enable quick selection mode, where no click is needed to change the selection.
     *
     * Only possible for the modes <code>single</code> and <code>one</code>.
     */
    quickSelection :
    {
      check : "Boolean",
      init : false,
      apply : "_applyQuickSelection"
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  
  members :
  {
    /** {qx.ui.core.selection.Abstract} The selection manager */
    __manager : null,


    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    
    /**
     * Selects all items of the managed object.
     */
    selectAll : function() {
      this.__manager.selectAll();
    },

    /**
     * Selects the given item. Replaces current selection
     * completely with the new item.
     *
     * Use {@link #addToSelection} instead if you want to add new
     * items to an existing selection.
     *
     * @deprecated Use 'setSelection' instead!
     * @param item {qx.ui.core.Widget} Any valid item.
     */
    select : function(item) {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'setSelection' instead!"
      );
      this.setSelection([item]);
    },

    /**
     * Selects the given item. Replaces current selection
     * completely with the new item.
     *
     * @deprecated Use 'setSelection' instead!
     * @param item {qx.ui.core.Widget} Any valid item.
     */
    setSelected : function(item) {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'setSelection' instead!"
      );
      this.setSelection([item]);
    },
    
    /**
     * Detects whether the given item is currently selected.
     *
     * @param item {qx.ui.core.Widget} Any valid selectable item.
     * @return {Boolean} Whether the item is selected.
     * @throws an exception if the item is not a child element.
     */
    isSelected : function(item) {
      if (!qx.ui.core.Widget.contains(this, item)) {
        throw new Error("Could not test if " + item + 
          " is selected, because it is not a child element!");
      }
      
      return this.__manager.isItemSelected(item);
    },

    /**
     * Adds the given item to the existing selection.
     *
     * Use {@link #setSelection} instead if you want to replace
     * the current selection.
     *
     * @param item {qx.ui.core.Widget} Any valid item.
     * @throws an exception if the item is not a child element.
     */
    addToSelection : function(item) {
      if (!qx.ui.core.Widget.contains(this, item)) {
        throw new Error("Could not add + " + item + 
          " to selection, because it is not a child element!");
      }
      
      this.__manager.addItem(item);
    },

    /**
     * Removes the given item from the selection.
     *
     * Use {@link #resetSelection} when you want to clear
     * the whole selection at once.
     *
     * @param item {qx.ui.core.Widget} Any valid item
     * @throws an exception if the item is not a child element.
     */
    removeFromSelection : function(item) {
      if (!qx.ui.core.Widget.contains(this, item)) {
        throw new Error("Could not remove " + item + 
          " from selection, because it is not a child element!");
      }
      
      this.__manager.removeItem(item);
    },

    /**
     * Selects an item range between two given items.
     *
     * @param begin {qx.ui.core.Widget} Item to start with
     * @param end {qx.ui.core.Widget} Item to end at
     */
    selectRange : function(begin, end) {
      this.__manager.selectItemRange(begin, end);
    },

    /**
     * Clears the whole selection at once. Also
     * resets the lead and anchor items and their
     * styles.
     *
     * @deprecated Use 'resetSelection' instead!
     */
    clearSelection : function() {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'resetSelection' instead!"
      );
      this.resetSelection();
    },

    /**
     * Clears the whole selection at once. Also
     * resets the lead and anchor items and their
     * styles.
     */
    resetSelection : function() {
      this.__manager.clearSelection();
    },
    
    /**
     * Replaces current selection with the given items
     *
     * @deprecated Use 'setSelection' instead!
     * @param items {qx.ui.core.Widget} Items to select
     */
    replaceSelection : function(items) {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'setSelection' instead!"
      );
      this.setSelection(items);
    },

    /**
     * Replaces current selection with the given items.
     *
     * @param items {qx.ui.core.Widget[]} Items to select.
     * @throws an exception if one of the itmes is not a child element and if 
     *    the mode is set to <code>single</code> or <code>one</code> and 
     *    the items contains more than one item. 
     */
    setSelection : function(items) {
      for (var i = 0; i < items.length; i++) {
        if (!qx.ui.core.Widget.contains(this, items[i])) {
          throw new Error("Could not select " + items[i] + 
            ", because it is not a child element!");
        }
      }
      
      this.__manager.replaceSelection(items);
    },
    
    /**
     * Get the selected item. This method does only work in <code>single</code>
     * selection mode.
     *
     * @deprecated Use 'getSelection' instead!
     * @return {qx.ui.core.Widget} The selected item.
     */
    getSelectedItem : function() {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'getSelection' instead!"
      );
      var result = this.getSelection();
      
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    },
    
    /**
     * Get the selected item.
     *
     * @deprecated Use 'getSelection' instead!
     * @return {qx.ui.core.Widget} The selected item.
     */
    getSelected : function() {
      qx.log.Logger.deprecatedMethodWarning(
        arguments.callee,
        "Use 'getSelection' instead!"
      );
      var result = this.getSelection();
      
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    },

    /**
     * Returns an array of currently selected items.
     *
     * @return {qx.ui.core.Widget[]} List of items.
     */
    getSelection : function() {
      return this.__manager.getSelection();
    },

    /**
     * Returns an array of currently selected items sorted
     * by their index in the container.
     *
     * @return {qx.ui.core.Widget[]} Sorted list of items
     */
    getSortedSelection : function() {
      return this.__manager.getSortedSelection();
    },

    /**
     * Whether the selection is empty
     *
     * @return {Boolean} Whether the selection is empty
     */
    isSelectionEmpty : function() {
      return this.__manager.isSelectionEmpty();
    },

    /**
     * Returns the last selection context.
     * 
     * @return {String | null} One of <code>click</code>, <code>quick</code>, 
     *    <code>drag</code> or <code>key</code> or <code>null</code>.
     */
    getSelectionContext : function() {
      return this.__manager.getSelectionContext();
    },

    /**
     * Returns the internal selection manager. Use this with
     * caution!
     *
     * @return {qx.ui.core.selection.Abstract} The selection manager
     */
    _getManager : function() {
      return this.__manager;
    },

    /**
     * Returns all elements which are selectable.
     * 
     * @return {qx.ui.core.Widget[]} The contained items.
     */
    getSelectables: function() {
      return this.__manager.getSelectables();
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    
    // property apply
    _applySelectionMode : function(value, old) {
      this.__manager.setMode(value);
    },

    // property apply
    _applyDragSelection : function(value, old) {
      this.__manager.setDrag(value);
    },

    // property apply
    _applyQuickSelection : function(value, old) {
      this.__manager.setQuick(value);
    },


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */

    
    /**
     * Event listener for <code>changeSelection</code> event on selection manager.
     *
     * @param e {qx.event.type.Data} Data event
     */
    _onSelectionChange : function(e) {
      this.fireDataEvent("changeSelection", e.getData());
    }
  },


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  
  destruct : function() {
    this._disposeObjects("__manager");
  }
});