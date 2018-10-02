import { CreateCommandObject } from './CommandOperations';

function OperationToCommand (str) {
	var RegEx = new RegExp('ID', 'g');
	str = str.replace(RegEx, 'Id');
	for (var i = 65; i < 91; i++) {
		RegEx = new RegExp(String.fromCharCode(i), 'g');
		str = str.replace(RegEx, '-' + String.fromCharCode(i + 32));
	}
	return str.substr(1);
}

function CommandToOperation (str) {
	for (var i = 65; i < 91; i++) {
		var RegEx = new RegExp('-' + String.fromCharCode(i + 32), 'g');
		str = str.replace(RegEx, String.fromCharCode(i));
	}
	return String.fromCharCode(str.charCodeAt(0) - 32) + str.substr(1);
}

var awsim = {
	_ExecuteCommand: function(CommandArray) {
		try {
			var command = CommandArray[0];
			var operation = CommandToOperation(CommandArray[1]);
			if (this[command]['operations'][operation]['_execute'] === undefined)
				return 'An error occurred (AccessDenied) when calling the ' + operation + ' operation: Access to the resource is denied.';
			return this[command]['operations'][operation]['_execute'](CreateCommandObject(CommandArray));
		}
		catch (err) {
			return `
usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]
aws: error: argument command: Invalid choice`;
		}
	},
	_ListCommands: function() {
		try {
			var result = [];
			for (var key in this)
				if (key.search('_') !== 0)
					result.push(key);
			return result;
		}
		catch (err) {
			return [];
		}
	},
	_GetCommandDocumentation: function(command) {
		try {
			return this[command]['documentation'];
		}
		catch (err) {
			return false;
		}
	},
	_ListOperations: function(command) {
		try {
			var result = [];
			for (var operation in this[command]['operations'])
				result.push(OperationToCommand(operation));
			return result;
		}
		catch (err) {
			return [];
		}
	},
	_GetOperationDocumentation: function(command, subcommand) {
		try {
			var operation = CommandToOperation(subcommand);
			return this[command]['operations'][operation]['documentation'];
		}
		catch (err) {
			return false;
		}
	},
	_ListOperationOptions: function(command, subcommand) {
		try {
			var operation = CommandToOperation(subcommand);
			return Object.keys(this[command]['operations'][operation]['_options']);
		}
		catch (err) {
			return [];
		}
	},
	_ListOperationOptionValues: function(command, subcommand, option) {
		try {
			var operation = CommandToOperation(subcommand);
			return this[command]['operations'][operation]['_options'][option]();
		}
		catch (err) {
			return [];
		}
	},
	_GetOperationOptionDocumentation: function(command, subcommand, option) {
		try {
			var operation = CommandToOperation(subcommand);
			option = CommandToOperation(option.replace('--',''));
			var shape = this[command]['operations'][operation]['input']['shape'];
			return this[command]['shapes'][shape]['members'][option]['documentation'];
		}
		catch (err) {
			return false;
		}
	},
	_GetOperationOptionDescription: function(command, subcommand, option) {
		try {
			var operation = CommandToOperation(subcommand);
			option = CommandToOperation(option.replace('--',''));
			var shape = this[command]['operations'][operation]['input']['shape'];
			shape = this[command]['shapes'][shape]['members'][option]['shape'];
			return this[command]['shapes'][shape]['type'];
		}
		catch (err) {
			return false;
		}
	},
};

