from django.contrib import admin

from raspberrypi.models import *

admin.site.register(Account)
admin.site.register(UserTag)
admin.site.register(TransactionType)
