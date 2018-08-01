import React from 'react';
import { connect } from 'react-redux';

import {
  dismissSystemMessage
} from 'store/modules/messages';

class SystemMessage extends React.Component {
	componentDidMount() {
		if (this.props.duration) {
			setTimeout(this.props.dismiss, this.props.duration, this.props.id);
		}
	}
	render() {
		return (
			<div className="system-message">
				<button onClick={ () => this.props.dismiss(this.props.id) }>
					{ this.props.message }
				</button>
			</div>
		)
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {
  dismissSystemMessage
};

const ConnectedSystemMessage = connect(mapStateToProps, mapDispatchToProps)()

class SystemMessages extends React.Component {

	render() {
		return (
			<div className="system-message-container">
				{
					this.props.messages.map(message =>
						<SystemMessage key={ message.id } { ...message }/>
					)
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
    messages: state.messages
})

const mapDispatchToProps = {
  dismissSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);