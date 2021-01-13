import pandas as pd
import pymongo
import json


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
# Replace null values with 0
df_cityPop.fillna(0,inplace = True)
#####################################################


# Latest Data
#####################################################
# url to scrape for the Live population data
countries_url ="https://worldpopulationreview.com"
# Use panda's `read_html` to parse the url
df_LatestPop = pd.read_html(countries_url, header=0)[0]
# eliminating unnessasary data
df_LatestPop = df_LatestPop.iloc[:,[1,2,5,6,7,8]]
# rename the columns
df_LatestPop.rename(columns={'2019 Density':'Density_PerSqKm', 
                             'Growth Rate':'Growth_Percentage', 
                             'World %':'World_Percentage'
                            },inplace=True)
                            
# Converting string values to numbers
df_LatestPop['Density_PerSqKm'] = pd.to_numeric(df_LatestPop['Density_PerSqKm'].str.rsplit('/', 0).str.get(0).str.replace(r',', ''))
df_LatestPop['Growth_Percentage'] = pd.to_numeric(df_LatestPop['Growth_Percentage'].str.rsplit('%', 0).str.get(0))
df_LatestPop['World_Percentage'] = pd.to_numeric(df_LatestPop['World_Percentage'].str.rsplit('%', 0).str.get(0))
#####################################################



# Countries Population Data
#####################################################
# read Countries population data from csv(source:https://worldpopulationreview.com) into dataframe
df_countries = pd.read_csv('static/data/csvData.csv')
# eliminating unnessasary data
df_countries = df_countries.iloc[:,[1,2,3,6,7,8,9]]
# rename the columns
df_countries.rename(columns={'name':'Country',
                             'pop2020':'2020',
                             'pop2019':'2019',
                             'pop2015':'2015',
                             'pop2010':'2010',
                             'pop2000':'2000',
                             'pop1990':'1990' 
                            },inplace=True)

# Removing decimal point from data
# Loop through the columns
for col in df_countries:
    # performing operations on columns other than Country column
    if col != "Country":
        df_countries[col] = df_countries[col].astype(str)  # Converting to string

        df_countries[col] = [x.split(".") for x in df_countries[col]]    # Split into 2 strings at the decimal point

        # concatenating both strings choosing only 3 digits from the second string(decimal part)
        df_countries[col] = [ x[0] + x[1][0:3] if len(x[1]) >= 3 \
                         else x[0] + x[1][0:3] + '0' if len(x[1]) == 2 \
                         else x[0] + x[1][0:3] + '00' \
                            for x in df_countries[col]]

        df_countries[col] = df_countries[col].astype(int)     # Convering back to number 
        




# Merging with Another dataset
#####################################################
# Another Dataset
# Cleaning csv Population data from https://datacatalog.worldbank.org
# reading csv's into dataframes
df_population = pd.read_csv('static/data/population.csv')

# Creating a list of required row indexes
row_list = []
for x in range(217):
    row_list.append(x)
row_list.append(263)

# Function to Clean each dataframes
def clean_dataFrames(df):
    # eliminating unnecessary data
    df = df.iloc[row_list, [2,11,12,13]]
    # renaming columns
    df = df.rename(columns = lambda x : (str(x)[:-9]))
    df.rename(columns= {df.columns[0]: "Country"}, inplace = True)
    return df

# Calling clean_dataFrames function passing the dataframe as parameter
df_population = clean_dataFrames(df_population)

df_population.drop(df_population.index[df_population['Country'] == 'Eritrea'], inplace = True)

# Loop through the columns
for col in df_population:
    # performing operations on columns other than Country column
    if col != "Country":
        df_population[col] = df_population[col].astype(float)  # Converting string to integer
        df_population[col] = df_population[col].astype(int)  # Converting string to integer

# Checking for countries that has records in df_countries, but not in df_population
mismatch_df = df_countries[~df_countries.Country.isin(df_population.Country)]

# Renaming the Countries to match the dataframes if Country name is df_countries a substring of 
# Country name in df_population
for country in mismatch_df['Country']: 
    df_population["Country"].loc[df_population['Country'].str.contains(country)] = country

# Changing the Other Country names in df_population to match with df_countries
df_population["Country"].loc[df_population.Country == "Congo, Dem. Rep."] = "DR Congo"
df_population["Country"].loc[df_population.Country == "Congo, Rep."] = "Republic of the Congo"
df_population["Country"].loc[df_population.Country == "Korea, Rep."] = "South Korea"
df_population["Country"].loc[df_population.Country == "Korea, Dem. People’s Rep."] = "North Korea"
df_population["Country"].loc[df_population.Country == "Cote d'Ivoire"] = "Ivory Coast"
df_population["Country"].loc[df_population.Country == "Lao PDR"] = "Laos"
df_population["Country"].loc[df_population.Country == "Macao SAR, China"] = "Macau"
df_population["Country"].loc[df_population.Country == "Kyrgyz Republic"] = "Kyrgyzstan"
df_population["Country"].loc[df_population.Country == "Slovak Republic"] = "Slovakia"
df_population["Country"].loc[df_population.Country == "Eswatini"] = "Swaziland"
df_population["Country"].loc[df_population.Country == "Cabo Verde"] = "Cape Verde"
df_population["Country"].loc[df_population.Country == "St. Lucia"] = "Saint Lucia"
df_population["Country"].loc[df_population.Country == "St. Vincent and the Grenadines"] = "Saint Vincent and the Grenadines"
df_population["Country"].loc[df_population.Country == "Virgin Islands (U.S.)"] = "United States Virgin Islands"
df_population["Country"].loc[df_population.Country == "St. Kitts and Nevis"] = "Saint Kitts and Nevis"
df_population["Country"].loc[df_population.Country == "St. Martin (French part)"] = "Saint Martin"

mismatch_df = df_countries[~df_countries.Country.isin(df_population.Country)]



# merging two dataframes for additional years
df_countries = df_countries.merge(df_population, on="Country", how="left")
# reordering the columns
df_countries = df_countries.iloc[:,[0,1,2,9,8,7,3,4,5,6]]
# Replace null values with 0
df_countries.fillna(0,inplace = True)
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
    df.reset_index(inplace=True) # Reset Index
    data_dict = df.to_dict("records") # Convert to dictionary
    collection.insert_one({"data":data_dict}) # Insert dict to collection


# Calling function to insert each dataframes into mongoDB collections
insertToDB(df_countries, countriesPop)
insertToDB(df_cityPop, citiesPop)
insertToDB(df_LatestPop, latestPop)


print(db.list_collection_names())
