CREATE TABLE blogful_tag (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL
);

CREATE TABLE blogful_article_tag (
    article_id UUID REFERENCES blogful_article(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blogful_tag(id) ON DELETE RESTRICT,
    PRIMARY KEY (article_id, tag_id)
);
