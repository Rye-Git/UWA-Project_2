import pandas as pd
import pymongo
import numpy as np
from geopy.geocoders import Nominatim


# Cities Data
#####################################################
# url to scrape for the city population
cities_url ="https://worldpopulationreview.com/world-cities"
# Use panda's `read_html` to parse the url
df_cityPop = pd.read_html(cities_url, header=0)[0]
# rename the columns
df_cityPop.rename(columns={'Name':'City', 
                           '2020 Population':'2020',
                           '2019 Population':'2019'
                          },inplace=True)
df_cityPop.fillna(0,inplace = True)
#  converting column 2019 from float to int
df_cityPop['2019'] = df_cityPop['2019'].apply(np.int32)


# Using geopy for coordinates of top 10 cities
#####################################################
# creating a dataframe with coordinates
cities = []
# iterate through top 10 rows
for row in df_cityPop.head(10).itertuples():
    try:
        geolocator = Nominatim(user_agent="population_analysis")
        city = row[2]
        country = row[3]
        loc = geolocator.geocode(city+','+ country)
        
        cities.append({"City": city,
                    "Country": country,
                    "Latitude": loc.latitude, 
                    "Longitude": loc.longitude}) 
    except:
        print("City not found. Skipping...") 

city_df = pd.DataFrame(cities)
# merging city dataframes 
df_cityPop = df_cityPop.merge(city_df, on=["City","Country"], how="left")
# Replace null values with 0
df_cityPop.fillna(0,inplace = True)
#####################################################





# Latest Data
#####################################################
# url to scrape for the Live population data
countries_url ="https://worldpopulationreview.com"
# Use pandas `read_html` to parse the url
df_LatestPop = pd.read_html(countries_url, header=0)[0]
# eliminating unnessasary data
df_LatestPop = df_LatestPop.iloc[:,[1,2,4,5,6,7,8]]
# rename the columns
df_LatestPop.rename(columns={'Area':'Area_SqKm',
                             '2019 Density':'Density_PerSqKm',
                             'Growth Rate':'Growth_Percentage', 
                             'World %':'World_Percentage'
                            },inplace=True)
                            
# Converting string values to numbers
df_LatestPop['Area_SqKm'] = pd.to_numeric(df_LatestPop['Area_SqKm'].str.rsplit(' ', 0).str.get(0).str.replace(r',', ''))
df_LatestPop['Density_PerSqKm'] = pd.to_numeric(df_LatestPop['Density_PerSqKm'].str.rsplit('/', 0).str.get(0).str.replace(r',', ''))
df_LatestPop['Growth_Percentage'] = pd.to_numeric(df_LatestPop['Growth_Percentage'].str.rsplit('%', 0).str.get(0))
df_LatestPop['World_Percentage'] = pd.to_numeric(df_LatestPop['World_Percentage'].str.rsplit('%', 0).str.get(0))
#####################################################



# Scraping Country codes to merge datasets with
#####################################################
# url to scrape for ISO 3166 country codes Alpha-2 and Alpha-3 from www.iban.com
country_code_url ="https://www.iban.com/country-codes"
# Use panda's `read_html` to parse the url
df_countryCode = pd.read_html(country_code_url, header=0)[0]
# eliminating unnessasary data
df_countryCode = df_countryCode.iloc[:,[1,2]]
# rename the columns
df_countryCode.rename(columns={'Alpha-2 code':'Country_Code_2',
                               'Alpha-3 code':'Country_Code'
                              },inplace=True) 
#####################################################


# Countries Population Data
#####################################################
# read Countries population data from csv(source:https://worldpopulationreview.com) into dataframe
df_countries = pd.read_csv('static/data/csvData.csv')
# rename the columns
df_countries.rename(columns={'cca2':'Country_Code_2',
                             'name':'Country',
                             'pop2050':'2050',
                             'pop2030':'2030',
                             'pop2020':'2020',
                             'pop2019':'2019',
                             'pop2015':'2015',
                             'pop2010':'2010',
                             'pop2000':'2000',
                             'pop1990':'1990',
                             'pop1980':'1980',
                             'pop1970':'1970' 
                            },inplace=True)

# # eliminating unnessasary data
df_countries = df_countries.iloc[:,[0,1,4,5,2,3,6,7,8,9,10,11]]

# Removing decimal point from data
# Loop through the columns
for col in df_countries:
    # performing operations on columns other than Country column
    if col not in ["Country_Code_2", "Country"]:
        # correcting the decimal positions
        df_countries[col] = (df_countries[col] * 1000).astype(int)




# Another Dataset to merge for additional years data
#####################################################
# Cleaning csv Population data from https://datacatalog.worldbank.org
# reading csv's into dataframes
df_population = pd.read_csv('static/data/population.csv')

# Function to Clean each dataframes
def clean_dataFrames(df, col_list):
    # eliminating unnecessary data
    df = df.iloc[0:217, col_list]
    # renaming columns
    df.rename(columns= {df.columns[0]: "Name"}, inplace = True)
    df = df.rename(columns = lambda x : (str(x)[:-9]))
    df.rename(columns= {df.columns[0]: "Country", df.columns[1]: "Country_Code"}, inplace = True)
    return df

# list of required column indexes
col_list = [2,3,11,12,13]
# Calling clean_dataFrames function passing the dataframe as parameter
df_population = clean_dataFrames(df_population, col_list)

# Removing row with no values for the required years(Country Eritrea)
df_population.drop(df_population.index[df_population['Country'] == 'Eritrea'], inplace = True)

# Loop through the columns to covert values from string to 
for col in df_population:
    # on columns other than Country and Country_Code_2
    if col not in ["Country_Code", "Country"]:
        # Converting string to number
        df_population[col] = df_population[col].astype(float).apply(np.int32)



# merging two dataframes for additional years data
#####################################################

# merging df_population with df_countryCode
df_population = df_countryCode.merge(df_population, on="Country_Code", how="right")


# merging df_population with df_countries
df_countries = df_countries.merge(df_population, on="Country_Code_2", how="left")
# removing duplicated Country column and Country_Code_2
df_countries = df_countries.drop(['Country_y', 'Country_Code_2'], axis=1)
# renaming columns
df_countries.rename(columns= {"Country_x": "Country"}, inplace = True)
# reordering the columns
df_countries = df_countries.iloc[:,[0,11,1,2,3,4,5,14,13,12,6,7,8,9,10]]
# Replace null values with 0
df_countries.fillna(0,inplace = True)
# converting float values to int
df_countries[['2016','2017','2018']] = df_countries[['2016','2017','2018']].apply(np.int32)
#####################################################

#####################################################





# Loading Data into MongoDB
#####################################################
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

db_name = "populationDB"
# # Drop database if exists
if bool(db_name in client.list_database_names()):
    client.drop_database(db_name)

# Creating Database and collection in mongodb
db = client[db_name]
countriesPop = db["countriesPopulation"]
citiesPop = db["citiesPopulation"]
latestPop = db["latestPopulation"]


# Function to insert Dataframes into mongodb collections
def insertToDB(df, collection):
    data_dict = df.to_dict("records") # Convert to dictionary
    # removing index from data
    data_dict = [{k: v for k, v in d.items() if k != 'index'} for d in data_dict]
    collection.insert_one({"data":data_dict}) # Insert dict to collection


# Calling function to insert each dataframes into mongoDB collections
insertToDB(df_countries, countriesPop)
insertToDB(df_cityPop, citiesPop)
insertToDB(df_LatestPop, latestPop)


print(db.list_collection_names())
