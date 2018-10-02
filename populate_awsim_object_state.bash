#!/bin/bash

function CommandToOperation {
	OPERATION=$1
	for X in {a..z}
	do
		OPERATION=$(echo $OPERATION | sed "s/-$X/$(echo $X | tr '[:lower:]' '[:upper:]')/g")
		OPERATION=$(echo $OPERATION | sed "s/^$X/$(echo $X | tr '[:lower:]' '[:upper:]')/g")
	done
	echo $OPERATION
}

function addC {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state'] = JSON.parse(atob('$(aws $COMMAND $SUBCOMMAND | base64)'));" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_options'] = {};" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_execute'] = function(CommandObject) { return JSON.stringify(awsim['$COMMAND']['operations']['$OPERATION']['_state'], null, 1); };" >> awsim.js
}

function PREP {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)
	OPTION=$3

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_options'] = {};" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state'] = {};" >> awsim.js
	sed "s/\$COMMAND/$COMMAND/g" ../skeletons/operation_with_options_function.js | sed "s/\$OPERATION/$OPERATION/g" | sed "s/\$OPTION/$OPTION/g" >> awsim.js
}

function addO {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)
	OPTION=$3
	OPTION_VALUE=$4

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state']['$OPTION $OPTION_VALUE'] = JSON.parse(atob('$(aws $COMMAND $SUBCOMMAND $OPTION $OPTION_VALUE | base64)'));" >> awsim.js
}

#!#!#! EC2
addC ec2 describe-instances

#!#!#! DYNAMODB
addC dynamodb list-tables

PREP dynamodb describe-table --table-name
addO dynamodb describe-table --table-name MyDB
addO dynamodb describe-table --table-name MyTable
