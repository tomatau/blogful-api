BEGIN;

INSERT INTO blogful_tags (
  id,
  text
) VALUES
  (
    'd653b7d9-dfd2-4ddc-8685-427452a2b280',
    'dog'
  ),
  (
    '029372f0-e756-4fa8-8fb2-f79d46b885c9',
    'cat'
  ),
  (
    '1fcb605e-ae8a-4cc9-8237-2aff3013a1fa',
    'tiger'
  ),
  (
    '38df922e-6063-44a7-8b80-d01dc2203666',
    'bat'
  ),
  (
    '3db4262f-230a-458c-8744-5e454b3d346c',
    'hedgehog'
  );

INSERT INTO blogful_articles_tags (
  article_id,
  tag_id
) VALUES
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    'd653b7d9-dfd2-4ddc-8685-427452a2b280'
  ),
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    '3db4262f-230a-458c-8744-5e454b3d346c'
  ),
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    '38df922e-6063-44a7-8b80-d01dc2203666'
  ),
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    '029372f0-e756-4fa8-8fb2-f79d46b885c9'
  ),
  (
    '7b635a3f-ca35-4f46-9cc3-0c30e0ff4e30',
    '029372f0-e756-4fa8-8fb2-f79d46b885c9'
  ),
  (
    '2acbdb56-2889-4589-8f29-39760170cba4',
    'd653b7d9-dfd2-4ddc-8685-427452a2b280'
  ),
  (
    '2acbdb56-2889-4589-8f29-39760170cba4',
    '1fcb605e-ae8a-4cc9-8237-2aff3013a1fa'
  );

COMMIT;
