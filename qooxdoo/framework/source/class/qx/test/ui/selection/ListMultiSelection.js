/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Schmidt (chris_schmidt)

************************************************************************ */

qx.Class.define("qx.test.ui.selection.ListMultiSelection",
{
  extend : qx.test.ui.selection.AbstractMultiSelectonTest,

  members :
  {
    setUp : function()
    {
      var length = 10;
      this._selection = [];
      this._mode = "multi";
      
      this._widget = new qx.ui.form.List().set(
      {
        selectionMode: this._mode,
        width : 200,
        height : 400
      });
      this.getRoot().add(this._widget);
      
      var selection = this._widget.getSelection();
      this.assertIdentical(selection.length, 0, 
        "Couldn't setup test, because selection isn't empty");
      
      for (var i = 0; i < length; i++) {
        var item = new qx.ui.form.ListItem("ListItem" + i);
        this._widget.add(item);
        
        if (i % 2 == 0) {
          this._widget.addToSelection(item);
          this._selection[i / 2] = item;
        }
      }
      
      this.flush();
    },

    tearDown : function()
    {
      this.getRoot().removeAll();
      this._widget.destroy();
      this._widget = null;
      this._selection = null;
    },
    
    _getChildren : function() 
    {
      if (this._widget != null) {
        return this._widget.getChildren();
      } else {
        return [];
      }
    },
    
    _createTestElement : function(name) {
      return new qx.ui.form.ListItem(name);
    }
  }
});