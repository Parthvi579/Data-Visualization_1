
**Introduction:**

I made an effort to adhere to the requirements outlined in the coursework guideline in my application.

**Task:**

- I conducted this project by filtering and aggregating data using Python, which allowed me to obtain a clean dataset for visualization. I then utilized D3.js, a powerful data visualization library, to develop interactive and engaging visualizations for the project.

The following points have been attempted to be illustrated using the Covid-19 dataset from the coursework:

**1. How did the COVID-19 pandemic grow over countries and continents throughout the world from its start?**

I created a line chart that shows the daily total cases of COVID-19 for the world since the start of the pandemic. The line chart clearly shows that the number of cases increased exponentially in the early stages of the pandemic, with a sharp rise in cases starting around March 2020. The number of cases continued to increase throughout 2020 and into 2021, with several peaks and plateaus along the way.

Using the date on the x-axis and the number of new cases on the y-axis, this would allow the observer to see how the pandemic spread over time.

I utilised the dataset's date, location, and total cases as Each observation in the dataset has a date associated with it, and the "total cases" column lists all confirmed COVID-19 cases.

With this information, I can see how the pandemic spreads across the nation because it is obvious that we can comprehend this situation by observing the global increase in COVID instances from beginning to end.

I used python for pre-processing data analytic using only specific column from the given dataset as follow,

import pandas as pd

##### Load the data

df = pd.read_csv('https://covid.ourworldindata.org/data/owid-covid-data.csv')

##### Select only the useful columns

df = df[['date', 'location', 'total_cases', 'total_deaths']]

##### Replace NaN values with 0

df[['total_cases', 'total_deaths']] = df[['total_cases', 'total_deaths']].fillna(0)

##### Convert the date column to datetime format df['date'] = pd.to_datetime(df['date'])

##### Group the data by month and country, and take the maximum of each month

df_monthly = df.groupby([pd.Grouper(key='date', freq='M'), 'location']).max()

##### Save the data to a CSV file

df_monthly.to_csv('1_linechart.csv')

