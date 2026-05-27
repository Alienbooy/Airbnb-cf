from django.http import JsonResponse


def custom_404_view(request, exception):
    return JsonResponse({"error": "The requested resource was not found."}, status=404)
