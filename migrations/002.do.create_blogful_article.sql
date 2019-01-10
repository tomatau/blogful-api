CREATE TABLE blogful_article (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(124) NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT
);
