class HostFixMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'HTTP_HOST' in request.META and 'auth_service' in request.META['HTTP_HOST']:
            request.META['HTTP_HOST'] = 'localhost'
        return self.get_response(request)
