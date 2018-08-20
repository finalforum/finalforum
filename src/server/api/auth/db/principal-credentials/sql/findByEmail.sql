select pc.*
from   principal_credentials pc
join   principal p on pc.principal_id = c.id
where  p.email_address = $1
