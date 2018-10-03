import { CreateCommandObject } from './tools/commandOperations';

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
