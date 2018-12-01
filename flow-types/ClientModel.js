type ClientProcessName = string

type ClientProcessMessage = {
	timestamp: string,
	message: string,
	isUnread: bool,
}
type ClientProcessStateChange = {
	timestamp: string,
	state: State,
}

opaque type ClientProcessID = string

type ClientProcess = {
	//id: ClientProcessID,
	isEnabled: bool,
	currentState: State,
	name: ClientProcessName,
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
		processes: Array<ClientProcessName>,
	},
}
