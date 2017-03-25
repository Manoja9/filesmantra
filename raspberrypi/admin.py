from django.contrib import admin

from raspberrypi.models import *

admin.site.register(Accounts)
admin.site.register(UserTags)
admin.site.register(TransactionType)
