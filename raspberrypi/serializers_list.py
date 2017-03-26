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

    tag = UserTagSerializer(read_only=False)
    primary_account = AccountSerializer(read_only=False)
    secondary_account = AccountSerializer(read_only=False)

    class Meta:
        model = TransactionType
        fields = '__all__'


class TransactionPOSTSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionType
        fields = '__all__'
