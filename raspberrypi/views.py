from django.shortcuts import render, redirect
from django.contrib.auth import logout as auth_logout

# Create your views here.
def home(request):
    return render(request, 'index.html')

def login(request):
    return redirect('/login/google-oauth2/?next=/')

def logout(request):
    auth_logout(request)
    return render(request, 'logout.html')