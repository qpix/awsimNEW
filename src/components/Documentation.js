import React, { Component } from 'react';

class TerminalDocumentation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			InnerHTML: {__html: '<div></div>'},
			Hidden: true
		};
	}
	update(HTML) {
		if (HTML)
			this.setState({
				InnerHTML: {__html: HTML},
				Hidden: false
			});
		else
			this.clear()
	}
	clear() {
		this.setState({
			Hidden: true
		});
	}
	render() {
		var documentationStyle = {
			borderTop: '1px solid white'
		};
		if (this.state.Hidden)
			documentationStyle.display = 'none';
		return (
			<div style={documentationStyle} dangerouslySetInnerHTML={this.state.InnerHTML}></div>
		);
	}
}

export default TerminalDocumentation;
