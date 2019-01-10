CREATE TABLE blogful_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    screen_name TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);

ALTER TABLE blogful_user
  ADD CONSTRAINT blogful_user_email_uk UNIQUE (email);

ALTER TABLE blogful_article
  ADD COLUMN
    author_id UUID REFERENCES blogful_user ON DELETE SET NULL;

ALTER TABLE blogful_comment
  ADD COLUMN
    user_id UUID REFERENCES blogful_user ON DELETE SET NULL;
