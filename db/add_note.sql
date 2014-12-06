CREATE or replace FUNCTION add_note (user_id integer, title varchar, body text, tags varchar[], photo_urls varchar[])
RETURNS integer AS $$
declare
  nid integer;
  tagname varchar;
  tid integer;
  photo_url varchar;
begin
  insert into notes (title, body, userId) values (title, body, user_id) returning id into nid;
  CREATE TEMP TABLE tagger ON COMMIT DROP AS SELECT nid, t.id as tid, t.name as tname FROM tags t where t.name = any(names);

  foreach tagname in array tags
  loop
    tid := (select t.tid from tagger t where t.tname = tagname);

    IF tid is null THEN
      insert into tags (name) values (tagname) returning id into tid;
      insert into tagger values (nid, tid, tagname);
    END IF;
  end loop;

  insert into notes_tags select t.nid, t.tid from tagger t;

  foreach photo_url in array photo_urls
  loop
    insert into photos (url, note_id) values (photo_url, nid);
  end loop;

  return nid;
end;
$$ LANGUAGE plpgsql;
