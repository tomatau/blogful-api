CREATE TABLE blogful_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    screen_name TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);

ALTER TABLE blogful_users
  ADD CONSTRAINT blogful_users_email_uk UNIQUE (email);

ALTER TABLE blogful_articles
  ADD COLUMN
    author_id UUID REFERENCES blogful_users ON DELETE SET NULL;

ALTER TABLE blogful_comments
  ADD COLUMN
    user_id UUID REFERENCES blogful_users ON DELETE SET NULL;