![Picture 1-1](https://github.com/Parthvi579/Data-Visualization_1/assets/72267232/050ddbbd-822b-4c01-92c3-c75479c1b7f3)


Chart 1: Line Chart

**2. Choosing some specific countries, how successfully did they manage the outbreak?**

To assess the success of different countries in managing the COVID-19 outbreak, I analyzed data from the repository, focusing on the variables "stringency_index" and "new_cases" for selected countries.

I created a scatterplot chart to compare the stringency index and new cases for each country. The stringency index represents the severity of government-imposed restrictions on social and economic activities, with higher values indicating more restrictive measures. The daily new cases represent the number of newly reported COVID-19 cases per day.

On closer inspection of the graph, we can observe that several nations had low stringency indices and few new cases, demonstrating that they were able to control the outbreak. Some nations on the other hand, had relatively high stringency indices and high numbers of new cases, indicating less effective outbreak management.

The scatterplot chart enables the correlation between the stringency index and new cases for each nation.

Pre-processing analytics used by me for this visualization, 

import pandas as pd

##### Load the data from the CSV file

data = pd.read_csv("https://covid.ourworldindata.org/data/owid-covid-data.csv")

##### Select the columns of interest columns = ["location", "date", "new_cases", "stringency_index"] data = data[columns]

##### Write the data to a new CSV file

data.to_csv("scatter.csv", index=False)


![Picture 1-2](https://github.com/Parthvi579/Data-Visualization_1/assets/72267232/25deda99-0e7f-46fb-a5ce-2659fa6505ed)

Chart 2: ScatterPlot Chart

3. Choosing some specific countries, is there a relationship between the relative “wealth” (e.g. GDP) of a population and the spread of the pandemic?

In order to investigate the relationship between a country's GDP per capita and the spread of the COVID19 pandemic, I used data from the OWID COVID-19 dataset, which provides information on the number of total cases and total GDP per capita for countries around the world. I focused on a subset of countries that I deemed relevant for my analysis.

To visualize the data, I created a barline graph that shows the total number of COVID-19 cases over time for each country, with the bar representing the country's total GDP per capita.

I use total_cases, gdp_per_capita, location from the owid-covid-data.csv to analysis this requirement.

![Picture 1-3](https://github.com/Parthvi579/Data-Visualization_1/assets/72267232/2c50d8a0-b333-458f-b788-d2e5eb6cd25a)


Chart 3: Bar_Line Chart

4. What effect did vaccinations have on the spread of cases/deaths? Did booster jabs also have an impact on the spread/transmissibility of the virus?

In this analysis, I investigate the effect of vaccinations on the spread of COVID-19 cases and deaths, as well as the impact of booster jabs on a quarterly basis. I examine the relationship between vaccination rates, new cases, and booster doses in a selection of countries using data from the Our World in Data COVID-19 dataset.

The grouped bar chart shows that there is a clear relationship between vaccinations and the spread of

COVID-19 cases and deaths on a quarterly basis. In the first quarter of 2021, many countries had low vaccination rates and high rates of new cases and deaths. However, as vaccination rates increased in subsequent quarters, new cases and deaths tended to decrease.

Furthermore, the data suggests that booster doses may have an impact on the spread and transmissibility of the virus on a quarterly basis. Countries with high rates of booster doses had relatively low rates of new cases and deaths in the fourth quarter of 2021 compared to countries with similar GDPs and vaccination rates.

I used python as a pre-processing analysis by taking some specific country and relevant column from the dataset.

import pandas as pd

##### Define selected country and columns selected_countries = ['United States', 'India', 'Brazil', 'United Kingdom', 'Italy', 'China'] selected_columns = ['iso_code', 'location', 'date', 'new_vaccinations_smoothed', 'new_cases_smoothed', 'new_deaths_smoothed', 'total_boosters']

##### Read the data from the CSV file

df = pd.read_csv('https://covid.ourworldindata.org/data/owid-covid-data.csv', usecols=selected_columns)

##### Filter the data for selected countries

##### df_selected = df[df['location'].isin(selected_countries)] df_selected = df

##### Drop rows with missing data

df_selected.dropna(inplace=True)

##### Convert the date column to datetime format

df_selected['date'] = pd.to_datetime(df_selected['date'])

df_selected['quarter'] = df_selected['date'].dt.to_period('Q')

##### Aggregate data by quarter and year df_selected_agg = df_selected.groupby(['location', 'quarter'])[['new_vaccinations_smoothed', 'new_cases_smoothed', 'total_boosters']].agg({'new_vaccinations_smoothed':'sum',

'new_cases_smoothed':'sum', 'total_boosters': lambda x: x.iloc[-1]-x.iloc[0]}).reset_index() print(df_selected_agg.head())

df_selected_agg.to_csv("4_Groupedbarchart.csv", index=False)

![Picture 1-4](https://github.com/Parthvi579/Data-Visualization_1/assets/72267232/022c594b-5da0-41fe-9127-10e4a1b2f0c7)


Chart 4: Grouped-BarPlot Chart

5. How might the geographical position of a country change how the pandemic impacted them?

To analyze the impact of the pandemic, we used a choropleth map that displayed different scalar data over a world map. The data was obtained from the Our World in Data repository and included the “total number of cases”, “vaccinations”, and total deaths due to COVID-19 in different countries. I used circles of varying sizes to represent the total number of deaths in each country, with larger circles indicating a higher number of deaths. The map also included tooltips that provided more information about each country, such as the total number of cases, vaccinations, and people vaccinated.

My analysis of the data revealed that the pandemic has impacted different countries in different ways, depending on their geographical position. For example, countries in Asia and Africa were slower to vaccinate their populations compared to countries in Europe and North America. Countries with high population densities, experienced a significant surge in cases, resulting in a higher number of deaths. I used python for analysis of data for scale distribution over map and tooltip import pandas as pd

# Read the data from the CSV file

df = pd.read_csv('https://covid.ourworldindata.org/data/owid-covid-data.csv')

##### Select the desired columns and fill missing values with 0

df_selected = df[["location", "iso_code", "total_cases", "total_deaths",

"total_vaccinations","people_vaccinated"]] df_selected.fillna(0, inplace=True)

##### Group by country and sum the values

df_agg = df_selected.groupby(['location', 'iso_code']).agg({'total_cases': 'max', 'total_deaths': 'max',

'total_vaccinations': 'max'}).reset_index()

df_agg["code"] = df_agg["iso_code"]

##### Display the aggregated data print(df_agg)

##### Write the data to a CSV file df_agg.to_csv("5_map.csv", index=False)

![Picture 1-5](https://github.com/Parthvi579/Data-Visualization_1/assets/72267232/332a0a92-6ee0-4784-8419-8fa6b636a0ab)


Chart 5: Choropleth map
