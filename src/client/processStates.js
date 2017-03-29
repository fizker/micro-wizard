// @flow

export function shouldShowStopButton(state:State) : bool {
	return state !== 'stopped'
}

export function shouldShowStartButton(state:State) : bool {
	return state === 'stopped' || state === 'died'
}

export function shouldShowRestartButton(state:State) : bool {
	return state === 'running'
}
