import React, { Component } from 'react';
import TerminalOutput from './TerminalOutput';
import TerminalSuggester from './TerminalSuggester';
import TerminalPrompt from './TerminalPrompt';
import TerminalDocumentation from './TerminalDocumentation';

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
