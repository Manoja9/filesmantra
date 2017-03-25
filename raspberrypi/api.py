from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from raspberrypi.models import *
from raspberrypi.serializers_list import *


class AccountAPI(APIView):
    """

    """
    permission_classes = (permissions.IsAuthenticated,)

    def get_account(self, pk):
        return Account.objects.filter(owner=self.request.user, id=pk)

    def get(self, request, **kwargs):
        """

        Args:
            request:
            **kwargs:

        Returns:

        """
        user_accounts = Account.objects.filter(owner=request.user)
        serialized_response = AccountSerializer(user_accounts, many=True)
        return Response(serialized_response.data)

    def post(self, request, **kwargs):
        """

        Args:
            request:
            **kwargs:

        Returns:

        """
        post_data = request.data
        post_data.update({"owner": request.user.id})
        account_serializer = AccountSerializer(data=post_data)
        if account_serializer.is_valid():
            account_serializer.save()
            return Response(account_serializer.data, status=status.HTTP_201_CREATED)
        return Response(account_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """

        :param request:
        :return:
        """
        account = self.get_account(pk)
        if account.exists():
            account.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response("Account does not exists",status=status.HTTP_400_BAD_REQUEST)


class TransactionAPI(APIView):
    """

    """
    permission_classes = (permissions.IsAuthenticated,)

    def get_transaction(self, pk):
        return TransactionType.objects.filter(id=pk, primary_account__owner=self.request.user)

    def get(self, request, pk):
        transactions = TransactionType.objects.filter(primary_account=request.GET.get('account'))
        serialized_response = TransactionSerializer(transactions, many=True)
        return Response(serialized_response.data)

    def post(self, request, pk):
        transaction_serializer = TransactionSerializer(data=request.data)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """

        :param request:
        :return:
        """
        transaction = self.get_transaction(pk)
        if transaction.exists():
            transaction.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response("Transaction does not exists", status=status.HTTP_400_BAD_REQUEST)


class UserTagAPI(APIView):
    """

    """
    permission_classes = (permissions.IsAuthenticated,)

    def get_tag(self, pk):
        return UserTag.objects.filter(id=pk, creator=self.request.user)

    def get(self, request, pk):
        tags = UserTag.objects.filter(creator__isnull=True) | UserTag.objects.filter(creator=request.user)
        serialized_response = UserTagSerializer(tags, many=True)
        return Response(serialized_response.data)

    def post(self, request, pk):
        post_data = request.data
        post_data.update({"creator": request.user.id})
        user_tag_serializer = UserTagSerializer(data=post_data)
        if user_tag_serializer.is_valid():
            user_tag_serializer.save()
            return Response(user_tag_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user_tag = self.get_tag(pk)
        if user_tag.exists():
            user_tag.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response("User Tag does not exists", status=status.HTTP_400_BAD_REQUEST)
