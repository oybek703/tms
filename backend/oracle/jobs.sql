-- CORR_TL_PAST
declare
    min_date date:= to_date('01.01.2021', 'DD-MM-YYYY');
    is_oper_day boolean:= false;
begin
    while min_date<sysdate loop
            is_oper_day:= checkOperDay(min_date);
            if(is_oper_day) then
                TOTAL_LIQUIDITY(min_date);
                HAND_CASH(min_date);
                ROAD_CASH(min_date);
            else
                DBMS_OUTPUT.PUT_LINE(min_date || ' is not operational day!');
            end if;
            min_date:= min_date+1;
        end loop;
end;

-- LIQUIDITY_JOB_PAST
DECLARE
    min_date     DATE := TO_DATE('01.01.2020', 'DD-MM-YYYY');
    is_oper_day  BOOLEAN := false;
BEGIN
    WHILE min_date < sysdate LOOP
            is_oper_day := checkoperday(min_date);
            IF ( is_oper_day ) THEN
                TOTAL_ACTIVE(min_date);
                DEMAND_DEPOSITS(min_date);
                PHYSICAL_PERSON(min_date);
                OTHER_CUSTOMER_DEPOSITS(min_date);
                FUNDS_ON_PC(min_date);
                OTHER_OBLIGATIONS_LIQUIDITY(min_date);
            ELSE
                dbms_output.put_line(min_date || ' is not operational day!');
            END IF;

            min_date := min_date + 1;
        END LOOP;
END;

-- MAIN_INDICATORS_JOB_PAST
DECLARE
    min_date     DATE := TO_DATE('01.01.2020', 'DD-MM-YYYY');
    is_oper_day  BOOLEAN := false;
BEGIN
    WHILE min_date < sysdate LOOP
            is_oper_day := checkoperday(min_date);
            IF ( is_oper_day ) THEN
                loan_portfolio(min_date);
                potential_loss_reserves(min_date);
                accrued_interest_receivable(min_date);
                other_assets(min_date);
                total_assets(min_date);
                commitment_to_customers(min_date);
                demand_deposits_legal_entities(min_date);
                accrued_interest_payable(min_date);
                other_financial_liabilities(min_date);
                other_obligations(min_date);
                total_liabilities(min_date);
                current_profit(min_date);
                total_capital(min_date);
            ELSE
                dbms_output.put_line(min_date || ' is not operational day!');
            END IF;

            min_date := min_date + 1;
        END LOOP;
END;

