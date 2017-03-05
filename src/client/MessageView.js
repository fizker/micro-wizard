import React from 'react'
import ReactDOM from 'react-dom'

export default function MessageView({ messages, style = {}, lineCount, ...props }) {
	let displayedMessages = messages.map(x => `${x.timestamp}: ${x.message}`)
	if(lineCount) {
		displayedMessages = displayedMessages.slice(-lineCount)
	}

	return <textarea
		{...props}
		readOnly
		rows={lineCount}
		value={displayedMessages.join('\n')}
		style={{ ...style, resize: 'none' }}
	/>
}
