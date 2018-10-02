import React, { Component } from 'react';

class TerminalOutput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: 'Copyright (C) 2019 Christian Åberg |\n------------------------------------'
		};
	}
	render() {
		var preStyle = {
			margin: '0',
			padding: '0',
		};
		return (
			<pre style={preStyle}>{this.state.content}</pre>
		);
	}

	echo(string) {
		this.setState({
			output: this.state.output += '<br>' + string
		});
	}
}

export default TerminalOutput;
