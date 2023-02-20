import rootColors from './palette'
import { ISxStyles } from '../interfaces/styles.interface'
import palette from './palette'

const globalStyles: ISxStyles = {
	userForm: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: '20px',
		backgroundColor: '#fff',
		padding: '40px'
	},
	usetSubmitBtn: {
		margin: '20px',
		padding: '10px 20px',
		minWidth: 250
	},
	dottedBorder: {
		border: '1px dotted #000'
	},
	noBorder: {
		border: 'none !important'
	},
	stickyCol: {
		position: 'sticky',
		left: 0,
		backgroundColor: rootColors.primary
	},
	stickyHead: {
		position: 'sticky',
		top: 0,
		zIndex: 1000
	},
	tabBtn: {
		marginRight: '20px',
		border: `1px solid ${rootColors.primary}`,
		borderRadius: '5px !important',
		padding: '8px 12px',
		borderRightColor: `${rootColors.primary} !important`,
		fontSize: 15,
		lineHeight: 1,
		textTransform: 'none',
		fontWeight: 560
	},
	grow: {
		color: '#009c34'
	},
	greens: {
		color: '#00B050',
		fontSize: '12pt'
	},
	down: {
		color: '#d32f2f'
	},
	active: {
		fontWeight: 'bold'
	},
	marginBottom10: {
		marginBottom: '10px'
	},
	marginTop10: {
		marginTop: '10px'
	},
	paddingBottom0: {
		paddingBottom: 0
	},
	muted: {
		cursor: 'not-allowed'
	},
	noWrap: {
		whiteSpace: 'nowrap'
	},
	italic: {
		fontStyle: 'italic'
	},
	pointer: {
		cursor: 'pointer'
	},
	logo: {
		minHeight: 100,
		minWidth: 220,
		transform: 'scale(1)',
		'&:hover': {
			transform: 'scale(1.05)'
		}
	},
	smallCard: {
		padding: '5px 10px',
		flexBasis: '32.8%',
		textAlign: 'center'
	},
	smallCardPadding: {
		padding: '5px 10px'
	},
	smallCardGrid: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: '20px',
		justifyItems: 'stretch',
		margin: '10px auto',
		textAlign: 'center'
	},
	smallCardContainer: {
		display: 'flex',
		margin: '2px auto',
		padding: '8px 0',
		justifyContent: 'space-between'
	},
	oneRowTitle: {
		fontSize: 20,
		padding: '10px 15px'
	},
	blueBackground: {
		backgroundColor: rootColors.primary,
		color: '#fff'
	},
	stickyTableHead: {
		backgroundColor: rootColors.primary,
		color: '#fff',
		position: 'sticky',
		top: 0,
		zIndex: 1000
	},
	inlinePickerCell: {
		minWidth: 140,
		maxWidth: 150
	},
	dataGridTotalRow: {
		display: 'grid',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: palette.primary,
		fontWeight: 'bold',
		color: '#fff',
		width: 'calc(100% + 20px)',
		height: '100%',
		transform: 'translateX(-10px)',
		marginRight: '-20px'
	},
	verticalText: {
		writingMode: 'vertical-rl',
		transform: 'rotate(180deg)',
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: '1.8em'
	}
}

export default globalStyles
