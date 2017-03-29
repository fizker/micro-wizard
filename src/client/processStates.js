export function shouldShowStopButton(state:State) {
	return state !== 'stopped'
}

export function shouldShowStartButton(state:State) {
	return state === 'stopped' || state === 'died'
}

export function shouldShowRestartButton(state:State) {
	return state === 'running'
}
