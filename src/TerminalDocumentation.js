import React, { Component } from 'react';

class TerminalDocumentation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: 'docs'
		};
	}
	update(content) {
		this.setState({
			content: content
		});
	}
	clear() {
		this.setState({
			content: ''
		});
	}
	render() {
		return (
			<div>
				{this.state.content}
			</div>
		);
	}
}

export default TerminalDocumentation;
