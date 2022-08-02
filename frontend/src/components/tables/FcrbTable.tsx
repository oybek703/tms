import React, { Fragment, memo } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import TableCap from '../UI/helpers/TableCap'
import { makeStyles, TableRow, Typography } from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { v4 as uuid } from 'uuid'
import { formatNumber } from '../../utils'
import Grid from '@material-ui/core/Grid'
import LongArrowDown from '../../images/long-arrow-down.png'

const useStyles = makeStyles((theme) => ({
  noWrap: theme.mixins.noWrap,
  noBorder: theme.mixins.noBorder,
  smallCardContainer: theme.mixins.smallCardContainer,
  smallCard: theme.mixins.smallCard,
  borderRadius: {
    border: '1.5px solid rgb(65, 113, 156)',
    borderRadius: '10px',
    backgroundColor: 'rgb(222, 235, 247)'
  },
  fullWidthCard: {
    ...theme.mixins.smallCard,
    width: '100%'
  },
  redBoldText: {
    color: 'rgb(255, 0, 0)',
    fontWeight: 600
  },
  moreRedText: {
    color: 'rgb(192, 0, 0)',
    fontSize: '17px'
  },
  lightRed: {
    color: 'rgb(255, 0, 0)'
  },
  resourceBase: {
    border: '3px solid rgb(255, 0, 0)',
    borderRadius: '10px',
    color: 'rgb(192, 0, 0)',
    padding: '20px 10px',
    maxWidth: '99%',
    margin: '0 auto',
    fontWeight: 600,
    ...theme.mixins.noWrap
  },
  balanceActive: {
    padding: '10px 10px',
    margin: '0 auto'
  },
  fundingAvg: {
    padding: '10px'
  },
  titleText: {
    fontSize: '20px'
  },
  titleNumber: {
    fontSize: '26px',
    fontWeight: 600
  },
  blackText: {
    fontSize: '16px'
  }
}))

function NoBorderCell(props: any) {
  const classes = useStyles()
  const { children, nowrap = false, redbold = false, titletext = false, morered = false, titlenumber = false, blacktext = false } = props
  return <TableCell className={`
        ${classes.noBorder} 
        ${nowrap ? classes.noWrap : ''}
        ${redbold ? classes.redBoldText : ''}
        ${titletext ? classes.titleText : ''}
        ${titlenumber ? classes.titleNumber : ''}
        ${morered ? classes.moreRedText : ''}
        ${blacktext ? classes.blackText : ''}
    `} align='center' {...props}>{children}</TableCell>
}

function RedLightText(props: any) {
  const classes = useStyles()
  const { children } = props
  return <b className={classes.lightRed} {...props}>{children}</b>
}

interface FcrbTableProps {
    rows: any
}

