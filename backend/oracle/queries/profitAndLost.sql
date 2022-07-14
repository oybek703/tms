SELECT year_begin,
       month_begin,
       selected_date,
       (selected_date - month_begin)                       AS differ,
       (ROUND((selected_date / month_begin) - 1, 3) * 100) AS differ_percent
FROM (SELECT (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1)) AS
                         selected_date
              FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   saldo_equival_out
                            FROM ibs.saldo@iabs sl
                            WHERE sl.account_code = ac.code
                              AND sl.oper_day < TO_DATE('08.07.2021',
                                                        'DD-MM-YYYY')
                              AND ROWNUM = 1) AS saldo_equival_out
                    FROM ibs.accounts@iabs AC
                    WHERE code_coa LIKE '562%')) AS selected_date,
             (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1)) AS
                         selected_date
              FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   saldo_equival_out
                            FROM ibs.saldo@iabs sl
                            WHERE sl.account_code = ac.code
                              AND sl.oper_day < TO_DATE('01.07.2021',
                                                        'DD-MM-YYYY')
                              AND ROWNUM = 1) AS saldo_equival_out
                    FROM ibs.accounts@iabs AC
                    WHERE code_coa LIKE '562%')) AS month_begin,
             (SELECT ABS(ROUND(SUM(saldo_equival_out) / POWER(10, 11), 1)) AS
                         selected_date
              FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   saldo_equival_out
                            FROM ibs.saldo@iabs sl
                            WHERE sl.account_code = ac.code
                              AND sl.oper_day < TO_DATE('01.01.2020',
                                                        'DD-MM-YYYY')
                              AND ROWNUM = 1) AS saldo_equival_out
                    FROM ibs.accounts@iabs AC
                    WHERE code_coa LIKE '562%')) AS year_begin
      FROM dual);