import { getLiquidityTotal, liqInclude } from './liq_pure_functions'
import LiquidityMainClass from './LiquidityMainClass'

/* eslint-disable camelcase */
class LiquidityAssets extends LiquidityMainClass {
  governmentBillsQuery(date: Date) {
    return `SELECT ROUND(( col1 - col5 ) / POWER(10, 8), 2)
           AS
              total,
       ROUND(( col2 - col5 ) / POWER(10, 8), 2)
           AS nat_curr,
       ROUND(( ( col1 - col2 ) / (SELECT equival
                                  FROM   ibs.s_rate_cur@iabs
                                  WHERE  date_cross = (SELECT MAX(date_cross)
                                                       FROM
                                                           ibs.s_rate_cur@iabs
                                                       WHERE  code = '840'
                                                         AND
                                                               date_cross < TO_DATE
                                                               (
                                                                   '${date}', 'DD-MM-YYYY'))
                                    AND code = '840') ) / POWER(10, 8), 2)
           AS
              for_curr,
       ROUND(NVL(col3, 0) / POWER(10, 8), 2)
           AS usa_dollar,
       ROUND(NVL(col4, 0) / POWER(10, 8), 2)
           AS evro
FROM   (SELECT (SELECT SUM(saldo_equival_out)
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}',
                                                             'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_equival_out
                        FROM   ibs.accounts@iabs AC
                        WHERE  code_coa LIKE'107%'))       AS col1,
               (SELECT SUM(saldo_equival_out)
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}',
                                                             'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_equival_out
                        FROM   ibs.accounts@iabs AC
                        WHERE  code_coa LIKE '107%'
                          AND code_currency = '000')) AS col2,
               (SELECT SUM(saldo_out)
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}',
                                                             'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs AC
                        WHERE  code_coa LIKE'107%'
                          AND code_currency = '840')) AS col3,
               (SELECT SUM(saldo_out)
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}',
                                                             'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs AC
                        WHERE  code_coa LIKE'107%'
                          AND code_currency = '978')) AS col4,
               (SELECT SUM(saldo_out)
                FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                FROM   ibs.saldo@iabs sl
                                WHERE  sl.account_code = ac.code
                                  AND sl.oper_day < TO_DATE('${date}',
                                                             'DD-MM-YYYY')
                                  AND ROWNUM = 1) AS saldo_out
                        FROM   ibs.accounts@iabs AC
                        WHERE  code_coa = '10793'))        AS col5
        FROM   ibs.saldo@iabs s,
               ibs.accounts@iabs a
        WHERE  a.code = s.account_code
          AND ROWNUM = 1)`
  }

