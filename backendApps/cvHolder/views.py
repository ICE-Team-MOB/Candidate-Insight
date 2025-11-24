# backend/apps/candidates/views.py
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .serializers import CandidateSerializer
from .models import Candidate
from .utils import extract_text_from_pdf, call_llama_for_cv

@api_view(["POST"])
def cv_form_upload(request):
    data = request.data

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



@api_view(["GET"])
def cv_list(request):
    queryset = Candidate.objects.all().order_by("-created_at")
    serializer = CandidateSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def cv_pdf_upload(request):

    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return Response(
            {"detail": "Не передано файл 'file'."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if uploaded_file.content_type != "application/pdf":
        return Response(
            {"detail": "Потрібен PDF-файл."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        pdf_text = extract_text_from_pdf(uploaded_file)
        if not pdf_text:
            return Response(
                {"detail": "Не вдалося витягти текст із PDF."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        llm_result = call_llama_for_cv(pdf_text)

        normalized = {
            "first_name": llm_result.get("first_name"),
            "last_name": llm_result.get("last_name"),
            "education": llm_result.get("education"),
            "sector": llm_result.get("sector"),
            "experience": llm_result.get("experience"),
            "work_format": llm_result.get("work_format"),
        }

        serializer = CandidateSerializer(data=normalized)
        if not serializer.is_valid():
            return Response(
                {
                    "detail": "Невірні дані після парсингу LLM.",
                    "errors": serializer.errors,
                    "llm_result": llm_result,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        candidate = serializer.save()

        return Response(
            {
                "message": "Кандидат створений з PDF.",
                "candidate": CandidateSerializer(candidate).data,
                "llm_result": llm_result,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as exc:
        return Response(
            {"detail": f"Internal error: {exc!r}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
