import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { checkCacheOrFetch } from '../../../utils/axiosUtils'
import { APIRoutes } from '../../../interfaces/apiRoutes.interface'
import { IFilialEffData, IFililiaEffRow } from '../../../interfaces/filial-eff.interfaces'

const initialState: { loading: boolean; filialEffectiveness: IFilialEffData; error: undefined } = {
	loading: false,
	filialEffectiveness: {
		roeTotal: 0,
		roaTotal: 0,
		allData: []
	},
	error: undefined
}

export const fetchFilialEffectiveness = checkCacheOrFetch(APIRoutes.filialEffectiveness)

const filialEffectivenessSlice = createSlice({
	name: APIRoutes.filialEffectiveness,
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(fetchFilialEffectiveness.pending, state => {
			state.loading = true
			state.error = undefined
		})
		builder.addCase(fetchFilialEffectiveness.fulfilled, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.filialEffectiveness = action.payload
		})
		builder.addCase(fetchFilialEffectiveness.rejected, (state, action: PayloadAction<any>) => {
			state.loading = false
			state.error = action.payload
		})
	}
})

export const filialEffectivenessActions = filialEffectivenessSlice.actions
export const filialEffectivenessReducer = filialEffectivenessSlice.reducer