  localBanksQuery(date: Date) {
    return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
            FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   NVL(SALDO_EQUIVAL_OUT, 0)
                            FROM   IBS.SALDO@IABS SL
                            WHERE  SL.ACCOUNT_CODE = AC.CODE
                              AND SL.OPER_DAY < TO_DATE('${date}',
                                                        'DD.MM.YYYY')
                              AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                    FROM   IBS.ACCOUNTS@IABS AC,
                           BANK_DICTIONARY B
                    WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                      AND CODE_COA IN ( '21002' ))) AS TOTAL,
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_EQUIVAL_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '000')) AS NAT_CURR,
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                    NVL(SALDO_EQUIVAL_OUT, 0) / 
                    (SELECT EQUIVAL FROM (SELECT --+index_desc(rate XPK_S_RATE_CUR )
                                                                                 EQUIVAL,
                                                                                 ROWNUM AS N
                                                                             FROM
                                                                                 IBS.S_RATE_CUR@IABS
                                                                                     RATE
                                                                             WHERE  CODE = '840')
                                                                        WHERE  N = 2)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY <> '000')) AS FOR_CURR,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '840'))         AS USD,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '978'))         AS EUR
            FROM   DUAL`
  }

  async total_actives() {/* ?????????? ???????????? (????????????) */
    return await this.getOneRow(
        '',
        '?????????? ???????????? (????????????)',
        '',
        this.liquidityQuery('T_A'),
        true
    )
  } /* ?????????? ???????????? (????????????) */

  async cash_box() {/* ?????????? */
    return await this.getOneRow(
        '1',
        '??????????',
        `code_coa like '101%'`,
        null,
        true
    )
  } /* ?????????? */

  async government_bills() {/* ?????? . ???????????? ???????????? */
    return await this.getOneRow(
        '2',
        '??????. ???????????? ????????????',
        '',
        this.governmentBillsQuery,
        true
    )
  } /* ?????? . ???????????? ???????????? */

  async drag_metals() {/* ????????. ???????????? */
    return await this.getOneRow(
        '3',
        '????????. ????????????',
        `code_coa='10909'`,
        null,
        true
    )
  } /* ????????. ???????????? */

  async over_night() {/* ???????????????? */
    return await this.getOneRow(
        '4',
        '????????????????',
        `code_coa='10521'`,
        null,
        true
    )
  } /* ???????????????? */

  async cb_accounts() {/* ?????????? ?? ???? ?????? */
    return await this.getOneRow(
        '5',
        '?????????? ?? ???? ??????',
        `code_coa like '103%'`,
        null,
        true
    )
  } /* ?????????? ?? ???? ?????? */

  async correspondent_accounts() {/* ?????????????????????????????????? ???????? */
    return await this.getOneRow(
        '-',
        '?????????????????????????????????? ????????',
        `code_coa='10301'`
    )
  } /* ?????????????????????????????????? ???????? */

  async f_o_r() {/* ?????? */
    return await this.getOneRow(
        '-',
        '??????',
        `code_coa='10309'`
    )
  } /* ?????? */

  async funds_to_receive() {/* ???????????????? ?? ?????????????????? */
    return await this.getOneRow(
        '-',
        '???????????????? ?? ??????????????????',
        `code_coa='10311'`
    )
  } /* ???????????????? ?? ?????????????????? */

  async repo_transaction() {/* ???????? ???????????? */
    return await this.getOneRow(
        '-',
        '???????? ????????????',
        `code_coa like '223%'`
    )
  } /* ???????? ???????????? */

  async interbank_deposits() {/* ?????????????????????????? ???????????????? */
    return await this.getOneRow(
        '-',
        '?????????????????????????? ????????????????',
        `CODE_COA IN ('10397', '10321', '10331')`
    )
  } /* ?????????????????????????? ???????????????? */

  async nostro_accounts() {/* ???????????? ?????????? */
    return await this.getOneRow(
        '6',
        '???????????? ??????????',
        `code_coa='10501'`,
        null,
        true
    )
  } /* ???????????? ?????????? */

  async vostro_accounts() {/* ?? ?????? ??????????, ???????????? ?????????? */
    return await this.getOneRow(
        '',
        '?? ?????? ??????????, ???????????? ??????????',
        `code_coa='21002'`
    )
  } /* ?? ?????? ??????????, ???????????? ?????????? */

  async local_banks() {/* Local Banks */
    return await this.getOneRow(
        '2',
        '__LOCAL_BANKS__',
        '',
        this.localBanksQuery
    )
  } /* Local banks */

  liquidity_assets_total(...args: any) {/* ?????????? ?????????????????? ?????????????? */
    const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns
        .map((p) => getLiquidityTotal(p, ...args))
    return {
      count: 7, state: '?????????? ?????????????????? ??????????????', total, nat_curr, for_curr, usa_dollar,
      evro, isTableHead: true
    }
  } /* ?????????? ?????????????????? ?????????????? */

  high_liq_assets_total(total_assets: any,
      f_o_r: any, repo_tr: any, vostr_accounts: any,
      localBanks: any) {/* ?????????? ???????????? ?????????????????? ?????????????? */
    const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns
        .map((p) => total_assets[p] -
      getLiquidityTotal(p, f_o_r, repo_tr, vostr_accounts) + localBanks[p])
    return {
      count: 8, state: '?????????? ???????????? ?????????????????? ??????????????', total, nat_curr, for_curr, usa_dollar,
      evro, isTableHead: true
    }
  } /* ?????????? ???????????? ?????????????????? ?????????????? */

  high_liq_assets_share(high_liq_assets_total: any,
      total_actives: any) {/* ???????? ?????????????????????????????? ?????????????? ?? % */
    const colValues = this.columns
        .map((p) => (`${(high_liq_assets_total[p] * 100 / total_actives[p]).toFixed(2)}%`))
    return {
      count: 9,
      state: '???????? ?????????????????????????????? ?????????????? ?? %',
      ...this.columns.reduce((acc, prop, i) => {
        // @ts-ignore
        acc[prop] = colValues[i] === 'Infinity%' ? ' ' : colValues[i]
        return acc
      }, {}),
      isTableHead: true
    }
  } /* ???????? ?????????????????????????????? ?????????????? ?? % */

  async getRows() {
    const [
      totalActives,
      cashBox,
      governmentBills,
      dragMetals,
      overNight,
      cbAccounts,
      correspondentAccounts,
      F_O_R,
      fundsToReceive,
      repoTransaction,
      interbankDeposits,
      nostroAccounts,
      vostroAccounts,
      localBanks
    ] = await Promise.all([
      this.total_actives(),
      this.cash_box(),
      this.government_bills(),
      this.drag_metals(),
      this.over_night(),
      this.cb_accounts(),
      this.correspondent_accounts(),
      this.f_o_r(),
      this.funds_to_receive(),
      this.repo_transaction(),
      this.interbank_deposits(),
      this.nostro_accounts(),
      this.vostro_accounts(),
      this.local_banks()
    ])
    const liquidityAssetsTotal = this.liquidity_assets_total(
        cashBox,
        cbAccounts,
        overNight,
        nostroAccounts,
        governmentBills
    )
    const highLiqAssetsTotal = this.high_liq_assets_total(
        liquidityAssetsTotal,
        F_O_R,
        repoTransaction,
        vostroAccounts,
        localBanks
    )
    const highLiqAssetsShare = this.high_liq_assets_share(
        highLiqAssetsTotal,
        totalActives
    )
    return [
      totalActives,
      cashBox,
      governmentBills,
      dragMetals,
      overNight,
      cbAccounts,
      liqInclude(),
      correspondentAccounts,
      F_O_R,
      fundsToReceive,
      repoTransaction,
      interbankDeposits,
      nostroAccounts,
      vostroAccounts,
      liquidityAssetsTotal,
      highLiqAssetsTotal,
      highLiqAssetsShare
    ]
  }
}

export default LiquidityAssets
