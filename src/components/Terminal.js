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
		this.aws = require('../aws').default;
	}
	render() {
		return (
			<div>
				<Output
					ref={this.Output}
				/>
				<Suggester
					aws={this.aws}
					ref={this.Suggester}
					Documentation={this.Documentation}
				/>
				<Prompt
					aws={this.aws}
					Output={this.Output}
					Suggester={this.Suggester}
				/>
				<Documentation
					aws={this.aws}
					ref={this.Documentation}
				/>
			</div>
		);
	}
}

export default Terminal;
