
CREATE TABLE blogful_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    article_id UUID
        REFERENCES blogful_articles(id)
        ON DELETE CASCADE NOT NULL
);
