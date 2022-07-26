import { blueGrey } from '@material-ui/core/colors'
import createTheme from '@material-ui/core/styles/createTheme'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

declare module '@material-ui/core/styles/createMixins' {
  // eslint-disable-next-line no-unused-vars
    interface Mixins {
        dottedBorder: CSSProperties
        noBorder: CSSProperties
        stickyCol: CSSProperties
        stickyHead: CSSProperties
        tabBtn: CSSProperties
        grow: CSSProperties
        down: CSSProperties
        active: CSSProperties
        marginBottom10: CSSProperties
        marginTop10: CSSProperties
        paddingBottom0: CSSProperties
        muted: CSSProperties
        noWrap: CSSProperties
        italic: CSSProperties
        displayNone: CSSProperties
        pointer: CSSProperties
        logo: CSSProperties
        smallCard: CSSProperties
        smallCardContainer: CSSProperties
        oneRowTitle: CSSProperties
        blueBackground: CSSProperties
        stickyTableHead: CSSProperties
    }
  // allow configuration using `createMuiTheme`
  // eslint-disable-next-line no-unused-vars
    interface MixinsOptions {
        dottedBorder?: CSSProperties
        noBorder?: CSSProperties
        stickyCol?: CSSProperties
        stickyHead?: CSSProperties
        tabBtn?: CSSProperties
        grow?: CSSProperties
        down?: CSSProperties
        active?: CSSProperties
        marginBottom10?: CSSProperties
        marginTop10?: CSSProperties
        paddingBottom0?: CSSProperties
        muted?: CSSProperties
        noWrap?: CSSProperties
        italic?: CSSProperties
        displayNone?: CSSProperties
        pointer?: CSSProperties
        logo?: CSSProperties
        smallCard?: CSSProperties
        smallCardContainer?: CSSProperties
        oneRowTitle?: CSSProperties
        blueBackground?: CSSProperties
        stickyTableHead?: CSSProperties
    }
}

const theme = createTheme({
  typography: {
    fontWeightBold: 600,
    fontFamily: [
      'SF UI Text',
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    secondary: {
      main: blueGrey['50'],
    },
    success: {
      main: blueGrey['400'],
    },
    warning: {
      main: blueGrey['500'],
    },
    info: {
      main: blueGrey['700'],
    },
    error: {
      main: '#cd0707',
      light: blueGrey['300'],
    },
    primary: {
      main: blueGrey['600'],
    },
  },
  mixins: {
    dottedBorder: {
      border: '1px dotted #000',
    },
    noBorder: {
      border: 'none !important',
    },
    stickyCol: {
      position: 'sticky',
      left: 0,
      backgroundColor: '#7794aa',
    },
    stickyHead: {
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    tabBtn: {
      marginRight: 20,
      border: `1px solid #7794aa`,
      borderRadius: '2px !important',
      padding: '8px 12px',
      borderRightColor: `#7794aa !important`,
      fontSize: 15,
      lineHeight: 1,
      textTransform: 'none',
      fontWeight: 560,
    },
    grow: {
      color: '#009c34',
    },
    down: {
      color: '#d32f2f',
    },
    active: {
      fontWeight: 'bold',
    },
    marginBottom10: {
      marginBottom: 10,
    },
    marginTop10: {
      marginTop: 10,
    },
    paddingBottom0: {
      paddingBottom: 0,
    },
    muted: {
      cursor: 'not-allowed',
    },
    noWrap: {
      whiteSpace: 'nowrap',
    },
    italic: {
      fontStyle: 'italic',
    },
    displayNone: {
      display: 'none',
    },
    pointer: {
      cursor: 'pointer',
    },
    logo: {
      'minHeight': 100,
      'minWidth': 220,
      'transform': 'scale(1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    smallCard: {
      padding: '5px 10px',
      flexBasis: '32.8%',
      textAlign: 'center',
    },
    smallCardContainer: {
      display: 'flex',
      margin: '2px auto',
      padding: '8px 0',
      justifyContent: 'space-between',
    },
    oneRowTitle: {
      fontSize: 20,
      padding: '10px 15px',
    },
    blueBackground: {
      backgroundColor: '#7794aa',
      color: '#fff',
    },
    stickyTableHead: {
      backgroundColor: '#7794aa',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },

  },
  overrides: {
    MuiTableContainer: {
      root: {
        maxHeight: '74vh',
        paddingBottom: 10,
      },
    },
    MuiTableCell: {
      root: {
        fontSize: '14px',
        border: '1px solid rgba(224, 224, 224, 1)',
      },
    },
    MuiButtonBase: {
      root: {
        '&$disabled': {
          'cursor': 'not-allowed',
          'pointerEvents': 'auto',
        },
      },
    },
    MuiTypography: {
      caption: {
        fontSize: '13.5px',
      },
    },
    MuiTable: {
      root: {
        borderCollapse: 'unset',
      },
    },
    MuiTab: {
      wrapper: {
        fontWeight: 'bold',
      },
    },
  },
})

export default theme
