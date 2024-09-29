import * as cdk from 'aws-cdk-lib';
import { SqsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Bucket, CfnBucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Lambda } from 'aws-cdk-lib/aws-ses-actions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MydemoappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //L1 and l2 constructs of an s3 Bucket
    const level1S3Bucket = new CfnBucket(this, 'MyFirstLevel1ConstructBucket', {
      versioningConfiguration: {
        status: 'Enabled'
      }
    });

    const level2S3Bucket = new Bucket(this, 'MyFirstLevel2ConstructBucket', {
      versioned: true,
      bucketName: "myfirstevel2contsructbucketforreal",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const queue = new Queue(this, 'Myqueue', {
      queueName: 'MyQueueDemo',

    });

    level2S3Bucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new SqsDestination(queue)
    );

    const myLambda = new lambda.Function(this, 'MyLambdaFunctionForReal',{
      runtime: lambda.Runtime.NODEJS_18_X, // Runtime for Lambda
      handler: 'index.handler',           // File and method name
      code: lambda.Code.fromAsset('lambda'), // Lambda code directory
    })
  }
}
