import json

from django.contrib.auth.models import User
from django.test import TestCase

from rest_framework.test import APIClient

from raspberrypi.api import *


class TransactionAPITestCases(TestCase):

    fixtures = ['initial_users.json', 'initial_data.json']

    def setUp(self):
        self.user = User.objects.all()[0]
        self.account = Account.objects.filter(owner=self.user)[1]
        self.client = APIClient()

    def test_get_method(self):
        self.client.force_login(self.user)
        response = self.client.get('/transaction/1/')
        get_data = json.loads(response.content)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(get_data), 4)

        response = self.client.get('/transaction/1/?for_date=2017-03-29')
        get_data = json.loads(response.content)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(get_data), 3)

    def test_post_method(self):
        self.client.force_login(self.user)
        previous_amount = self.account.amount
        post_data = {
            "type": "Income",
            "amount": 12000,
            "primary_account": self.account.id,
            "for_date": "2017-03-27"
        }
        response = self.client.post("/transaction/1/", data=post_data)
        self.assertEquals(response.status_code, 201)
        self.assertEquals(Account.objects.get(id=self.account.id).amount, previous_amount+12000)

    def test_delete_method(self):
        self.client.force_login(self.user)
        sample_transaction_id = TransactionType.objects.filter(primary_account__owner=self.user)[0].id
        response = self.client.delete("/transaction/{}/".format(sample_transaction_id))
        self.assertEquals(response.status_code, 204)
        self.assertFalse(TransactionType.objects.filter(id=sample_transaction_id).exists())
