import React, {Fragment, memo, useCallback, useState} from 'react'
import TopDepositCard from "../UI/Layout/TopDeposits/TopDepositCard"
import {v4 as uuid} from 'uuid'
import {Grid} from "@material-ui/core"
import TopDepositsTab from "../UI/Layout/Tabs/TopDepositsTab"
import Card from "@material-ui/core/Card"

function matchTitle(code) {
    switch (code) {
        case '20200':
            return 'ДЕПОЗИТЫ ДО ВОСТРЕБОВАНИЯ'
        case '20600':
            return 'СРОЧНЫЕ ДЕПОЗИТЫ'
        case '20400':
            return 'СБЕРЕГАТЕЛЬНЫЕ ДЕПОЗИТЫ'
        case '22602':
            return 'ДЕПОЗИТЫ КЛИЕНТОВ ПО АККРЕДИТИВАМ'
        case '22613':
            return 'ЗАРЕЗЕРВИРОВАННЫЕ СРЕДСТВА КЛИЕНТОВ ДЛЯ КОНВЕРТАЦИИ'
        default:
            return 'СРЕДСТВА КЛИЕНТОВ, СКОНВЕРТИРОВАННЫЕ'
    }
}

function matchColor(cardIndex, code) {
    switch (cardIndex) {
        case 0:
            return code === '22614' ? '#2e75b6' : '#ff0000'
        case 1:
            return '#333f50'
        default:
            return '#00b050'
    }
}

function matchCurrency(cardIndex, code) {
    switch (cardIndex) {
        case 0:
            return code === '22614' ? 'Рубль (643)' : 'Нац. вал. (000)'
        case 1:
            return 'Долл. США (840)'
        default:
            return 'Евро (978 )'
    }
}

function matchActiveTabCode(activeTabIndex) {
    switch (activeTabIndex) {
        case 2:
            return '20600'
        case 3:
            return '20400'
        case 4:
            return '22602'
        case 5:
            return '22613'
        case 6:
            return '22614'
        default:
            return '20200'
    }
}

function TopDepositsTable({rows= {}}) {
    const [expanded, setExpanded] = useState('20200')
    const [activeTabIndex, setActiveTabIndex] = useState(1)
    const accountCodes = []
    const memoizedMatchTitle = useCallback(matchTitle, [])
    const memoizedMatchColor = useCallback(matchColor, [])
    const memoizedMatchCurrency = useCallback(matchCurrency, [])

    const handleTabChange = useCallback((activeTabIndex) => {
        setActiveTabIndex(activeTabIndex)
        setExpanded(matchActiveTabCode(activeTabIndex))
    }, [])

    for (const rowsKey in rows) {
        accountCodes.push({code: rowsKey, title: memoizedMatchTitle(rowsKey)})
    }
    return (
        <Fragment>
            <TopDepositsTab handleChange={handleTabChange} active={activeTabIndex}/>
            {accountCodes.map(({code}) => <Fragment key={uuid()}>
                    <Card>
                        {expanded === code && <Grid container spacing={2} justify='center'>
                            {rows[expanded].map((card, cardIndex) => (
                                <Grid key={uuid()} item xs={4}>
                                    <TopDepositCard
                                        title={memoizedMatchTitle(code)}
                                        color={memoizedMatchColor(cardIndex, code)}
                                        currency={memoizedMatchCurrency(cardIndex, code)}
                                        data={card}/>
                                </Grid>
                            ))}
                        </Grid>}
                    </Card>
                </Fragment>)}
        </Fragment>
    )
}

export default memo(TopDepositsTable)
