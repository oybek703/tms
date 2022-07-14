-- RUN ANY PROCEDURE
DECLARE
    min_date     DATE := TO_DATE('17.07.2021', 'DD-MM-YYYY');
    is_oper_day  BOOLEAN := false;
BEGIN
    WHILE min_date < sysdate LOOP
            is_oper_day := checkoperday(min_date);
            IF ( is_oper_day ) THEN
            -- RUN PROCEDURE HERE
            -- EXAMPLE: FUNDS_ON_PC(min_date);
            ELSE
                dbms_output.put_line(min_date || ' is not operational day!');
            END IF;

            min_date := min_date + 1;
        END LOOP;
END;
/

-- ===============================================================
-- OTHER OBLIGATIONS

CREATE OR REPLACE PROCEDURE other_obligations IS

    oper_day_oo         DATE := TO_DATE('01.01.2021', 'DD-MM-YYYY');
    total              NUMBER := 0;
    nat_curr    NUMBER := 0;
    for_curr  NUMBER := 0;
    usa_dollar              NUMBER := 0;
    evro              NUMBER := 0;
    curr_rate          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);

    -- ROLE='O_O'
BEGIN

    --select for oper_day

    SELECT
        MAX(oper_day)
    INTO oper_day_oo
    FROM
        ibs.day_operational@iabs
    WHERE
            day_status = 1
    ORDER BY
        oper_day DESC;

----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_oo
      AND role = 'O_O';

    IF ( oper_day_oo = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO curr_rate
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_oo
          AND code = 840;

        ------------------------Итого--------------------------------

        SELECT
            round(((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_oo
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('298%')
                          AND ac.condition IN('A', 'C', 'T')
                    )
            )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_oo
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('298%')
                          AND code_currency = '000'
                          AND ac.condition IN('A', 'C', 'T')
                    )
            )) / power(10, 8)),
                  2)
        INTO nat_curr
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        for_curr := round((total - nat_curr) / curr_rate, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_oo
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('298%')
                                        AND code_currency = '840'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO usa_dollar
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_oo
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('298%')
                                        AND code_currency = '978'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO evro
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_oo,
                     total,
                     nat_curr,
                     for_curr,
                     usa_dollar,
                     evro,
                     'O_O'
                 );

        dbms_output.put_line(oper_day_oo || ' date data written in LIQUIDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [other_obligations] procedure.');
END;
/

-- ===============================================================
-- MAIN INDICATORS PROCEDURES
CREATE OR REPLACE PROCEDURE loan_portfolio (
    oper_day_lp IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- L_P
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_lp
      AND role = 'L_P';

    IF ( oper_day_lp = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_lp, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_lp, 'YYYY')
        INTO year_begin
        FROM
            dual;

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '125%'
                   OR code_coa LIKE '126%'
                   OR code_coa LIKE '127%'
                   OR code_coa LIKE '129%'
                   OR code_coa LIKE '130%'
                   OR code_coa LIKE '131%'
                   OR code_coa LIKE '132%'
                   OR code_coa LIKE '133%'
                   OR code_coa LIKE '143%'
                   OR code_coa LIKE '144%'
                   OR code_coa LIKE '149%'
                   OR code_coa LIKE '150%'
                   OR code_coa LIKE '151%'
                   OR code_coa LIKE '152%'
                   OR code_coa LIKE '153%'
                   OR code_coa LIKE '155%'
                   OR code_coa LIKE '156%'
                   OR code_coa LIKE '157%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '125%'
                   OR code_coa LIKE '126%'
                   OR code_coa LIKE '127%'
                   OR code_coa LIKE '129%'
                   OR code_coa LIKE '130%'
                   OR code_coa LIKE '131%'
                   OR code_coa LIKE '132%'
                   OR code_coa LIKE '133%'
                   OR code_coa LIKE '143%'
                   OR code_coa LIKE '144%'
                   OR code_coa LIKE '149%'
                   OR code_coa LIKE '150%'
                   OR code_coa LIKE '151%'
                   OR code_coa LIKE '152%'
                   OR code_coa LIKE '153%'
                   OR code_coa LIKE '155%'
                   OR code_coa LIKE '156%'
                   OR code_coa LIKE '157%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_lp
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '125%'
                   OR code_coa LIKE '126%'
                   OR code_coa LIKE '127%'
                   OR code_coa LIKE '129%'
                   OR code_coa LIKE '130%'
                   OR code_coa LIKE '131%'
                   OR code_coa LIKE '132%'
                   OR code_coa LIKE '133%'
                   OR code_coa LIKE '143%'
                   OR code_coa LIKE '144%'
                   OR code_coa LIKE '149%'
                   OR code_coa LIKE '150%'
                   OR code_coa LIKE '151%'
                   OR code_coa LIKE '152%'
                   OR code_coa LIKE '153%'
                   OR code_coa LIKE '155%'
                   OR code_coa LIKE '156%'
                   OR code_coa LIKE '157%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_lp,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'L_P',
                     'Кредитный портфель'
                 );

        dbms_output.put_line(oper_day_lp || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.loan_portfolio] procedure.');
        COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE potential_loss_reserves (
    oper_day_plr IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- P_L_R
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_plr
      AND role = 'P_L_R';

    IF ( oper_day_plr = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_plr, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_plr, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            round(SUM(saldo_equival_out) / power(10, 11), 1)
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa IN ( '12599', '12699', '12999', '13199', '13299',
                                      '14399',
                                      '14999',
                                      '15099',
                                      '15199',
                                      '15299',
                                      '15399',
                                      '15999',
                                      '15699',
                                      '15799',
                                      '15599' )
            );

        --select for begin month

        SELECT
            round(SUM(saldo_equival_out) / power(10, 11), 1)
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa IN ( '12599', '12699', '12999', '13199', '13299',
                                      '14399',
                                      '14999',
                                      '15099',
                                      '15199',
                                      '15299',
                                      '15399',
                                      '15999',
                                      '15699',
                                      '15799',
                                      '15599' )
            );

