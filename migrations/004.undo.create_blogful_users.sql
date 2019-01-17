
ALTER TABLE blogful_articles DROP COLUMN IF EXISTS author_id;
ALTER TABLE blogful_comments DROP COLUMN IF EXISTS user_id;
DROP TABLE IF EXISTS blogful_users;
