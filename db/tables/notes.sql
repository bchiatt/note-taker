create table notes(
  id serial primary key,
  title varchar(255),
  body text,
  updated_at timestamp default now(),
  created_at timestamp default now(),
  userId integer references users(id)
);
