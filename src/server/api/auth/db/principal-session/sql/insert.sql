insert into principal_session
(
    principal_id,
    session_token,
    user_agent,
    created
)
values
(
    $1,
    $2,
    $3,
    current_timestamp
)
returning id
