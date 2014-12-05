CREATE or replace FUNCTION add_note (user_id integer, title varchar, body text, tags varchar)
RETURNS integer AS $$
declare
  nid integer;
  names varchar[];
  tagname varchar;
  tid integer;
begin
  insert into notes (title, body, userId) values (title, body, user_id) returning id into nid;
  select string_to_array(tags, ',') into names;
  raise notice 'nid: %', nid;
  raise notice 'names: %', names;
  CREATE TEMP TABLE tagger ON COMMIT DROP AS SELECT nid, t.id as tid, t.name as tname FROM tags t where t.name = any(names);

  foreach tagname in array names
  loop
    tid := (select t.tid from tagger t where t.tname = tagname);
    raise notice 'tid: %', tid;

    IF tid is null THEN
      insert into tags (name) values (tagname) returning id into tid;
      insert into tagger values (nid, tid, tagname);
    END IF;
  end loop;

  insert into notes_tags select t.nid, t.tid from tagger t;
  return nid;
end;
$$ LANGUAGE plpgsql;
