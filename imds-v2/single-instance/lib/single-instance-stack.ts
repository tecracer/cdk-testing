import { Stack, Construct, StackProps, Tag, CfnOutput } from '@aws-cdk/core';
import { Instance, AmazonLinuxImage, AmazonLinuxGeneration, AmazonLinuxEdition, AmazonLinuxVirt, AmazonLinuxStorage, InstanceType, InstanceClass, InstanceSize, OperatingSystemType,Vpc, SubnetType, SecurityGroup, UserData, Peer, Port, GenericLinuxImage } from '@aws-cdk/aws-ec2';
import { ManagedPolicy, Role, ServicePrincipal, CfnInstanceProfile } from '@aws-cdk/aws-iam'
import { VpcStack} from './Vpc-stack'

export class SingleInstanceStack extends Stack {
  constructor(scope: Construct, id: string, vpc: VpcStack, props?:StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  
    // const linuxImage = new AmazonLinuxImage({
    //   generation: AmazonLinuxGeneration.AMAZON_LINUX_2
    // });
    //{"ubuntu-xenial-16.04-amd64-server-20191114", OperatingSystemType.LINUX}
    // ami-0062c497b55437b01
    const myUserData = UserData.forLinux();
    myUserData.addCommands("yum update -y");

    const linuxImage = new GenericLinuxImage({"eu-central-1" : "ami-0062c497b55437b01"},
    {
      userData: myUserData
    });

    // const linuxImage = new AmazonLinuxImage({
    //   generation: AmazonLinuxGeneration.AMAZON_LINUX_2
    // });

    const instance=new Instance(this, "singleinstance", {
        vpc: vpc.vpc,
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        machineImage: linuxImage,
        vpcSubnets: {subnetType: SubnetType.PUBLIC},
        keyName: 'ggtrc-eu-central-1'
        },
      );

    instance.role.addManagedPolicy( ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));
    instance.role.addManagedPolicy( ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'));
    instance.addUserData('yum update -y');
    
    
    instance.addSecurityGroup(vpc.securitygroup);
    

    new CfnOutput(this, "DemoInstanceId", {
      description: "Instance id imdbv2 Demo",
      value: instance.instanceId,
      exportName: 'demoUbuntuInstanceId'
    });
    new CfnOutput(this, "DemoInstanceIp", {
      description: "Instance id imdbv2 Demo",
      value: instance.instancePublicIp,
      exportName: 'demoUbuntuInstanceIp'
    });

  }
}
