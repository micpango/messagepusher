package com.mostblind.messagepusher

class Message {

  static constraints = {
    title blank:false
    content blank:false, widget:'textarea'
    user blank:false
  }

  static mapping = {
    sort dateCreated:'desc'	 
  }

  String title
  String content
  String user
  Date dateCreated
}
