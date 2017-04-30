#!/usr/bin/python
# -*- coding: utf-8 -*-
'''
Created on Oct 20, 2015

@author: mentzera
'''
import re
from textblob import TextBlob

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
            return doc['coordiantes']
    except:
        pass

    try:
        if doc['place']:
            lat, lon = doc['place']['bounding_box'][0][0][0]
            return {'coordinates': [lat, lon]}
    except:
        pass

    # Extract exif data?

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