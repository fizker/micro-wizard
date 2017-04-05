import React from 'react'
import ReactDOM from 'react-dom'

export default function MessageView({ messages, style = {}, lineCount, ...props }) {
	return <div
		{...props}
		style={{
			...style,
			padding: 5,
			margin: 2,
			fontSize: '11pt',
			border: '1px solid black',
			height: lineCount ? lineCount + 'em' : null,
			whiteSpace: 'pre-wrap',
			overflow: 'auto',
		}}
	>
		{messages.map((x, idx) => <div key={idx}>
			{`${x.timestamp}: ${x.message}`}
		</div>)}
	</div>
}
