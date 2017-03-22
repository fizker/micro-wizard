type ClientProcessID = number

type ClientProcessMessage = {
	timestamp: string,
	message: string,
	isUnread: bool,
}
type ClientProcessStateChange = {
	timestamp: string,
	state: State,
}

type ClientProcess = {
	id: ClientProcessID,
	isEnabled: bool,
	currentState: State,
	name: string,
	notifications: {
		hasUnreadMessages: bool,
		showUnreadMessages: bool,
		hasStateChanges: bool,
	},
	messages: Array<ClientProcessMessage>,
	stateChanges: Array<ClientProcessStateChange>,
}

type ClientModel = {
	processes: Array<ClientProcess>,
	secondaryWindow: {
		lines: number,
		processes: Array<ClientProcessID>,
	},
}
