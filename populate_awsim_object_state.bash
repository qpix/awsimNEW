#!/bin/bash

function add_sub_command {
	CLI_SUB_COMMAND=$2
	for X in {A..Z}
	do
		CLI_SUB_COMMAND=$(echo $CLI_SUB_COMMAND | sed "s/$X/-$(echo $X | tr '[:upper:]' '[:lower:]')/g")
	done
	CLI_SUB_COMMAND=$(echo $CLI_SUB_COMMAND | sed 's/^-//')

	echo Adding subcommand: aws $1 $CLI_SUB_COMMAND
	echo "awsim['$1']['operations']['$2']['_state'] = JSON.parse(atob('$(aws $1 $CLI_SUB_COMMAND | base64)'));" >> awsim.js
	echo "awsim['$1']['operations']['$2']['_options'] = {};" >> awsim.js
	echo "awsim['$1']['operations']['$2']['_execute'] = function(CommandObject) { return JSON.stringify(awsim['$1']['operations']['$2']['_state'], null, 1); };" >> awsim.js
}

function prepare_sub_command_with_required_option {
	echo 'Preparing subcommand with required option:' $1 $2
	echo "awsim['$1']['operations']['$2']['_options'] = {};" >> awsim.js
	echo "awsim['$1']['operations']['$2']['_state'] = {};" >> awsim.js
}

function add_sub_command_with_required_option {
	CLI_SUB_COMMAND=$2
	for X in {A..Z}
	do
		CLI_SUB_COMMAND=$(echo $CLI_SUB_COMMAND | sed "s/$X/-$(echo $X | tr '[:upper:]' '[:lower:]')/g")
	done
	CLI_SUB_COMMAND=$(echo $CLI_SUB_COMMAND | sed 's/^-//')

	echo Adding subcommand with required option: aws $1 $CLI_SUB_COMMAND $3 $4
	echo "awsim['$1']['operations']['$2']['_state']['$3 $4'] = JSON.parse(atob('$(aws $1 $CLI_SUB_COMMAND $3 $4 | base64)'));" >> awsim.js
	echo "\
awsim['$1']['operations']['$2']['_options']['$3'] = () => {\
        var result = [];\
        for (var key in awsim['$1']['operations']['$2']['_state'])\
                result.push(key.split(' ')[1]);\
        return result;\
};\
awsim['$1']['operations']['$2']['_execute'] = (command) => {\
	var optionName = '$3'.replace('--','');\
        if (command.options[optionName] === undefined || command.options[optionName][0] === undefined || command.options[optionName].length > 1)\
                return 'aws: error: argument $3: expected one argument';\
	var optionValue = command['options'][optionName][0];\
        var resource = awsim['$1']['operations']['$2']['_state']['$3 ' + optionValue];\
        if (resource === undefined)\
                return 'An error occurred (ResourceNotFoundException) when calling the $2 operation: Requested resource not found: ' + optionValue + ' not found';\
        return '<pre>' + JSON.stringify(resource, null, 1) + '</pre>';\
};" >> awsim.js
}

#!#!#! EC2
add_sub_command					ec2 DescribeInstances

#!#!#! DYNAMODB
add_sub_command dynamodb ListTables

prepare_sub_command_with_required_option dynamodb DescribeTable
add_sub_command_with_required_option		dynamodb DescribeTable --table-name MyDB
add_sub_command_with_required_option		dynamodb DescribeTable --table-name MyTable
