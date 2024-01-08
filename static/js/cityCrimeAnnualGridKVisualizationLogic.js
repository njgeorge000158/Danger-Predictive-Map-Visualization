/****************************************************************************
 *
 *  File Name:  cityCrimeAnnualGridKVisualizationLogic.js
 *
 *  File Description:
 *      This Javascript file contains the function and subroutine calls 
 *      for the html file, cityCrimeAnnualGridKVisualizationIndex.html. 
 *      Here is a list of the functions and subroutines:
 *  
 *      FetchJsonDataFromURLFunction
 *      ReturnColorFromOffensesFunction
 *      ReturnPoliceStationsURLFunction
 *      ReturnUcrCrimesAndOverlayFunction
 * 
 *      DisplayOverlayLayerSubroutine
 *      DisplayPolicePrecinctsSubroutine
 *      DisplayPoliceBeatsSubroutine
 *      DisplayPoliceGridSubroutine
 *      DisplayPoliceStationsSubroutine
 *      DisplayLegendSubroutine
 * 
 *      InitializeWebPageSubroutine
 *      
 *
 *  Date        Description                             Programmer
 *  ----------  ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

let cityOutlineUrlString
        = 'https://mapping-phoenix.opendata.arcgis.com/datasets/Phoenix::city-limit-light-outline.geojson?where=1=1&outSR=%7B%22latestWkid%22%3A2868%2C%22wkid%22%3A2868%7D'

let policeStationsUrlString 
        = 'https://mapping-phoenix.opendata.arcgis.com/datasets/Phoenix::police-stations.geojson?where=1=1&outSR=%7B%22latestWkid%22%3A2868%2C%22wkid%22%3A2868%7D';

let policePrecinctsUrlString 
        = 'https://mapping-phoenix.opendata.arcgis.com/datasets/Phoenix::police-precincts.geojson?where=1=1&outSR=%7B%22latestWkid%22%3A2868%2C%22wkid%22%3A2868%7D';

let policeBeatsUrlString 
        = 'https://mapping-phoenix.opendata.arcgis.com/datasets/Phoenix::police-beats.geojson?where=1=1&outSR=%7B%22latestWkid%22%3A2868%2C%22wkid%22%3A2868%7D';

let policeGridUrlString 
        = 'https://mapping-phoenix.opendata.arcgis.com/datasets/Phoenix::police-grid.geojson?where=1=1';


let cityOutlineOverlayLayerGroup
        = L.layerGroup();

let policeStationsOverlayLayerGroup
        = L.layerGroup();

let policePrecinctsOverlayLayerGroup
        = L.layerGroup();

let policeBeatsOverlayLayerGroup
        = L.layerGroup();

let policeGridOverlayLayerGroup
        = L.layerGroup();


let gridCrimes2023ActualOverlayLayerGroup
        = L.layerGroup();

let gridCrimesNonePredictionsOverlayLayerGroup
        = L.layerGroup();


let choropleth2023PredictionsOverlayLayerGroup
        = L.layerGroup();

let choropleth2024PredictionsOverlayLayerGroup
        = L.layerGroup();
        
let choroplethNonePredictionsOverlayLayerGroup
        = L.layerGroup();


// These lines of code declare the four map tile layers: outdoors, grayscale,
// satellite, and dark.
const outdoorsMapTileLayer 
      = L.tileLayer
        (
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: 'mapbox/outdoors-v11',
                accessToken: API_KEY
            }
        );

const grayscaleMapTileLayer 
      = L.tileLayer
        (
            'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: 'mapbox/light-v10',
                accessToken: API_KEY
            }
        );

const satelliteMapTileLayer 
      = L.tileLayer
        (
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
            {
                attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
                maxZoom: 18,
                id: 'mapbox.satellite',
                accessToken: API_KEY
            }
        );

const darkMapTileLayer 
      = L.tileLayer 
        (
            'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
            {
                attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
                maxZoom: 18,
                id: 'dark-v10',
                accessToken: API_KEY
            }
        );


// This Dictionary contains the base map tile layers.
const baseMapTileLayerDictionary
        = {
                'Outdoors Map': outdoorsMapTileLayer,
                'Grayscale Map': grayscaleMapTileLayer,
                'Satellite Map': satelliteMapTileLayer,
                'Dark Map': darkMapTileLayer
          };

// These Dictionaries contain map overlay layers.
const boundariesOverlayLayerGroupDictionary 
        = {
                'City of Phoenix': cityOutlineOverlayLayerGroup,
                'Police Stations': policeStationsOverlayLayerGroup,
                'Police Precincts': policePrecinctsOverlayLayerGroup,
                'Police Beats': policeBeatsOverlayLayerGroup,
                'Police Grid': policeGridOverlayLayerGroup
          };

const gridCrimesOverlayLayerGroupDictionary 
        = {
                'UCR Crimes (2023)': gridCrimes2023ActualOverlayLayerGroup,
                'None': gridCrimesNonePredictionsOverlayLayerGroup
          };

const predictiveMapsOverlayLayerGroupDictionary 
        = {
                'Predictive Map (2023)': choropleth2023PredictionsOverlayLayerGroup,
                'Predictive Map (2024)': choropleth2024PredictionsOverlayLayerGroup,
                'None': choroplethNonePredictionsOverlayLayerGroup
          };


// This map object is the current map and initially displays the outdoors map with the 
// city overlay layers.
let currentMapObject 
        = L.map
            ('mapid', 
                {
                    center: [33.605333, -112.073889],
                    zoom: 13,
                    layers: [outdoorsMapTileLayer,
                             cityOutlineOverlayLayerGroup,
                             policePrecinctsOverlayLayerGroup,
                             gridCrimesNonePredictionsOverlayLayerGroup,
                             choropleth2023PredictionsOverlayLayerGroup]
                }
            );


// These control layers display the map and overlay options.
L.control
    .layers
    (   
        baseMapTileLayerDictionary, 
        boundariesOverlayLayerGroupDictionary,
        {collapsed: false}
    )
    .addTo(currentMapObject);

L.control
    .layers
    (   
        gridCrimesOverlayLayerGroupDictionary, 
        {},
        {collapsed: false}
    )
    .addTo(currentMapObject);

L.control
    .layers
    (   
        predictiveMapsOverlayLayerGroupDictionary, 
        {},
        {collapsed: false}
    )
    .addTo(currentMapObject);


// This control layer is the legend.
let legendControlObject
        = L.control
          (
            {position: 'topleft'}
          );


// This Array includes the offenses for color assignment.
const offensesRangeFloatArray
        = [1, 10, 20, 40, 80, 120, 240, 360, 480];


/****************************************************************************
 *
 *  Function Name:  FetchJsonDataFromURLFunction
 *
 *  Function Description:  
 *      This function is the first stage for retrieving the aviation 
 *      accidents data set from the specified URL.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          urlString
 *                          This parameter is the URL for the source data.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

async function FetchJsonDataFromURLFunction 
                (urlString) 
{
    var dataD3JsonObject = null;
  
    try 
    {
        dataD3JsonObject 
            = await 
                d3.json
                    (urlString);
    }
    catch (error) 
    {
        console.error
            (error);
    }
 
    return dataD3JsonObject;
} // This right brace ends the block for the function, 
// FetchJsonDataFromURLFunction.


/****************************************************************************
 *
 *  Function Name:  ReturnColorFromOffensesFunction
 *
 *  Function Description:  
 *      This function chooses a color based on the number of offenses
 *      in a grid.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Float
 *          depthFloat
 *                          This parameter is the depth of the earthquake.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function ReturnColorFromOffensesFunction
            (depthFloat) 
{
    if (depthFloat >= offensesRangeFloatArray[8])
    {
        return 'maroon';
    }
    else if (depthFloat >= offensesRangeFloatArray[7])
    {
        return 'firebrick';
    }
    else if (depthFloat >= offensesRangeFloatArray[6])
    {
        return 'red';
    }
    else if (depthFloat >= offensesRangeFloatArray[5])
    {
        return 'orangered';
    }
    else if (depthFloat >= offensesRangeFloatArray[4])
    {
        return 'darkorange';
    }
    else if (depthFloat >= offensesRangeFloatArray[3])
    {
        return 'orange';
    }
    else if (depthFloat >= offensesRangeFloatArray[2])
    {
        return 'gold';
    }
    else if (depthFloat >= offensesRangeFloatArray[1])
    {
        return 'yellow';
    }
    else
    {
        return 'lightgreen';
    }
} // This right brace ends the block for the function, 
// ReturnColorFromOffensesFunction.


/****************************************************************************
 *
 *  Function Name:  ReturnPoliceStationsURLFunction
 *
 *  Function Description:  
 *      This function returns the police station url based on object id.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          objectIDString
 *                          This parameter is the police station's object ID.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/12/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function ReturnPoliceStationsURLFunction
            (objectIDString)
{
    if (objectIDString == 1298)
    {
        return 'https://www.phoenix.gov/police/precincts/south-mountain'
    } 
    else if (objectIDString == 1299)
    {
        return 'https://www.phoenix.gov/police/precincts/central-city'
    }
    else if (objectIDString == 1300)
    {
        return 'https://www.phoenix.gov/police/precincts/desert-horizon'
    }
    else if (objectIDString == 1301)
    {
        return 'https://www.phoenix.gov/police/precincts/mountain-view'
    }
    else if (objectIDString == 1302)
    {
        return 'https://www.phoenix.gov/police/precincts/maryvale'
    }
    else if (objectIDString == 1303)
    {
        return 'https://www.phoenix.gov/police/precincts/cactus-park'
    }
    else if (objectIDString == 1304)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1305)
    {
        return 'https://www.phoenixpolicereserve.org/the-academy.html'
    }
    else if (objectIDString == 1306)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1307)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1308)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1309)
    {
        return 'https://www.phoenix.gov/police/property-crimes/property-management-unit'
    }
    else if (objectIDString == 1310)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1311)
    {
        return 'https://www.phoenix.gov/police/precincts/south-mountain'
    }
    else if (objectIDString == 1312)
    {
        return 'https://www.phoenix.gov/police/resources-information/vehicle-impounds'
    }
    else if (objectIDString == 1313)
    {
        return 'https://www.phoenix.gov/police'
    }
    else if (objectIDString == 1314)
    {
        return 'https://arizonacenter.com'
    }
    else
    {
        return 'https://www.phoenix.gov/police'
    }
} // This right brace ends the block for the function, 
// ReturnPoliceStationsURLFunction.


/****************************************************************************
 *
 *  Function Name:  ReturnUcrCrimesAndOverlayFunction
 *
 *  Function Description:  
 *      This function returns the overlay layer and crimes by grid list
 *      for a particular year.
 *
 *
 *  Function Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String
 *          objectIDString
 *                          This parameter is the police station's object ID.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/12/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function ReturnUcrCrimesAndOverlayFunction
            (yearString,
             choroplethBoolean = false)
{
    var currentOverlayLayerGroup = null;

    var ucrCrimesList = null;

    if (yearString == '2020')
    {
        currentOverlayLayerGroup = gridCrimes2020ActualOverlayLayerGroup;

        ucrCrimesList = gridCrimes2020ActualList;
    }
    else if (yearString == '2021')
    {
        currentOverlayLayerGroup = gridCrimes2021ActualOverlayLayerGroup;

        ucrCrimesList = gridCrimes2021ActualList;
    }
    else if (yearString == '2022')
    {
        currentOverlayLayerGroup = gridCrimes2022ActualOverlayLayerGroup;

        ucrCrimesList = gridCrimes2022ActualList;
    }
    else if (yearString == '2023')
    {
        if (choroplethBoolean == true)
        {
            currentOverlayLayerGroup = choropleth2023PredictionsOverlayLayerGroup;
        }
        else
        {
            currentOverlayLayerGroup = gridCrimes2023ActualOverlayLayerGroup;
        }

        ucrCrimesList = gridCrimes2023ActualList;
    }
    else if (yearString == '2024')
    {
        if (choroplethBoolean == true)
        {
            currentOverlayLayerGroup = choropleth2024PredictionsOverlayLayerGroup;
        }
        else
        {
            currentOverlayLayerGroup = gridCrimes2024PredictionsOverlayLayerGroup;
        }
        
        ucrCrimesList = gridCrimes2024PredictionsList;
    }

    return [currentOverlayLayerGroup, ucrCrimesList];
} // This right brace ends the block for the function, 
// ReturnUcrCrimesAndOverlayFunction.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayOverlayLayerSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine checks whether the overlay layer is currently
 *      displayed and updates the overlay layer accordingly.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  Overlay Layer Group
 *          overlayLayerGroup
 *                          This parameter is the current overlay layer group.
 *  Boolean
 *          layerExistsBoolean
 *                          This parameter indicates whether the overlay layer
 *                          is currently displayed or not.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayOverlayLayerSubroutine
            (overlayLayerGroup,
             layerExistsBoolean)
{
    if (layerExistsBoolean == false)
    {
        currentMapObject.removeLayer(overlayLayerGroup);
    }
    else
    {
        overlayLayerGroup.addTo(currentMapObject); 
    }
} // This right brace ends the block for the subroutine, 
// DisplayOverlayLayerSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayCityOutlineSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the city's outline.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayCityOutlineSubroutine()
{
    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(cityOutlineOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    cityOutlineOverlayLayerGroup.clearLayers();

    cityOutlineOverlayLayerGroup.addTo(currentMapObject);

    FetchJsonDataFromURLFunction
    (cityOutlineUrlString)
        .then
        (
            (cityOutlineGeoJsonDictionary => 
                {
                    L.geoJSON
                    (
                        cityOutlineGeoJsonDictionary.features, 
                        {style: 
                            {color: 'blue',
                             fillOpacity: 0.0,
                             weight: 3.0}
                        }
                    )
                    .addTo(cityOutlineOverlayLayerGroup);

                    DisplayOverlayLayerSubroutine
                        (cityOutlineOverlayLayerGroup,
                         layerExistsBoolean);
                }
            )
        );
} // This right brace ends the block for the subroutine, 
// DisplayCityOutlineSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayPolicePrecinctsSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays police precincts.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayPolicePrecinctsSubroutine()
{
    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(policePrecinctsOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    policePrecinctsOverlayLayerGroup.clearLayers();

    policePrecinctsOverlayLayerGroup.addTo(currentMapObject);

    FetchJsonDataFromURLFunction
        (policePrecinctsUrlString)
            .then
            (
                (policePrecinctsGeoJsonDictionary => 
                    {
                        L.geoJSON 
                        (
                            policePrecinctsGeoJsonDictionary.features, 
                            {
                                color: 'blue',
                                fillOpacity: 0.0,
                                weight: 2.5,
                                onEachFeature: function (feature, layer) 
                                {
                                    layer.bindPopup('<p><b>' + feature.properties.NAME.toUpperCase() + '</b></p>');
                                }
                            }
                        ).addTo(policePrecinctsOverlayLayerGroup);

                        DisplayOverlayLayerSubroutine
                            (policePrecinctsOverlayLayerGroup,
                             layerExistsBoolean);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// DisplayPolicePrecinctsSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayPoliceBeatsSubroutine
 * 
 *  Subroutine Description:  
 *      This subroutine displays police beats.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayPoliceBeatsSubroutine()
{
    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(policeBeatsOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    policeBeatsOverlayLayerGroup.clearLayers();

    policeBeatsOverlayLayerGroup.addTo(currentMapObject);

    FetchJsonDataFromURLFunction 
        (policeBeatsUrlString)
            .then
            (
                (policeBeatsGeoJsonDictionary => 
                    {
                        L.geoJSON
                        (
                            policeBeatsGeoJsonDictionary.features, 
                            {
                                color: 'green',
                                fillOpacity: 0.0,
                                weight: 1.5,
                                onEachFeature: function (feature, layer) 
                                {
                                    layer.bindPopup('<p><b>BEAT:</b> ' + feature.properties.BEAT + '</p>');
                                }
                            }
                        )
                        .addTo(policeBeatsOverlayLayerGroup);

                        DisplayOverlayLayerSubroutine
                            (policeBeatsOverlayLayerGroup,
                             layerExistsBoolean);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// DisplayPoliceBeatsSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayPoliceGridSubroutine
 * 
 *  Subroutine Description:  
 *      This subroutine displays the police grid.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayPoliceGridSubroutine()
{
    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(policeGridOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    policeGridOverlayLayerGroup.clearLayers();

    policeGridOverlayLayerGroup.addTo(currentMapObject);

    FetchJsonDataFromURLFunction 
        (policeGridUrlString)
            .then
            (
                (policeGridGeoJsonDictionary => 
                    {
                        L.geoJSON
                        (
                            policeGridGeoJsonDictionary.features, 
                            {
                                color: 'red',
                                fillOpacity: 0.0,
                                weight: 1.0,
                                onEachFeature: function (feature, layer) 
                                {
                                    layer.bindPopup('<p><b>GRID:</b> ' + feature.properties.GRID_NUMBER + '</p>');
                                }
                            }
                        )
                        .addTo(policeGridOverlayLayerGroup);

                        DisplayOverlayLayerSubroutine
                            (policeGridOverlayLayerGroup,
                             layerExistsBoolean);
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// DisplayPoliceBeatsSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayPoliceStationsSubroutine
 * 
 *  Subroutine Description:  
 *      This subroutine displays the police stations.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayPoliceStationsSubroutine()
{
    var layerExistsBoolean = true;

    var markerIconObject
            = new L.Icon
                    (
                        {
                            iconUrl: './static/img/marker-icon-2x-blue.png',
                            shadowUrl: './static/img/marker-shadow.png',
                            iconSize: [18, 30],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        }
                    );

    if (currentMapObject.hasLayer(policeStationsOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    policeStationsOverlayLayerGroup.clearLayers();

    policeStationsOverlayLayerGroup.addTo(currentMapObject);

    FetchJsonDataFromURLFunction 
        (policeStationsUrlString)
            .then
            (
                (policeStationsGeoJsonDictionary => 
                    {
                        for (var i = 0; i < policeStationsGeoJsonDictionary.features.length; i++)
                        {
                            L.marker
                            (
                                [policeStationsGeoJsonDictionary.features[i].geometry.coordinates[1],
                                 policeStationsGeoJsonDictionary.features[i].geometry.coordinates[0]], 
                                {icon: markerIconObject}
                            )
                            .bindPopup
                            (
                                `<div class="map-popup"><a href="${ReturnPoliceStationsURLFunction(policeStationsGeoJsonDictionary.features[i].properties.OBJECTID)}">
                                    <b>${policeStationsGeoJsonDictionary.features[i].properties.NAME.toUpperCase()}</b></a></div><br>
                                <div class="map-popup-exp">
                                <span>Address: </span> ${policeStationsGeoJsonDictionary.features[i].properties.ADDRESS} <br>
                                <span>City: </span> ${policeStationsGeoJsonDictionary.features[i].properties.CITY} <br>
                                <span>State: </span> ${policeStationsGeoJsonDictionary.features[i].properties.STATE} <br>
                                <span>Zipcode: </span> ${policeStationsGeoJsonDictionary.features[i].properties.ZIPCODE} km <br>
                                <span>Phone Number: </span> ${policeStationsGeoJsonDictionary.features[i].properties.PHONE_NUMB}
                                </div>`
                            )
                            .addTo(policeStationsOverlayLayerGroup);

                            DisplayOverlayLayerSubroutine
                                (policeStationsOverlayLayerGroup,
                                 layerExistsBoolean);
                        }
                    }
                )
            );
} // This right brace ends the block for the subroutine, 
// DisplayPoliceStationsSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayUcrCrimesSubroutine
 * 
 *  Subroutine Description:  
 *      This subroutine displays the ucr crime numbers for 2023.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String  yearString      This parameter is the selected year for crimes.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayUcrCrimesSubroutine
            (yearString)
{
    const [currentOverlayLayerGroup, ucrCrimesList] 
            = ReturnUcrCrimesAndOverlayFunction(yearString, false);

    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(currentOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    currentOverlayLayerGroup.clearLayers();

    currentOverlayLayerGroup.addTo(currentMapObject);

    var tempList = [];

    for (var i = 0; i < ucrCrimesList.length; i++)
    {
        if (ucrCrimesList[i]['offense_count'] > 0)
        {
            tempList.push(ucrCrimesList[i])
        }
    }

    for (var i = 0; i < tempList.length; i++)
    {   
        L.circle
            (
                ([tempList[i]['lat'],
                  tempList[i]['lon']]), 
                         {
                            radius: 350,
                            fillColor: ReturnColorFromOffensesFunction
                                        (tempList[i]['offense_count']),
                            fillOpacity: 0.7,
                            color: 'black',
                            stroke: true,
                            weight: 1.0
                        }
            )
            .bindPopup
            (
                '<p> <b>Grid:</b> ' + tempList[i]['grid'] + '</p>'
                + '<p> <b>Offense Count:</b> ' + tempList[i]['offense_count'] + '</p>'
            )
            .addTo(currentOverlayLayerGroup);
                     
            DisplayOverlayLayerSubroutine
                (currentOverlayLayerGroup,
                 layerExistsBoolean);
        }
} // This right brace ends the block for the subroutine, 
// DisplayUcrCrimesSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayCrimePredictiveHeatmapKMSubroutine
 * 
 *  Subroutine Description:  
 *      This subroutine displays the 2023 ucr crime predictions as a 
 *      choropleth.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  String  yearString      This parameter is the selected year for crimes.
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  12/14/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayCrimePredictiveHeatmapKMSubroutine
            (yearString)
{
    const [currentOverlayLayerGroup, ucrCrimesList] 
            = ReturnUcrCrimesAndOverlayFunction(yearString, true);

    var layerExistsBoolean = true;

    if (currentMapObject.hasLayer(currentOverlayLayerGroup) == false)
    {
        layerExistsBoolean = false;
    }

    currentOverlayLayerGroup.clearLayers();

    currentOverlayLayerGroup.addTo(currentMapObject);

    var heatLocationArray = [];

    for (var i = 0; i < ucrCrimesList.length; i++)
    {
            if (ucrCrimesList[i]['offense_count'] > 2)
            {
                heatLocationArray
                .push
                    (
                            [
                                ucrCrimesList[i]['lat'],
                                ucrCrimesList[i]['lon'],
                                ucrCrimesList[i]['offense_count'] / 10.0
                            ]
                    )

            }
    }

    L.heatLayer
        (heatLocationArray, 
            {
                minOpacity: 0.2,
                radius: 40,
                blur: 40,
                gradient: {0.2: 'blue',
                           0.3: 'green',
                           0.4: 'orange',
                           0.5: 'orangered',
                           0.6: 'red',
                           1.0: 'darkred'}
            }
        ).addTo(currentOverlayLayerGroup);
                     
    DisplayOverlayLayerSubroutine
        (currentOverlayLayerGroup,
         layerExistsBoolean);     
} // This right brace ends the block for the subroutine, 
// DisplayCrimePredictiveHeatmapKMSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  DisplayLegendSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine displays the legend for the base map.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function DisplayLegendSubroutine() 
{
    legendControlObject
        .onAdd 
            = function() 
              {
                    var divDOMUtilityObject
                            = L.DomUtil
                               .create
                                    ('div', 
                                     'legend');


                    divDOMUtilityObject.innerHTML 
                        = '<p>Offenses</p>' 
                          + offensesRangeFloatArray.map
                                (function(elementFloat, indexInteger) 
                                 {
                                    return '<span style = "background:' 
                                           + ReturnColorFromOffensesFunction(elementFloat + 1.0) 
                                           + '">&nbsp &nbsp &nbsp &nbsp</span> ' 
                                           + elementFloat 
                                           + (offensesRangeFloatArray[indexInteger + 1] 
                                              ? ' &ndash; ' + offensesRangeFloatArray[indexInteger + 1] + '<br>' 
                                              : '+');
                                 }
                                ).join('');
  
                    return divDOMUtilityObject;
              };

    let legendButtonObject 
            = L.easyButton
                (
                    {
                        position: 'topright',
                        states: 
                            [
                                {
                                    stateName: 'show-legend',
                                    icon: '<img class = "button-keys" src = "https://upload.wikimedia.org/wikipedia/commons/1/11/Key.svg" height = "30px">',
                                    onClick: 
                                        function(control) 
                                        {
                                            legendControlObject.addTo(currentMapObject);

                                            control.state('hide-legend');
                                        }
                                }, 
                                {
                                    stateName: 'hide-legend',
                                    icon: '<img class = "button-keys" src = "https://upload.wikimedia.org/wikipedia/commons/1/11/Key.svg" height = "30px">',
                                    onClick: 
                                        function(control) 
                                        {
                                            currentMapObject.removeControl(legendControlObject );

                                            control.state('show-legend');
                                        }
                                }
                            ]
                    }
                ).addTo(currentMapObject);

    let buttonElementObject
            = legendButtonObject
                ._container
                .firstChild;

    buttonElementObject.id = 'legend-button';
} // This right brace ends the block for the subroutine, 
// DisplayLegendSubroutine.


/****************************************************************************
 *
 *  Subroutine Name:  InitializeWebPageSubroutine
 *
 *  Subroutine Description:  
 *      This subroutine initializes the Aviation Accidents Visualization
 *      Toolkit by populating the drop down menus and setting up the
 *      legend, dropdown menus, and map layers.
 *
 *
 *  Subroutine Parameters:
 *
 *  Type    Name            Description
 *  -----   -------------   ----------------------------------------------
 *  n/a     n/a             n/a
 *
 * 
 *  Date        Description                             Programmer
 *  --------    ------------------------------------    ------------------
 *  10/26/2023  Initial Development                     N. James George
 *
 ****************************************************************************/

function InitializeWebPageSubroutine() 
{

    DisplayLegendSubroutine();


    DisplayCityOutlineSubroutine();

    DisplayPoliceStationsSubroutine();

    DisplayPolicePrecinctsSubroutine();

    DisplayPoliceBeatsSubroutine();

    DisplayPoliceGridSubroutine();
    

    DisplayUcrCrimesSubroutine('2023');


    DisplayCrimePredictiveHeatmapKMSubroutine('2023');

    DisplayCrimePredictiveHeatmapKMSubroutine('2024');
} // This right brace ends the block for the subroutine, 
// InitializeWebPageSubroutine.


InitializeWebPageSubroutine();