import {SecurityGroup, Peer, Port, Vpc} from '@aws-cdk/aws-ec2'
import { Stack, Construct, StackProps } from '@aws-cdk/core';

export class CdkInspecStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = Vpc.fromLookup(this, 'VPC', {
      // This imports the default VPC but you can also
      // specify a 'vpcName' or 'tags'.
      isDefault: true
    });

    const frontEndSecurityGroup = new SecurityGroup(this, "FrontEnd",
    {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "FrontEnd",
      description: "Test Inspec"
    })

    frontEndSecurityGroup.addIngressRule( Peer.anyIpv4(), Port.tcp(8080), "Web Client incoming")
    frontEndSecurityGroup.addIngressRule( Peer.ipv4("10.0.1.7/32"), Port.tcp(22), "SSH Client")



    const backEndSecurityGroup = new SecurityGroup(this, "BackEnd",
    {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "BackEnd",
      description: "Test Inspec"
    });

    backEndSecurityGroup.addIngressRule(frontEndSecurityGroup, Port.tcp(8080), "BackEndConnetion")

  }
}
