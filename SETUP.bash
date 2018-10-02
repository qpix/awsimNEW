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

function C {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state'] = JSON.parse(atob('$(aws $COMMAND $SUBCOMMAND | base64)'));" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_options'] = {};" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_execute'] = function(CommandObject) { return JSON.stringify(awsim['$COMMAND']['operations']['$OPERATION']['_state'], null, 1); };" >> awsim.js
}

function prepO {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)
	OPTION=$3

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_options'] = {};" >> awsim.js
	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state'] = {};" >> awsim.js
	sed "s/\$COMMAND/$COMMAND/g" ../skeletons/operation_with_options_function.js | sed "s/\$OPERATION/$OPERATION/g" | sed "s/\$OPTION/$OPTION/g" >> awsim.js
}

function O {
	COMMAND=$1
	SUBCOMMAND=$2
	OPERATION=$(CommandToOperation $SUBCOMMAND)
	OPTION=$3
	OPTION_VALUE=$4

	if ! fgrep -q "awsim['$COMMAND']['operations']['$OPERATION']['_options']" awsim.js; then
		prepO $1 $2 $3
	fi

	echo "awsim['$COMMAND']['operations']['$OPERATION']['_state']['$OPTION $OPTION_VALUE'] = JSON.parse(atob('$(aws $COMMAND $SUBCOMMAND $OPTION $OPTION_VALUE | base64)'));" >> awsim.js
}

cd src
for SERVICE_FILE in data/*/*/service-2.json; do
        SERVICE_NAME=$(echo $SERVICE_FILE | cut -f2 -d/)
        echo "awsim['$SERVICE_NAME'] = require('./$SERVICE_FILE');" >> tmp.txt
done
cp ../skeletons/awsim.js awsim.js
sort --reverse tmp.txt | sort -u -t '/' -k 3,3 >> awsim.js
rm -f tmp.txt

source ../CONFIG.bash
