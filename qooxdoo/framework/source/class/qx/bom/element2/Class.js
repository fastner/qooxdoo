﻿/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2009-2010 Deutsche Telekom AG, Germany, http://www.telekom.com

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
	 * Sebastian Fastner (fastner)

   ======================================================================

   This class contains code based on the following work:

   * jQuery
     http://jquery.com
     Version 1.4.2

     Copyright:
       John Resig

     License:
       MIT+GPL: http://jquery.org/license

     Authors:
       * John Resig

************************************************************************ */

/**
 * Replacement for add/remove functions of {@link qx.bom.element.Class} to
 * support multiple adds/removes per call.
 */
qx.Class.define("qx.bom.element2.Class",
{
  statics :
  {
    /** {RegExp} Matches special spaces in class names */
    __rclass : /[\n\t]/g,

    /** {RegExp} Divider between class names */
    __rspace : /\s+/,

    /**
     * Whether the given element has the given cSS class
     *
     * @param elem {Element} DOM element to query
     * @param value {String} Class name to query for
     */
    has : qx.lang.Object.select(qx.bom.client.Feature.HTML5_CLASSLIST ? "native" : "default",
	{
	  "native" : function(elem, value) {
	    if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          qx.core.Assert.assertString(value, "Invalid class name to check for!");
          qx.core.Assert.assertMatch(value, /^[a-zA-Z][a-zA-Z0-9-]+$/, "Supports single value class names only!");
        }
	    return elem.classList.contains(name);
	  },
	  "default" : function(elem, value)
      {
        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          qx.core.Assert.assertString(value, "Invalid class name to check for!");
          qx.core.Assert.assertMatch(value, /^[a-zA-Z][a-zA-Z0-9-]+$/, "Supports single value class names only!");
        }

        if ((" " + elem.className + " ").replace(this.__rclass, " ").indexOf(" " + value + " ") > -1) {
          return true;
        }

        return false;
	  }
    },


    /**
     * Adds one or multiple classes to the given element
     *
     * @param elem {Element} DOM element to modify
     * @param classes {String} List of classes to add. One or
     *    multiple classes in a single string.
     * @return {String} The resulting class name which was applied
     */
    add : qx.lang.Object.select(qx.bom.client.Feature.HTML5_CLASSLIST ? "native" : "default",
	{
	  "native" : function(elem, classes)
	  {
	    if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          qx.core.Assert.assertString(classes, "Invalid class name to add to element!");
        }
		
		if (!elem.className)
        {
          elem.className = classes;
        }
        else
        {
          var classNames = classes.split(this.__rspace);
		  
		  for (var i=0, l=classNames.length; i<l; i++) {
		    element.classList.add(classNames[i]);
		  }
		}
	  },
	  "default" : function(elem, classes)
      {
        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          qx.core.Assert.assertString(classes, "Invalid class name to add to element!");
        }

        if (!elem.className)
        {
          elem.className = classes;
        }
        else
        {
          var classNames = classes.split(this.__rspace);
          var className = " " + elem.className + " ";
          var setClass = elem.className;

          for (var i=0, l=classNames.length; i<l; i++)
          {
            if (className.indexOf(" " + classNames[i] + " ") < 0) {
              setClass += " " + classNames[i];
            }
          }

          elem.className = qx.lang.String.trim(setClass);
        }

        return elem.className;
	  }
    },


    /**
     * Removes one or multiple classes from the given element
     *
     * @param elem {Element} DOM element to modify
     * @param classes {String[]|varargs} List of classes to remove. One or
     *    multiple classes in a single string.
     * @return {String} The resulting class name which was applied
     */
    remove : qx.lang.Object.select(qx.bom.client.Feature.HTML5_CLASSLIST ? "native" : "default",
	{
	  "native" : function(elem, classes)
	  {
	    if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          //qx.core.Assert.assertString(classes, "Invalid class name to add to element!");
        }
		
		if (!elem.className) {
          return;
        }
		
		if (classes)
        {
          var classNames = classes.split(this.__rspace);

          for (var i=0, l=classNames.length; i<l; i++) {
            element.classList.remove(classNames[i]);
          }
        }
        else
        {
          elem.className = "";
        }
		
		return elem.className;
	  },
	  "default" : function(elem, classes)
      {
        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          qx.core.Assert.assertElement(elem, "Invalid element to check for applied CSS class!");
          //qx.core.Assert.assertString(classes, "Invalid class name to add to element!");
        }

        if (!elem.className) {
          return;
        }

        if (classes)
        {
          var classNames = classes.split(this.__rspace);
          var setClass = (" " + elem.className + " ").replace(this.__rclass, " ");

          for (var i=0, l=classNames.length; i<l; i++) {
            setClass = setClass.replace(" " + classNames[i] + " ", " ");
          }

          elem.className = qx.lang.String.trim(setClass);
        }
        else
        {
          elem.className = "";
        }

        return elem.className;
      }
    }
  }
});
