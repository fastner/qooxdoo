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
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("qx.test.lang.Type",
{
  extend : qx.dev.unit.TestCase,

  members :
  {
    testIsString : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isString(""));
      this.assertTrue(Type.isString("Juhu"));
      this.assertTrue(Type.isString(new String("Juhu")));
      this.assertTrue(Type.isString(new qx.locale.LocalizedString("Juhu")));
      this.assertTrue(Type.isString(new qx.type.BaseString("juhu")));
      
      this.assertFalse(Type.isString());
      this.assertFalse(Type.isString(function() {}));
      this.assertFalse(Type.isString(null));
      this.assertFalse(Type.isString(2));
      this.assertFalse(Type.isString({}));
      this.assertFalse(Type.isString([]));
      this.assertFalse(Type.isString(/juhu/));
    },
    
    
    testIsArray : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isArray([]));
      this.assertTrue(Type.isArray(new Array()));
      this.assertTrue(Type.isArray(new qx.type.BaseArray()));
      this.assertTrue(Type.isArray(new qx.bom.Collection()));
      
      this.assertFalse(Type.isArray());
      this.assertFalse(Type.isArray(function() {}));
      this.assertFalse(Type.isArray(""));
      this.assertFalse(Type.isArray(null));
      this.assertFalse(Type.isArray(2));
      this.assertFalse(Type.isArray({}));
      this.assertFalse(Type.isArray(true));
      this.assertFalse(Type.isArray(/juhu/));
    },
    
    
    testIsObject : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isObject({}));
      this.assertTrue(Type.isObject(new Object()));
      this.assertTrue(Type.isObject(new qx.core.Object()));
      
      this.assertFalse(Type.isObject());
      this.assertFalse(Type.isObject(function() {}));
      this.assertFalse(Type.isObject(""));
      this.assertFalse(Type.isObject(null));
      this.assertFalse(Type.isObject(2));
      this.assertFalse(Type.isObject([]));    
      this.assertFalse(Type.isObject(true));    
      this.assertFalse(Type.isObject(/juhu/));    
    },
    
    
    testIsRegExp : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isRegExp(/juhu/));
      this.assertTrue(Type.isRegExp(new RegExp()));
      
      this.assertFalse(Type.isRegExp());
      this.assertFalse(Type.isRegExp(function() {}));
      this.assertFalse(Type.isRegExp(""));
      this.assertFalse(Type.isRegExp(null));
      this.assertFalse(Type.isRegExp(2));
      this.assertFalse(Type.isRegExp([]));    
      this.assertFalse(Type.isRegExp(true));    
      this.assertFalse(Type.isRegExp({}));        
    },
    
    
    testIsNumber : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isNumber(1));
      this.assertTrue(Type.isNumber(1.1));
      this.assertTrue(Type.isNumber(new Number(1)));
      this.assertTrue(Type.isNumber(0));
      
      this.assertFalse(Type.isNumber());
      this.assertFalse(Type.isNumber(function() {}));
      this.assertFalse(Type.isNumber(""));
      this.assertFalse(Type.isNumber(null));
      this.assertFalse(Type.isNumber(/g/));
      this.assertFalse(Type.isNumber([]));    
      this.assertFalse(Type.isNumber(true));    
      this.assertFalse(Type.isNumber({}));       
    },
    
    
    testIsBoolean : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isBoolean(true));
      this.assertTrue(Type.isBoolean(false));
      this.assertTrue(Type.isBoolean(new Boolean()));
      
      this.assertFalse(Type.isBoolean());
      this.assertFalse(Type.isBoolean(function() {}));
      this.assertFalse(Type.isBoolean(""));
      this.assertFalse(Type.isBoolean(null));
      this.assertFalse(Type.isBoolean(/g/));
      this.assertFalse(Type.isBoolean([]));    
      this.assertFalse(Type.isBoolean(2));    
      this.assertFalse(Type.isBoolean({}));       
    },
    
    
    testIsFunction : function()
    {
      var Type = qx.lang.Type;
      
      this.assertTrue(Type.isFunction(function() {}));
      this.assertTrue(Type.isFunction(arguments.callee));
      this.assertTrue(Type.isFunction(Object));
      
      this.assertFalse(Type.isFunction());
      this.assertFalse(Type.isFunction(true));
      this.assertFalse(Type.isFunction(""));
      this.assertFalse(Type.isFunction(null));
      this.assertFalse(Type.isFunction(/g/));
      this.assertFalse(Type.isFunction([]));    
      this.assertFalse(Type.isFunction(2));    
      this.assertFalse(Type.isFunction({}));       
    }
  }
});