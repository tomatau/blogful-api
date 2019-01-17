CREATE TABLE blogful_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL
);

CREATE TABLE blogful_articles_tags (
    article_id UUID REFERENCES blogful_articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blogful_tags(id) ON DELETE RESTRICT,
    PRIMARY KEY (article_id, tag_id)
);