export default awsim;
awsim['acm'] = require('./data/acm/2015-12-08/service-2.json');
awsim['acm-pca'] = require('./data/acm-pca/2017-08-22/service-2.json');
awsim['alexaforbusiness'] = require('./data/alexaforbusiness/2017-11-09/service-2.json');
awsim['apigateway'] = require('./data/apigateway/2015-07-09/service-2.json');
awsim['application-autoscaling'] = require('./data/application-autoscaling/2016-02-06/service-2.json');
awsim['appstream'] = require('./data/appstream/2016-12-01/service-2.json');
awsim['appsync'] = require('./data/appsync/2017-07-25/service-2.json');
awsim['athena'] = require('./data/athena/2017-05-18/service-2.json');
awsim['autoscaling'] = require('./data/autoscaling/2011-01-01/service-2.json');
awsim['autoscaling-plans'] = require('./data/autoscaling-plans/2018-01-06/service-2.json');
awsim['batch'] = require('./data/batch/2016-08-10/service-2.json');
awsim['budgets'] = require('./data/budgets/2016-10-20/service-2.json');
awsim['ce'] = require('./data/ce/2017-10-25/service-2.json');
awsim['cloud9'] = require('./data/cloud9/2017-09-23/service-2.json');
awsim['clouddirectory'] = require('./data/clouddirectory/2017-01-11/service-2.json');
awsim['cloudformation'] = require('./data/cloudformation/2010-05-15/service-2.json');
awsim['cloudfront'] = require('./data/cloudfront/2018-06-18/service-2.json');
awsim['cloudhsm'] = require('./data/cloudhsm/2014-05-30/service-2.json');
awsim['cloudhsmv2'] = require('./data/cloudhsmv2/2017-04-28/service-2.json');
awsim['cloudsearch'] = require('./data/cloudsearch/2013-01-01/service-2.json');
awsim['cloudsearchdomain'] = require('./data/cloudsearchdomain/2013-01-01/service-2.json');
awsim['cloudtrail'] = require('./data/cloudtrail/2013-11-01/service-2.json');
awsim['cloudwatch'] = require('./data/cloudwatch/2010-08-01/service-2.json');
awsim['codebuild'] = require('./data/codebuild/2016-10-06/service-2.json');
awsim['codecommit'] = require('./data/codecommit/2015-04-13/service-2.json');
awsim['codedeploy'] = require('./data/codedeploy/2014-10-06/service-2.json');
awsim['codepipeline'] = require('./data/codepipeline/2015-07-09/service-2.json');
awsim['codestar'] = require('./data/codestar/2017-04-19/service-2.json');
awsim['cognito-identity'] = require('./data/cognito-identity/2014-06-30/service-2.json');
awsim['cognito-idp'] = require('./data/cognito-idp/2016-04-18/service-2.json');
awsim['cognito-sync'] = require('./data/cognito-sync/2014-06-30/service-2.json');
awsim['comprehend'] = require('./data/comprehend/2017-11-27/service-2.json');
awsim['config'] = require('./data/config/2014-11-12/service-2.json');
awsim['connect'] = require('./data/connect/2017-08-08/service-2.json');
awsim['cur'] = require('./data/cur/2017-01-06/service-2.json');
awsim['datapipeline'] = require('./data/datapipeline/2012-10-29/service-2.json');
awsim['dax'] = require('./data/dax/2017-04-19/service-2.json');
awsim['devicefarm'] = require('./data/devicefarm/2015-06-23/service-2.json');
awsim['directconnect'] = require('./data/directconnect/2012-10-25/service-2.json');
awsim['discovery'] = require('./data/discovery/2015-11-01/service-2.json');
awsim['dlm'] = require('./data/dlm/2018-01-12/service-2.json');
awsim['dms'] = require('./data/dms/2016-01-01/service-2.json');
awsim['ds'] = require('./data/ds/2015-04-16/service-2.json');
awsim['dynamodb'] = require('./data/dynamodb/2012-08-10/service-2.json');
awsim['dynamodbstreams'] = require('./data/dynamodbstreams/2012-08-10/service-2.json');
awsim['ec2'] = require('./data/ec2/2016-11-15/service-2.json');
awsim['ecr'] = require('./data/ecr/2015-09-21/service-2.json');
awsim['ecs'] = require('./data/ecs/2014-11-13/service-2.json');
awsim['efs'] = require('./data/efs/2015-02-01/service-2.json');
awsim['eks'] = require('./data/eks/2017-11-01/service-2.json');
awsim['elasticache'] = require('./data/elasticache/2015-02-02/service-2.json');
awsim['elasticbeanstalk'] = require('./data/elasticbeanstalk/2010-12-01/service-2.json');
awsim['elastictranscoder'] = require('./data/elastictranscoder/2012-09-25/service-2.json');
awsim['elb'] = require('./data/elb/2012-06-01/service-2.json');
awsim['elbv2'] = require('./data/elbv2/2015-12-01/service-2.json');
awsim['emr'] = require('./data/emr/2009-03-31/service-2.json');
awsim['es'] = require('./data/es/2015-01-01/service-2.json');
awsim['events'] = require('./data/events/2015-10-07/service-2.json');
awsim['firehose'] = require('./data/firehose/2015-08-04/service-2.json');
awsim['fms'] = require('./data/fms/2018-01-01/service-2.json');
awsim['gamelift'] = require('./data/gamelift/2015-10-01/service-2.json');
awsim['glacier'] = require('./data/glacier/2012-06-01/service-2.json');
awsim['glue'] = require('./data/glue/2017-03-31/service-2.json');
awsim['greengrass'] = require('./data/greengrass/2017-06-07/service-2.json');
awsim['guardduty'] = require('./data/guardduty/2017-11-28/service-2.json');
awsim['health'] = require('./data/health/2016-08-04/service-2.json');
awsim['iam'] = require('./data/iam/2010-05-08/service-2.json');
awsim['importexport'] = require('./data/importexport/2010-06-01/service-2.json');
awsim['inspector'] = require('./data/inspector/2016-02-16/service-2.json');
awsim['iot'] = require('./data/iot/2015-05-28/service-2.json');
awsim['iot-data'] = require('./data/iot-data/2015-05-28/service-2.json');
awsim['iot-jobs-data'] = require('./data/iot-jobs-data/2017-09-29/service-2.json');
awsim['iot1click-devices'] = require('./data/iot1click-devices/2018-05-14/service-2.json');
awsim['iot1click-projects'] = require('./data/iot1click-projects/2018-05-14/service-2.json');
awsim['iotanalytics'] = require('./data/iotanalytics/2017-11-27/service-2.json');
awsim['kinesis'] = require('./data/kinesis/2013-12-02/service-2.json');
awsim['kinesis-video-archived-media'] = require('./data/kinesis-video-archived-media/2017-09-30/service-2.json');
awsim['kinesis-video-media'] = require('./data/kinesis-video-media/2017-09-30/service-2.json');
awsim['kinesisanalytics'] = require('./data/kinesisanalytics/2015-08-14/service-2.json');
awsim['kinesisvideo'] = require('./data/kinesisvideo/2017-09-30/service-2.json');
awsim['kms'] = require('./data/kms/2014-11-01/service-2.json');
awsim['lambda'] = require('./data/lambda/2015-03-31/service-2.json');
awsim['lex-models'] = require('./data/lex-models/2017-04-19/service-2.json');
awsim['lex-runtime'] = require('./data/lex-runtime/2016-11-28/service-2.json');
awsim['lightsail'] = require('./data/lightsail/2016-11-28/service-2.json');
awsim['logs'] = require('./data/logs/2014-03-28/service-2.json');
awsim['machinelearning'] = require('./data/machinelearning/2014-12-12/service-2.json');
awsim['macie'] = require('./data/macie/2017-12-19/service-2.json');
awsim['marketplace-entitlement'] = require('./data/marketplace-entitlement/2017-01-11/service-2.json');
awsim['marketplacecommerceanalytics'] = require('./data/marketplacecommerceanalytics/2015-07-01/service-2.json');
awsim['mediaconvert'] = require('./data/mediaconvert/2017-08-29/service-2.json');
awsim['medialive'] = require('./data/medialive/2017-10-14/service-2.json');
awsim['mediapackage'] = require('./data/mediapackage/2017-10-12/service-2.json');
awsim['mediastore'] = require('./data/mediastore/2017-09-01/service-2.json');
awsim['mediastore-data'] = require('./data/mediastore-data/2017-09-01/service-2.json');
awsim['mediatailor'] = require('./data/mediatailor/2018-04-23/service-2.json');
awsim['meteringmarketplace'] = require('./data/meteringmarketplace/2016-01-14/service-2.json');
awsim['mgh'] = require('./data/mgh/2017-05-31/service-2.json');
awsim['mobile'] = require('./data/mobile/2017-07-01/service-2.json');
awsim['mq'] = require('./data/mq/2017-11-27/service-2.json');
awsim['mturk'] = require('./data/mturk/2017-01-17/service-2.json');
awsim['neptune'] = require('./data/neptune/2014-10-31/service-2.json');
awsim['opsworks'] = require('./data/opsworks/2013-02-18/service-2.json');
awsim['opsworkscm'] = require('./data/opsworkscm/2016-11-01/service-2.json');
awsim['organizations'] = require('./data/organizations/2016-11-28/service-2.json');
awsim['pi'] = require('./data/pi/2018-02-27/service-2.json');
awsim['pinpoint'] = require('./data/pinpoint/2016-12-01/service-2.json');
awsim['polly'] = require('./data/polly/2016-06-10/service-2.json');
awsim['pricing'] = require('./data/pricing/2017-10-15/service-2.json');
awsim['rds'] = require('./data/rds/2014-10-31/service-2.json');
awsim['redshift'] = require('./data/redshift/2012-12-01/service-2.json');
awsim['rekognition'] = require('./data/rekognition/2016-06-27/service-2.json');
awsim['resource-groups'] = require('./data/resource-groups/2017-11-27/service-2.json');
awsim['resourcegroupstaggingapi'] = require('./data/resourcegroupstaggingapi/2017-01-26/service-2.json');
awsim['route53'] = require('./data/route53/2013-04-01/service-2.json');
awsim['route53domains'] = require('./data/route53domains/2014-05-15/service-2.json');
awsim['s3'] = require('./data/s3/2006-03-01/service-2.json');
awsim['sagemaker'] = require('./data/sagemaker/2017-07-24/service-2.json');
awsim['sagemaker-runtime'] = require('./data/sagemaker-runtime/2017-05-13/service-2.json');
awsim['sdb'] = require('./data/sdb/2009-04-15/service-2.json');
awsim['secretsmanager'] = require('./data/secretsmanager/2017-10-17/service-2.json');
awsim['serverlessrepo'] = require('./data/serverlessrepo/2017-09-08/service-2.json');
awsim['servicecatalog'] = require('./data/servicecatalog/2015-12-10/service-2.json');
awsim['servicediscovery'] = require('./data/servicediscovery/2017-03-14/service-2.json');
awsim['ses'] = require('./data/ses/2010-12-01/service-2.json');
awsim['shield'] = require('./data/shield/2016-06-02/service-2.json');
awsim['signer'] = require('./data/signer/2017-08-25/service-2.json');
awsim['sms'] = require('./data/sms/2016-10-24/service-2.json');
awsim['snowball'] = require('./data/snowball/2016-06-30/service-2.json');
awsim['sns'] = require('./data/sns/2010-03-31/service-2.json');
awsim['sqs'] = require('./data/sqs/2012-11-05/service-2.json');
awsim['ssm'] = require('./data/ssm/2014-11-06/service-2.json');
awsim['stepfunctions'] = require('./data/stepfunctions/2016-11-23/service-2.json');
awsim['storagegateway'] = require('./data/storagegateway/2013-06-30/service-2.json');
awsim['sts'] = require('./data/sts/2011-06-15/service-2.json');
awsim['support'] = require('./data/support/2013-04-15/service-2.json');
awsim['swf'] = require('./data/swf/2012-01-25/service-2.json');
awsim['transcribe'] = require('./data/transcribe/2017-10-26/service-2.json');
awsim['translate'] = require('./data/translate/2017-07-01/service-2.json');
awsim['waf'] = require('./data/waf/2015-08-24/service-2.json');
awsim['waf-regional'] = require('./data/waf-regional/2016-11-28/service-2.json');
awsim['workdocs'] = require('./data/workdocs/2016-05-01/service-2.json');
awsim['workmail'] = require('./data/workmail/2017-10-01/service-2.json');
awsim['workspaces'] = require('./data/workspaces/2015-04-08/service-2.json');
awsim['xray'] = require('./data/xray/2016-04-12/service-2.json');
awsim['ec2']['operations']['DescribeInstances']['_state'] = JSON.parse(atob('ewogICAgIlJlc2VydmF0aW9ucyI6IFsKICAgICAgICB7CiAgICAgICAgICAgICJJbnN0YW5jZXMiOiBbCiAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgIk1vbml0b3JpbmciOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJTdGF0ZSI6ICJkaXNhYmxlZCIKICAgICAgICAgICAgICAgICAgICB9LCAKICAgICAgICAgICAgICAgICAgICAiUHVibGljRG5zTmFtZSI6ICJlYzItNTItMjExLTUtMjIzLmV1LXdlc3QtMS5jb21wdXRlLmFtYXpvbmF3cy5jb20iLCAKICAgICAgICAgICAgICAgICAgICAiU3RhdGUiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJDb2RlIjogMTYsIAogICAgICAgICAgICAgICAgICAgICAgICAiTmFtZSI6ICJydW5uaW5nIgogICAgICAgICAgICAgICAgICAgIH0sIAogICAgICAgICAgICAgICAgICAgICJFYnNPcHRpbWl6ZWQiOiBmYWxzZSwgCiAgICAgICAgICAgICAgICAgICAgIkxhdW5jaFRpbWUiOiAiMjAxOC0xMC0wMlQxMzoyNjowMi4wMDBaIiwgCiAgICAgICAgICAgICAgICAgICAgIlB1YmxpY0lwQWRkcmVzcyI6ICI1Mi4yMTEuNS4yMjMiLCAKICAgICAgICAgICAgICAgICAgICAiUHJpdmF0ZUlwQWRkcmVzcyI6ICIxNzIuMzEuMTUuMTI1IiwgCiAgICAgICAgICAgICAgICAgICAgIlByb2R1Y3RDb2RlcyI6IFtdLCAKICAgICAgICAgICAgICAgICAgICAiVnBjSWQiOiAidnBjLTFkZTg2Nzc5IiwgCiAgICAgICAgICAgICAgICAgICAgIkNwdU9wdGlvbnMiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJDb3JlQ291bnQiOiAxLCAKICAgICAgICAgICAgICAgICAgICAgICAgIlRocmVhZHNQZXJDb3JlIjogMQogICAgICAgICAgICAgICAgICAgIH0sIAogICAgICAgICAgICAgICAgICAgICJTdGF0ZVRyYW5zaXRpb25SZWFzb24iOiAiIiwgCiAgICAgICAgICAgICAgICAgICAgIkluc3RhbmNlSWQiOiAiaS0wYmJkZTJjMmEzNDdhN2IxYiIsIAogICAgICAgICAgICAgICAgICAgICJFbmFTdXBwb3J0IjogdHJ1ZSwgCiAgICAgICAgICAgICAgICAgICAgIkltYWdlSWQiOiAiYW1pLTBiZGIxZDZjMTVhNDAzOTJjIiwgCiAgICAgICAgICAgICAgICAgICAgIlByaXZhdGVEbnNOYW1lIjogImlwLTE3Mi0zMS0xNS0xMjUuZXUtd2VzdC0xLmNvbXB1dGUuaW50ZXJuYWwiLCAKICAgICAgICAgICAgICAgICAgICAiS2V5TmFtZSI6ICJxd2lrTEFCUy1MMTUyLTc0MjM0IiwgCiAgICAgICAgICAgICAgICAgICAgIlNlY3VyaXR5R3JvdXBzIjogWwogICAgICAgICAgICAgICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiR3JvdXBOYW1lIjogImxhdW5jaC13aXphcmQtMSIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIkdyb3VwSWQiOiAic2ctMDBkMjJhMWZmNGIyNDFiZDkiCiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBdLCAKICAgICAgICAgICAgICAgICAgICAiQ2xpZW50VG9rZW4iOiAiIiwgCiAgICAgICAgICAgICAgICAgICAgIlN1Ym5ldElkIjogInN1Ym5ldC01MTcwMWUzNSIsIAogICAgICAgICAgICAgICAgICAgICJJbnN0YW5jZVR5cGUiOiAidDIubWljcm8iLCAKICAgICAgICAgICAgICAgICAgICAiTmV0d29ya0ludGVyZmFjZXMiOiBbCiAgICAgICAgICAgICAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJTdGF0dXMiOiAiaW4tdXNlIiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiTWFjQWRkcmVzcyI6ICIwMjo3NDplZTo1MDpkMzoxYyIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIlNvdXJjZURlc3RDaGVjayI6IHRydWUsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIlZwY0lkIjogInZwYy0xZGU4Njc3OSIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIkRlc2NyaXB0aW9uIjogIiIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIk5ldHdvcmtJbnRlcmZhY2VJZCI6ICJlbmktMDJmODkwYTdlNmU1NTEzZjYiLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQcml2YXRlSXBBZGRyZXNzZXMiOiBbCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiUHJpdmF0ZURuc05hbWUiOiAiaXAtMTcyLTMxLTE1LTEyNS5ldS13ZXN0LTEuY29tcHV0ZS5pbnRlcm5hbCIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiUHJpdmF0ZUlwQWRkcmVzcyI6ICIxNzIuMzEuMTUuMTI1IiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQcmltYXJ5IjogdHJ1ZSwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJBc3NvY2lhdGlvbiI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQdWJsaWNJcCI6ICI1Mi4yMTEuNS4yMjMiLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQdWJsaWNEbnNOYW1lIjogImVjMi01Mi0yMTEtNS0yMjMuZXUtd2VzdC0xLmNvbXB1dGUuYW1hem9uYXdzLmNvbSIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIklwT3duZXJJZCI6ICJhbWF6b24iCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQcml2YXRlRG5zTmFtZSI6ICJpcC0xNzItMzEtMTUtMTI1LmV1LXdlc3QtMS5jb21wdXRlLmludGVybmFsIiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiQXR0YWNobWVudCI6IHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiU3RhdHVzIjogImF0dGFjaGVkIiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIkRldmljZUluZGV4IjogMCwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIkRlbGV0ZU9uVGVybWluYXRpb24iOiB0cnVlLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiQXR0YWNobWVudElkIjogImVuaS1hdHRhY2gtMDA0Njg2ZGRlNmJjY2UxMWIiLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiQXR0YWNoVGltZSI6ICIyMDE4LTEwLTAyVDEzOjI2OjAyLjAwMFoiCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJHcm91cHMiOiBbCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiR3JvdXBOYW1lIjogImxhdW5jaC13aXphcmQtMSIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiR3JvdXBJZCI6ICJzZy0wMGQyMmExZmY0YjI0MWJkOSIKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICJJcHY2QWRkcmVzc2VzIjogW10sIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgIk93bmVySWQiOiAiMzczMjgxNDE5NTE1IiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiUHJpdmF0ZUlwQWRkcmVzcyI6ICIxNzIuMzEuMTUuMTI1IiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiU3VibmV0SWQiOiAic3VibmV0LTUxNzAxZTM1IiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiQXNzb2NpYXRpb24iOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIlB1YmxpY0lwIjogIjUyLjIxMS41LjIyMyIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJQdWJsaWNEbnNOYW1lIjogImVjMi01Mi0yMTEtNS0yMjMuZXUtd2VzdC0xLmNvbXB1dGUuYW1hem9uYXdzLmNvbSIsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJJcE93bmVySWQiOiAiYW1hem9uIgogICAgICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgXSwgCiAgICAgICAgICAgICAgICAgICAgIlNvdXJjZURlc3RDaGVjayI6IHRydWUsIAogICAgICAgICAgICAgICAgICAgICJQbGFjZW1lbnQiOiB7CiAgICAgICAgICAgICAgICAgICAgICAgICJUZW5hbmN5IjogImRlZmF1bHQiLCAKICAgICAgICAgICAgICAgICAgICAgICAgIkdyb3VwTmFtZSI6ICIiLCAKICAgICAgICAgICAgICAgICAgICAgICAgIkF2YWlsYWJpbGl0eVpvbmUiOiAiZXUtd2VzdC0xYSIKICAgICAgICAgICAgICAgICAgICB9LCAKICAgICAgICAgICAgICAgICAgICAiSHlwZXJ2aXNvciI6ICJ4ZW4iLCAKICAgICAgICAgICAgICAgICAgICAiQmxvY2tEZXZpY2VNYXBwaW5ncyI6IFsKICAgICAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgIkRldmljZU5hbWUiOiAiL2Rldi94dmRhIiwgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAiRWJzIjogewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJTdGF0dXMiOiAiYXR0YWNoZWQiLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiRGVsZXRlT25UZXJtaW5hdGlvbiI6IHRydWUsIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJWb2x1bWVJZCI6ICJ2b2wtMGY3YzA1MTY5YzFjOTBkZjUiLCAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAiQXR0YWNoVGltZSI6ICIyMDE4LTEwLTAyVDEzOjI2OjAzLjAwMFoiCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBdLCAKICAgICAgICAgICAgICAgICAgICAiQXJjaGl0ZWN0dXJlIjogIng4Nl82NCIsIAogICAgICAgICAgICAgICAgICAgICJSb290RGV2aWNlVHlwZSI6ICJlYnMiLCAKICAgICAgICAgICAgICAgICAgICAiUm9vdERldmljZU5hbWUiOiAiL2Rldi94dmRhIiwgCiAgICAgICAgICAgICAgICAgICAgIlZpcnR1YWxpemF0aW9uVHlwZSI6ICJodm0iLCAKICAgICAgICAgICAgICAgICAgICAiQW1pTGF1bmNoSW5kZXgiOiAwCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIF0sIAogICAgICAgICAgICAiUmVzZXJ2YXRpb25JZCI6ICJyLTBkOTExZGIzODVlZGRmY2I1IiwgCiAgICAgICAgICAgICJHcm91cHMiOiBbXSwgCiAgICAgICAgICAgICJPd25lcklkIjogIjM3MzI4MTQxOTUxNSIKICAgICAgICB9CiAgICBdCn0K'));
awsim['ec2']['operations']['DescribeInstances']['_options'] = {};
awsim['ec2']['operations']['DescribeInstances']['_execute'] = function(CommandObject) { return JSON.stringify(awsim['ec2']['operations']['DescribeInstances']['_state'], null, 1); };
awsim['dynamodb']['operations']['ListTables']['_state'] = JSON.parse(atob('ewogICAgIlRhYmxlTmFtZXMiOiBbCiAgICAgICAgIk15REIiLCAKICAgICAgICAiTXlUYWJsZSIKICAgIF0KfQo='));
awsim['dynamodb']['operations']['ListTables']['_options'] = {};
awsim['dynamodb']['operations']['ListTables']['_execute'] = function(CommandObject) { return JSON.stringify(awsim['dynamodb']['operations']['ListTables']['_state'], null, 1); };
awsim['dynamodb']['operations']['DescribeTable']['_options'] = {};
awsim['dynamodb']['operations']['DescribeTable']['_state'] = {};
awsim['dynamodb']['operations']['DescribeTable']['_options']['--table-name'] = () => {
	var result = [];

	for (var key in awsim['dynamodb']['operations']['DescribeTable']['_state'])
		result.push(key.split(' ')[1]);

	return result;
};
awsim['dynamodb']['operations']['DescribeTable']['_execute'] = (command) => {
	var optionName = '--table-name'.replace('--','');

	if (command.options[optionName] === undefined || command.options[optionName][0] === undefined || command.options[optionName].length > 1)
		return 'aws: error: argument --table-name: expected one argument';

	var optionValue = command['options'][optionName][0];
	var resource = awsim['dynamodb']['operations']['DescribeTable']['_state']['--table-name ' + optionValue];

	if (resource === undefined)
		return 'An error occurred (ResourceNotFoundException) when calling the DescribeTable operation: Requested resource not found: ' + optionValue + ' not found';

	return JSON.stringify(resource, null, 1);
}
awsim['dynamodb']['operations']['DescribeTable']['_state']['--table-name MyDB'] = JSON.parse(atob('ewogICAgIlRhYmxlIjogewogICAgICAgICJUYWJsZUFybiI6ICJhcm46YXdzOmR5bmFtb2RiOmV1LXdlc3QtMTozNzMyODE0MTk1MTU6dGFibGUvTXlEQiIsIAogICAgICAgICJBdHRyaWJ1dGVEZWZpbml0aW9ucyI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgIkF0dHJpYnV0ZU5hbWUiOiAiaWQiLCAKICAgICAgICAgICAgICAgICJBdHRyaWJ1dGVUeXBlIjogIlMiCiAgICAgICAgICAgIH0KICAgICAgICBdLCAKICAgICAgICAiUHJvdmlzaW9uZWRUaHJvdWdocHV0IjogewogICAgICAgICAgICAiTnVtYmVyT2ZEZWNyZWFzZXNUb2RheSI6IDAsIAogICAgICAgICAgICAiV3JpdGVDYXBhY2l0eVVuaXRzIjogNSwgCiAgICAgICAgICAgICJSZWFkQ2FwYWNpdHlVbml0cyI6IDUKICAgICAgICB9LCAKICAgICAgICAiVGFibGVTaXplQnl0ZXMiOiAwLCAKICAgICAgICAiVGFibGVOYW1lIjogIk15REIiLCAKICAgICAgICAiVGFibGVTdGF0dXMiOiAiQUNUSVZFIiwgCiAgICAgICAgIlRhYmxlSWQiOiAiNzgyNTY0MGYtODYyMi00Y2YwLTk2ODAtZjIwZjhkNmViMWMyIiwgCiAgICAgICAgIktleVNjaGVtYSI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgIktleVR5cGUiOiAiSEFTSCIsIAogICAgICAgICAgICAgICAgIkF0dHJpYnV0ZU5hbWUiOiAiaWQiCiAgICAgICAgICAgIH0KICAgICAgICBdLCAKICAgICAgICAiSXRlbUNvdW50IjogMCwgCiAgICAgICAgIkNyZWF0aW9uRGF0ZVRpbWUiOiAxNTM4NDg2ODAwLjQ3CiAgICB9Cn0K'));
awsim['dynamodb']['operations']['DescribeTable']['_state']['--table-name MyTable'] = JSON.parse(atob('ewogICAgIlRhYmxlIjogewogICAgICAgICJUYWJsZUFybiI6ICJhcm46YXdzOmR5bmFtb2RiOmV1LXdlc3QtMTozNzMyODE0MTk1MTU6dGFibGUvTXlUYWJsZSIsIAogICAgICAgICJBdHRyaWJ1dGVEZWZpbml0aW9ucyI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgIkF0dHJpYnV0ZU5hbWUiOiAiaWQiLCAKICAgICAgICAgICAgICAgICJBdHRyaWJ1dGVUeXBlIjogIlMiCiAgICAgICAgICAgIH0KICAgICAgICBdLCAKICAgICAgICAiUHJvdmlzaW9uZWRUaHJvdWdocHV0IjogewogICAgICAgICAgICAiTnVtYmVyT2ZEZWNyZWFzZXNUb2RheSI6IDAsIAogICAgICAgICAgICAiV3JpdGVDYXBhY2l0eVVuaXRzIjogNSwgCiAgICAgICAgICAgICJSZWFkQ2FwYWNpdHlVbml0cyI6IDUKICAgICAgICB9LCAKICAgICAgICAiVGFibGVTaXplQnl0ZXMiOiAwLCAKICAgICAgICAiVGFibGVOYW1lIjogIk15VGFibGUiLCAKICAgICAgICAiVGFibGVTdGF0dXMiOiAiQUNUSVZFIiwgCiAgICAgICAgIlRhYmxlSWQiOiAiMGQyZjY3MWUtNGEzYy00ZTFkLTk0ZGQtNTA3YTM2NzNiYTRjIiwgCiAgICAgICAgIktleVNjaGVtYSI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgIktleVR5cGUiOiAiSEFTSCIsIAogICAgICAgICAgICAgICAgIkF0dHJpYnV0ZU5hbWUiOiAiaWQiCiAgICAgICAgICAgIH0KICAgICAgICBdLCAKICAgICAgICAiSXRlbUNvdW50IjogMCwgCiAgICAgICAgIkNyZWF0aW9uRGF0ZVRpbWUiOiAxNTM4NDg2ODA3LjM0NgogICAgfQp9Cg=='));
