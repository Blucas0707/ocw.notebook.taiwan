from elasticsearch import Elasticsearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
import boto3
from dotenv import dotenv_values
config = dotenv_values("../.env")

host = config["ES_host"] # For example, my-test-domain.us-east-1.es.amazonaws.com
region = 'us-east-2' # e.g. us-west-1

service = 'es'
credentials = boto3.Session().get_credentials()
aws_access_key_id = config["AWS_ACCESS_KEY"]
aws_secret_access_key= config["AWS_SECRET_KEY"]
# awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
awsauth = AWS4Auth(aws_access_key_id, aws_secret_access_key, region, service)

# print(awsauth)
es = Elasticsearch(
    hosts = [{'host': host, 'port': 443}],
    http_auth = awsauth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection
)

body = {
  "settings": {
        "number_of_shards": 3,
        "number_of_replicas": 2
    },
  "mappings": {
      "properties": {
        "course_name": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "course_category": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "course_university": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
	"course_description": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        }
      }
  }
}

try: 
  es.indices.create(index='courses', body=body)
  es.indices.put_alias(index='courses', name='allcourses')
except:
  indexName = 'courses'
  print(f"index {indexName} is Existed")
print(es.indices.get(index="courses"))