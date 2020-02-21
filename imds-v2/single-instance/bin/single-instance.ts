#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SingleInstanceStack } from '../lib/single-instance-stack';
import { VpcStack} from '../lib/vpc-stack';

const app = new cdk.App();

const envEU  = { account: 'TODOYOURACCOUNT', region: 'eu-central-1' };

const env = envEU;

const vpcstack = new VpcStack(app, "VpcStackImdbV2War17",{ env: env});

new SingleInstanceStack(app, 'SingleInstanceStack',  vpcstack,{ env: env});
