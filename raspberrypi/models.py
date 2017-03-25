from django.db import models


class ModelBase(models.Model):
    created_at = models.DateField(auto_now=True, null=True)
    modified_at = models.DateField(auto_now=True, null=True)

    class Meta:
        abstract = True
