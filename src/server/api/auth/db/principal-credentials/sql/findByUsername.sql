select pc.*
from   principal_credentials pc
join   principal p on pc.principal_id = c.id
where  p.username = $1
