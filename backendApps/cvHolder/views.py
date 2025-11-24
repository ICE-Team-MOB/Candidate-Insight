# backend/apps/candidates/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import CandidateSerializer

@api_view(["POST"])
def cv_form_upload(request):
    """
    Принимает JSON:
    {
      "firstName": "...",
      "lastName": "...",
      "education": "...",
      "sector": "...",
      "experience": "...",
      "workFormat": "..."
    }
    """
    data = request.data

    # Приводим к полям модели (snake_case)
    normalized = {
      "first_name": data.get("firstName"),
      "last_name": data.get("lastName"),
      "education": data.get("education"),
      "sector": data.get("sector"),
      "experience": data.get("experience"),
      "work_format": data.get("workFormat"),
    }

    serializer = CandidateSerializer(data=normalized)
    if serializer.is_valid():
        candidate = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
