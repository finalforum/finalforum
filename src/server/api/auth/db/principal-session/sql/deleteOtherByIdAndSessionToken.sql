delete from principal_session
where  id = $1
and    principal_id in (select principal_id from principal_session where session_token = $2)
and    id not in (select id from principal_session where session_token = $2)
