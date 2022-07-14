-- Курс валюты
SELECT (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '392'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '392') AS JPY,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '398'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '398') AS KZT,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '643'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '643') AS RUB,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '756'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '756') AS CHF,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '840'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '826') AS GBP,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '826'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '840') AS USD,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '978'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '978') AS EUR
FROM   dual;
-- Изменение в течение недели
SELECT (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '392'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '392') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '392'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '392') AS JPY,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '398'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '398') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '398'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '398') AS KZT,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '643'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '643') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '643'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '643') AS RUB,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '756'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '756') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '756'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '756') AS CHF,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '826'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '826') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '826'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '826') AS GBP,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '840'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '840') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '840'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '840') AS USD,
    (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM   ibs.s_rate_cur@iabs
WHERE  code = '978'
AND date_cross <= TO_DATE('02.06.2021',
    'DD-MM-YYYY')
AND ROWNUM = 1)
AND code = '978') - (SELECT equival
FROM   ibs.s_rate_cur@iabs
WHERE  date_cross = (SELECT MAX(date_cross)
FROM
ibs.s_rate_cur@iabs
WHERE
code = '978'
AND date_cross <=
TO_DATE('02.06.2021',
    'DD-MM-YYYY') - 1
AND ROWNUM = 1)
AND code = '978') AS EUR
FROM   dual;
-- Всего денежные наличности в кассе
SELECT ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '000'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS UZS,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '392'
                        AND code_coa LIKE '101%')) / POWER(10, 6), 2) AS JPY,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '398'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS KZT,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '643'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS RUB,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '756'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS CHF,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '826'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS GPB,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '840'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS USD,
       ROUND((SELECT SUM(saldo_out)
              FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day <= TO_DATE('02.06.2021',
                                                           'MM-DD-YYYY')
                                AND ROWNUM = 1) AS saldo_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_currency = '978'
                        AND code_coa LIKE '101%')) / POWER(10, 8), 2) AS EUR
FROM   dual;
-- Наличные деньги в кассе
SELECT (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS UZS
        FROM  (SELECT (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '000'))AS col1,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10102'
                                AND code_currency = '000'))AS col2,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10111'
                                AND code_currency = '000'))AS col3,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10198'
                                AND code_currency = '000'))AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS UZS,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS JPY
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '392'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '392')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '392')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '392')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS JPY,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS KZT
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '398'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '398')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '398')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '398')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS KZT,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS RUB
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '643'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '643')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '643')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '643')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS RUB,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS CHF
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '756'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '756')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '756')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '756')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS CHF,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS GBP
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '826'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '826')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '826')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '826')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS GPB,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS EUR
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10101'
                                AND code_currency = '978'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10102'
                                    AND code_currency = '978')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '978')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10198'
                                    AND code_currency = '978')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS EUR
FROM   dual;
(SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS USD
 FROM  (SELECT (SELECT SUM(saldo_out)
                FROM  (SELECT (SELECT
                                   --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   saldo_out
                               FROM   ibs.saldo@iabs sl
                               WHERE  sl.account_code = ac.code
                                 AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                 AND ROWNUM = 1) AS saldo_out
                       FROM   ibs.accounts@iabs AC
                       WHERE  code_coa = '10101'
                         AND code_currency = '840'))        AS col1,
               NVL((SELECT SUM(saldo_out)
                    FROM  (SELECT (SELECT
                                       --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                   FROM   ibs.saldo@iabs sl
                                   WHERE  sl.account_code = ac.code
                                     AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                     AND ROWNUM = 1) AS saldo_out
                           FROM   ibs.accounts@iabs AC
                           WHERE  code_coa = '10102'
                             AND code_currency = '840')), 0)AS col2,
               NVL((SELECT SUM(saldo_out)
                    FROM  (SELECT (SELECT
                                       --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                   FROM   ibs.saldo@iabs sl
                                   WHERE  sl.account_code = ac.code
                                     AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                     AND ROWNUM = 1) AS saldo_out
                           FROM   ibs.accounts@iabs AC
                           WHERE  code_coa = '10111'
                             AND code_currency = '840')), 0)AS col3,
               NVL((SELECT SUM(saldo_out)
                    FROM  (SELECT (SELECT
                                       --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_out
                                   FROM   ibs.saldo@iabs sl
                                   WHERE  sl.account_code = ac.code
                                     AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                     AND ROWNUM = 1) AS saldo_out
                           FROM   ibs.accounts@iabs AC
                           WHERE  code_coa = '10198'
                             AND code_currency = '840')), 0)AS col4
        FROM   ibs.saldo@iabs s,
               ibs.accounts@iabs a
        WHERE  s.account_code = a.code
          AND ROWNUM = 1));
