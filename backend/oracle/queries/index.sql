-- SALDO_EQUIVALENT_OUT
select sum(saldo_equival_out) from (select
    AC.code,(
    select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
    oper_day from ibs.saldo sl
    where sl.account_code=ac.code
    and sl.oper_day<=to_date('${yearFirstDate}', 'DD-MM-YYYY')
    and rownum=1
    )
    as oper_day,
    (
    select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
    saldo_equival_out
    from ibs.saldo sl
    where
    sl.account_code=ac.code
    and sl.oper_day<=to_date('${yearFirstDate}', 'DD-MM-YYYY')
    and rownum =1
    )
    as saldo_equival_out
    from ibs.accounts  AC
    where code_coa like '303%')
-- Кредитные линиии всего:
select col1+col2 as summ from(
select (
select  sum(saldo_equival_out) from(
select AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum =1
)
as saldo_equival_out from ibs.accounts  AC
where code_coa like '220%'
)
) as col1,(
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '216%'
)
) as col2 from ibs.saldo s, ibs.accounts a
where s.account_code=a.code
and rownum=1
);

-- в национальной валюте
select col1+col2 as summ from(
select (
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '220%'
and ac.code_currency='000'
)
) as col1,(
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '216%'
and ac.code_currency='000'
)
) as col2 from ibs.saldo s, ibs.accounts a
where s.account_code=a.code
and rownum=1
);
---в иностранной валюте
select allvalute-allsum from(
select (
select col1+col2 as summ from(
select (
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '220%'
)
) as col1,(
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='15.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '216%'
)
) as col2 from ibs.saldo s, ibs.accounts a
where s.account_code=a.code
and rownum=1
)
) as allvalute,(
select col1+col2 as summ from(
select (
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '220%'
and ac.code_currency='000'
)
) as col1,(
select  sum(saldo_equival_out) from(
select
AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_equival_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo_equival_out
from ibs.accounts  AC
where code_coa like '216%'
and ac.code_currency='000'
)
) as col2 from ibs.saldo s, ibs.accounts a

where s.account_code=a.code
and rownum=1
)) as allsum from ibs.saldo s, ibs.accounts a

where a.code=s.account_code
and rownum=1
)

-- Текущая прибыль (31206)
select col1+col2 as sum from( select (
select sum(saldo__equival_out) from(
select AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='04.01.2021'
and rownum=1)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo__equival_out

from ibs.accounts  AC
where code_coa like '4%')
) as col1,(
select sum(saldo__equival_out) from(
select

AC.code,(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
oper_day from ibs.saldo sl
where sl.account_code=ac.code
and sl.oper_day<='04.01.2021'
and rownum=1
)
as oper_day,
(
select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
saldo_out
from ibs.saldo sl
where
sl.account_code=ac.code
and sl.oper_day<='18.06.2021'
and rownum =1
)
as saldo__equival_out

from ibs.accounts  AC
where code_coa like '5%'
)
) as col2 from ibs.saldo s, ibs.accounts a
where s.account_code=a.code
and rownum=1
)

SELECT
    nvl((SELECT sum(saldo_equival_out)
         FROM
             (SELECT
                  (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                          saldo_equival_out
                   FROM ibs.saldo@iabs sl
                   WHERE sl.account_code=ac.code
                     AND sl.oper_day<='03.06.2021'
                     AND rownum =1 ) AS saldo_equival_out
              FROM ibs.accounts@iabs AC
              WHERE code_coa in ('30315', '30309')))
        (SELECT sum(saldo_equival_out)
         FROM
             (SELECT
                  (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                          saldo_equival_out
                   FROM ibs.saldo@iabs sl
                   WHERE sl.account_code=ac.code
                     AND sl.oper_day<='03.06.2021'
                     AND rownum =1 ) AS saldo_equival_out
              FROM ibs.accounts@iabs AC
              WHERE code_coa='30303')), 0) AS SALDO_EQ_OUT
