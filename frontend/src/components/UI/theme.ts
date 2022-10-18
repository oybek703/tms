import blueGrey from '@mui/material/colors/blueGrey'
import { createTheme } from '@mui/material/styles'
import '@mui/styles'

const theme = createTheme({
	typography: {
		fontWeightBold: 600,
		fontFamily:
			[
				'SF UI Text',
				'Poppins',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Helvetica Neue',
				'Arial',
				'sans-serif'
			].join(',') + '!important'
	},
	palette: {
		secondary: {
			main: blueGrey['50']
		},
		success: {
			main: blueGrey['400']
		},
		warning: {
			main: blueGrey['500']
		},
		info: {
			main: blueGrey['700']
		},
		error: {
			main: '#cd0707',
			light: blueGrey['300']
		},
		primary: {
			main: blueGrey['600']
		}
	},
	components: {
		MuiTableContainer: {
			styleOverrides: {
				root: {
					maxHeight: '78vh',
					paddingBottom: 10,
					maxWidth: '98vw'
				}
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					fontSize: '14px',
					border: '1px solid rgba(224, 224, 224, 1)'
				}
			}
		},
		MuiButtonBase: {
			styleOverrides: {
				root: {
					'&$disabled': {
						cursor: 'not-allowed',
						pointerEvents: 'auto'
					}
				}
			}
		},
		MuiTypography: {
			styleOverrides: {
				caption: {
					fontSize: '13.5px'
				}
			}
		},
		MuiTable: {
			styleOverrides: {
				root: {
					borderCollapse: 'unset'
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				textColorPrimary: {
					fontWeight: 'bold',
					color: '#ddd',
					'&.Mui-selected': {
						color: '#fff'
					}
				}
			}
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					backgroundColor: '#fff'
				}
			}
		}
	}
})

export default theme