-- Денежная наличность в обменных пунктах, банкоматах и деньги в пути
SELECT (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS UZS
        FROM  (SELECT (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '000'))AS col1,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10107'
                                AND code_currency = '000'))AS col2,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10111'
                                AND code_currency = '000'))AS col3,
                      (SELECT SUM(saldo_equival_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_equival_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS
                                         saldo_equival_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10109'
                                AND code_currency = '000'))AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS UZS,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS JPY
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '392'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '392')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '392')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '392')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS JPY,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS KZT
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '398'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '398')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '398')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '398')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS KZT,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS RUB
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '643'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '643')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '643')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '643')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS RUB,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS CHF
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '756'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '756')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '756')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '756')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS CHF,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS GBP
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '826'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '826')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '826')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '826')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS GPB,
       (SELECT ROUND((col1 + col2 + col3)/POWER(10, 8), 2) AS USD
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '840'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '840')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '840')), 0)AS col3
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS USD,
       (SELECT ROUND((col1 + col2 + col3 + col4)/POWER(10, 8), 2) AS EUR
        FROM  (SELECT (SELECT SUM(saldo_out)
                       FROM  (SELECT (SELECT
                                          --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                          saldo_out
                                      FROM   ibs.saldo@iabs sl
                                      WHERE  sl.account_code = ac.code
                                        AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                        AND ROWNUM = 1) AS saldo_out
                              FROM   ibs.accounts@iabs AC
                              WHERE  code_coa = '10103'
                                AND code_currency = '978'))        AS col1,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10107'
                                    AND code_currency = '978')), 0)AS col2,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10111'
                                    AND code_currency = '978')), 0)AS col3,
                      NVL((SELECT SUM(saldo_out)
                           FROM  (SELECT (SELECT
                                              --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_out
                                          FROM   ibs.saldo@iabs sl
                                          WHERE  sl.account_code = ac.code
                                            AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                            AND ROWNUM = 1) AS saldo_out
                                  FROM   ibs.accounts@iabs AC
                                  WHERE  code_coa = '10109'
                                    AND code_currency = '978')), 0)AS col4
               FROM   ibs.saldo@iabs s,
                      ibs.accounts@iabs a
               WHERE  s.account_code = a.code
                 AND ROWNUM = 1)) AS EUR
FROM   dual;
-- Ностро
SELECT ROUND((SELECT SUM(saldo_equival_out)
              FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_equival_out
                             FROM   ibs.saldo@iabs sl
                             WHERE  sl.account_code = ac.code
                               AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                               AND ROWNUM = 1) AS saldo_equival_out
                     FROM   ibs.accounts@iabs AC
                     WHERE  code_coa = '10301'
                       AND code_currency = '000')) / POWER(10, 8), 2) AS UZS,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '392')), 0) / POWER(10, 8), 2) AS JPY,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '398')), 0) / POWER(10, 8), 2) AS KZT,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '643')), 0) / POWER(10, 8), 2) AS RUB,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '756')), 0) / POWER(10, 8), 2) AS CHF,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '826')), 0) / POWER(10, 8), 2) AS GPB,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '840')), 0) / POWER(10, 8), 2) AS USD,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10301'
                           AND code_currency = '978')), 0) / POWER(10, 8), 2) AS EUR
FROM   dual;
-- ФОР
SELECT ROUND(NVL((SELECT SUM(saldo_equival_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_equival_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_equival_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '000')), 0) / POWER(10, 8), 2) AS UZS,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '392')), 0) / POWER(10, 8), 2) AS JPY,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '398')), 0) / POWER(10, 8), 2) AS KZT,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '643')), 0) / POWER(10, 8), 2) AS RUB,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '756')), 0) / POWER(10, 8), 2) AS CHF,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '826')), 0) / POWER(10, 8)) AS GPB,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '840')), 0) / POWER(10, 8), 2) AS USD,
       ROUND(NVL((SELECT SUM(saldo_out)
                  FROM  (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                        saldo_out
                                 FROM   ibs.saldo@iabs sl
                                 WHERE  sl.account_code = ac.code
                                   AND sl.oper_day <= TO_DATE('29.06.2021', 'DD-MM-YYYY')
                                   AND ROWNUM = 1) AS saldo_out
                         FROM   ibs.accounts@iabs AC
                         WHERE  code_coa = '10309'
                           AND code_currency = '978')), 0) / POWER(10, 8), 2) AS EUR
FROM   dual;
-- Корреспондентские счета в других банках
-- Ипак Йули банк, Uzbekistan
SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '000')) AS UZB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '392')) AS JPY,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '398')) AS KZT,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '643')) AS RUB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '756')) AS CHF,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '826')) AS GPB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '840')) AS USD,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10501'
                  AND SUBSTR(code, 17, 8) = '00000444'
                  AND code_currency = '978')) AS EUR
FROM   dual;
--Межбанковские депозиты (10597)
--

-- Mikrokreditbank, Uzbekistan
SELECT (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '000')) AS UZB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '392')) AS JPY,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '398')) AS KZT,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '643')) AS RUB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '756')) AS CHF,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '826')) AS GPB,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '840')) AS USD,
       (SELECT ROUND(SUM(saldo_out) / POWER(10, 8), 2)
        FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_out
                        FROM   ibs.saldo@iabs sl
                        WHERE  sl.account_code = ac.code
                          AND sl.oper_day <= TO_DATE('02.06.2021',
                                                     'DD-MM-YYYY')
                          AND ROWNUM = 1) AS saldo_out
                FROM   ibs.accounts@iabs AC
                WHERE  code_coa = '10597'
                  AND SUBSTR(code, 17, 8) = '00000433'
                  AND code_currency = '978')) AS EUR
FROM   dual;
