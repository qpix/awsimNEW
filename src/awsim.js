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
awsim['acm'] = require('./services/acm/2015-12-08/service-2.json');
awsim['acm-pca'] = require('./services/acm-pca/2017-08-22/service-2.json');
awsim['alexaforbusiness'] = require('./services/alexaforbusiness/2017-11-09/service-2.json');
awsim['apigateway'] = require('./services/apigateway/2015-07-09/service-2.json');
awsim['application-autoscaling'] = require('./services/application-autoscaling/2016-02-06/service-2.json');
awsim['appstream'] = require('./services/appstream/2016-12-01/service-2.json');
awsim['appsync'] = require('./services/appsync/2017-07-25/service-2.json');
awsim['athena'] = require('./services/athena/2017-05-18/service-2.json');
awsim['autoscaling'] = require('./services/autoscaling/2011-01-01/service-2.json');
awsim['autoscaling-plans'] = require('./services/autoscaling-plans/2018-01-06/service-2.json');
awsim['batch'] = require('./services/batch/2016-08-10/service-2.json');
awsim['budgets'] = require('./services/budgets/2016-10-20/service-2.json');
awsim['ce'] = require('./services/ce/2017-10-25/service-2.json');
awsim['cloud9'] = require('./services/cloud9/2017-09-23/service-2.json');
awsim['clouddirectory'] = require('./services/clouddirectory/2017-01-11/service-2.json');
awsim['cloudformation'] = require('./services/cloudformation/2010-05-15/service-2.json');
awsim['cloudfront'] = require('./services/cloudfront/2018-06-18/service-2.json');
awsim['cloudhsm'] = require('./services/cloudhsm/2014-05-30/service-2.json');
awsim['cloudhsmv2'] = require('./services/cloudhsmv2/2017-04-28/service-2.json');
awsim['cloudsearch'] = require('./services/cloudsearch/2013-01-01/service-2.json');
awsim['cloudsearchdomain'] = require('./services/cloudsearchdomain/2013-01-01/service-2.json');
awsim['cloudtrail'] = require('./services/cloudtrail/2013-11-01/service-2.json');
awsim['cloudwatch'] = require('./services/cloudwatch/2010-08-01/service-2.json');
awsim['codebuild'] = require('./services/codebuild/2016-10-06/service-2.json');
awsim['codecommit'] = require('./services/codecommit/2015-04-13/service-2.json');
awsim['codedeploy'] = require('./services/codedeploy/2014-10-06/service-2.json');
awsim['codepipeline'] = require('./services/codepipeline/2015-07-09/service-2.json');
awsim['codestar'] = require('./services/codestar/2017-04-19/service-2.json');
awsim['cognito-identity'] = require('./services/cognito-identity/2014-06-30/service-2.json');
awsim['cognito-idp'] = require('./services/cognito-idp/2016-04-18/service-2.json');
awsim['cognito-sync'] = require('./services/cognito-sync/2014-06-30/service-2.json');
awsim['comprehend'] = require('./services/comprehend/2017-11-27/service-2.json');
awsim['config'] = require('./services/config/2014-11-12/service-2.json');
awsim['connect'] = require('./services/connect/2017-08-08/service-2.json');
awsim['cur'] = require('./services/cur/2017-01-06/service-2.json');
awsim['datapipeline'] = require('./services/datapipeline/2012-10-29/service-2.json');
awsim['dax'] = require('./services/dax/2017-04-19/service-2.json');
awsim['devicefarm'] = require('./services/devicefarm/2015-06-23/service-2.json');
awsim['directconnect'] = require('./services/directconnect/2012-10-25/service-2.json');
awsim['discovery'] = require('./services/discovery/2015-11-01/service-2.json');
awsim['dlm'] = require('./services/dlm/2018-01-12/service-2.json');
awsim['dms'] = require('./services/dms/2016-01-01/service-2.json');
awsim['ds'] = require('./services/ds/2015-04-16/service-2.json');
awsim['dynamodb'] = require('./services/dynamodb/2012-08-10/service-2.json');
awsim['dynamodbstreams'] = require('./services/dynamodbstreams/2012-08-10/service-2.json');
awsim['ec2'] = require('./services/ec2/2016-11-15/service-2.json');
awsim['ecr'] = require('./services/ecr/2015-09-21/service-2.json');
awsim['ecs'] = require('./services/ecs/2014-11-13/service-2.json');
awsim['efs'] = require('./services/efs/2015-02-01/service-2.json');
awsim['eks'] = require('./services/eks/2017-11-01/service-2.json');
awsim['elasticache'] = require('./services/elasticache/2015-02-02/service-2.json');
awsim['elasticbeanstalk'] = require('./services/elasticbeanstalk/2010-12-01/service-2.json');
awsim['elastictranscoder'] = require('./services/elastictranscoder/2012-09-25/service-2.json');
awsim['elb'] = require('./services/elb/2012-06-01/service-2.json');
awsim['elbv2'] = require('./services/elbv2/2015-12-01/service-2.json');
awsim['emr'] = require('./services/emr/2009-03-31/service-2.json');
awsim['es'] = require('./services/es/2015-01-01/service-2.json');
awsim['events'] = require('./services/events/2015-10-07/service-2.json');
awsim['firehose'] = require('./services/firehose/2015-08-04/service-2.json');
awsim['fms'] = require('./services/fms/2018-01-01/service-2.json');
awsim['gamelift'] = require('./services/gamelift/2015-10-01/service-2.json');
awsim['glacier'] = require('./services/glacier/2012-06-01/service-2.json');
awsim['glue'] = require('./services/glue/2017-03-31/service-2.json');
awsim['greengrass'] = require('./services/greengrass/2017-06-07/service-2.json');
awsim['guardduty'] = require('./services/guardduty/2017-11-28/service-2.json');
awsim['health'] = require('./services/health/2016-08-04/service-2.json');
awsim['iam'] = require('./services/iam/2010-05-08/service-2.json');
awsim['importexport'] = require('./services/importexport/2010-06-01/service-2.json');
awsim['inspector'] = require('./services/inspector/2016-02-16/service-2.json');
awsim['iot'] = require('./services/iot/2015-05-28/service-2.json');
awsim['iot-data'] = require('./services/iot-data/2015-05-28/service-2.json');
awsim['iot-jobs-data'] = require('./services/iot-jobs-data/2017-09-29/service-2.json');
awsim['iot1click-devices'] = require('./services/iot1click-devices/2018-05-14/service-2.json');
awsim['iot1click-projects'] = require('./services/iot1click-projects/2018-05-14/service-2.json');
awsim['iotanalytics'] = require('./services/iotanalytics/2017-11-27/service-2.json');
awsim['kinesis'] = require('./services/kinesis/2013-12-02/service-2.json');
awsim['kinesis-video-archived-media'] = require('./services/kinesis-video-archived-media/2017-09-30/service-2.json');
awsim['kinesis-video-media'] = require('./services/kinesis-video-media/2017-09-30/service-2.json');
awsim['kinesisanalytics'] = require('./services/kinesisanalytics/2015-08-14/service-2.json');
awsim['kinesisvideo'] = require('./services/kinesisvideo/2017-09-30/service-2.json');
awsim['kms'] = require('./services/kms/2014-11-01/service-2.json');
awsim['lambda'] = require('./services/lambda/2015-03-31/service-2.json');
awsim['lex-models'] = require('./services/lex-models/2017-04-19/service-2.json');
awsim['lex-runtime'] = require('./services/lex-runtime/2016-11-28/service-2.json');
awsim['lightsail'] = require('./services/lightsail/2016-11-28/service-2.json');
awsim['logs'] = require('./services/logs/2014-03-28/service-2.json');
awsim['machinelearning'] = require('./services/machinelearning/2014-12-12/service-2.json');
awsim['macie'] = require('./services/macie/2017-12-19/service-2.json');
awsim['marketplace-entitlement'] = require('./services/marketplace-entitlement/2017-01-11/service-2.json');
awsim['marketplacecommerceanalytics'] = require('./services/marketplacecommerceanalytics/2015-07-01/service-2.json');
awsim['mediaconvert'] = require('./services/mediaconvert/2017-08-29/service-2.json');
awsim['medialive'] = require('./services/medialive/2017-10-14/service-2.json');
awsim['mediapackage'] = require('./services/mediapackage/2017-10-12/service-2.json');
awsim['mediastore'] = require('./services/mediastore/2017-09-01/service-2.json');
awsim['mediastore-data'] = require('./services/mediastore-data/2017-09-01/service-2.json');
awsim['mediatailor'] = require('./services/mediatailor/2018-04-23/service-2.json');
awsim['meteringmarketplace'] = require('./services/meteringmarketplace/2016-01-14/service-2.json');
awsim['mgh'] = require('./services/mgh/2017-05-31/service-2.json');
awsim['mobile'] = require('./services/mobile/2017-07-01/service-2.json');
awsim['mq'] = require('./services/mq/2017-11-27/service-2.json');
awsim['mturk'] = require('./services/mturk/2017-01-17/service-2.json');
awsim['neptune'] = require('./services/neptune/2014-10-31/service-2.json');
awsim['opsworks'] = require('./services/opsworks/2013-02-18/service-2.json');
awsim['opsworkscm'] = require('./services/opsworkscm/2016-11-01/service-2.json');
awsim['organizations'] = require('./services/organizations/2016-11-28/service-2.json');
awsim['pi'] = require('./services/pi/2018-02-27/service-2.json');
awsim['pinpoint'] = require('./services/pinpoint/2016-12-01/service-2.json');
awsim['polly'] = require('./services/polly/2016-06-10/service-2.json');
awsim['pricing'] = require('./services/pricing/2017-10-15/service-2.json');
awsim['rds'] = require('./services/rds/2014-10-31/service-2.json');
awsim['redshift'] = require('./services/redshift/2012-12-01/service-2.json');
awsim['rekognition'] = require('./services/rekognition/2016-06-27/service-2.json');
awsim['resource-groups'] = require('./services/resource-groups/2017-11-27/service-2.json');
awsim['resourcegroupstaggingapi'] = require('./services/resourcegroupstaggingapi/2017-01-26/service-2.json');
awsim['route53'] = require('./services/route53/2013-04-01/service-2.json');
awsim['route53domains'] = require('./services/route53domains/2014-05-15/service-2.json');
awsim['s3'] = require('./services/s3/2006-03-01/service-2.json');
awsim['sagemaker'] = require('./services/sagemaker/2017-07-24/service-2.json');
awsim['sagemaker-runtime'] = require('./services/sagemaker-runtime/2017-05-13/service-2.json');
awsim['sdb'] = require('./services/sdb/2009-04-15/service-2.json');
awsim['secretsmanager'] = require('./services/secretsmanager/2017-10-17/service-2.json');
awsim['serverlessrepo'] = require('./services/serverlessrepo/2017-09-08/service-2.json');
awsim['servicecatalog'] = require('./services/servicecatalog/2015-12-10/service-2.json');
awsim['servicediscovery'] = require('./services/servicediscovery/2017-03-14/service-2.json');
awsim['ses'] = require('./services/ses/2010-12-01/service-2.json');
awsim['shield'] = require('./services/shield/2016-06-02/service-2.json');
awsim['signer'] = require('./services/signer/2017-08-25/service-2.json');
awsim['sms'] = require('./services/sms/2016-10-24/service-2.json');
awsim['snowball'] = require('./services/snowball/2016-06-30/service-2.json');
awsim['sns'] = require('./services/sns/2010-03-31/service-2.json');
awsim['sqs'] = require('./services/sqs/2012-11-05/service-2.json');
awsim['ssm'] = require('./services/ssm/2014-11-06/service-2.json');
awsim['stepfunctions'] = require('./services/stepfunctions/2016-11-23/service-2.json');
awsim['storagegateway'] = require('./services/storagegateway/2013-06-30/service-2.json');
awsim['sts'] = require('./services/sts/2011-06-15/service-2.json');
awsim['support'] = require('./services/support/2013-04-15/service-2.json');
awsim['swf'] = require('./services/swf/2012-01-25/service-2.json');
awsim['transcribe'] = require('./services/transcribe/2017-10-26/service-2.json');
awsim['translate'] = require('./services/translate/2017-07-01/service-2.json');
awsim['waf'] = require('./services/waf/2015-08-24/service-2.json');
awsim['waf-regional'] = require('./services/waf-regional/2016-11-28/service-2.json');
awsim['workdocs'] = require('./services/workdocs/2016-05-01/service-2.json');
awsim['workmail'] = require('./services/workmail/2017-10-01/service-2.json');
awsim['workspaces'] = require('./services/workspaces/2015-04-08/service-2.json');
awsim['xray'] = require('./services/xray/2016-04-12/service-2.json');
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
