BEGIN;

INSERT INTO blogful_users (
  id,
  full_name,
  user_name,
  password
) VALUES
  (
    'cea84d59-d294-42a2-b7f7-1cea369366ed',
    'Tom HT',
    'tomht',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  ),
  (
    'fcdab65c-d063-45d4-8277-fff9c0230a88',
    'Bodeep Deboop',
    'b.deboop',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  ),
  (
    'f19d7725-c447-42d0-8b81-f41a16a97c34',
    'Charlie Bloggs',
    'c.bloggs',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  ),
  (
    '5b6620d4-1475-4f4a-b8dc-d1fa4c41023d',
    'Sam Smith',
    's.smith',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  ),
  (
    '821a24ae-40ad-4f04-ad46-efbb5322a1bb',
    'Alex Taylor',
    'lexlor',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  ),
  (
    '2ad8f2bc-23db-4ace-aa9d-4da4844da0f8',
    'Ping Won In',
    'wippy',
    '$2y$10$52jpI2sWVniQeZbdIl43rOuuMpQ5sl6hmBDrTZNo0xW/1SnrXIk.u'
  );

INSERT INTO blogful_articles (
  id,
  title,
  style,
  content,
  author_id
) VALUES
  (
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    'First post with an author',
    'Interview',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, ut atque. Minima beatae ipsa ratione. Dolorem suscipit ullam temporibus repellendus quae atque expedita architecto corrupti doloremque ducimus eaque, eum ipsum!',
    'fcdab65c-d063-45d4-8277-fff9c0230a88'
  ),
  (
    '7b635a3f-ca35-4f46-9cc3-0c30e0ff4e30',
    'Second post with an author',
    'News',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam minus esse, dolorum vitae neque ullam adipisci consequatur doloremque autem rerum doloribus officiis exercitationem culpa, temporibus eligendi, assumenda ex. Cupiditate, sequi.',
    '5b6620d4-1475-4f4a-b8dc-d1fa4c41023d'
  ),
  (
    '2acbdb56-2889-4589-8f29-39760170cba4',
    'Third post with an author',
    'How-to',
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut et, eum id distinctio vel sint nulla dolorum vero perspiciatis debitis repudiandae officiis nostrum illo adipisci minus placeat in error. Voluptatum.',
    'f19d7725-c447-42d0-8b81-f41a16a97c34'
  );


INSERT INTO blogful_comments (
  id,
  text,
  article_id,
  user_id
) VALUES
  (
    'fabb14e1-2ac2-4c9c-8330-453fdb57ca02',
    'Comment with a user',
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    'fcdab65c-d063-45d4-8277-fff9c0230a88'
  ),
  (
    '032e0655-3e0b-4469-bc43-b4e860baa0e1',
    'Another comment from a user',
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    'f19d7725-c447-42d0-8b81-f41a16a97c34'
  ),
  (
    '269bb863-ad3b-4f9a-a6f0-22a7b426ffff',
    'Users comment',
    '7b635a3f-ca35-4f46-9cc3-0c30e0ff4e30',
    'fcdab65c-d063-45d4-8277-fff9c0230a88'
  ),
  (
    '6f49cc70-e24d-422b-8385-e8d46c071d97',
    'More comments by a user',
    'a7f400c6-8c29-46d0-b755-6239507df45e',
    '821a24ae-40ad-4f04-ad46-efbb5322a1bb'
  ),
  (
    '826801e3-e062-4e3f-b602-976aaf49ad74',
    'Commentable comment from user',
    '7b635a3f-ca35-4f46-9cc3-0c30e0ff4e30',
    'f19d7725-c447-42d0-8b81-f41a16a97c34'
  );

COMMIT;