FROM dual;
SELECT sum(saldo_equival_out)
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa in
           ('15800', '15900', '15913', '10711', '10719', '10779', '10821', '10813', '10823', '10825', '10879', '10899'));
SELECT sum(saldo_equival_out)
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa in ('10723', '10725', '10799', '10823', '10825', '10899'));
SELECT sum(saldo_equival_out) SALDO_EQ_OUT
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa='31206');
SELECT
    (SELECT sum(saldo_equival_out)
     FROM (SELECT
               (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                       saldo_equival_out
                FROM ibs.saldo@iabs sl
                WHERE sl.account_code=ac.code
                  AND sl.oper_day<='03.06.2021'
                  AND rownum =1 ) AS saldo_equival_out
           FROM ibs.accounts@iabs AC
           WHERE code_coa in ('10711',
                              '10719',
                              '10779',
                              '10821',
                              '10813',
                              '10823',
                              '10825',
                              '10879',
                              '10899')
              OR code_coa like '158%'
              OR code_coa like '159%'))
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='03.06.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa in ('10723',
                             '10725',
                             '10799',
                             '10823',
                             '10825',
                             '15913',
                             '10899'))) AS SALDO_EQ_OUT
FROM dual;
-- FOR CAPITAL
-- FOR YEAR END
SELECT decode(sign(summ), 1, summ, 0) SALDO_EQ_OUT
FROM (SELECT nvl(col1, 0)+nvl(col2, 0)+nvl(col3, 0) AS summ
      FROM
          (SELECT
               (SELECT sum(saldo_equival_out) FROM (SELECT
                                                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                saldo_equival_out
                                                         FROM ibs.saldo@iabs sl
                                                         WHERE sl.account_code=ac.code
                                                           AND sl.oper_day<='30.06.2021'
                                                           AND rownum =1 ) AS saldo_equival_out
                                                    FROM ibs.accounts@iabs AC
                                                    WHERE code_coa='30907' )) AS col1,
               (SELECT sum(saldo_equival_out)
                FROM
                    (SELECT
                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 saldo_equival_out
                          FROM ibs.saldo@iabs sl
                          WHERE sl.account_code=ac.code
                            AND sl.oper_day<='02.06.2021'
                            AND rownum =1 ) AS saldo_equival_out
                     FROM ibs.accounts@iabs AC
                     WHERE code_coa='30909' )) AS col2,
               (SELECT col2+col1
                FROM
                    (SELECT
                         (SELECT sum(saldo_equival_out)
                          FROM
                              (SELECT
                                   (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           saldo_equival_out
                                    FROM ibs.saldo@iabs sl
                                    WHERE sl.account_code=ac.code
                                      AND sl.oper_day<='02.06.2021'
                                      AND rownum =1 ) AS saldo_equival_out
                               FROM ibs.accounts@iabs AC
                               WHERE code_coa like '4%' ))AS col1,

(SELECT sum(saldo_equival_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_equival_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='02.06.2021'
             AND rownum =1 ) AS saldo_equival_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa like '5%' )) AS col2
                    FROM ibs.saldo@iabs s,
                         ibs.accounts@iabs a
WHERE s.account_code=a.code
AND rownum=1 )) AS col3
          FROM ibs.saldo@iabs s,
               ibs.accounts@iabs a
WHERE s.account_code=a.code
AND rownum=1 ));
-- FOR OTHER DAYS
SELECT decode(sign(summ), 1, summ, 0) SALDO_EQ_OUT
FROM (SELECT nvl(col1, 0)+nvl(col2, 0)+nvl(col3, 0) AS summ FROM (SELECT
                                                                      (SELECT sum(saldo_equival_out)
                                                                       FROM
                                                                           (SELECT
                                                                                (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                        saldo_equival_out
                                                                                 FROM ibs.saldo@iabs sl
                                                                                 WHERE sl.account_code=ac.code
                                                                                   AND sl.oper_day<='31.12.2020'
                                                                                   AND rownum =1 ) AS saldo_equival_out
                                                                            FROM ibs.accounts@iabs AC
                                                                            WHERE code_coa='30907' )) AS col1,

(SELECT sum(saldo_equival_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_equival_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='03.06.2020'
             AND rownum =1 ) AS saldo_equival_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa='30909' )) AS col2,

(SELECT sum(saldo_equival_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_equival_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='31.12.2020'
             AND rownum =1 ) AS saldo_equival_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa='31206' )) AS col3
          FROM ibs.saldo@iabs s,
               ibs.accounts@iabs a
