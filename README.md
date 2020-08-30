
**Create and activate Python Virtual Enviroment**
```
python -m venv venv
source venv/bin/activate
```

---

**Install the python dependencies**
```
cd djangophish
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

**Run the Django Server on exposed network (in Terminal 1)**
```
python .\djangophish\manage.py runserver 0.0.0.0:8000
```

**Run the React development version (in Terminal 2)**
```
npm start --prefix ./phishingnet
```
