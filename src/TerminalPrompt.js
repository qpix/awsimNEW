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
	updateInputValue(SyntheticEvent) {
		const value = SyntheticEvent.target.value;
		this.setState({
			InputValue: value,
			CommandHistoryPointer: -1
		});
		this.props.Suggester.current.update(CreateCommandArray(value));
	}
	keyUp(event) {
		var pointer = this.state.CommandHistoryPointer;
		if (event.keyCode === 13) {
			//promptText.style.display = 'none';
			//this.readOnly = true;
			this.setState({Locked:true});
			this.props.SuggesterFunctions.update(['']);
			this.props.OutputFunctions.echo('aws&gt; '+ prompt.value);

			var command = CreateCommandArray(this.state.InputValue);
			this.commandHistory.unshift(command);

			setTimeout(() => {
				this.props.OutputFunctions.echo(this.props.awsim._ExecuteCommand(command));
				this.setState({
					Locked: false,
					InputValue: '',
				});
			}, 2500);
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
	render() {
		return (
			<div>aws&gt; <input type="text" value={this.state.InputValue} onKeyUp={(key) => {this.keyUp(key);}} onChange={(string) => {this.updateInputValue(string);}} /></div>
		);
	}
}

export default TerminalPrompt;