WHERE s.account_code=a.code
AND rownum=1 ));
SELECT ceil(sum(saldo_equival_out)) AS summ
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa='30911' );
SELECT 0.45*sum(saldo_equival_out) AS summ
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa='30908' );
SELECT sum(saldo_equival_out) SALDO_EQ_OUT
FROM
    (SELECT
         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                 saldo_equival_out
          FROM ibs.saldo@iabs sl
          WHERE sl.account_code=ac.code
            AND sl.oper_day<='03.06.2021'
            AND rownum =1 ) AS saldo_equival_out
     FROM ibs.accounts@iabs AC
     WHERE code_coa='11501');
SELECT
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%' )) AS col1,
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='000' ))AS col2,
    (trunc(
                (select (
                            (SELECT sum(saldo_equival_out)
                             FROM
                                 (SELECT
                                      (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM ibs.saldo@iabs sl
                                       WHERE sl.account_code=ac.code
                                         AND sl.oper_day<='02.06.2021'
                                         AND rownum =1 ) AS saldo_equival_out
                                  FROM ibs.accounts@iabs AC
                                  WHERE code_coa like '101%' ))

                                (SELECT sum(saldo_equival_out)
                                FROM
                                (SELECT
                                (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                saldo_equival_out
                                FROM ibs.saldo@iabs sl
                                WHERE sl.account_code=ac.code
                                AND sl.oper_day<='02.06.2021'
                                AND rownum =1 ) AS saldo_equival_out
                                FROM ibs.accounts@iabs AC
                                WHERE code_coa like '101%'
                                AND code_currency='000' ))
                        ) from dual)/(select equival from ibs.s_rate_cur@IABS where date_cross='02.06.2021' and code='840'),
                2
        ))
                                        AS col3
FROM ibs.saldo@iabs s,
     ibs.accounts@iabs a
WHERE a.code=s.account_code
  AND rownum=1;
-- LIQUIDITY FIRST ROW
SELECT
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%' )) AS Итого,
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='000' ))AS "Национальная валюта",
    trunc(((select (
                       (SELECT sum(saldo_equival_out)
                        FROM
                            (SELECT
                                 (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                         saldo_equival_out
                                  FROM ibs.saldo@iabs sl
                                  WHERE sl.account_code=ac.code
                                    AND sl.oper_day<='02.06.2021'
                                    AND rownum =1 ) AS saldo_equival_out
                             FROM ibs.accounts@iabs AC
                             WHERE code_coa like '101%' ))

                           (SELECT sum(saldo_equival_out)
                           FROM
                           (SELECT
                           (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                           saldo_equival_out
                           FROM ibs.saldo@iabs sl
                           WHERE sl.account_code=ac.code
                           AND sl.oper_day<='02.06.2021'
                           AND rownum =1 ) AS saldo_equival_out
                           FROM ibs.accounts@iabs AC
                           WHERE code_coa like '101%'
                           AND code_currency='000' ))
                   ) from dual)/(select equival from ibs.s_rate_cur@IABS where date_cross='02.06.2021' and code='840')),2)
                                        as "Иностранном валюте (долл.США)",
    (SELECT sum(saldo_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='840' )) AS "Долл. США",
    (SELECT sum(saldo_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='02.06.2021'
                 AND rownum =1 ) AS saldo_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='978' )) AS "Евро"
