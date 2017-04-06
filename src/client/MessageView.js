// @flow

import React from 'react'

const borderWidth = 1

export default class MessageView extends React.Component {
	props: {
		lineCount?: number,
		messages: ClientProcessMessage[],
		style?: any,
	}

	state = {
		scrolledToBottom: true,
	}

	messageView:HTMLDivElement

	render() {
		const { messages, style = {}, lineCount, ...props } = this.props
		return <div
			{...props}
			style={{
				...style,
				padding: 5,
				margin: 2,
				fontSize: '11pt',
				border: `${borderWidth}px solid black`,
				height: lineCount ? lineCount + 'em' : null,
				whiteSpace: 'pre-wrap',
				overflow: 'auto',
			}}
			ref={(div)=>this.messageView = div}
			onScroll={()=>this.viewDidScroll()}
		>
			{messages.map((x, idx) => <div key={idx}>
				{`${x.timestamp}: ${x.message}`}
			</div>)}
		</div>
	}

	viewDidScroll() {
		if(!this.messageView) return

		const visibleBottom = this.messageView.scrollTop + this.messageView.offsetHeight
		const bufferToMakeAutoscrollSimpler = 5

		const scrolledToBottom = visibleBottom >= this.messageView.scrollHeight - bufferToMakeAutoscrollSimpler

		if(scrolledToBottom != this.state.scrolledToBottom) {
			this.setState({
				scrolledToBottom,
			})
		}
	}

	componentDidMount() {
		this.scrollLastMessageIntoView()
	}

	componentDidUpdate() {
		this.scrollLastMessageIntoView()
	}

	scrollLastMessageIntoView() {
		if(!this.state.scrolledToBottom) {
			return
		}

		const lastElement = this.messageView.children[this.messageView.children.length - 1]
		if(lastElement) {
			lastElement.scrollIntoView()
		}
	}
}
