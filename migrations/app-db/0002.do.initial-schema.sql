-- Auth tables

create table principal
(
    id            bigserial   primary key,
    username      text        unique not null, -- required upon activation
    email_address text        unique not null, -- cannot update if there's no principal_credentials
    active        boolean     not null,        -- true: not deleted. false: deleted. nothing to do with activation.
    created       timestamptz not null
);

-- Principal's login credentials if the principal is activated
create table principal_credentials
(
    id            bigserial   primary key,
    principal_id  bigint      unique not null references principal,
    password_hash text        not null,
    created       timestamptz not null
);

-- Can be multiple per principal, which can happen if email is slow/unreliable.
create table pending_activation
(
    id              bigserial   primary key,
    principal_id    bigint      not null references principal,
    activation_code text        unique not null,
    created         timestamptz not null
);

-- Can be multiple per principal, which can happen if email is slow/unreliable.
create table pending_reset
(
    id           bigserial   primary key,
    principal_id bigint      not null references principal,
    reset_code   text        unique not null,
    created      timestamptz not null
);

create table principal_session
(
    id             bigserial   primary key,
    principal_id   bigint      not null references principal,
    session_token  text        not null,
    user_agent     text        not null,
    created        timestamptz not null
);
