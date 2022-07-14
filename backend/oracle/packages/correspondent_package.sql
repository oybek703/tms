-- CREATE CORRESPONDENT PACKAGE SPECIFICATION
    create or replace package CORRESPONDENT_PACKAGE as
    procedure total_liquidity;
end CORRESPONDENT_PACKAGE;
/
-- CREATE CORRESPONDENT PACKAGE BODY
create or replace package body CORRESPONDENT_PACKAGE is
    procedure TOTAL_LIQUIDITY as
        oper_day_c  DATE := TO_DATE('01.01.2021', 'DD-MM-YYYY');
        uzs_c       NUMBER := 0;
        jpy_c       NUMBER := 0;
        kzt_c       NUMBER := 0;
        rub_c       NUMBER := 0;
        chf_c       NUMBER := 0;
        gbp_c       NUMBER := 0;
        usd_c       NUMBER := 0;
        eur_c       NUMBER := 0;
        existing_date date:=to_date(SYSDATE);
    begin
        SELECT MAX(oper_day) INTO oper_day_c FROM ibs.day_operational@iabs
        WHERE day_status = 1 ORDER BY oper_day DESC;

        SELECT oper_day INTO existing_date FROM correspondent
        WHERE oper_day=oper_day_c;
        IF(oper_day_c=existing_date) THEN
            DBMS_OUTPUT.PUT_LINE(existing_date || ' date data already exists!');
            DBMS_OUTPUT.PUT_LINE('Insert skipped for: ' || sysdate);
        END IF;
    exception
        when no_data_found then
            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '000'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO uzs_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '392'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO jpy_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '398'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO kzt_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '643'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO rub_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '756'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO chf_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '826'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO gbp_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '840'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO usd_c
            FROM
                dual;

            SELECT
                (
                    SELECT
                        ROUND(NVL(SUM(saldo_out), 0) / POWER(10, 8), 2)
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
                                      AND sl.oper_day < oper_day_c
                                      AND ROWNUM = 1
                                ) AS saldo_out
                            FROM
                                ibs.accounts@iabs ac
                            WHERE
                                    code_coa = '29801'
                              AND code_currency = '978'
                              AND ac.condition IN ( 'A', 'C', 'T' )
                        )
                )
            INTO eur_c
            FROM
                dual;

            INSERT INTO correspondent (
                oper_day,
                uzs,
                jpy,
                kzt,
                rub,
                chf,
                gbp,
                usd,
                eur
            ) VALUES (
                         oper_day_c,
                         uzs_c,
                         jpy_c,
                         kzt_c,
                         rub_c,
                         chf_c,
                         gbp_c,
                         usd_c,
                         eur_c
                     );
            DBMS_OUTPUT.PUT_LINE(oper_day_c || ' date data written in correspondent!');
        when others then
            DBMS_OUTPUT.PUT_LINE('Something went wrong with LIQUIDITY procedure.');
    end;
end CORRESPONDENT_PACKAGE;
/
-- WRITE PAST DATA TO CORRESPONDENT
declare
    min_date date:= to_date('01.01.2021', 'DD-MM-YYYY');
    is_oper_day boolean:= false;
begin
    while min_date<sysdate loop
            is_oper_day:= checkOperDay(min_date);
            if(is_oper_day) then
                TOTAL_LIQUIDITY(min_date);
            else
                DBMS_OUTPUT.PUT_LINE(min_date || ' is not operational day!');
            end if;
            min_date:= min_date+1;
        end loop;
end;
/