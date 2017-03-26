# FilesMantra

## Getting started:
### At first clone the repo and cd to the folder and enter follwing commands
```
  virtualenv venv
  source venv/bin/activate
  pip install -r requirements.txt
  python manage.py migrate
  python manage.py runserver
 ```
 ### To run testcases
 
 ```
  python manage.py test
 ```
 ### Note: use only localhost:8000 port since Google OAuth redirect url is only localhost:8000
 >Incase of any doubts on the filters please hover on them
