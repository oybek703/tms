create view LOGS_DASHBOARD as
select log_date
from (
         select log_date, status
         from user_scheduler_job_log
         where job_name = 'DASHBOARD_JOB'
         order by log_date desc)
where status = 'SUCCEEDED'
  and ROWNUM = 1
/

