-- UPDATE LIQUIDITY FOR_CURR COLUMN

declare
    curr_rate number;
    day LIQUIDITY.OPER_DAY%type;
    c_total LIQUIDITY.TOTAL%type;
    nat_val LIQUIDITY.NAT_CURR%type;
    for_val LIQUIDITY.FOR_CURR%type;
    cursor c_liquidity_fpc  is select OPER_DAY, TOTAL, NAT_CURR from LIQUIDITY WHERE ROLE='F_PC';
begin
    open c_liquidity_fpc;
    loop
        fetch c_liquidity_fpc into day, c_total, nat_val;
        exit when c_liquidity_fpc%notfound;
        SELECT equival INTO curr_rate
        FROM (SELECT * FROM IBS.S_RATE_CUR@IABS ORDER BY DATE_CROSS DESC)
        WHERE CODE='840' AND DATE_CROSS<=day AND ROWNUM=1;
        for_val := round((c_total-nat_val)/curr_rate, 2);
        update LIQUIDITY set FOR_CURR=for_val WHERE ROLE='F_PC' AND OPER_DAY=day;
    end loop;
    close c_liquidity_fpc;
end;
/