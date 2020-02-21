import cdk = require('@aws-cdk/core');
import { Vpc , CfnRouteTable, CfnRoute, CfnTransitGatewayAttachment,CfnVPCPeeringConnection,CfnVPCCidrBlock, SubnetType} from '@aws-cdk/aws-ec2'
import { Tag } from '@aws-cdk/core';
import { CdkTransitgatewayStack } from '../lib/cdk-transitgateway-stack';



export class VPCSetting extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, tgw: CdkTransitgatewayStack, props?: cdk.StackProps) {
    super(scope, id, props);

    const allCidr  = "0.0.0.0/0";
    const net1Cidr = "10.10.0.0/24";
    const net2Cidr = "192.168.1.0/24";

    const buildEnvTransitGateway = tgw.transitGateway;

    // VPC 1 *** START *****************
    const vpnVPC = new Vpc(this, "vpn",
    {
      cidr: net1Cidr,
      maxAzs: 2,
      enableDnsSupport: true,
      natGateways: 1,
      vpnGateway: false,
    });

    const vpnVpcAttachment = new CfnTransitGatewayAttachment(this, "base-attach",
    {
      transitGatewayId: buildEnvTransitGateway.ref,
      vpcId: vpnVPC.vpcId,
      subnetIds: [vpnVPC.privateSubnets[0].subnetId, vpnVPC.privateSubnets[1].subnetId],
      tags: [new Tag("Name","build-env-a-attach")],
    });
    
    for (var i = 0, len = vpnVPC.privateSubnets.length; i < len; i++) {
      new CfnRoute(this, "tgwVpc"+i,
      {
        routeTableId: vpnVPC.privateSubnets[i].routeTable.routeTableId,
        destinationCidrBlock: net2Cidr,
        transitGatewayId: buildEnvTransitGateway.ref,
      }).addDependsOn(vpnVpcAttachment);      

    }
    // VPC 1 *** END *****************

    // VPC 2 *** Start *****************
    const privateVpc = new Vpc(this, "private",
    {
      cidr: net2Cidr,
      maxAzs: 2,
      natGateways: 1,
      vpnGateway: false,
    });
    
    const privateVPCAttachement = new CfnTransitGatewayAttachment(this, "build-env-b-attach",
    {
      transitGatewayId: buildEnvTransitGateway.ref,
      vpcId: privateVpc.vpcId,
      subnetIds: [privateVpc.privateSubnets[0].subnetId, privateVpc.privateSubnets[1].subnetId],
      tags: [new Tag("Name","build-env-private-attach")]
    });
    
    for (var i = 0, len = vpnVPC.privateSubnets.length; i < len; i++) {
      new CfnRoute(this, "tgwPrivVpc"+i,
      {
        routeTableId: privateVpc.privateSubnets[i].routeTable.routeTableId,
        destinationCidrBlock: net1Cidr,
        transitGatewayId: buildEnvTransitGateway.ref,
      }).addDependsOn(privateVPCAttachement);      
    }
    // VPC 2 *** END *****************
  



  }
}
