from django.contrib.auth.models import User

from django.db import models


class ModelBase(models.Model):
    created_at = models.DateField(auto_now=True, null=True)
    modified_at = models.DateField(auto_now=True, null=True)

    class Meta:
        abstract = True


class Account(ModelBase):
    owner = models.ForeignKey(User)
    name = models.CharField(max_length=255)
    amount = models.PositiveIntegerField()

    def __unicode__(self):
        return "{}-{}".format(self.owner, self.name)


class UserTag(ModelBase):
    creator = models.ForeignKey(User, null=True, blank=True)
    name = models.CharField(max_length=255)

    def __unicode__(self):
        if not self.creator:
            return "Default-{}".format(self.name)
        return "{}-{}".format(self.creator, self.name)


class TransactionType(ModelBase):
    TransactionModes = (
        ("Income", "Income"), ("Expense", "Expense"), ("Transfer", "Transfer"), ("BalanceReset", "BalanceReset"))
    type = models.CharField(max_length=127, choices=TransactionModes)
    amount = models.PositiveIntegerField()
    description = models.TextField(null=True, blank=True)
    primary_account = models.ForeignKey(Account, related_name='primary_account')
    secondary_account = models.ForeignKey(Account, related_name='secondary_account', null=True, blank=True)
    tag = models.ForeignKey(UserTag, null=True, blank=True)

    def __unicode__(self):
        return "{}-{}".format(self.primary_account, self.type)
