import * as React from 'react'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'

interface PageTitleProps {
	title?: string
	additionalContent?: JSX.Element
}

const PageTitle: React.FC<PageTitleProps> = ({ title, additionalContent }) => {
	return (
		<>
			<Card
				variant="outlined"
				sx={{
					marginBottom: '20px',
					backgroundColor: '#eee',
					borderRadius: '5px'
				}}
			>
				<Grid
					sx={{ padding: '10px', display: 'flex', justifyContent: 'flex-start' }}
					component={Grid}
					container
					alignItems="center"
				>
					<Typography
						sx={{
							textTransform: 'uppercase',
							backgroundColor: 'rgb(248 63 55)',
							padding: '5px 10px',
							borderRadius: '5px',
							color: 'white',
							marginRight: '10px'
						}}
						variant="body1"
					>
						<b>{title}</b>
					</Typography>
					{additionalContent}
				</Grid>
			</Card>
		</>
	)
}

export default PageTitle
