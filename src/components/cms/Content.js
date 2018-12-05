import React from 'react';
import { connect } from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor';

import { Link } from "react-router-dom";

import MarkdownRenderer from 'react-markdown-renderer';

class CMS_BodyViewer extends React.Component {
	state = {
		error: null,
		body: ""
	}

	fetchFalcorDeps() {
		const { content_id } = this.props;
		return this.props.falcor.get(
			['content', 'byId', content_id, ["body"]]
		)
		.then(response => {
			try {
				const {
					body
				} = response.json.content.byId[content_id];
				this.setState({ error: null, body });
			}
			catch (e) {
				this.setState({ error: `Invalid content id: "${ content_id }"`, body: null });
			}
			return response;
		})
	}

	render() {
		const {
			error,
			body
		} = this.state;
		const {
			maxHeight,
			content_id,
			authed,
			showLink
		} = this.props;
		const style = {
			maxHeight: `${ maxHeight }px`,
			overflow: "auto"
		};
		return (
			!error && !body ?
				<div>Loading...</div>
			: !error ?
				<div style={ style } id={ content_id } style={ { position: "relative" } }>
					{ !(authed && showLink) ? null :
						<Link to={ `/cms/edit/${ content_id }` }
							style={ { position: "absolute", right: `${ this.props.right }px`, top: `${ this.props.top }px`, zIndex: 1000 } }>
							edit #{ content_id }
						</Link>
					}
					<MarkdownRenderer markdown={ body }
                  		options={ { html: true } }/>
				</div>
			:
				authed ? <div>{ `There was an error: ${ error }` }</div> : <span />
		)
	}
}

CMS_BodyViewer.defaultProps = {
	showLink: true,
	right: 5,
	top: 5
}

const mapStateToProps = state => ({
	authed: state.user.authed
})

export default connect(mapStateToProps, undefined)(reduxFalcor(CMS_BodyViewer));