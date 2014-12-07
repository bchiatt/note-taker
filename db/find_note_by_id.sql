--DROP FUNCTION find_note_by_id(integer);
CREATE OR REPLACE FUNCTION find_note_by_id(nid integer)
RETURNS TABLE("noteId" integer, "title" varchar, "body" text, "updatedAt" timestamp, "photoId" integer[], "photos" varchar[], "tagIds" integer[], "tags" varchar[]) AS $$
DECLARE
BEGIN

  create temp table note_with_tags on commit drop as
    select n.id as noteId, n.title, n.body, n.updated_at as updatedAt, array_agg(t.id) as tagIds, array_agg(t.name) as tags
    from notes n
    inner join notes_tags nt on n.id = nt.note_id
    inner join tags t on t.id = nt.tag_id
    inner join photos p on n.id = p.note_id
    where n.id = nid
    group by n.id
    limit 1;

  return query
    select p.note_id as noteId, nwt.title, nwt.body, nwt.updatedAt, array_agg(p.id) as photoId, array_agg(p.url) as photos, nwt.tagIds, nwt.tags
    from photos p
    inner join note_with_tags nwt on nwt.noteId = p.note_id
    where p.note_id = nid
    group by p.note_id, nwt.title, nwt.body, nwt.updatedAt, nwt.tagIds, nwt.tags;

END;
$$ LANGUAGE plpgsql;

--select * from find_note_by_id(90);
