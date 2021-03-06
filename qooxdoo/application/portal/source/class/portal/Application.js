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
     * Alexander Steitz (aback)
     * David Werner (psycledw)

************************************************************************ */

/* ************************************************************************

#asset(portal/*)

************************************************************************ */

/**
 * Main application class
 */

qx.Class.define("portal.Application",
{
  extend : qx.application.Native,

  members :
  {
    /**
     * Application start
     *
     * @return {void}
     */
    main : function()
    {
      this.base(arguments);

      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        qx.log.appender.Native;
        qx.log.appender.Console;

        if (qx.core.Variant.isSet("qx.client", "mshtml")) {
          qx.log.appender.Console.init();
        }
      }

      portal.box.Manager.getInstance().load();
      portal.dragdrop.Manager.getInstance();
    }
  }
});
