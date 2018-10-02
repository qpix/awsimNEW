import React, { Component } from 'react';
import { CreateCommandArray } from './CommandOperations';

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
		var inputStyle = {
			border: 'none',
			fontFamily: 'monospace',
			fontSize: '12px',
			color: 'white',
			backgroundColor: 'black',
			width: '100%',
			outline: 'none',
			padding: '0',
			margin: '0',
		}

		if (this.state.locked)
			return(<div></div>);

		return (
			<table style={{
				borderCollapse: 'collapse',
				width: '100%',
				marginBottom: '125px',
			}}>
				<tbody>
					<tr>
						<td style={{
							width: '0%'
						}}>aws&gt;&nbsp;</td>
						<td style={{
							width: '100%'
						}}><input type="text" style={inputStyle} value={this.state.InputValue} onKeyUp={(key) => {this.keyUp(key);}} onChange={(string) => {this.updateInputValue(string);}} /></td>
					</tr>
				</tbody>
			</table>
		);
	}
	updateInputValue(SyntheticEvent) {
		var input = SyntheticEvent.target;

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

		this.setState({
			InputValue: input.value,
			CommandHistoryPointer: -1
		});

		this.props.Suggester.current.update(CreateCommandArray(input.value), iX, iY);
	}
	keyUp(event) {
		var pointer = this.state.CommandHistoryPointer;
		if (event.keyCode === 13) {
			//promptText.style.display = 'none';
			//this.readOnly = true;
			this.props.Suggester.current.update(['']);
			this.props.Output.current.echo('aws> '+ this.state.InputValue);
			var command = CreateCommandArray(this.state.InputValue);

			this.setState({Locked:true}, () => {
				setTimeout(() => {
					this.props.Output.current.echo(this.props.awsim._ExecuteCommand(command));
					this.setState({
						Locked: false,
						InputValue: '',
						CommandHistory: this.state.CommandHistory.slice().unshift(command),
					});
				}, 2500);
			});
		}
		else if (event.keyCode === 38) {
			if (this.state.InputValue === '' || this.state.CommandHistoryPointer >= 0) {
				pointer += 1;
				if (pointer === this.state.CommandHistory.length)
					pointer -= 1;
				this.setState({
					InputValue: this.state.CommandHistory[pointer].join(' '),
					CommandHistoryPointer: pointer,
				});
			}
			else {
				this.setState({
					InputValue: this.props.Suggester.current.goUp(),
				});
			}
		}
		else if (event.keyCode === 40) {
			if (this.state.CommandHistoryPointer >= 0) {
				pointer -= 1;
				if (pointer === -1)
					this.setState({
						InputValue: '',
						CommandHistoryPointer: pointer,
					});
				else
					this.setState({
						InputValue: this.state.CommandHistory[pointer].join(' '),
						CommandHistoryPointer: pointer,
					});
			}
			else {
				this.setState({
					InputValue: this.props.Suggester.current.goDown(),
				});
			}
		}
	}
}

export default TerminalPrompt;
