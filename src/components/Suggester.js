import React, { Component } from 'react';

class TerminalSuggester extends Component {
	constructor(props) {
		super(props);
		this.state = {
			WindowX: '0px',
			WindowY: '0px',
			WindowTop: 0,
			WindowLength: 0,
			WindowCurrent: 0,
			WindowObjects: [],
			ToggableCommands: [],
		};
	}

	render() {
		let objects = this.buildWindowObjects();

		var tableStyle = {
				borderCollapse: 'collapse',
				position: 'absolute',
				left: this.state.WindowX,
				top: this.state.WindowY,
		}

		return (
			<table style={tableStyle} className="suggester">
				<tbody>
					{objects}
				</tbody>
			</table>
		);
	}

	buildWindowObjects() {
		var objects = [];

		for (var i = this.state.WindowTop; i < this.state.WindowTop + this.state.WindowLength; i++) {
			var rowClass = 'passive';
			if (i === this.state.WindowCurrent)
				rowClass = 'active';

			if (this.state.ToggableCommands[i].description)
				objects.push(
					<tr key={i} className={rowClass}>
						<td>&nbsp;{this.state.ToggableCommands[i].command.slice(-1)}&nbsp;</td>
						<td>&nbsp;{this.state.ToggableCommands[i].description}&nbsp;</td>
					</tr>
				);

			else
				objects.push(
					<tr key={i} className={rowClass}>
						<td>&nbsp;{this.state.ToggableCommands[i].command.slice(-1)}&nbsp;</td>
					</tr>
				);
		}
		return objects;
	}

	goUp() {
		let wCurrent = this.state.WindowCurrent - 1;
		let wTop = this.state.WindowTop;

		if (wCurrent < 0) {
			wCurrent = this.state.ToggableCommands.length - 1;
			wTop = this.state.ToggableCommands.length - this.state.WindowLength;
		}

		else if (wCurrent < wTop + 1) {
			wTop -= 1;
			if (wTop < 1)
				wTop = 1;
		}

		this.setState({
			WindowCurrent: wCurrent,
			WindowTop: wTop
		});

		return this.state.ToggableCommands[wCurrent].command.join(' ');
	}

	goDown() {
		var wCurrent = this.state.WindowCurrent;
		var wTop = this.state.WindowTop;
		const wLength = this.state.WindowLength;

		if (wCurrent + 1 === this.state.ToggableCommands.length) {
			wCurrent = 0;
			wTop = 1;
		}

		else {
			wCurrent += 1;
			if (wTop + wLength - 1 <= wCurrent) {
				wTop += 1;
				if (this.state.ToggableCommands.length <= wTop + wLength)
					wTop = this.state.ToggableCommands.length - wLength;
			}
		}

		this.setState({
			WindowCurrent: wCurrent,
			WindowTop: wTop
		});

		return this.state.ToggableCommands[wCurrent].command.join(' ');
	}

	update(command, wX = this.state.WindowLeft, wY = this.state.WindowTop) {
		var aws = this.props.aws;
		var Documentation = this.props.Documentation.current;
		var toggableValues = [{command:command}];

		// The input is empty
		if (command.length === 0 || (command.length === 1 && command[0] === ''))
		{
			Documentation.clear();
		}

		// User is entering a command
		else if (command.length === 1)
		{
			let availableCommands = aws._ListCommands();
			for (let i = 0; i < availableCommands.length; i++)
				if (availableCommands[i].search(command[0]) === 0)
					toggableValues.push({command:[availableCommands[i]]});
		}

		// User is entering a subcommand
		else if (command.length === 2)
		{
			let availableOperations = aws._ListOperations(command[0]);
			for (let i = 0; i < availableOperations.length; i++)
				if (availableOperations[i].search(command[1]) === 0)
					toggableValues.push({command:[command[0],availableOperations[i]]});
			Documentation.update(aws._GetCommandDocumentation(command[0]));
		}

		else
		{
			var currentOption = false;
			for (let i = 2; i < command.length; i++) {
				if (command[i].search('-') === 0 || i === 2) {
					// User is entering an option
					if (i === command.length - 1) {
						var availableOperationOptions = aws._ListOperationOptions(command[0], command[1]);

						for (let x = 0; x < availableOperationOptions.length; x++)
							if (availableOperationOptions[x].search(command[i]) === 0) {
								let toggable = command.slice(0);
								toggable.pop();
								toggable.push(availableOperationOptions[x]);
								toggableValues.push({
									command: toggable,
									description: aws._GetOperationOptionDescription(command[0], command[1], availableOperationOptions[x])
								});
							}

						Documentation.update(aws._GetOperationDocumentation(command[0], command[1]));
					}
					else {
						currentOption = command[i];
					}
				}
				else {
					// User is entering an option value
					if (i === command.length - 1 && currentOption) {
						var availableOperationOptionValues = aws._ListOperationOptionValues(command[0], command[1], currentOption);

						for (var y = 0; y < availableOperationOptionValues.length; y++)
							if (availableOperationOptionValues[y].search(command[i]) === 0) {
								let toggable = command.slice(0);
								toggable.pop();
								toggable.push(availableOperationOptionValues[y]);
								toggableValues.push({command:toggable});
							}

						Documentation.update(aws._GetOperationOptionDocumentation(command[0], command[1], currentOption));
					}
				}
			}
		}

		this.setState({
			ToggableCommands: toggableValues,
			WindowCurrent: 0,
			WindowX: wX,
			WindowY: wY,
			WindowTop: 1,
			WindowLength: (toggableValues.length >= 8) ? 7 : toggableValues.length - 1,
		});
	}
}

export default TerminalSuggester;
