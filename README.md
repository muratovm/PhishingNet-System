**Install necessary packages**
```
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl
```
---

**Setup PostgreSQL database**
```
sudo -u postgres psql
CREATE DATABASE 'db_name';
CREATE USER 'user' WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE 'db_name' TO 'user';
```
---

**Create and activate Python Virtual Enviroment**
```
cd djangophish
python3 -m venv venv
source venv/bin/activate
```
---

**Setup a Django account**
```
manage.py makemigrations
manage.py migrate
manage.py createsuperuser
```
---

**Install the python dependencies**
```
pip install -r requirements.txt
cd ..
```

**Install the npm dependencies**
```
cd phishingnet
npm install
cd ..
```
---

**Networking Settings**
```
sudo apt install ufw
sudo ufw allow 8000
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

**SSL Encryption**
```
sudo apt install certbot
sudo certbot certonly --nginx
```

**NGINX Setup**
```
cd Webserver
cp djangophish /etc/nginx/sites-available/djangophish
sudo ln -s /etc/nginx/sites-available/djangophish /etc/nginx/sites-enabled


cp phishingnet /etc/nginx/sites-available/phishingnet
sudo ln -s /etc/nginx/sites-available/phishingnet /etc/nginx/sites-enabled
cd ..
```

** Enable Gunicorn and NGINX**
```
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
sudo systemctl restart nginx
```
---

**Run the Django Development Server on exposed network (in Terminal 1)**
```
python3 .\djangophish\manage.py runserver 0.0.0.0:8000
```

**Run the React Development Frontend (in Terminal 2)**
```
npm start --prefix ./phishingnet
```
