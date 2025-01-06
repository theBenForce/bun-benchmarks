import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as NodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as path from 'path';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeLambda = new NodeLambda.NodejsFunction(this, "node-lambda", {
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
      // entry: './NodeLambda.ts'
    });

    const bunDistPath = path.join(__dirname, '..', '..', '..', 'functions', 'bun-lambda', 'dist');
    console.dir({ bunDistPath });

    const bunLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'bun-layer', `arn:aws:lambda:${this.region}:${this.account}:layer:bun:1`);

    const bunLambda = new lambda.Function(this, "bun-lambda", {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      architecture: lambda.Architecture.ARM_64,
      layers: [bunLayer],
      handler: 'index.handler',
      code: lambda.Code.fromAsset(bunDistPath),
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
    });
    
    const httpApi = new apigwv2.HttpApi(this, 'HttpApi');

    const nodeRoute = httpApi.addRoutes({
      path: '/node',
      methods: [ apigwv2.HttpMethod.GET ],
      integration: new HttpLambdaIntegration('NodeIntegration', nodeLambda),
    });

    const bunRoute = httpApi.addRoutes({
      path: '/bun',
      methods: [ apigwv2.HttpMethod.GET ],
      integration: new HttpLambdaIntegration('BunIntegration', bunLambda),
    });

    this.exportValue(httpApi.url!, {
      name: 'HttpApiUrl',
    });
  }
}
