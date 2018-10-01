function CreateCommandArray (command) {
        while (command.search('  ') !== -1) command = command.replace('  ', ' ');
        return command.split(' ');
}

function CreateCommandObject (command) {
        var CommandObject = {
                commands : [],
                options : {}
        }
        var optionStartIndex = false;

        for (var i = 0; i < command.length; i++) {
                if (command[i].search('--') === 0) {
                        optionStartIndex = i;
                        break;
                }
                CommandObject.commands.push(command[i]);
        }

        if (optionStartIndex) {
                var currentOption;
                for (var j = optionStartIndex; j < command.length; j++) {
                        if (command[j].search('--') === 0) {
                                currentOption = command[j].substring(2);
                                CommandObject.options[currentOption] = [];
                        }
                        else {
													if (command[j] !== '')
														CommandObject.options[currentOption].push(command[j]);
                        }
                }
        }
        return CommandObject;
}

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

module.exports.CreateCommandArray = CreateCommandArray;
module.exports.CreateCommandObject = CreateCommandObject;
module.exports.OperationToCommand = OperationToCommand;
module.exports.CommandToOperation = CommandToOperation;
