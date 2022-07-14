import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import {v4 as uuid} from 'uuid'
import CurrencyLineChart from '../../../charts/Dashboard/CurrencyRate/CurrencyLineChart'

const currencyOrder = ['USD', 'EUR', 'RUB', 'GBP', 'CHF', 'JPY', 'KZT', 'CNY']

const CurrencyRateLine = ({last90Rates = {}}) => {
    const categories = (last90Rates['USD'] || []).map(value => value['CURR_DAY'])
    const [currency, setCurrency] = useState('USD')
    const [series, setSeries] = useState((last90Rates['USD'] || []).map(value => value['EQUIVAL']))
    function handleChange({target: {value}}) {
        setCurrency(value)
        setSeries((last90Rates[value] || []).map(value => value['EQUIVAL']))
    }
    return (
        <>
            <Grid container direction='column' component={Paper} style={{paddingTop: 10}}>
                <CurrencyLineChart data={{
                    categories,
                    series
                }} id='rate'/>
                <br/>
                <FormControl component="fieldset">
                    <RadioGroup row value={currency}
                    onChange={handleChange}
                                aria-label="position" name="position" defaultValue="USD">
                        {currencyOrder.map(v => <FormControlLabel
                            key={uuid()}
                            value={v}
                            control={<Radio color="primary" />}
                            label={v}
                            labelPlacement="bottom"
                        />)}
                    </RadioGroup>
                </FormControl>
            </Grid>
        </>
    )
}

export default CurrencyRateLine