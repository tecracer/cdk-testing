#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkInspecStack } from '../lib/cdk-inspec-stack';

const envEU  = { account: 'TODOACCOUNT', region: 'eu-central-1' };

const app = new cdk.App();
new CdkInspecStack(app, 'CdkInspecStack', { env: envEU  });