const FcrbTable: React.FC<FcrbTableProps> = ({ rows = {} }) => {
  const classes = useStyles()
  const { mfiData = {}, treasuryData = {}, retailData = {}, centralizedResourceBaseData = {}, portfolioData = {} } = rows
  return (
    <Paper>
      <Table size='small' stickyHeader>
        <TableCap rows={20} text={'млрд.сум'}/>
      </Table>
      {/* МФИ, КАЗНАЧЕЙСТВО(деп. юр. лиц меж.банк), РОЗНИЦА(депозиты физ.лиц) */}
      <Grid container className={classes.smallCardContainer}>
        <Grid className={classes.smallCard} item xs={4}>
          <Table className={classes.borderRadius} size='small'>
            <TableHead>
              <TableRow>
                <NoBorderCell titletext='true' colSpan={6} align='center'><b>МФИ</b></NoBorderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <NoBorderCell colSpan={6}
                  redbold='true'
                  titlenumber='true'
                  align='center'><b>{formatNumber(
                      // mfiData['mfiTotal']
                      26238.5
                  )}</b></NoBorderCell>
              </TableRow>
              <TableRow>
                {['USD', 'EUR', 'UZS'].map((t, i) => <Fragment key={uuid()}>
                  <NoBorderCell colSpan={2} morered='true'
                    align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}>
                    <b>{t} &nbsp; <RedLightText>
                      {formatNumber(
                          ((mfiData['mfiPercents'] || [])
                              .find((percent: any) => percent['CURRENCY_NAME'] === t) || {})['PERCENT']
                      )}%
                    </RedLightText></b>
                  </NoBorderCell>
                </Fragment>)}
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid className={classes.smallCard} item xs={4}>
          <Table className={classes.borderRadius} size='small'>
            <TableHead>
              <TableRow>
                <NoBorderCell titletext='true' colSpan={6} align='center'><b>КАЗНАЧЕЙСТВО (деп. юр. лиц меж.банк)</b></NoBorderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <NoBorderCell colSpan={6} redbold='true' titlenumber='true'>
                  <b>{formatNumber(
                      // treasuryData['treasuryTotal']
                      13426.3
                  )}</b>
                </NoBorderCell>
              </TableRow>
              <TableRow>
                {['USD', 'EUR', 'UZS'].map((t, i) => <Fragment key={uuid()}>
                  <NoBorderCell colSpan={2} morered='true'
                    align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}>
                    <b>{t} &nbsp; <RedLightText>
                      {formatNumber(
                          ((treasuryData['treasuryPercents'] || [])
                              .find((percent: any) => percent['CURRENCY_NAME'] === t) || {})['PERCENT']
                      )}%
                    </RedLightText></b>
                  </NoBorderCell>
                </Fragment>)}
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid className={classes.smallCard} item xs={4}>
          <Table className={classes.borderRadius} size='small'>
            <TableHead>
              <TableRow>
                <NoBorderCell titletext='true' colSpan={6} align='center'><b>РОЗНИЦА (депозиты физ.лиц)</b></NoBorderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <NoBorderCell colSpan={6}
                  redbold='true'
                  titlenumber='true'
                  align='center'><b>{formatNumber(
                      // retailData['retailTotal']
                      2488.8
                  )}</b></NoBorderCell>
              </TableRow>
              <TableRow>
                {['USD', 'EUR', 'UZS'].map((t, i) => <Fragment key={uuid()}>
                  <NoBorderCell colSpan={2} morered='true'
                    align={t === 'USD' ? 'right' : t === 'UZS' ? 'left' : 'center'}>
                    <b>{t} &nbsp; <RedLightText>
                      {formatNumber(
                          ((retailData['retailPercents'] || []).find((percent: any) => percent['CURRENCY_NAME'] === t) || {})['PERCENT']
                      )}%
                    </RedLightText></b>
                  </NoBorderCell>
                </Fragment>)}
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Grid container className={classes.smallCardContainer}>
        {Array(3)
            .fill('')
            .map((_) => <Grid key={uuid()} className={classes.smallCard} item xs={4}><ArrowDownwardIcon/></Grid>)
        }
      </Grid>
      {/* ЦЕНТРАЛИЗОВАННАЯ РЕСУРСНАЯ БАЗА */}
      <Grid container justifyContent='center' className={classes.resourceBase}>
        <Grid item className={classes.smallCard}><Typography gutterBottom variant='h5'>
          <b>ЦЕНТРАЛИЗОВАННАЯ РЕСУРСНАЯ БАЗА</b></Typography></Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Table className={classes.borderRadius} size='small'>
              <TableHead>
                <TableRow>
                  <NoBorderCell titlenumber='true' colSpan={3}
                    align='right'><b>КАПИТАЛ</b></NoBorderCell>
                  <NoBorderCell redbold='true' titlenumber='true' colSpan={2}
                    align='left'><b>{formatNumber(
                        // centralizedResourceBaseData['capital']
                        6476.9
                    )}</b></NoBorderCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
          <Grid item xs={8}>
            <Table className={classes.borderRadius} size='small'>
              <TableHead>
                <TableRow>
                  <NoBorderCell titlenumber='true' colSpan={4}
                    align='right'><b>ОБЯЗАТЕЛЬСТВА</b></NoBorderCell>
                  <NoBorderCell titlenumber='true' redbold='true' colSpan={2}
                    align='left'><b>{formatNumber(
                        // centralizedResourceBaseData['obligations']
                        42153.6
                    )}</b></NoBorderCell>
                </TableRow>
              </TableHead>
            </Table>
          </Grid>
        </Grid>
      </Grid>
      {/* другие активы, инвестиции, цен. бумаги и меж. банк., кредитования + аккредитив, розничное кредитования */}
      <br/>
      <TableContainer>
        <Table size='small'>
          <TableBody>
            {/* другие активы, инвестиции, цен. бумаги и меж. банк., кредитования + аккредитив, розничное кредитования */}
            <TableRow>
              <NoBorderCell colSpan={3} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell nowrap='true' blacktext='true' align='center'><b>другие
                                                активы</b></NoBorderCell>
                      <NoBorderCell redbold='true' nowrap='true' morered='true'
                        align='left'><RedLightText>{formatNumber(
                            // portfolioData['otherActives'])
                            8793.7
                        )}</RedLightText></NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
              <NoBorderCell rowSpan={3}/>
              <NoBorderCell colSpan={3} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell colSpan={2} align='center' blacktext='true' ><b>инвестиции</b></NoBorderCell>
                      <NoBorderCell redbold='true' morered='true' colSpan={3}
                        align='left'>
                        <RedLightText>{formatNumber(
                            // portfolioData['investments']
                            745.7
                        )}</RedLightText>
                      </NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
              <NoBorderCell rowSpan={2}/>
              <NoBorderCell colSpan={3} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell nowrap='true' blacktext='true' colSpan={3} align='center'><b>цен.бум. и меж. банк.</b></NoBorderCell>
                      <NoBorderCell redbold='true' morered='true' colSpan={3} nowrap='true'
                        align='left'><RedLightText>{formatNumber(
                            // portfolioData['billsAndInterbankDeposits']
                            3449.2
                        )}</RedLightText></NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
              <NoBorderCell colSpan={4} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell nowrap='true' colSpan={3} align='center' blacktext='true'>
                        <b>кредитования + аккредитив</b>
                      </NoBorderCell>
                      <NoBorderCell redbold='true' morered='true' nowrap='true' colSpan={3}
                        align='left'><RedLightText>{formatNumber(
                            // portfolioData['creditingAndAccredetiv']
                            30843.3
                        )}</RedLightText></NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
              <NoBorderCell colSpan={2} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell nowrap='true' colSpan={3} align='center' blacktext='true'><b>розничное
                                                кредитования</b></NoBorderCell>
                      <NoBorderCell redbold='true' morered='true' nowrap='true' colSpan={3}
                        align='left'><RedLightText>{formatNumber(
                            // portfolioData['retailLending']
                            4798.6
                        )}</RedLightText></NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
            </TableRow>
            {/* ARROWS PART */}
            <TableRow>
              <NoBorderCell align='center' colSpan={3} rowSpan={3}>
                <img style={{ paddingTop: 40 }} src={LongArrowDown} alt="pointer arrow"/>
              </NoBorderCell>
              <NoBorderCell colSpan={3} align='center'><ArrowDownwardIcon/></NoBorderCell>
              <NoBorderCell colSpan={3} align='center'><ArrowDownwardIcon/></NoBorderCell>
              <NoBorderCell align='center' colSpan={4} rowSpan={3}>
                <img style={{ paddingTop: 40 }} src={LongArrowDown} alt="pointer arrow"/>
              </NoBorderCell>
              <NoBorderCell align='center' colSpan={3} rowSpan={3}>
                <img style={{ paddingTop: 40 }} src={LongArrowDown} alt="pointer arrow"/>
              </NoBorderCell>
            </TableRow>
            {/* КАЗНАЧЕЙСКИЙ ПОРТФЕЛЬ */}
            <TableRow>
              <NoBorderCell colSpan={7} align='center'>
                <Table className={classes.borderRadius} size='small'>
                  <TableHead>
                    <TableRow>
                      <NoBorderCell colSpan={6} align='center' titlenumber='true'>
                        <b>КАЗНАЧЕЙСКИЙ ПОРТФЕЛЬ
                          <NoBorderCell component='span'
                            titlenumber='true'
                            redbold='true'>&nbsp; <b>{formatNumber(
                                // portfolioData['treasuryPortfolio']
                                4194.9
                            )}</b>
                          </NoBorderCell>
                        </b>
                      </NoBorderCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </NoBorderCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* БАЛАНСОВЫЕ АКТИВЫ */}
      <br/>
      <Grid container className={`${classes.smallCardContainer} ${classes.balanceActive}`} justifyContent='center'>
        <Grid item xs={12}>
          <Table className={classes.borderRadius} size='small'>
            <TableHead>
              <TableRow>
                <NoBorderCell titlenumber='true' nowrap='true' colSpan={6} align='center'
                  titletext='true'>
                  <b>БАЛАНСОВЫЕ АКТИВЫ
                    <NoBorderCell component='span' titlenumber='true'
                      redbold='true'>&nbsp;
                      <b>{formatNumber(
                          // portfolioData['balanceActive']
                          48630.5
                      )}</b>
                    </NoBorderCell>
                  </b>
                </NoBorderCell>
              </TableRow>
            </TableHead>
          </Table>
        </Grid>
      </Grid>
      <br/>
      {/** Средняя ставка всего фондирования*/}
      <Grid container className={`${classes.smallCardContainer} ${classes.fundingAvg}`} justifyContent='space-evenly'>
        <Grid item xs={6}>
          <Table className={classes.borderRadius} size='small'>
            <TableHead>
              <TableRow>
                <NoBorderCell nowrap='true' align='left'>
                  <b>*Средняя ставка всего фондирования</b>
                </NoBorderCell>
                {['USD', 'EUR', 'UZS'].map((t) => <Fragment key={uuid()}>
                  <NoBorderCell align='center' morered='true'><b>{t}</b></NoBorderCell>
                  <NoBorderCell redbold='true' morered='true' align='center'>
                    <RedLightText>
                      {formatNumber(
                          ((portfolioData['fundingAvgRatePercents'] || [])
                              .find((percent: any) => percent['CURRENCY_NAME'] === t) || {})['PERCENT']
                      )}%
                    </RedLightText>
                  </NoBorderCell>
                </Fragment>)}
              </TableRow>

            </TableHead>
          </Table>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default memo(FcrbTable)