--- select for selected date

        SELECT
            round(SUM(saldo_equival_out) / power(10, 11), 1)
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_plr
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa IN ( '12599', '12699', '12999', '13199', '13299',
                                      '14399',
                                      '14999',
                                      '15099',
                                      '15199',
                                      '15299',
                                      '15399',
                                      '15999',
                                      '15699',
                                      '15799',
                                      '15599' )
            );

        valueofdaily := -1 * valueofdaily;
        valueofbeginmonth := -1 * valueofbeginmonth;
        valueofbeginyear := -1 * valueofbeginyear;
        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_plr,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'P_L_R',
                     'Резервы возможных убытков'
                 );

        dbms_output.put_line(oper_day_plr || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.potential_loss_reserves] procedure.');
        COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE accrued_interest_receivable (
    oper_day_air IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- A_I_R
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_air
      AND role = 'A_I_R';

    IF ( oper_day_air = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_air, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_air, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '163%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '163%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_air
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '163%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_air,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'A_I_R',
                     'Начисленные проценты к получению'
                 );

        dbms_output.put_line(oper_day_air || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.accrued_interest_receivable] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE other_assets (
    oper_day_oa IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- O_A
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_oa
      AND role = 'O_A';

    IF ( oper_day_oa = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_oa, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_oa, 'YYYY')
        INTO year_begin
        FROM
            dual;

------select for valueofBeginyear
        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '108%'
                   OR code_coa LIKE '109%'
                   OR code_coa LIKE '115%'
                   OR code_coa LIKE '117%'
                   OR code_coa LIKE '164%'
                   OR code_coa LIKE '158%'
                   OR code_coa LIKE '161%'
                   OR code_coa LIKE '166%'
                   OR code_coa LIKE '171%'
                   OR code_coa LIKE '173%'
                   OR code_coa LIKE '199%'
                   OR code_coa LIKE '174%'
                   OR code_coa LIKE '168%'
                   OR code_coa LIKE '175%'
                   OR code_coa = '10791'
                   OR code_coa = '10793'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '108%'
                   OR code_coa LIKE '109%'
                   OR code_coa LIKE '115%'
                   OR code_coa LIKE '117%'
                   OR code_coa LIKE '164%'
                   OR code_coa LIKE '158%'
                   OR code_coa LIKE '161%'
                   OR code_coa LIKE '166%'
                   OR code_coa LIKE '171%'
                   OR code_coa LIKE '173%'
                   OR code_coa LIKE '199%'
                   OR code_coa LIKE '174%'
                   OR code_coa LIKE '168%'
                   OR code_coa LIKE '175%'
                   OR code_coa = '10791'
                   OR code_coa = '10793'
            );

--- select for selected date
        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_oa
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '108%'
                   OR code_coa LIKE '109%'
                   OR code_coa LIKE '115%'
                   OR code_coa LIKE '117%'
                   OR code_coa LIKE '164%'
                   OR code_coa LIKE '158%'
                   OR code_coa LIKE '161%'
                   OR code_coa LIKE '166%'
                   OR code_coa LIKE '171%'
                   OR code_coa LIKE '173%'
                   OR code_coa LIKE '199%'
                   OR code_coa LIKE '174%'
                   OR code_coa LIKE '168%'
                   OR code_coa LIKE '175%'
                   OR code_coa = '10791'
                   OR code_coa = '10793'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_oa,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'O_A',
                     'Другие активы'
                 );

        dbms_output.put_line(oper_day_oa || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.other_assets] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE total_assets (
    oper_day_ta IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- T_A
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_ta
      AND role = 'T_A';

    IF ( oper_day_ta = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_ta, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_ta, 'YYYY')
        INTO year_begin
        FROM
            dual;

------select for valueofBeginyear
        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '1%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '1%'
            );

--- select for selected date
        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_ta
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '1%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_ta,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'T_A',
                     'Всего активов'
                 );

        dbms_output.put_line(oper_day_ta || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.total_assets] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE commitment_to_customers (
    oper_day_ctc IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- C_T_C
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_ctc
      AND role = 'C_T_C';

    IF ( oper_day_ctc = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_ctc, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_ctc, 'YYYY')
        INTO year_begin
        FROM
            dual;

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                   OR code_coa LIKE '204%'
                   OR code_coa LIKE '206%'
                   OR code_coa LIKE '226%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                   OR code_coa LIKE '204%'
                   OR code_coa LIKE '206%'
                   OR code_coa LIKE '226%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_ctc
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                   OR code_coa LIKE '204%'
                   OR code_coa LIKE '206%'
                   OR code_coa LIKE '226%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_ctc,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'C_T_C',
                     'Обязательство перед клиентами'
                 );

        dbms_output.put_line(oper_day_ctc || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.Commitment_to_customers] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE demand_deposits_legal_entities (
    oper_day_ddle IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);
    d202               NUMBER;    -- code_coa like'202%'
    d226               NUMBER;    --code_coa like'226%';

--            ROLE- D_D_L_E
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_ddle
      AND role = 'D_D_L_E';

    IF ( oper_day_ddle = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_ddle, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_ddle, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --     select for code_coa like'202%'
        SELECT
            SUM(saldo_equival_out)
        INTO d202
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                  AND code_coa != '20206'
            );

        --     select for code_coa like'226%'

        SELECT
            SUM(saldo_equival_out)
        INTO d226
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '226%'
                  AND code_coa != '22617'
                  AND code_coa != '22618'
            );

        valueofbeginyear := round((d202 + d226) / power(10, 11), 1);

        --select for begin month

--     select for code_coa like'202%'
        SELECT
            SUM(saldo_equival_out)
        INTO d202
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                  AND code_coa != '20206'
            );

        --     select for code_coa like'226%'

        SELECT
            SUM(saldo_equival_out)
        INTO d226
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '226%'
                  AND code_coa != '22618'
                  AND code_coa != '22617'
            );

        valueofbeginmonth := round((d202 + d226) / power(10, 11), 1);

        --- select for selected date

