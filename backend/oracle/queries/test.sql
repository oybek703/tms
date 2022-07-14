SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '000')) AS UZB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '392')) AS JPY,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '398')) AS KZT,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '643')) AS RUB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '756')) AS CHF,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '826')) AS GPB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '840')) AS USD,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('29.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00001140'
                  AND code_currency = '978')) AS EUR
FROM   dual;