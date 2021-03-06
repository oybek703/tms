import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import {
  makeStyles,
  TableBody,
  TableContainer,
  TableRow
} from '@material-ui/core'
import TableCell from '@material-ui/core/TableCell'
import BoldWithColor from '../../helpers/BoldWithColor'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '77vh'
  }
}))

const Normatives = () => {
  const classes = useStyles()
  return (
    <TableContainer classes={{ root: classes.tableContainer }} component={Paper}>
      <Table size='small'>
        <TableHead>
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>1</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Показатели достаточности
                            капитала</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Установленные нормативы</BoldWithColor></TableCell>
            <TableCell align='center'><BoldWithColor>Показатели нормативов</BoldWithColor></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[
            {
              count: '1.1',
              title: 'Коэф. достат. Капитала',
              min: 'мин 13%',
              min_percent: '13.7%'
            },
            {
              count: '1.2',
              title: 'Коэф. достат. капитала – 1',
              min: 'мин 10%',
              min_percent: '12.5%'
            },
            {
              count: '1.3',
              title: 'Коэффициент достат. основ. капитала – 1',
              min: 'мин 8%',
              min_percent: '12.5%'
            },
            {
              count: '1.4',
              title: 'Левераж',
              min: 'мин 6%',
              min_percent: '9.4%'
            }
          ].map((row) => <TableRow key={uuid()}>
            <TableCell align='center'>{row.count}</TableCell>
            <TableCell colSpan={2} align='center'>{row.title}</TableCell>
            <TableCell align='center'>{row.min}</TableCell>
            <TableCell align='center'>{row.min_percent}</TableCell>
          </TableRow>)}
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>2</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Показатели
                            ликвидности</BoldWithColor></TableCell>
            <TableCell align='center' colSpan={2}/>
          </TableRow>
          <TableRow>
            <TableCell align='center'>2.1</TableCell>
            <TableCell colSpan={2} align='center'>Доля высоколиквидных активов
                            во всего активах <span style={{ color: 'red' }}>(ВЛА)</span></TableCell>
            <TableCell align='center'>мин 10%</TableCell>
            <TableCell align='center'>15.4%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={4} align='center'>2.2</TableCell>
            <TableCell rowSpan={4} align='center'>
                            Коэффициент покрытия ликвидности <span style={{ color: 'red' }}>(LCR)</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Всего</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>262.9%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>нац. Валюта</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>252.7%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ин. Валюта</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>269.2%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={4} align='center'>2.3</TableCell>
            <TableCell rowSpan={4} align='center'>
                            Норма чистого стаб. финан. <span style={{ color: 'red' }}>(NSFR)</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Всего</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>110.6%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>нац. Валюта</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>113.9%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ин. Валюта</TableCell>
            <TableCell align='center'>мин 100%</TableCell>
            <TableCell align='center'>108.9%</TableCell>
          </TableRow>
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>3</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Нормативы по крупным рискам</BoldWithColor></TableCell>
            <TableCell align='center' colSpan={2}/>
          </TableRow>
          <TableRow>
            <TableCell align='center'>3.1</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер риска на одного или группу</TableCell>
            <TableCell align='center'>макс 25%</TableCell>
            <TableCell align='center'>22.3%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>3.2</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер риска на один банк или группу</TableCell>
            <TableCell align='center'>макс 25%</TableCell>
            <TableCell align='center'>10.9%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>3.3</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер необеспеч. кредита на одного или
                            группу</TableCell>
            <TableCell align='center'>макс 5%</TableCell>
            <TableCell align='center'>0.0%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>3.4</TableCell>
            <TableCell colSpan={2} align='center'>Совокупная сумма всех крупных рисков</TableCell>
            <TableCell align='center'>макс 500%</TableCell>
            <TableCell align='center'>157.6%</TableCell>
          </TableRow>
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>4</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Нормативы по ценным бумагам</BoldWithColor></TableCell>
            <TableCell align='center' colSpan={2}/>
          </TableRow>
          <TableRow>
            <TableCell align='center'>4.1</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер инвестиций одного юр. лица</TableCell>
            <TableCell align='center'>макс 15%</TableCell>
            <TableCell align='center'>8.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>4.2</TableCell>
            <TableCell colSpan={2} align='center'>Макс. общий размер инвестиций в ценные бумаги</TableCell>
            <TableCell align='center'>макс 25%</TableCell>
            <TableCell align='center'>0.5%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>4.3</TableCell>
            <TableCell colSpan={2} align='center'>Макс. общий размер инвестиций всех эмитентов</TableCell>
            <TableCell align='center'>макс 50%</TableCell>
            <TableCell align='center'>13.1%</TableCell>
          </TableRow>
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>5</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Нормативы риска на связанных с банком
                            лиц</BoldWithColor></TableCell>
            <TableCell align='center' colSpan={2}/>
          </TableRow>
          <TableRow>
            <TableCell align='center'>5.1</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер риска на одного связанного с банком
                            лица</TableCell>
            <TableCell align='center'>макс 25%</TableCell>
            <TableCell align='center'>8.1%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='center'>5.2</TableCell>
            <TableCell colSpan={2} align='center'>Макс. размер риска по всем связанным с банком
                            лицам</TableCell>
            <TableCell align='center'>макс 50%</TableCell>
            <TableCell align='center'>14.1%</TableCell>
          </TableRow>
          <TableRow style={{ background: '#7794aa' }}>
            <TableCell align='center'><BoldWithColor>6</BoldWithColor></TableCell>
            <TableCell colSpan={2} align='center'><BoldWithColor>Норматив по инвестициям банка в
                            недвижимость</BoldWithColor></TableCell>
            <TableCell align='center' colSpan={2}/>
          </TableRow>
          <TableRow>
            <TableCell align='center'>6.1</TableCell>
            <TableCell colSpan={2} align='center'>Норматив по инвестициям банка в недвижимость</TableCell>
            <TableCell align='center'>макс 100%</TableCell>
            <TableCell align='center'>0.0%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Normatives
