select pc.*
from   principal_credentials pc
join   principal_session ps on pc.principal_id = ps.principal_id
where  ps.session_token = $1;
