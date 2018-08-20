select p.*
from   principal p
join   principal_session ps on p.id = ps.principal_id
where  ps.session_token = $1
