
## Create and activate Python Virtual Enviroment

	**On Windows:**
	```
	py -m venv .venv
	.\.venv\Scripts\activate
	```

	**On Linux:**
	```
	python -m venv .venv
	source .venv/bin/activate
	```

**Install the python dependencies**
```
pip install requirements.txt
```

**Install the npm dependencies**
```
cd phishingnet
npm install
cd ..
```


**Run the Django Server on exposed network**
python .\djangophish\manage.py runserver 0.0.0.0:8000


**Run the React development version**
npm start --prefix ./phishingnet