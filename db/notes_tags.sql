create table notes_tags(
  note_id integer references not null notes(id),
  tag_id integer references not null tags(id)
);
