#!/usr/bin/python
# -*- coding: utf-8 -*-
import re
import requests
import exifread
import StringIO

id_field = 'id_str'

tweet_mapping = {'properties': 
                    {'timestamp_ms': {
                                  'type': 'date'
                                  },
                     'text': {
                                  'type': 'string'
                              },
                     'coordinates': {
                          'properties': {
                             'coordinates': {
                                'type': 'geo_point'
                             },
                             'type': {
                                'type': 'string',
                                'index' : 'not_analyzed'
                            }
                          }
                     },
                     'user': {
                          'properties': {
                             'id': {
                                'type': 'long'
                             },
                             'name': {
                                'type': 'string'
                            }
                          }
                     },
                     'sentiments': {
                                  'type': 'string',
                                  'index' : 'not_analyzed'
                              }
                    }
                 }

def _convert_to_degress(value):
    """
    Helper function to convert the GPS coordinates stored in the EXIF to degress in float format
    :param value:
    :type value: exifread.utils.Ratio
    :rtype: float
    """
    d = float(value.values[0].num) / float(value.values[0].den)
    m = float(value.values[1].num) / float(value.values[1].den)
    s = float(value.values[2].num) / float(value.values[2].den)

    return d + (m / 60.0) + (s / 3600.0)

def get_exif_location(exif_data):
    """
    Returns the latitude and longitude, if available, from the provided exif_data (obtained through get_exif_data above)
    """
    lat = None
    lon = None

    gps_latitude = exif_data.get('GPS GPSLatitude')
    gps_latitude_ref = exif_data.get('GPS GPSLatitudeRef')
    gps_longitude = exif_data.get('GPS GPSLongitude')
    gps_longitude_ref = exif_data.get('GPS GPSLongitudeRef')

    if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
        lat = _convert_to_degress(gps_latitude)
        if gps_latitude_ref.values[0] != 'N':
            lat = 0 - lat

        lon = _convert_to_degress(gps_longitude)
        if gps_longitude_ref.values[0] != 'E':
            lon = 0 - lon

    return lat, lon

def extract_location(doc):
    """ "place":
{
    "attributes":{},
     "bounding_box":
    {
        "coordinates":
        [[
                [-77.119759,38.791645],
                [-76.909393,38.791645],
                [-76.909393,38.995548],
                [-77.119759,38.995548]
        ]],
        "type":"Polygon"
    },
     "country":"United States",
     "country_code":"US",
     "full_name":"Washington, DC",
     "id":"01fbe706f872cb32",
     "name":"Washington",
     "place_type":"city",
     "url": "http://api.twitter.com/1/geo/id/01fbe706f872cb32.json"
}"""


    try:
        if doc['coordinates']:
            return doc['coordinates']
    except:
        pass

    try:
        if doc['place']:
            lat, lon = doc['place']['bounding_box'][0][0][0]
            return {'coordinates': [lat, lon]}
    except:
        pass

    # Extract exif data
    try:
        res = requests.get(doc['quoted_status']['entities']['media'][0]['media_url_http'])
    except:
        print ("Failed to get media for doc %s" % doc)

    exif_data = exif.process_file(StringIO.StringIO(res.content))
    exif_lat_lon = get_exif_location(exif_data)

    if exif_lat_lon:
        return {'coordinates': [exif_lat_lon[0], exif_lat_lon[1]]}

    return None


def get_tweet(doc):
    tweet = {}
    tweet[id_field] = doc[id_field]
    tweet['hashtags'] = map(lambda x: x['text'],doc['entities']['hashtags'])

    # Yes I know this may blow up... but thats fine, lambda will recover 
    tweet['coordinates'] = extract_location(doc)

    # Extract media url from quoted tweet
    try:
        tweet['image'] = doc['quoted_status']['entities']['media'][0]['media_url_https']
    except:
        pass

    # Or for the actual tweet
    try:
        tweet['image'] = doc['entities']['media'][0]['media_url_https']
    except:
        pass

    tweet['timestamp_ms'] = doc['timestamp_ms'] 
    tweet['text'] = doc['text']
    tweet['user'] = {'id': doc['user']['id'], 'name': doc['user']['name']}
    tweet['mentions'] = re.findall(r'@\w*', doc['text'])
    return tweet