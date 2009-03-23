#!/usr/bin/env python

################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2007-2009 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Daniel Wagner (d_wagner)
#
################################################################################

# NAME
#  Automated Test Script
#
# DESCRIPTION
#  This script controls automated tests of qooxdoo applications and components.
#  The test setup can be configured by manipulating the configuration
#  dictionaries and by adding and removing method calls to and from the main()
#  method.
#
#  It is assumed that a web server is running on the test machine and the
#  applications to be tested are accessible using the host name and paths 
#  defined in autConf.

import subprocess, sys, os, re, time, httplib, socket
from urllib2 import Request, urlopen, URLError

socket.setdefaulttimeout(10)

testConf = {
  'seleniumLog'         : '/tmp/selenium.log',
  'seleniumReport'      : 'selenium-report.html',
  'archiveDir'          : '/home/dwagner/qxselenium/reports',
  'logFormat'	          : '/home/dwagner/qxselenium/logFormatter.py /tmp/selenium.log',
  'startSelenium'       : 'java -jar /home/dwagner/qxselenium/selenium-server.jar -browserSideLog -log ',
  'seleniumHost'        : 'http://localhost:4444',
  'svnRev'              : 'svnversion /var/www/qx/trunk',
  'buildTests'          : '/var/www/qx/trunk/qooxdoo/tool/admin/app/batserver/batbuild.py -z -C -p framework -g test -n',
  'buildDemobrowser'    : '/var/www/qx/trunk/qooxdoo/tool/admin/app/batserver/batbuild.py -z -C -p application/demobrowser -g build -n',
  'buildDemobrowser'    : '/var/www/qx/trunk/qooxdoo/tool/admin/app/batserver/batbuild.py -z -C -p application/feedreader -g build -n',
  'classPath'           : '/home/dwagner/qxselenium/selenium-java-client-driver.jar:/home/dwagner/rhino1_7R1/js.jar',
  'scriptTestrunner'    : '/home/dwagner/qxselenium/test_testrunner.js',
  'scriptDemobrowser'   : '/home/dwagner/qxselenium/test_demobrowser.js',
  'scriptFeedreader'    : '/home/dwagner/qxselenium/test_feedreader.js'
}

autConf = {
  'autHost'             : 'http://172.17.12.142',
  'autPathTestrunner'   : '/qx/trunk/qooxdoo/framework/test/index.html',
  'autPathDemobrowser'  : '/qx/trunk/qooxdoo/application/demobrowser/build/index.html',
  'autPathFeedreader'   : '/qx/trunk/qooxdoo/application/feedreader/build/index.html'
}

browserConf = {
  'FF307'    : '*custom /usr/lib/firefox-3.0.7/firefox -no-remote -P selenium-3',
  'FF31b2'   : '*custom /home/dwagner/firefox-31b2/firefox -no-remote -P selenium-31b2',
  'FF31b3'   : '*custom /home/dwagner/firefox-31b3/firefox -no-remote -P selenium-31b3',
  'FF2'      : '*custom /home/dwagner/firefox2/firefox -no-remote -P selenium-2',
  'Opera964' : '*opera'
}

lintConf = {
  'lintRunner'      : '/home/dwagner/qxselenium/lintRunner.py',
  'framework'       : '/var/www/qx/trunk/qooxdoo/framework',
  'demobrowser'     : '/var/www/qx/trunk/qooxdoo/application/demobrowser',
  'feedreader'      : '/var/www/qx/trunk/qooxdoo/application/feedreader',
  'playground'      : '/var/www/qx/trunk/qooxdoo/application/playground',
  'portal'          : '/var/www/qx/trunk/qooxdoo/application/portal',
  'apiviewer'       : '/var/www/qx/trunk/qooxdoo/component/apiviewer',
  'testrunner'      : '/var/www/qx/trunk/qooxdoo/component/testrunner',
  'inspector'       : '/var/www/qx/trunk/qooxdoo/component/inspector'
}

