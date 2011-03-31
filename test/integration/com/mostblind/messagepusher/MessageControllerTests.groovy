package com.mostblind.messagepusher

import grails.test.*
import com.mostblind.pusherapp.PusherService

class MessageControllerTests extends GrailsUnitTestCase {

  def testController
  def pusherService

  protected void setUp() {
    super.setUp()
    pusherService = mockFor(PusherService)
    testController = new MessageController()
    testController.params.title = 'title'
    testController.params.content = 'content'
    testController.params.user = 'user'
  }

  void testIfCreateViewIsRenderedOnUnsuccessfullSave() {
    executeMockedTriggerPushWithValue(null)
    assertEquals '/message/create', testController.modelAndView.getViewName()
  }

  void testIfRedirectedToShowViewOnSuccessfullSave() {
    executeMockedTriggerPushWithValue(202)
    assertEquals '/admin/show/1', testController.response.redirectedUrl
  }

  private def executeMockedTriggerPushWithValue(def returnValue) {
    pusherService.demand.triggerPush {def channel, def event, def jsonData ->
      returnValue
    }
    testController.pusherService = pusherService.createMock()
    testController.save()
  }
}