FROM ibs.saldo@iabs s,
     ibs.accounts@iabs a
WHERE a.code=s.account_code
  AND rownum=1;
-- FOR LIQUIDITY
select equival from ibs.s_rate_cur@IABS where date_cross='02.06.2021' and code='840';
SELECT col1,
       col2,
       ceil((col1-col2)/
            (SELECT equival
             FROM ibs.s_rate_cur@iabs
             WHERE date_cross='30.06.2021'
               AND code='840')) AS invalut,
       col3,
       col4
FROM (SELECT
          (SELECT sum(saldo_equival_out)
           FROM
               (SELECT
                    (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                            saldo_equival_out
                     FROM ibs.saldo@iabs sl
                     WHERE sl.account_code=ac.code
                       AND sl.oper_day<='02.06.2021'
                       AND rownum =1 ) AS saldo_equival_out
                FROM ibs.accounts@iabs AC
                WHERE code_coa like '101%' )) AS col1,

(SELECT sum(saldo_equival_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_equival_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='02.06.2021'
             AND rownum =1 ) AS saldo_equival_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa like '101%'
        AND code_currency='000' ))AS col2,

(SELECT sum(saldo_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='02.06.2021'
             AND rownum =1 ) AS saldo_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa like '101%'
        AND code_currency='840' )) AS col3,

(SELECT sum(saldo_out)
 FROM
     (SELECT
          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                  saldo_out
           FROM ibs.saldo@iabs sl
           WHERE sl.account_code=ac.code
             AND sl.oper_day<='02.06.2021'
             AND rownum =1 ) AS saldo_out
      FROM ibs.accounts@iabs AC
      WHERE code_coa like '101%'
        AND code_currency='978' )) AS col4
     FROM ibs.saldo@iabs s,
          ibs.accounts@iabs a
WHERE a.code=s.account_code
AND rownum=1 );
SELECT
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='21.04.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%' )) AS total,
    (SELECT sum(saldo_equival_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_equival_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='21.04.2021'
                 AND rownum =1 ) AS saldo_equival_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='000' )) AS nat_curr,
    trunc(((select (
                           (SELECT sum(saldo_equival_out)
                            FROM
                                (SELECT
                                     (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                             saldo_equival_out
                                      FROM ibs.saldo@iabs sl
                                      WHERE sl.account_code=ac.code
                                        AND sl.oper_day<='21.04.2021'
                                        AND rownum =1 ) AS saldo_equival_out
                                 FROM ibs.accounts@iabs AC
                                 WHERE code_coa like '101%' ))-(SELECT sum(saldo_equival_out)
                                                                FROM
                                                                    (SELECT
                                                                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                 saldo_equival_out
                                                                          FROM ibs.saldo@iabs sl
                                                                          WHERE sl.account_code=ac.code
                                                                            AND sl.oper_day<='21.04.2021'
                                                                            AND rownum =1 ) AS saldo_equival_out
                                                                     FROM ibs.accounts@iabs AC
                                                                     WHERE code_coa like '101%'
                                                                       AND code_currency='000' ))
                       ) from dual)/(select equival from ibs.s_rate_cur@IABS where date_cross='21.04.2021' and code='840')),2)
                                        as for_curr_dollar,
    (SELECT sum(saldo_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='21.04.2021'
                 AND rownum =1 ) AS saldo_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='840' )) AS usa_dollar,
    (SELECT sum(saldo_out)
     FROM
         (SELECT
              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                      saldo_out
               FROM ibs.saldo@iabs sl
               WHERE sl.account_code=ac.code
                 AND sl.oper_day<='21.04.2021'
                 AND rownum =1 ) AS saldo_out
          FROM ibs.accounts@iabs AC
          WHERE code_coa like '101%'
            AND code_currency='978' )) AS evro
FROM ibs.saldo@iabs s,
     ibs.accounts@iabs a
WHERE a.code=s.account_code
  AND rownum=1;



