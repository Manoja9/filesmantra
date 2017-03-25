from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver


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

    def save(self, *args, **kwargs):
        if self.type == self.TransactionModes[0][0]:
            account = Account.objects.get(id=self.primary_account.id)
            account.amount += self.amount
            account.save()
        elif self.type == self.TransactionModes[1][0]:
            account = Account.objects.get(id=self.primary_account.id)
            account.amount -= self.amount
            account.save()
        elif self.type == self.TransactionModes[2][0]:
            if not self.secondary_account:
                raise ValueError("secondary account should be present in transfer")
            account = Account.objects.get(id=self.primary_account.id)
            account.amount -= self.amount
            account.save()
            account = Account.objects.get(id=self.secondary_account.id)
            account.amount += self.amount
            account.save()
        else:
            Account.objects.filter(id=self.primary_account.id).update(amount=self.amount)
        super(TransactionType, self).save(*args, **kwargs)


@receiver(pre_delete, sender=TransactionType)
def _transaction_delete(sender, instance, **kwargs):
    if instance.type == instance.TransactionModes[0][0]:
        account = Account.objects.get(id=instance.primary_account.id)
        account.amount -= instance.amount
        account.save()
    elif instance.type == instance.TransactionModes[1][0]:
        account = Account.objects.get(id=instance.primary_account.id)
        account.amount += instance.amount
        account.save()
    elif instance.type == instance.TransactionModes[2][0]:
        account = Account.objects.get(id=instance.primary_account.id)
        account.amount += instance.amount
        account.save()
        account = Account.objects.filter(id=instance.secondary_account.id).first()
        if account:
            account.amount -= instance.amount
            account.save()
    else:
        pass


@receiver(pre_delete, sender=Account)
def _account_delete(sender, instance, **kwargs):
    TransactionType.objects.filter(primary_account=instance).delete()
