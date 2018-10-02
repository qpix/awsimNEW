awsim['$COMMAND']['operations']['$OPERATION']['_options']['$OPTION'] = () => {
	var result = [];

	for (var key in awsim['$COMMAND']['operations']['$OPERATION']['_state'])
		result.push(key.split(' ')[1]);

	return result;
};
awsim['$COMMAND']['operations']['$OPERATION']['_execute'] = (command) => {
	var optionName = '$OPTION'.replace('--','');

	if (command.options[optionName] === undefined || command.options[optionName][0] === undefined || command.options[optionName].length > 1)
		return 'aws: error: argument $OPTION: expected one argument';

	var optionValue = command['options'][optionName][0];
	var resource = awsim['$COMMAND']['operations']['$OPERATION']['_state']['$OPTION ' + optionValue];

	if (resource === undefined)
		return 'An error occurred (ResourceNotFoundException) when calling the $OPERATION operation: Requested resource not found: ' + optionValue + ' not found';

	return JSON.stringify(resource, null, 1);
}
