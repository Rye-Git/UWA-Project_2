from flask import Flask, render_template, redirect, jsonify 
from flask_pymongo import PyMongo
from bson.json_util import dumps, loads
import json

import population_ETL

# Flask Setup
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/populationDB")


# Flask Routes

@app.route('/api/population/latest')
def latest():
    latest = mongo.db.latestPopulation.find() # PYMONGO CURSOR 
    dump_latest = dumps(latest) # CONVERT PYMONGO CUSTOR TO JSON STRING 
    json_latest = json.loads(dump_latest) # CONVERT TO ACTUAL JSON 
    return jsonify(json_latest)  # RETURN JSON 



@app.route("/api/population/countries")
def countries():
    countries = mongo.db.countriesPopulation.find()
    dump_countries = dumps(countries)
    json_countries = json.loads(dump_countries)
    return jsonify(json_countries) 

@app.route('/api/population/cities')
def cities():
    cities = mongo.db.citiesPopulation.find()
    dump_cities = dumps(cities)
    json_cities = json.loads(dump_cities)
    return jsonify(json_cities) 



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summary')
def summary():
    return render_template('summary.html')    

@app.route('/contact')
def contact():
    return render_template('contact.html')  

@app.route('/Data')
def Data():
    return render_template('Data.html')  
    
@app.route('/api')
def api():
    return render_template('api.html') 

if __name__ == "__main__":
    app.run(debug=True)
