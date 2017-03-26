from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout


@login_required(login_url="/login")
def home(request):
    return render(request, 'index.html')


def login(request):
    return render(request, 'login.html')


def logout(request):
    auth_logout(request)
    return render(request, 'logout.html')