from rest_framework import serializers

from raspberrypi.models import *


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = '__all__'


class UserTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserTag
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionType
        fields = '__all__'
