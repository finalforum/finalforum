delete from principal_session
where  principal_id in (select principal_id from principal_session where session_token = $1)
and    id not in (select id from principal_session where session_token = $1)
