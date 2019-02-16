CREATE TABLE blogful_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);

ALTER TABLE blogful_articles
  ADD COLUMN
    author_id UUID REFERENCES blogful_users(id)
    ON DELETE SET NULL;

ALTER TABLE blogful_comments
  ADD COLUMN
    user_id UUID REFERENCES blogful_users(id)
    ON DELETE SET NULL;
