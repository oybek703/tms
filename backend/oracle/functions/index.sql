-- CHECK OPER_DAY FUNCTION
CREATE OR replace FUNCTION checkoperday(selected_date IN DATE)
    RETURN BOOLEAN
    IS
    oper_day DATE;
    CURSOR c_oper_day IS
        SELECT oper_day
        FROM   day_operational;
BEGIN
    OPEN c_oper_day;

    LOOP
        FETCH c_oper_day INTO oper_day;

        exit WHEN oper_day = selected_date;

        RETURN TRUE;
    END LOOP;

    CLOSE c_oper_day;

    RETURN FALSE;
END;
/
-- TOTAL OPER_DAYS
CREATE OR replace FUNCTION totaloperdays
    RETURN NUMBER
    IS
    total NUMBER := 0;
BEGIN
    SELECT count(*)
    INTO   total
    FROM   day_operational;

    RETURN total;
END;
/