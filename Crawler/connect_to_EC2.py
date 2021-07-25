import requests
import os
import boto3
from dotenv import dotenv_values
from mysql.connector import pooling
# import paramiko

# key = paramiko.RSAKey.from_private_key_file(/Users/lucas/Desktop/myProject/OCW/AWS/ocw.notebook.pem)
# client = paramiko.SSHClient()

config = dotenv_values("../.env")

# ec2 = boto3.client('ec2',
#                    'us-east-2',
#                    aws_access_key_id=config["AWS_ACCESS_KEY"],
#                    aws_secret_access_key=config["AWS_SECRET_KEY"]
#                    )
# response = ec2.describe_instances()["Reservations"]["Instances"][0][]
# print(response)

try:
    ssm_client = boto3.client('ssm', region_name='us-east-2',
                              aws_access_key_id=config["AWS_ACCESS_KEY"],
                             aws_secret_access_key=config["AWS_SECRET_KEY"])
    params={"commands":["python -V"]}
    # print(running_instances[0])

    response = ssm_client.send_command(DocumentName="AWS-RunShellScript", InstanceIds=[config["InstanceId"]],Parameters=params)
    # print(response)
    command_id = response["Command"]['CommandId']
    output = ssm_client.get_command_invocation(
        CommandId=command_id,
        InstanceId=config["InstanceId"],
        PluginName="aws:runShellScript"
    )
    print(command_id,output)
except Exception as e:
    print(e)
else:
    print('------------- succeded ---------------------')
    # print(response)


# aws ssm send-command \
#     --instance-ids "i-03d4c6d002f44f929" \
#     --document-name "AWS-RunShellScript" \
#     --comment "IP config" \
#     --parameters commands=ifconfig \
#     --output text


# print(config)
# print(config["SSHPublicKey"])
# client = boto3.client('ec2-instance-connect')
# response = client.send_ssh_public_key(
#     InstanceId = config["InstanceId"],
#     InstanceOSUser= config["InstanceOSUser"],
#     SSHPublicKey= config["SSHPublicKey"],
#     AvailabilityZone= config["AvailabilityZone"]
# )
# print(response)


