package com.mostblind.pusherapp

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.commons.ConfigurationHolder

class PusherServiceIntegrationTests extends GrailsUnitTestCase {

  def pusherService = new PusherService()

  void testTriggerPushReturnsACCEPTED202() {
    assertEquals 202, pusherService.triggerPush(ConfigurationHolder.config.pusherChannel, 'test_message', 'Hello World')
  }
}
