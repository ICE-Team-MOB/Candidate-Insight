# backend/apps/candidates/serializers.py
from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            "id",
            "first_name",
            "last_name",
            "education",
            "sector",
            "experience",
            "work_format",
            "created_at",
        ]
