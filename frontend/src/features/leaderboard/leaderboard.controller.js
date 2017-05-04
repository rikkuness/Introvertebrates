import elasticsearch from 'elasticsearch'

export default class LeaderboardController {
    constructor($http, $scope) {
        this._http = $http

        // Connect to Elasticsearch
        this.connectEs()

        let scope = $scope
        this.findUniqueUsers().then(r => {
            const users = r.aggregations.distinct_users.buckets

            $scope.$apply(() => {
                scope.users = users

                // Look up usernames
                scope.users.map(user => {
                    this.lookupUserByID(user.key).then(r => {
                        $scope.$apply(() => {
                            try {
                                user.name = r.hits.hits[0]._source.user.name
                            } catch (err) { }
                        })
                    })
                })
            })
        })

    }

    connectEs() {
        this.esclient = new elasticsearch.Client({
            host: 'https://e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/',
            httpAuth: 'readonly:spaceappschallenge'
        })
    }

    findUniqueUsers() {
        // Have to unique by id rather than name :(
        return this.esclient.search({
            index: 'twitter',
            type: 'tweet',
            body: {
                "size": 0,
                "aggs": {
                    "distinct_users": {
                        "terms": {
                            "field": "user.id"
                        }
                    }
                }
            }
        })
    }

    lookupUserByID(id) {
        return this.esclient.search({
            index: 'twitter',
            type: 'tweet',
            body: {
                "size": 1,
                "query": {
                    "bool": {
                        "must": [{
                            "term": {
                                "user.id": id
                            }
                        }]
                    }
                }
            }
        })
    }

}
