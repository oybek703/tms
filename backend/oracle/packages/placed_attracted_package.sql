CREATE OR REPLACE PACKAGE PLACED_ATTRACTED_PACKAGE AS
    PROCEDURE placed_attracted_funds;
END PLACED_ATTRACTED_PACKAGE;

CREATE OR REPLACE PACKAGE BODY PLACED_ATTRACTED_PACKAGE AS
    PROCEDURE PLACED_ATTRACTED_FUNDS AS
        oper_day_pa       DATE   := TO_DATE('01.01.2021', 'DD-MM-YYYY');
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
        SELECT MAX(oper_day) INTO oper_day_pa FROM ibs.day_operational@iabs WHERE day_status = 1 ORDER BY oper_day DESC;
        SELECT oper_day INTO existing_date FROM PLACED_ATTRACTED WHERE OPER_DAY = oper_day_pa AND ROLE = 'AC';
        IF (oper_day_pa = existing_date) THEN
            DBMS_OUTPUT.PUT_LINE(existing_date || ' date data already exists!');
            DBMS_OUTPUT.PUT_LINE(' Insert skipped for: ' || sysdate);
        END IF;
    EXCEPTION
        WHEN no_data_found THEN
            DELETE FROM MATRIX_BSREP WHERE 1=1;
            BALANCE_REPORT(oper_day_pa);
            SELECT
                ROUND("'00000'"/POWER(10, 3), 2) INTO demand_deps
            FROM VIEW_BALANCE_REPORT WHERE LINE='20299A';
            SELECT
                ROUND("'00000'"/POWER(10, 3), 2) INTO saving_deps
            FROM VIEW_BALANCE_REPORT WHERE LINE='20499A';
            SELECT
                ROUND("'00000'"/POWER(10, 3), 2) INTO time_deps
            FROM VIEW_BALANCE_REPORT WHERE LINE='20699A';
            SELECT SUM(SUM) INTO interests_taxes FROM (SELECT
                                                           ROUND("'00000'"/POWER(10, 3), 2) SUM
                                                       FROM VIEW_BALANCE_REPORT WHERE LINE='22499A' OR LINE='22599A');
            SELECT
                ROUND("'00000'"/POWER(10, 3), 2) INTO other_client_dep
            FROM VIEW_BALANCE_REPORT WHERE LINE='22699A';
            SELECT
                ROUND(NVL(SUM(SALDO_EQUIVAL_OUT)/POWER(10, 5), 0), 2) INTO own_resources
            FROM
                (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                SALDO_EQUIVAL_OUT
                         FROM ibs.saldo@iabs sl
                         WHERE sl.account_code=ac.code
                           AND sl.OPER_DAY <= TO_DATE(oper_day_pa, 'DD-MM-YYYY')
                           AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                 FROM ibs.accounts@iabs AC
                 WHERE CODE_COA LIKE '3%' OR CODE_COA LIKE '4%' OR CODE_COA LIKE '5%');
            SELECT SUM(SUM) INTO factoring_leasing FROM (SELECT
                                                             ROUND("'00000'"/POWER(10, 3), 2) SUM
                                                         FROM VIEW_BALANCE_REPORT WHERE LINE LIKE '11199A'
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
            DELETE FROM MATRIX_BSREP WHERE 1=1;
            DBMS_OUTPUT.PUT_LINE(oper_day_pa || ' date data written in placed_attracted! ');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(' Something went wrong with PLACED_ATTRACTED procedure. ');
    END;
END PLACED_ATTRACTED_PACKAGE;
