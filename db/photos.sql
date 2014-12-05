create table photos(
  id serial primary key,
  url varchar(255),
  created_at timestamp default now(),
  note_id integer references users(id)
);
