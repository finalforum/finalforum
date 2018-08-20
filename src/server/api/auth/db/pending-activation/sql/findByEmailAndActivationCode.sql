select *
from   pending_activation
where  email_address = $1
and    activation_code = $2
