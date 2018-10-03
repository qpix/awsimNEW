import React, { Component } from 'react';
import { CreateCommandArray } from '../tools/commandOperations';

class TerminalPrompt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			InputValue: '',
			CommandHistory: [],
			CommandHistoryPointer: 0,
			Locked: false
		}
	}

	render() {
		if (this.state.Locked)
			return(<div style={{marginBottom:'125px'}}></div>);

		return (
			<table className="prompt">
				<tbody>
					<tr>
						<td>aws&gt;&nbsp;</td>
						<td><input type="text" value={this.state.InputValue} onKeyUp={(key) => {this.keyUp(key);}} onChange={(string) => {this.updateInputValue(string);}} autoFocus /></td>
					</tr>
				</tbody>
			</table>
		);
	}

	updateInputValue(SyntheticEvent) {
		var input = SyntheticEvent.target;
		var Suggester = this.props.Suggester.current;

		this.setState({
			InputValue: input.value,
			CommandHistoryPointer: -1
		}, () => { input.scrollIntoView(); });

		// Calculating suggester position
		var iX = 0;
		var iY = 15;
		var element = input;
		while (element !== document.body) {
			iX += element.offsetLeft;
			iY += element.offsetTop;
			element = element.parentElement;
		}
		iX += 7.3 * input.selectionStart;
		iX += 'px';
		iY += 'px';

		// Updating suggester content and position
		Suggester.update(CreateCommandArray(input.value), iX, iY);
	}

	keyUp(event) {
		var Suggester = this.props.Suggester.current;
		var Output = this.props.Output.current;
		var CommandHistory = this.state.CommandHistory.slice();
		var CommandHistoryPointer = this.state.CommandHistoryPointer;
		var CommandHistoryLength = this.state.CommandHistory.length;

		if (event.keyCode === 13) {
			Suggester.update(['']);
			Output.echo('aws> '+ this.state.InputValue);
			var command = CreateCommandArray(this.state.InputValue);

			this.setState({Locked:true}, () => {
				setTimeout(() => {
					Output.echo(this.props.awsim._ExecuteCommand(command));
					CommandHistory.unshift(command);
					this.setState({
						Locked: false,
						InputValue: '',
						CommandHistory: CommandHistory,
					});
				}, 2500);
			});
		}

		else if (event.keyCode === 38) {
			if (this.state.InputValue === '' || CommandHistoryPointer >= 0) {
				CommandHistoryPointer += 1;

				if (CommandHistoryPointer === CommandHistoryLength)
					CommandHistoryPointer -= 1;

				this.setState({
					InputValue: CommandHistory[CommandHistoryPointer].join(' '),
					CommandHistoryPointer: CommandHistoryPointer,
				});
			}
			else
				this.setState({InputValue:this.props.Suggester.current.goUp()});
		}

		else if (event.keyCode === 40) {
			if (CommandHistoryPointer >= 0) {
				CommandHistoryPointer -= 1;

				if (CommandHistoryPointer === -1)
					this.setState({
						InputValue: '',
						CommandHistoryPointer: CommandHistoryPointer,
					});

				else
					this.setState({
						InputValue: CommandHistory[CommandHistoryPointer].join(' '),
						CommandHistoryPointer: CommandHistoryPointer,
					});
			}
			else
				this.setState({InputValue:this.props.Suggester.current.goDown()});
		}
	}
}

export default TerminalPrompt;
