import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { v4 as uuid } from 'uuid'
import CurrencyLineChart from '../../../../charts/Dashboard/CurrencyRate/CurrencyLineChart'

const currencyOrder = ['USD', 'EUR', 'RUB', 'GBP', 'CHF', 'JPY', 'KZT', 'CNY']

interface CurrencyRateLineProps {
	last90Rates: any
}

const CurrencyRateLine: React.FC<CurrencyRateLineProps> = ({ last90Rates = {} }) => {
	const categories = (last90Rates['USD'] || []).map((value: any) => value['currDay'])
	const [currency, setCurrency] = useState('USD')
	const [series, setSeries] = useState((last90Rates['USD'] || []).map((value: any) => value['equival']))
	function handleChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
		setCurrency(value)
		setSeries((last90Rates[value] || []).map((value: any) => value['equival']))
	}

	return (
		<Grid container direction="column" component={Paper} sx={{ paddingTop: '10px' }}>
			<CurrencyLineChart
				data={{
					categories,
					series
				}}
				id="rate"
			/>
			<FormControl component="fieldset">
				<RadioGroup
					row
					value={currency}
					onChange={handleChange}
					aria-label="position"
					name="position"
					defaultValue="USD"
				>
					{currencyOrder.map(v => (
						<FormControlLabel
							key={uuid()}
							value={v.toLowerCase()}
							control={<Radio color="primary" />}
							label={v}
							labelPlacement="bottom"
						/>
					))}
				</RadioGroup>
			</FormControl>
		</Grid>
	)
}

export default CurrencyRateLine
