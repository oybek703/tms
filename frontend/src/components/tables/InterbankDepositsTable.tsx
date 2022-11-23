import React, { Fragment, memo, useCallback, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import InterbankDepositsHead from '../helpers/interbankDeposits/InterbankDepositsHead'
import InterbankDepositsBody from '../helpers/interbankDeposits/InterbankDepositsBody'
import TableCap from '../helpers/TableCap'
import ButtonTabs from '../layout/Tabs/ButtonsTab'
import ExportButton from '../layout/ExportButton'
import { formatOneDate } from '../../utils'
import useTypedSelector from '../../hooks/useTypedSelector'

const titles = [
	{ title: 'Межбанковские депозиты', code: 'all' },
	{ title: 'Привлеченные', code: 'borrow' },
	{ title: 'Размещенные', code: 'land' }
]

const InterbankDepositsTable: React.FC<{ rows: any }> = function ({ rows = [] }) {
	const { land, borrow, fullBorrowData, fullLandData } = rows
	const { reportDate } = useTypedSelector(state => state.operDays)
	const [expanded, setExpanded] = useState<string>('all')
	const handleChange = useCallback((code: string) => setExpanded(code), [])
	return (
		<Fragment>
			<ButtonTabs handleChange={handleChange} active={expanded} titles={titles} />
			{
				<TableContainer component={Paper}>
					<ExportButton id={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`} />
					<Table
						size="small"
						tableexport-key={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`}
						id={`${expanded === 'all' ? 'interbank-deposits' : expanded}-${formatOneDate(reportDate)}`}
					>
						<InterbankDepositsHead />
						{expanded === 'all' && (
							<Fragment>
								<InterbankDepositsBody
									rows={land}
									isInterbank
									cap={
										<TableCap
											textAlign="center"
											text="Размещенные межбанковские депозиты"
											rows={2}
											isGrey
											isHead={false}
										/>
									}
								/>
								<InterbankDepositsBody
									rows={borrow}
									isInterbank
									cap={
										<TableCap
											textAlign="center"
											text="Привлеченные межбанковские депозиты"
											rows={2}
											isGrey
											isHead={false}
										/>
									}
								/>
							</Fragment>
						)}
						{expanded === 'borrow' && <InterbankDepositsBody rows={fullBorrowData} />}
						{expanded === 'land' && <InterbankDepositsBody rows={fullLandData} extraCurrency="рубль" />}
					</Table>
				</TableContainer>
			}
		</Fragment>
	)
}

export default memo(InterbankDepositsTable)