mailConf = {
  'mailFrom'        : 'daniel.wagner@1und1.de',
  #'mailTo'          : 'daniel.wagner@1und1.de',
  'mailTo'          : 'webtechnologies@1und1.de',
  'smtpHost'        : 'smtp.1und1.de',
  'smtpPort'        : 587
}

def main():    
    if ( isSeleniumServer() ):
        print("Selenium server seems to be running.")
    else:
        seleniumserver()
    if ( isSeleniumServer() ):
      
        clearLogs()
        invoke_external(testConf['buildTests'])
        trunkrev = get_rev().rstrip('\n')
        
        for key in lintConf:
          if (key != "lintRunner"):
            print("Running Lint for " + key.capitalize())
            invoke_external(getLintCmd(lintConf[key], trunkrev))

        invoke_external(getStartCmd('Testrunner','FF307'))
        invoke_external(getStartCmd('Testrunner','FF2'))
        #CRASH invoke_external(getStartCmd('Testrunner','FF31b2'))
        invoke_external(getStartCmd('Testrunner','FF31b3'))
        invoke_external(getStartCmd('Testrunner','Opera964'))
        invoke_external(testConf['logFormat'])
        sendReport("Testrunner",trunkrev)        

        clearLogs()
        invoke_external(testConf['buildDemobrowser'])
        trunkrev = get_rev().rstrip('\n')
        invoke_external(getStartCmd('Demobrowser','Opera964'))
        invoke_external(getStartCmd('Demobrowser','FF307'))
        invoke_external(testConf['logFormat'])
        sendReport("Demobrowser",trunkrev)
        
        clearLogs()
        trunkrev = get_rev().rstrip('\n')
        invoke_external(getStartCmd('Feedreader','FF307'))
        invoke_external(testConf['logFormat'])
        sendReport("Feedreader",trunkrev)
        
    else:
        print("Couldn't contact Selenium server.") 

# Returns the SVN checkout's revision number
def get_rev():
    ret,out,err = invoke_piped(testConf["svnRev"])
    return out

# Invoke an external command and return its STDOUT and STDERR output.
def invoke_piped(cmd):
    import subprocess
    p = subprocess.Popen(cmd, shell=True,
                         stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE,
                         universal_newlines=True)
    output, errout = p.communicate()
    rcode = p.returncode

    return (rcode, output, errout)

# Invoke an external command and wait for it to finish.
def invoke_external(cmd):
    import subprocess
    p = subprocess.Popen(cmd, shell=True,
                         stdout=sys.stdout,
                         stderr=sys.stderr)
    return p.wait()

# Send an HTTP request to the Selenium proxy. A 403 response means it's running.
def isSeleniumServer():
    status = False
    print("Checking Selenium server")
    req = Request(testConf['seleniumHost'])
    try:
        response = urlopen(req)
        # Selenium should always refuse this request, so we should never get here
    except URLError, e:
        if hasattr(e, 'code'):
            if (e.code == 403):
                status = True
    return status


# Start the Selenium RC server and check its status.
def seleniumserver():
    global selserv
    print "Starting Selenium server..."
    selserv = subprocess.Popen(testConf['startSelenium'] + testConf['seleniumLog'], shell=True)

    # wait a while for the server to start up
    time.sleep(20)

    # check if it's up and running
    if ( not(isSeleniumServer()) ):
        print "Selenium server not responding, waiting a little longer..."
        time.sleep(20)
        if ( not(isSeleniumServer()) ):
            print "Selenium server not responding."
            sys.exit(1)

# Assembles the shell command that launches the actual test in Rhino.
def getStartCmd(aut, browser):
    cmd = "java"
    if ('classPath' in testConf):
        cmd += " -cp " + testConf['classPath']
    cmd += " org.mozilla.javascript.tools.shell.Main"    
    cmd += " " + testConf['script' + aut]
    cmd += " autHost=" + autConf['autHost']
    cmd += " autPath=" + autConf['autPath' + aut]
    cmd += " testBrowser='" + browserConf[browser] + "'"
    return cmd

