from django.db import models

class Candidate(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    education = models.CharField(max_length=64)
    sector = models.CharField(max_length=64)
    experience = models.CharField(max_length=32)
    work_format = models.CharField(max_length=32)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
