import { StyleProvider, Root } from "native-base";
import React, { Component } from "react";

import getTheme from "../../../native-base-theme/components";
import variables from "../../../native-base-theme/variables/gostream";

export default class StyleWrapper extends Component {
	render() {
		return (
			<StyleProvider style={getTheme(variables)}>
				{this.props.children}
			</StyleProvider>
		);
	}
}