--     select for code_coa like'202%'
        SELECT
            SUM(saldo_equival_out)
        INTO d202
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_ddle
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '202%'
                  AND code_coa != '20206'
            );

        SELECT
            SUM(saldo_equival_out)
        INTO d226
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_ddle
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '226%'
                  AND code_coa != '22617'
                  AND code_coa != '22618'
            );

        valueofdaily := round((d202 + d226) / power(10, 11), 1);

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_ddle,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'D_D_L_E',
                     'депозиты довостребования юр. лиц.'
                 );

        dbms_output.put_line(oper_day_ddle || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.demand_deposits_legal_entities] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE accrued_interest_payable (
    oper_day_aip IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- S_D_L_P
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_aip
      AND role = 'A_I_P';

    IF ( oper_day_aip = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_aip, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_aip, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '224%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '224%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_aip
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '224%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_aip,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'A_I_P',
                     'Начисленные проценты к оплате'
                 );

        dbms_output.put_line(oper_day_aip || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.accrued_interest_payable] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE other_financial_liabilities (
    oper_day_ofl IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- O_F_L
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_ofl
      AND role = 'O_F_L';

    IF ( oper_day_ofl = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_ofl, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_ofl, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '231%'
                   OR code_coa LIKE '222%'
                   OR code_coa LIKE '228%'
                   OR code_coa LIKE '232%'
                   OR code_coa LIKE '234%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '231%'
                   OR code_coa LIKE '222%'
                   OR code_coa LIKE '228%'
                   OR code_coa LIKE '232%'
                   OR code_coa LIKE '234%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_ofl
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '231%'
                   OR code_coa LIKE '222%'
                   OR code_coa LIKE '228%'
                   OR code_coa LIKE '232%'
                   OR code_coa LIKE '234%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_ofl,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'O_F_L',
                     'Другие финансовые обязательствы'
                 );

        dbms_output.put_line(oper_day_ofl || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.other_financial_liabilities] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE other_obligations (
    oper_day_oo IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- O_O
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_oo
      AND role = 'O_O';

    IF ( oper_day_oo = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_oo, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_oo, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '298%'
                   OR code_coa LIKE '235%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '298%'
                   OR code_coa LIKE '235%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_oo
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '298%'
                   OR code_coa LIKE '235%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_oo,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'O_O',
                     'Другие обязательствы'
                 );

        dbms_output.put_line(oper_day_oo || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.other_obligations] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE total_liabilities (
    oper_day_tl IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- T_L
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_tl
      AND role = 'T_L';

    IF ( oper_day_tl = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_tl, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_tl, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '2%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '2%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_tl
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '2%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_tl,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'T_L',
                     ' Всего обязательств'
                 );

        dbms_output.put_line(oper_day_tl || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.total_liabilities] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE current_profit (
    oper_day_cp IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- C_P
BEGIN


    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_cp
      AND role = 'C_P';

    IF ( oper_day_cp = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_cp, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_cp, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa = '31206'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '4%'
                   OR code_coa LIKE '5%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_cp
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '4%'
                   OR code_coa LIKE '5%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_cp,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'C_P',
                     ' Текущая прибыль'
                 );

        dbms_output.put_line(oper_day_cp || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.current_profit] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE total_capital (
    oper_day_tc IN DATE
) IS

    month_begin        DATE;
    year_begin         DATE;
    valueofdaily       NUMBER;
    valueofbeginmonth  NUMBER;
    valueofbeginyear   NUMBER;
    existing_date      DATE := to_date(sysdate);

    --            ROLE- T_C
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        mainindicators
    WHERE
            oper_day = oper_day_tc
      AND role = 'T_C';

    IF ( oper_day_tc = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---select for BEGIN MONTH and BEGIN YEAR

        SELECT
            trunc(oper_day_tc, 'MM')
        INTO month_begin
        FROM
            dual;

        SELECT
            trunc(oper_day_tc, 'YYYY')
        INTO year_begin
        FROM
            dual;

        --select for begin year

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginyear
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < year_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '3%'
            );

        --select for begin month

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofbeginmonth
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day < month_begin
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '3%'
                   OR code_coa LIKE '4%'
                   OR code_coa LIKE '5%'
            );

--- select for selected date

        SELECT
            abs(round(SUM(saldo_equival_out) / power(10, 11), 1))
        INTO valueofdaily
        FROM
            (
                SELECT
                    (
                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                               saldo_equival_out
                        FROM
                            ibs.saldo@iabs sl
                        WHERE
                                sl.account_code = ac.code
                          AND sl.oper_day <= oper_day_tc
                          AND ROWNUM = 1
                    ) AS saldo_equival_out
                FROM
                    ibs.accounts@iabs ac
                WHERE
                        code_coa LIKE '3%'
                   OR code_coa LIKE '4%'
                   OR code_coa LIKE '5%'
            );

        INSERT INTO mainindicators (
            oper_day,
            year_begin,
            month_begin,
            selected_date,
            role,
            indicator_name
        ) VALUES (
                     oper_day_tc,
                     valueofbeginyear,
                     valueofbeginmonth,
                     valueofdaily,
                     'T_C',
                     'Совокупный капитал'
                 );

        dbms_output.put_line(oper_day_tc || ' date data written in MAININDICATORS');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [MAIN_INDICATORS_PACKAGE.total_capital] procedure.');
END;
/
-- ===============================================================

-- ===============================================================
-- LIQUIDITY PROCEDURES
CREATE OR REPLACE PROCEDURE total_active(oper_day_l IN DATE) IS
    total              NUMBER := 0;                --Итого
    national_valute    NUMBER := 0;           --Национальная валюта
    innational_valute  NUMBER := 0;          --Иностранном валюте (долл.США)
    usd_l              NUMBER := 0;                      --Долл. США
    eur_l              NUMBER := 0;                     --Евро
    rate_curs          NUMBER := 0;                 --dollar kursi
    existing_date      DATE := to_date(sysdate);

    --            ROLE- T_A
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'T_A';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;

        ------------------------Итого--------------------------------

        SELECT
            round(((
                       SELECT
                           SUM(saldo_equival_out)
                       FROM
                           (
                               SELECT
                                   (
                                       SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM
                                           ibs.saldo@iabs sl
                                       WHERE
                                               sl.account_code = ac.code
                                         AND sl.oper_day <= oper_day_l
                                         AND ROWNUM = 1
                                   ) AS saldo_equival_out
                               FROM
                                   ibs.accounts@iabs ac
                               WHERE
                                       code_coa LIKE('1%')
                                 AND ac.condition IN('A', 'C', 'T')
                           )
                   ) -(
                       SELECT
                           SUM(saldo_equival_out)
                       FROM
                           (
                               SELECT
                                   (
                                       SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM
                                           ibs.saldo@iabs sl
                                       WHERE
                                               sl.account_code = ac.code
                                         AND sl.oper_day <= oper_day_l
                                         AND ROWNUM = 1
                                   ) AS saldo_equival_out
                               FROM
                                   ibs.accounts@iabs ac
                               WHERE
                                       code_coa LIKE('161%')
                                 AND ac.condition IN('A', 'C', 'T')
                           )
                   ) -(
                       SELECT
                           SUM(saldo_equival_out)
                       FROM
                           (
                               SELECT
                                   (
                                       SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM
                                           ibs.saldo@iabs sl
                                       WHERE
                                               sl.account_code = ac.code
                                         AND sl.oper_day <= oper_day_l
                                         AND ROWNUM = 1
                                   ) AS saldo_equival_out
                               FROM
                                   ibs.accounts@iabs ac
                               WHERE
                                       code_coa LIKE('175%')
                                 AND ac.condition IN('A', 'C', 'T')
                           )
                   )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                        SELECT
                            SUM(saldo_equival_out)
                        FROM
                            (
                                SELECT
                                    (
                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_equival_out
                                        FROM
                                            ibs.saldo@iabs sl
                                        WHERE
                                                sl.account_code = ac.code
                                          AND sl.oper_day <= oper_day_l
                                          AND ROWNUM = 1
                                    ) AS saldo_equival_out
                                FROM
                                    ibs.accounts@iabs ac
                                WHERE
                                        code_coa LIKE('1%')
                                  AND code_currency = '000'
                                  AND ac.condition IN('A', 'C', 'T')
                            )
                    ) -(
                        SELECT
                            SUM(saldo_equival_out)
                        FROM
                            (
                                SELECT
                                    (
                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_equival_out
                                        FROM
                                            ibs.saldo@iabs sl
                                        WHERE
                                                sl.account_code = ac.code
                                          AND sl.oper_day <= oper_day_l
                                          AND ROWNUM = 1
                                    ) AS saldo_equival_out
                                FROM
                                    ibs.accounts@iabs ac
                                WHERE
                                        code_coa LIKE('161%')
                                  AND ac.condition IN('A', 'C', 'T')
                                  AND code_currency = '000'
                            )
                    ) -(
                        SELECT
                            SUM(saldo_equival_out)
                        FROM
                            (
                                SELECT
                                    (
                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               saldo_equival_out
                                        FROM
                                            ibs.saldo@iabs sl
                                        WHERE
                                                sl.account_code = ac.code
                                          AND sl.oper_day <= oper_day_l
                                          AND ROWNUM = 1
                                    ) AS saldo_equival_out
                                FROM
                                    ibs.accounts@iabs ac
                                WHERE
                                        code_coa LIKE('175%')
                                  AND ac.condition IN('A', 'C', 'T')
                                  AND code_currency = '000'
                            )
                    )) / power(10, 8)),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('1%')
                                        AND code_currency = '840'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0) - nvl((
                                       SELECT
                                           SUM(saldo_out)
                                       FROM
                                           (
                                               SELECT
                                                   (
                                                       SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                              saldo_out
                                                       FROM
                                                           ibs.saldo@iabs sl
                                                       WHERE
                                                               sl.account_code = ac.code
                                                         AND sl.oper_day <= oper_day_l
                                                         AND ROWNUM = 1
                                                   ) AS saldo_out
                                               FROM
                                                   ibs.accounts@iabs ac
                                               WHERE
                                                       code_coa LIKE('161%')
                                                 AND ac.condition IN('A', 'C', 'T')
                                                 AND code_currency = '840'
                                           )
                                   ),
                                   0) - nvl((
                                                SELECT
                                                    SUM(saldo_out)
                                                FROM
                                                    (
                                                        SELECT
                                                            (
                                                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                       saldo_out
                                                                FROM
                                                                    ibs.saldo@iabs sl
                                                                WHERE
                                                                        sl.account_code = ac.code
                                                                  AND sl.oper_day <= oper_day_l
                                                                  AND ROWNUM = 1
                                                            ) AS saldo_out
                                                        FROM
                                                            ibs.accounts@iabs ac
                                                        WHERE
                                                                code_coa LIKE('175%')
                                                          AND ac.condition IN('A', 'C', 'T')
                                                          AND code_currency = '840'
                                                    )
                                            ),
                                            0))) / power(10, 8),
                    2) )
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('1%')
                                        AND code_currency = '978'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0) - nvl((
                                       SELECT
                                           SUM(saldo_out)
                                       FROM
                                           (
                                               SELECT
                                                   (
                                                       SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                              saldo_out
                                                       FROM
                                                           ibs.saldo@iabs sl
                                                       WHERE
                                                               sl.account_code = ac.code
                                                         AND sl.oper_day <= oper_day_l
                                                         AND ROWNUM = 1
                                                   ) AS saldo_out
                                               FROM
                                                   ibs.accounts@iabs ac
                                               WHERE
                                                       code_coa LIKE('161%')
                                                 AND ac.condition IN('A', 'C', 'T')
                                                 AND code_currency = '978'
                                           )
                                   ),
                                   0) - nvl((
                                                SELECT
                                                    SUM(saldo_out)
                                                FROM
                                                    (
                                                        SELECT
                                                            (
                                                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                       saldo_out
                                                                FROM
                                                                    ibs.saldo@iabs sl
                                                                WHERE
                                                                        sl.account_code = ac.code
                                                                  AND sl.oper_day <= oper_day_l
                                                                  AND ROWNUM = 1
                                                            ) AS saldo_out
                                                        FROM
                                                            ibs.accounts@iabs ac
                                                        WHERE
                                                                code_coa LIKE('175%')
                                                          AND ac.condition IN('A', 'C', 'T')
                                                          AND code_currency = '978'
                                                    )
                                            ),
                                            0))) / power(10, 8),
                    2) )
        INTO eur_l
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'T_A'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [total_activ] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE demand_deposits(oper_day_l IN DATE) IS
    total              NUMBER := 0;
    national_valute    NUMBER := 0;
    innational_valute  NUMBER := 0;
    usd_l              NUMBER := 0;
    eur_l              NUMBER := 0;
    rate_curs          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);
    --- ROLE- D_D
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'D_D';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;

        ------------------------Итого--------------------------------

        SELECT
            round(((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('202%')
                    )
            )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('202%')
                          AND code_currency = '000'
                    )
            )) / power(10, 8)),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('202%')
                                        AND code_currency = '840'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('202%')
                                        AND code_currency = '978'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO eur_l
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'D_D'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [demand_deposits] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE physical_person(oper_day_l IN DATE) IS
    total              NUMBER := 0;
    national_valute    NUMBER := 0;
    innational_valute  NUMBER := 0;
    usd_l              NUMBER := 0;
    eur_l              NUMBER := 0;
    rate_curs          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);

    --ROLE -P_P
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'P_P';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;
        ------------------------Итого--------------------------------

        SELECT
            round(((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa = '20206'
                    )
            )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa = '20206'
                          AND code_currency = '000'
                    )
            )) / power(10, 8)),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa = '20206'
                                        AND code_currency = '840'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa = '20206'
                                        AND code_currency = '978'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO eur_l
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'P_P'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [physical_person] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE other_customer_deposits(oper_day_l IN DATE) IS
    total              NUMBER := 0;
    national_valute    NUMBER := 0;
    innational_valute  NUMBER := 0;
    usd_l              NUMBER := 0;
    eur_l              NUMBER := 0;
    rate_curs          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);

    -- ROLE='O_C_D'
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'O_C_D';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;

        ------------------------Итого--------------------------------

        SELECT
            round(((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('226%')
                    )
            )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('226%')
                          AND code_currency = '000'
                    )
            )) / power(10, 8)),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('226%')
                                        AND code_currency = '840'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('226%')
                                        AND code_currency = '978'
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO eur_l
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'O_C_D'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [Other_customer_deposits] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE funds_on_pc(oper_day_l IN DATE) IS
    total              NUMBER := 0;
    national_valute    NUMBER := 0;
    innational_valute  NUMBER := 0;
    usd_l              NUMBER := 0;
    eur_l              NUMBER := 0;
    rate_curs          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);

