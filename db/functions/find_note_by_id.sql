--DROP FUNCTION find_note_by_id(integer);
CREATE OR REPLACE FUNCTION find_note_by_id(nid integer)
RETURNS TABLE("noteId" integer, "title" varchar, "body" text, "updatedAt" timestamp, "photoId" integer[], "photos" varchar[], "tagIds" integer[], "tags" varchar[]) AS $$
DECLARE
BEGIN

  return query
    select n.id as noteId, n.title, n.body, n.updated_at as updatedAt, array_agg(distinct p.id) as photoId, array_agg(distinct p.url) as photos, array_agg(distinct t.id) as tagIds, array_agg(distinct t.name) as tags
    from notes n
    inner join notes_tags nt on n.id = nt.note_id
    inner join tags t on t.id = nt.tag_id
    left join photos p on n.id = p.note_id
    where n.id = nid
    group by n.id
    limit 1;


END;
$$ LANGUAGE plpgsql;

--select * from find_note_by_id(93);
