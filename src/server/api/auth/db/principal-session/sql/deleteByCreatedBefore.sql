delete from pending_reset
where created < $1
