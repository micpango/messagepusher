class UrlMappings {

	static mappings = {
		"/admin/$action?/$id?"(controller: "message")
		"/messages"(controller: "message", action: "last10messages")
		"/"(view:"/index")
		"500"(view:'/error')
	}
}
