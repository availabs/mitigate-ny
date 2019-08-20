import React from 'react'
import TrackVisibility from 'react-on-screen';

export default ({ ...rest }) => {
    return (
        <TrackVisibility offset={200} style={{height: '100%'}}>
        	<GraphHider { ...rest } />
        </TrackVisibility>
	)
}



class GraphHider extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show: props.isVisible ? true : false
        }
    }

    componentDidUpdate(prevProps, prevState) {
    	if(this.props.isVisible && !this.state.show) {
    		this.setState({show:true})
    	}
    }

    render () {
    	let {isVisible, children, ...rest} = this.props
        return this.state.show ?
		    <div>{children}</div> :
		    <div>...</div>
    }
}