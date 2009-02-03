/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("qx.test.ui.virtual.layer.LayerMock",
{
  extend : qx.ui.core.Widget,
  implement : [qx.ui.virtual.core.ILayer],
  
  construct : function() 
  {
    this.base(arguments);
    
    this.calls = [];
  },
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    fullUpdate : function(
      firstRow, lastRow, 
      firstColumn, lastColumn, 
      rowSizes, columnSizes
    ) {    
      this.calls.push(["fullUpdate", qx.lang.Array.fromArguments(arguments)]);
    },
    
    
    updateLayerWindow : function(
      firstRow, lastRow, 
      firstColumn, lastColumn, 
      rowSizes, columnSizes  
    ) {
      this.calls.push(["updateLayerWindow", qx.lang.Array.fromArguments(arguments)]);
    }
  }
});