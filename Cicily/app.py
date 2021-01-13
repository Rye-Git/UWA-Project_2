from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from bson.json_util import dumps

import population_ETL

# Flask Setup
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/populationDB")


# Flask Routes

@app.route('/api')
def dataset():
    return render_template('api.html')


@app.route('/api/population/live')
def latest():
    latest = mongo.db.latestPopulation.find()
    return dumps(latest)

@app.route("/api/population/countries")
def countries():
    countries = mongo.db.countriesPopulation.find()
    return dumps(countries)

@app.route('/api/population/cities')
def cities():
    cities = mongo.db.citiesPopulation.find()
    return dumps(cities)



@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
