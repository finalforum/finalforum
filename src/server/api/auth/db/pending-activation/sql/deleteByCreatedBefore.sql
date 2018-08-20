delete from pending_activation
where created < $1
