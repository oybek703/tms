import ActionsTypes from '../../actions/types'

const initialState = {
	reportDate: localStorage.getItem('reportDate') || new Date().toISOString().slice(0, 10)
}

function date(state = initialState, action: any) {
	const { payload, type } = action
	switch (type) {
		case ActionsTypes.CHANGE_DATE:
			return { reportDate: payload }
		default:
			return state
	}
}

export default date