--role='F_PC';

BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'F_PC';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;
        ------------------------Итого--------------------------------

        SELECT
            round((nvl((
                           SELECT
                               SUM(saldo_equival_out)
                           FROM
                               (
                                   SELECT
                                       (
                                           SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                  saldo_equival_out
                                           FROM
                                               ibs.saldo@iabs sl
                                           WHERE
                                                   sl.account_code = ac.code
                                             AND sl.oper_day <= oper_day_l
                                             AND ROWNUM = 1
                                       ) AS saldo_equival_out
                                   FROM
                                       ibs.accounts@iabs ac
                                   WHERE
                                           code_coa = '22617'
                               )
                       ),
                       0) +(nvl((
                                    SELECT
                                        SUM(saldo_equival_out)
                                    FROM
                                        (
                                            SELECT
                                                (
                                                    SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                           saldo_equival_out
                                                    FROM
                                                        ibs.saldo@iabs sl
                                                    WHERE
                                                            sl.account_code = ac.code
                                                      AND sl.oper_day <= oper_day_l
                                                      AND ROWNUM = 1
                                                ) AS saldo_equival_out
                                            FROM
                                                ibs.accounts@iabs ac
                                            WHERE
                                                    code_coa = '22618'
                                        )
                                ),
                                0)) +(nvl((
                                              SELECT
                                                  SUM(saldo_equival_out)
                                              FROM
                                                  (
                                                      SELECT
                                                          (
                                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                     saldo_equival_out
                                                              FROM
                                                                  ibs.saldo@iabs sl
                                                              WHERE
                                                                      sl.account_code = ac.code
                                                                AND sl.oper_day <= oper_day_l
                                                                AND ROWNUM = 1
                                                          ) AS saldo_equival_out
                                                      FROM
                                                          ibs.accounts@iabs ac
                                                      WHERE
                                                              code_coa = '22619'
                                                  )
                                          ),
                                          0)) +(nvl((
                                                        SELECT
                                                            SUM(saldo_equival_out)
                                                        FROM
                                                            (
                                                                SELECT
                                                                    (
                                                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                               saldo_equival_out
                                                                        FROM
                                                                            ibs.saldo@iabs sl
                                                                        WHERE
                                                                                sl.account_code = ac.code
                                                                          AND sl.oper_day <= oper_day_l
                                                                          AND ROWNUM = 1
                                                                    ) AS saldo_equival_out
                                                                FROM
                                                                    ibs.accounts@iabs ac
                                                                WHERE
                                                                        code_coa = '22620'
                                                            )
                                                    ),
                                                    0))) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((nvl((
                           SELECT
                               SUM(saldo_out)
                           FROM
                               (
                                   SELECT
                                       (
                                           SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                  saldo_out
                                           FROM
                                               ibs.saldo@iabs sl
                                           WHERE
                                                   sl.account_code = ac.code
                                             AND sl.oper_day <= oper_day_l
                                             AND ROWNUM = 1
                                       ) AS saldo_out
                                   FROM
                                       ibs.accounts@iabs ac
                                   WHERE
                                           code_coa = '22617'
                                     AND code_currency = '000'
                               )
                       ),
                       0) +(nvl((
                                    SELECT
                                        SUM(saldo_out)
                                    FROM
                                        (
                                            SELECT
                                                (
                                                    SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                           saldo_out
                                                    FROM
                                                        ibs.saldo@iabs sl
                                                    WHERE
                                                            sl.account_code = ac.code
                                                      AND sl.oper_day <= oper_day_l
                                                      AND ROWNUM = 1
                                                ) AS saldo_out
                                            FROM
                                                ibs.accounts@iabs ac
                                            WHERE
                                                    code_coa = '22618'
                                              AND code_currency = '000'
                                        )
                                ),
                                0)) +(nvl((
                                              SELECT
                                                  SUM(saldo_out)
                                              FROM
                                                  (
                                                      SELECT
                                                          (
                                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                     saldo_out
                                                              FROM
                                                                  ibs.saldo@iabs sl
                                                              WHERE
                                                                      sl.account_code = ac.code
                                                                AND sl.oper_day <= oper_day_l
                                                                AND ROWNUM = 1
                                                          ) AS saldo_out
                                                      FROM
                                                          ibs.accounts@iabs ac
                                                      WHERE
                                                              code_coa = '22619'
                                                        AND code_currency = '000'
                                                  )
                                          ),
                                          0)) +(nvl((
                                                        SELECT
                                                            SUM(saldo_out)
                                                        FROM
                                                            (
                                                                SELECT
                                                                    (
                                                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                               saldo_out
                                                                        FROM
                                                                            ibs.saldo@iabs sl
                                                                        WHERE
                                                                                sl.account_code = ac.code
                                                                          AND sl.oper_day <= oper_day_l
                                                                          AND ROWNUM = 1
                                                                    ) AS saldo_out
                                                                FROM
                                                                    ibs.accounts@iabs ac
                                                                WHERE
                                                                        code_coa = '22620'
                                                                  AND code_currency = '000'
                                                            )
                                                    ),
                                                    0))) / power(10, 8),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------

        SELECT
            round((nvl((
                           SELECT
                               SUM(saldo_out)
                           FROM
                               (
                                   SELECT
                                       (
                                           SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                  saldo_out
                                           FROM
                                               ibs.saldo@iabs sl
                                           WHERE
                                                   sl.account_code = ac.code
                                             AND sl.oper_day <= oper_day_l
                                             AND ROWNUM = 1
                                       ) AS saldo_out
                                   FROM
                                       ibs.accounts@iabs ac
                                   WHERE
                                           code_coa = '22617'
                                     AND code_currency = '840'
                               )
                       ),
                       0) +(nvl((
                                    SELECT
                                        SUM(saldo_out)
                                    FROM
                                        (
                                            SELECT
                                                (
                                                    SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                           saldo_out
                                                    FROM
                                                        ibs.saldo@iabs sl
                                                    WHERE
                                                            sl.account_code = ac.code
                                                      AND sl.oper_day <= oper_day_l
                                                      AND ROWNUM = 1
                                                ) AS saldo_out
                                            FROM
                                                ibs.accounts@iabs ac
                                            WHERE
                                                    code_coa = '22618'
                                              AND code_currency = '840'
                                        )
                                ),
                                0)) +(nvl((
                                              SELECT
                                                  SUM(saldo_out)
                                              FROM
                                                  (
                                                      SELECT
                                                          (
                                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                     saldo_out
                                                              FROM
                                                                  ibs.saldo@iabs sl
                                                              WHERE
                                                                      sl.account_code = ac.code
                                                                AND sl.oper_day <= oper_day_l
                                                                AND ROWNUM = 1
                                                          ) AS saldo_out
                                                      FROM
                                                          ibs.accounts@iabs ac
                                                      WHERE
                                                              code_coa = '22619'
                                                        AND code_currency = '840'
                                                  )
                                          ),
                                          0)) +(nvl((
                                                        SELECT
                                                            SUM(saldo_out)
                                                        FROM
                                                            (
                                                                SELECT
                                                                    (
                                                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                               saldo_out
                                                                        FROM
                                                                            ibs.saldo@iabs sl
                                                                        WHERE
                                                                                sl.account_code = ac.code
                                                                          AND sl.oper_day <= oper_day_l
                                                                          AND ROWNUM = 1
                                                                    ) AS saldo_out
                                                                FROM
                                                                    ibs.accounts@iabs ac
                                                                WHERE
                                                                        code_coa = '22620'
                                                                  AND code_currency = '840'
                                                            )
                                                    ),
                                                    0))) / power(10, 8),
                  2)
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------

        SELECT
            round((nvl((
                           SELECT
                               SUM(saldo_out)
                           FROM
                               (
                                   SELECT
                                       (
                                           SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                  saldo_out
                                           FROM
                                               ibs.saldo@iabs sl
                                           WHERE
                                                   sl.account_code = ac.code
                                             AND sl.oper_day <= oper_day_l
                                             AND ROWNUM = 1
                                       ) AS saldo_out
                                   FROM
                                       ibs.accounts@iabs ac
                                   WHERE
                                           code_coa = '22617'
                                     AND code_currency = '978'
                               )
                       ),
                       0) +(nvl((
                                    SELECT
                                        SUM(saldo_out)
                                    FROM
                                        (
                                            SELECT
                                                (
                                                    SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                           saldo_out
                                                    FROM
                                                        ibs.saldo@iabs sl
                                                    WHERE
                                                            sl.account_code = ac.code
                                                      AND sl.oper_day <= oper_day_l
                                                      AND ROWNUM = 1
                                                ) AS saldo_out
                                            FROM
                                                ibs.accounts@iabs ac
                                            WHERE
                                                    code_coa = '22618'
                                              AND code_currency = '978'
                                        )
                                ),
                                0)) +(nvl((
                                              SELECT
                                                  SUM(saldo_out)
                                              FROM
                                                  (
                                                      SELECT
                                                          (
                                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                     saldo_out
                                                              FROM
                                                                  ibs.saldo@iabs sl
                                                              WHERE
                                                                      sl.account_code = ac.code
                                                                AND sl.oper_day <= oper_day_l
                                                                AND ROWNUM = 1
                                                          ) AS saldo_out
                                                      FROM
                                                          ibs.accounts@iabs ac
                                                      WHERE
                                                              code_coa = '22619'
                                                        AND code_currency = '978'
                                                  )
                                          ),
                                          0)) +(nvl((
                                                        SELECT
                                                            SUM(saldo_out)
                                                        FROM
                                                            (
                                                                SELECT
                                                                    (
                                                                        SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                               saldo_out
                                                                        FROM
                                                                            ibs.saldo@iabs sl
                                                                        WHERE
                                                                                sl.account_code = ac.code
                                                                          AND sl.oper_day <= oper_day_l
                                                                          AND ROWNUM = 1
                                                                    ) AS saldo_out
                                                                FROM
                                                                    ibs.accounts@iabs ac
                                                                WHERE
                                                                        code_coa = '22620'
                                                                  AND code_currency = '978'
                                                            )
                                                    ),
                                                    0))) / power(10, 8),
                  2)
        INTO eur_l
        FROM
            dual;

        --DBMS_OUTPUT.PUT_LINE(oper_day_l);
--DBMS_OUTPUT.PUT_LINE(total);
--DBMS_OUTPUT.PUT_LINE(national_valute);
--DBMS_OUTPUT.PUT_LINE(innational_valute);
--DBMS_OUTPUT.PUT_LINE(usd_l);
--DBMS_OUTPUT.PUT_LINE(eur_l);

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'F_PC'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [funds_on_pc] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE other_obligations_liquidity(oper_day_l IN DATE) IS
    total              NUMBER := 0;
    national_valute    NUMBER := 0;
    innational_valute  NUMBER := 0;
    usd_l              NUMBER := 0;
    eur_l              NUMBER := 0;
    rate_curs          NUMBER := 0;
    existing_date      DATE := to_date(sysdate);

    -- ROLE='O_O'
BEGIN

    ----------------select for existing date------------------
    SELECT
        oper_day
    INTO existing_date
    FROM
        liquidity
    WHERE
            oper_day = oper_day_l
      AND role = 'O_O';

    IF ( oper_day_l = existing_date ) THEN
        dbms_output.put_line(existing_date || ' date data already exists!');
        dbms_output.put_line('Insert skipped for: ' || sysdate);
    END IF;

EXCEPTION
    WHEN no_data_found THEN

---- select for curs dollar

        SELECT
            equival
        INTO rate_curs
        FROM
            ibs.s_rate_cur@iabs
        WHERE
                date_cross = oper_day_l
          AND code = 840;

        ------------------------Итого--------------------------------

        SELECT
            round(((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('298%')
                          AND ac.condition IN('A', 'C', 'T')
                    )
            )) / power(10, 8),
                  2)
        INTO total
        FROM
            dual;

--------------Национальная валюта    ---------------------

        SELECT
            round((((
                SELECT
                    SUM(saldo_equival_out)
                FROM
                    (
                        SELECT
                            (
                                SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM
                                    ibs.saldo@iabs sl
                                WHERE
                                        sl.account_code = ac.code
                                  AND sl.oper_day <= oper_day_l
                                  AND ROWNUM = 1
                            ) AS saldo_equival_out
                        FROM
                            ibs.accounts@iabs ac
                        WHERE
                                code_coa LIKE('298%')
                          AND code_currency = '000'
                          AND ac.condition IN('A', 'C', 'T')
                    )
            )) / power(10, 8)),
                  2)
        INTO national_valute
        FROM
            dual;

--------------------------------Иностранном валюте (долл.США)---------
        innational_valute := round((total - national_valute) / rate_curs, 2);
-----------------------Долл. США ----------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('298%')
                                        AND code_currency = '840'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO usd_l
        FROM
            dual;

--------------Евро ---------------------
        SELECT
            ( round(((nvl((
                              SELECT
                                  SUM(saldo_out)
                              FROM
                                  (
                                      SELECT
                                          (
                                              SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     saldo_out
                                              FROM
                                                  ibs.saldo@iabs sl
                                              WHERE
                                                      sl.account_code = ac.code
                                                AND sl.oper_day <= oper_day_l
                                                AND ROWNUM = 1
                                          ) AS saldo_out
                                      FROM
                                          ibs.accounts@iabs ac
                                      WHERE
                                              code_coa LIKE('298%')
                                        AND code_currency = '978'
                                        AND ac.condition IN('A', 'C', 'T')
                                  )
                          ),
                          0))) / power(10, 8),
                    2) )
        INTO eur_l
        FROM
            dual;

        INSERT INTO liquidity (
            oper_day,
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            role
        ) VALUES (
                     oper_day_l,
                     total,
                     national_valute,
                     innational_valute,
                     usd_l,
                     eur_l,
                     'O_O'
                 );

        dbms_output.put_line(oper_day_l || ' date data written in LIQUDITY!');
    WHEN OTHERS THEN
        dbms_output.put_line('Something went wrong with [other_obligations] procedure.');
END;
/

CREATE OR REPLACE PROCEDURE PLACED_ATTRACTED_PAST(
    oper_day_pa IN DATE
) AS
    demand_deps       NUMBER := 0; -- Депозиты до востребования (202)
    saving_deps       NUMBER := 0; -- Сберегательные депозиты (204)
    time_deps         NUMBER := 0; -- Срочные депозиты (206)
    interests_taxes   NUMBER := 0; -- Начисленные проценты и налоги к оплате (224, 225)
    other_client_dep  NUMBER := 0; -- Другие депозиты клиентов (226)
    own_resources     NUMBER := 0; -- Собственные ресурсы (Капитал) (3, 4, 5)
    factoring_leasing NUMBER := 0; -- Факторинг, кредиты и лизинг (111, 119-156)
    litigation_loans  NUMBER := 0; -- Кредиты в судебном разбирательстве (157)
    interest_charges  NUMBER := 0; -- Начисленные проценты (163, 164)
    actives           NUMBER := 0; -- АКТИВЛАР (1)
    requirements      NUMBER := 0; -- МАЖБУРИЯТЛАР (2)
    received_funds    NUMBER := 0; -- Бош банк/филиаллардан олинадиган маблаглар (161)
    payed_funds       NUMBER := 0; -- Бош банк/филиалларга туланадиган маблаглар (222)
    existing_date     DATE   := TO_DATE(SYSDATE);
BEGIN
    SELECT oper_day INTO existing_date FROM PLACED_ATTRACTED WHERE OPER_DAY = oper_day_pa AND ROLE = 'AC';
    IF (oper_day_pa = existing_date) THEN
        DBMS_OUTPUT.PUT_LINE(existing_date || ' date data already exists!');
        DBMS_OUTPUT.PUT_LINE(' Insert skipped for: ' || sysdate);
    END IF;
EXCEPTION
    WHEN no_data_found THEN
        DELETE FROM MATRIX_BSREP WHERE 1 = 1;
        BALANCE_REPORT(oper_day_pa);
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO demand_deps
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '20299A';
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO saving_deps
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '20499A';
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO time_deps
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '20699A';
        SELECT SUM(SUM)
        INTO interests_taxes
        FROM (SELECT ROUND("'00000'" / POWER(10, 3), 2) SUM
              FROM VIEW_BALANCE_REPORT
              WHERE LINE = '22499A'
                 OR LINE = '22599A');
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO other_client_dep
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '22699A';
        SELECT ROUND(NVL(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 5), 0), 2)
        INTO own_resources
        FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                             SALDO_EQUIVAL_OUT
                      FROM ibs.saldo@iabs sl
                      WHERE sl.account_code = ac.code
                        AND sl.OPER_DAY <= oper_day_pa
                        AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
              FROM ibs.accounts@iabs AC
              WHERE CODE_COA LIKE '3%'
                 OR CODE_COA LIKE '4%'
                 OR CODE_COA LIKE '5%');
        SELECT SUM(SUM)
        INTO factoring_leasing
        FROM (SELECT ROUND("'00000'" / POWER(10, 3), 2) SUM
              FROM VIEW_BALANCE_REPORT
              WHERE LINE LIKE '11199A'
                 OR LINE LIKE '11999A'
                 OR LINE LIKE '12199A'
                 OR LINE LIKE '12399A'
                 OR LINE LIKE '12499A'
                 OR LINE LIKE '12599A'
                 OR LINE LIKE '12699A'
                 OR LINE LIKE '12799A'
                 OR LINE LIKE '12899A'
                 OR LINE LIKE '12999A'
                 OR LINE LIKE '13099A'
                 OR LINE LIKE '13199A'
                 OR LINE LIKE '13299A'
                 OR LINE LIKE '13399A'
                 OR LINE LIKE '14399A'
                 OR LINE LIKE '14499A'
                 OR LINE LIKE '14599A'
                 OR LINE LIKE '14799A'
                 OR LINE LIKE '14899A'
                 OR LINE LIKE '14999A'
                 OR LINE LIKE '15099A'
                 OR LINE LIKE '15199A'
                 OR LINE LIKE '15299A'
                 OR LINE LIKE '15399A'
                 OR LINE LIKE '15499A'
                 OR LINE LIKE '15599A'
                 OR LINE LIKE '15699A');
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO litigation_loans
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '15799A';
        SELECT SUM(SUM)
        INTO interest_charges
        FROM (SELECT ROUND("'00000'" / POWER(10, 3), 2) SUM
              FROM VIEW_BALANCE_REPORT
              WHERE LINE = '16399A'
                 OR LINE = '16499A');
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO actives
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '19999B';
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO requirements
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '29999B';
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO received_funds
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '16199A';
        SELECT ROUND("'00000'" / POWER(10, 3), 2)
        INTO payed_funds
        FROM VIEW_BALANCE_REPORT
        WHERE LINE = '22299A';

        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, demand_deps, 'DD', 'Депозиты до востребования');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, saving_deps, 'SD', 'Сберегательные депозиты');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, time_deps, 'TD', 'Срочные депозиты');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, interests_taxes, 'IT', 'Начисленные проценты и налоги к оплате');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, other_client_dep, 'OCD', 'Другие депозиты клиентов');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, own_resources, 'OWR', 'Собственные ресурсы (Капитал)');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, factoring_leasing, 'FL', 'Факторинг, кредиты и лизинг');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, litigation_loans, 'LL', 'Кредиты в судебном разбирательстве');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, interest_charges, 'ICH', 'Начисленные проценты');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, actives, 'AC', 'АКТИВЛАР');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, requirements, 'RQ', 'МАЖБУРИЯТЛАР');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, received_funds, 'RF', 'Бош банк/филиаллардан олинадиган маблаглар');
        INSERT INTO PLACED_ATTRACTED(OPER_DAY, SALDO_EQUIVAL_OUT, ROLE, FUND_NAME)
        VALUES (oper_day_pa, payed_funds, 'PF', 'Бош банк/филиалларга туланадиган маблаглар');
        DELETE FROM MATRIX_BSREP WHERE 1 = 1;
        DBMS_OUTPUT.PUT_LINE(oper_day_pa || ' date data written in placed_attracted! ');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE(' Something went wrong with PLACED_ATTRACTED procedure. ');
END;
/






