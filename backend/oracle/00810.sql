Procedure S0204RB_F
-- Балансовый отчет формы № 0204 в разрезе подразделений
( oCount out number   ,    -- число строк в отчете
oRepId out number,       -- идентификатор сформированного отчета
p_svod     varchar2,      -- 1- в разрезе отделений выбранного филиала
-- 2- по банку
p_filial   varchar2,      --филиал
p_type     varchar2,      --тип отчета
-- 1- в номинале выбранной валюты
-- 2- сумовой эквивалент выбранной валюты
-- 3- консолидированный балансовый отчет
p_val      varchar2,      --тип валюты
-- 000 'сум (для междунар.расчетов)'
-- 643 ........
p_dat      date,          --опер.день
p_zero     varchar2,   --1- показывать все строки
--2- не показывать строки с нулевыми суммами
iHTEX      varchar2  := 'txt'
)
is
version     CONSTANT char(14) := '->>15102012<<-';
begin

delete DWH_COA_CurrDay; Commit;

if p_dat >= setup.OperDay  then Rep_Svbals.pDate_is_CurrDay (p_svod+1, p_filial, '0' ); end if;

if   iHTEX = 'txt' then S0204RB_F_Txt (oCount, oRepId, p_svod, p_filial, p_type, p_val, p_dat, p_zero);
else Rep_Svbals_Cons_Ht.S0204RB_F (oCount, oRepId, p_svod, p_filial, p_type, p_val, p_dat, p_zero, iHTEX);
end if;
DBMS_Session.Free_Unused_User_Memory;
end ;