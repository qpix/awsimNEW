import React, { Component } from 'react';
import Output from './Output';
import Suggester from './Suggester';
import Prompt from './Prompt';
import Documentation from './Documentation';

class Terminal extends Component {
	constructor(props) {
		super(props);
		this.Output = React.createRef();
		this.Suggester = React.createRef();
		this.Documentation = React.createRef();
		this.awsim = require('../awsim').default;
	}
	render() {
		return (
			<div>
				<Output
					ref={this.Output}
				/>
				<Suggester
					awsim={this.awsim}
					ref={this.Suggester}
					Documentation={this.Documentation}
				/>
				<Prompt
					awsim={this.awsim}
					Output={this.Output}
					Suggester={this.Suggester}
				/>
				<Documentation
					awsim={this.awsim}
					ref={this.Documentation}
				/>
			</div>
		);
	}
}

export default Terminal;
