import React, { Component } from 'react';
import TerminalOutput from './terminal/Output';
import TerminalSuggester from './terminal/Suggester';
import TerminalPrompt from './terminal/Prompt';
import TerminalDocumentation from './terminal/Documentation';

class Terminal extends Component {
	constructor(props) {
		super(props);
		this.Output = React.createRef();
		this.Suggester = React.createRef();
		this.Documentation = React.createRef();
		this.awsim = require('./awsim').default;
	}
	render() {
		return (
			<div>
				<TerminalOutput
					ref={this.Output}
				/>
				<TerminalSuggester
					awsim={this.awsim}
					ref={this.Suggester}
					Documentation={this.Documentation}
				/>
				<TerminalPrompt
					awsim={this.awsim}
					Output={this.Output}
					Suggester={this.Suggester}
				/>
				<TerminalDocumentation
					awsim={this.awsim}
					ref={this.Documentation}
				/>
			</div>
		);
	}
}

export default Terminal;
