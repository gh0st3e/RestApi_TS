CREATE TABLE IF NOT EXISTS users
(
    email text COLLATE pg_catalog."default" NOT NULL,
    "firstName" text COLLATE pg_catalog."default",
    "lastName" text COLLATE pg_catalog."default",
    image text COLLATE pg_catalog."default",
    pdf bytea,
    CONSTRAINT user_pkey PRIMARY KEY (email)
)