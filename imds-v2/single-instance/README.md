# Single Instance and Test imdsv2

Goal: Patch ssh daemon instance connect to work with imdbv2

Test: 

1. Create Instance and VPC with `task deploy`


## EC2 instance

Install newest aws cli

1) Remove old cli
`sudo yum remove awscli`

2) Install new version of awscli
```bash
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
```

With the old version (here 1.16.102-1.amzn2.0.1) imdsv2 does not work.
With the new version (here aws-cli/1.16.311) imdbv2 works.

## CDK

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
