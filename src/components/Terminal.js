import React, { Component } from 'react';
import Output from './Output';
import Suggester from './Suggester';
import Prompt from './Prompt';
import Documentation from './Documentation';

class Terminal extends Component {
	constructor(props) {
		super(props);
		this.Output = React.createRef();
		this.Prompt = React.createRef();
		this.Suggester = React.createRef();
		this.Documentation = React.createRef();
		this.aws = require('../aws').default;
	}

	render() {
		return (
			<div onClick={() => {this.Prompt.current.focus(false);}}>
				<Output
					ref={this.Output}
				/>
				<Prompt
					aws={this.aws}
					ref={this.Prompt}
					Output={this.Output}
					Suggester={this.Suggester}
				/>
				<Suggester
					aws={this.aws}
					ref={this.Suggester}
					Documentation={this.Documentation}
				/>
				<Documentation
					aws={this.aws}
					ref={this.Documentation}
				/>
			</div>
		);
	}

	componentDidMount()	{
		document.onclick = () => {this.Prompt.current.focus(false);};
	}
}

export default Terminal;
