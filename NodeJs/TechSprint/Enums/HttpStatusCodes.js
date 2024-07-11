const STATUSCODE = Object.freeze({
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
});

export default STATUSCODE;

// 100 Continue: The server has received the request headers, and the client should proceed to send the request body.
// 101 Switching Protocols: The requester has asked the server to switch protocols.
// 200 OK: Standard response for successful HTTP requests.
// 201 Created: The request has been fulfilled and resulted in a new resource being created.
// 202 Accepted: The request has been accepted for processing, but the processing has not been completed.
// 203 Non-Authoritative Information: The server successfully processed the request, but is returning information that may be from another source.
// 204 No Content: The server successfully processed the request, but is not returning any content.
// 205 Reset Content: The server successfully processed the request, but is not returning any content, and requires that the requester reset the document view.
// 206 Partial Content: The server is delivering only part of the resource due to a range header sent by the client.
// 300 Multiple Choices: Indicates multiple options for the resource that the client may follow.
// 301 Moved Permanently: This and all future requests should be directed to the given URI.
// 302 Found: The resource was found, but at a different location. Future requests should still use the original URI.
// 303 See Other: The response to the request can be found under another URI using a GET method.
// 304 Not Modified: The resource has not been modified since the version specified by the request headers.
// 305 Use Proxy: The requested resource is only available through a proxy, the address for which is provided in the response.
// 307 Temporary Redirect: The request should be repeated with another URI, but future requests should still use the original URI.
// 400 Bad Request: The server could not understand the request due to invalid syntax.
// 401 Unauthorized: The request requires user authentication.
// 402 Payment Required: Reserved for future use.
// 403 Forbidden: The server understood the request, but is refusing to fulfill it.
// 404 Not Found: The server has not found anything matching the Request-URI.
// 405 Method Not Allowed: The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.
// 406 Not Acceptable: The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.
// 407 Proxy Authentication Required: The client must first authenticate itself with the proxy.
// 408 Request Timeout: The server timed out waiting for the request.
// 409 Conflict: The request could not be completed due to a conflict with the current state of the resource.
// 410 Gone: The requested resource is no longer available at the server and no forwarding address is known.
// 411 Length Required: The request did not specify the length of its content, which is required by the requested resource.
// 412 Precondition Failed: The server does not meet one of the preconditions that the requester put on the request.
// 413 Request Entity Too Large: The request is larger than the server is willing or able to process.
// 414 Request-URI Too Long: The URI provided was too long for the server to process.
// 415 Unsupported Media Type: The request entity has a media type which the server or resource does not support.
// 416 Requested Range Not Satisfiable: The client has asked for a portion of the file, but the server cannot supply that portion.
// 417 Expectation Failed: The server cannot meet the requirements of the Expect request-header field.
// 500 Internal Server Error: A generic error message, given when no more specific message is suitable.
// 501 Not Implemented: The server either does not recognize the request method, or it lacks the ability to fulfill the request.
// 502 Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.
// 503 Service Unavailable: The server is currently unavailable (because it is overloaded or down for maintenance).
// 504 Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
// 505 HTTP Version Not Supported: The server does not support the HTTP protocol version used in the request.
