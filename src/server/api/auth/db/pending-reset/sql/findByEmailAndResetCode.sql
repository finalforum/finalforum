select *
from   pending_reset
where  email_address = $1
and    reset_code = $2