def getLintCmd(target,trunkrev=None):
    cmd = lintConf['lintRunner'] + ' -m -t ' + mailConf['mailTo'] + ' -w ' + target
    
    if (trunkrev):
        cmd += ' -s ' + '"(trunk r' + trunkrev + ')"'
    
    return cmd
    

# Sends the generated test report file by email.
def sendReport(aut,trunkrev):    
    print("Report: " + testConf['seleniumReport'])
    if ( not(os.path.exists(testConf['seleniumReport'])) ):
        print "Report file not found, quitting."
        sys.exit(1)

    from email.MIMEMultipart import MIMEMultipart
    from email.MIMEText import MIMEText
    import smtplib, re, shutil

    mailSubject = "[qooxdoo-test] " + aut

    reportFile = open(testConf['seleniumReport'], 'rb')

    osRe = re.compile('<p>Browser: .* on (.*)</p>')
    failedTestsRe = re.compile('<p class="failedtests">([\d]*)')
    totalErrorsRe = re.compile('<p class="totalerrors">Total errors in report: ([\d]*)</p>')

    osystem = ""
    failed = ""
    totalE = ""
    for line in reportFile:
      osys = osRe.search(line)
      if (osys):
        osystem = osys.group(1)

      failedTests = failedTestsRe.search(line)
      if (failedTests):
        failed = failedTests.group(1)

      totalErrors = totalErrorsRe.search(line)
      if (totalErrors):
        totalE = totalErrors.group(1)

    if (trunkrev != ""):
      mailSubject += " " + osystem + " (trunk r" + trunkrev + "): "
    else:
      mailSubject += " " + osystem + ": "
    if (failed != ""):
      mailSubject += failed + " test runs failed!"
    else:
      mailSubject += totalE + " issues"

    reportFile.seek(0)
    msg = MIMEMultipart()
    msg['Subject'] = mailSubject
    msg['From'] = mailConf['mailFrom']
    msg['To'] = mailConf['mailTo']
    msg.preamble = 'Test Results'

    msgText = MIMEText(reportFile.read(), 'html')
    msg.attach(msgText)

    # Send mail
    if (osystem !=""):
      print("Sending report. Subject: " + mailSubject)
      mailServer = smtplib.SMTP(mailConf['smtpHost'], mailConf['smtpPort'])
      mailServer.ehlo()
      mailServer.starttls()
      mailServer.ehlo()
      mailServer.sendmail(mailConf['mailFrom'], mailConf['mailTo'], msg.as_string())
      mailServer.close()
    else:
      print("Report file seems incomplete, report not sent.")

    # Rename report file, adding current date.
    from datetime import datetime
    now = datetime.today()
    datestring = now.strftime("%Y-%m-%d_%H.%M")
    newname_temp = "selenium-report_" + datestring + ".html"
    newname = os.path.join(os.path.dirname(testConf['seleniumReport']),newname_temp)
    print("Renaming report file to " + newname)
    os.rename(testConf['seleniumReport'], newname)
    print("Moving report file to " + testConf['archiveDir'])    
    shutil.move(newname, testConf['archiveDir'])

def clearLogs():
    if (os.path.exists(testConf['seleniumLog'])):
        f = open(testConf['seleniumLog'], 'w')
        print("Emptying server log file " + testConf['seleniumLog'])
        f.write('')
        f.close()

    if (os.path.exists(testConf['seleniumReport'])):
        f = open(testConf['seleniumReport'], 'w')
        print("Emptying Selenium report file " + testConf['seleniumReport'])
        f.write('')
        f.close()

if __name__ == "__main__":
    try:
        rc = main()
    except KeyboardInterrupt:
        print
        print "  * Keyboard Interrupt"
        rc = 1
    sys.exit(rc)
 