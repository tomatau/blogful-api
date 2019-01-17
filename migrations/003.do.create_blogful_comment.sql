-- first relationship is one to many

CREATE TABLE blogful_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    article_id UUID
        REFERENCES blogful_articles ON DELETE CASCADE NOT NULL
);
