#!/usr/bin/env python3
"""
Script to create Jenkins job for random-number-api
Run this script to automatically create the Jenkins pipeline job
"""

import requests
from io import BytesIO
import json

def create_jenkins_job(xml_content: str, job_name: str) -> str:
    """
    Creates a Jenkins job from XML string content.
    Returns a JSON string containing status code and response text.
    """
    jenkins_url = "http://10.244.9.46:8080"
    username = "admin"
    token = "113c3c36d7941c82dc817a1ddf1c1b0db7"

    xml_file = BytesIO(xml_content.encode("utf-8"))
    xml_file.name = f"{job_name}.xml"

    headers = {"Content-Type": "application/xml"}

    response = requests.post(
        f"{jenkins_url}/createItem?name={job_name}",
        headers=headers,
        data=xml_file,
        auth=(username, token)
    )

    result = {
        "status_code": response.status_code,
        "response_text": response.text
    }

    return json.dumps(result)

# Jenkins job XML configuration
JENKINS_JOB_XML = '''<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions/>
  <description>CI/CD Pipeline for Random Number API</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.90">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.11.0">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/jaasimjalal/random-number-api</url>
          <refspec>+refs/heads/develop:refs/remotes/origin/develop</refspec>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/develop</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
'''

if __name__ == "__main__":
    job_name = "random-number-api"
    result = create_jenkins_job(JENKINS_JOB_XML, job_name)
    result_obj = json.loads(result)
    
    print(f"Job creation result: {result_obj['status_code']}")
    print(f"Response: {result_obj['response_text']}")
    
    if result_obj['status_code'] == 200:
        print(f"\n✅ Jenkins job '{job_name}' created successfully!")
        print(f"Pipeline URL: http://10.244.9.46:8080/job/{job_name}/")
    elif result_obj['status_code'] == 400:
        print(f"\n⚠️ Job '{job_name}' may already exist or configuration issue.")
    else:
        print(f"\n❌ Failed to create job. Status: {result_obj['status_code']}")