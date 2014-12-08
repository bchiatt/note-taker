--DROP FUNCTION find_all_notes_by_user(integer,integer,character varying);
CREATE OR REPLACE FUNCTION find_all_notes_by_user(user_id integer, lmt integer, ofst integer, tg varchar)
RETURNS TABLE("noteId" integer, "title" varchar, "body" text, "updatedAt" timestamp, "tags" varchar[]) AS $$
DECLARE
BEGIN
  CREATE TEMP TABLE tags_by_note ON COMMIT DROP AS
    SELECT n.id AS nid, array_agg(t.name) AS tags
    FROM notes n
    LEFT OUTER JOIN notes_tags nt ON n.id = nt.note_id
    LEFT OUTER JOIN tags t ON nt.tag_id = t.id
    WHERE n.userid = user_id and t.name like tg
    GROUP BY n.id
    ORDER BY n.updated_at DESC
    OFFSET ofst
    LIMIT lmt;

  RETURN QUERY
    SELECT n.id AS "noteId",n.title,n.body,n.updated_at AS "updatedAt",tg.tags
    FROM notes n
    INNER JOIN tags_by_note tg ON n.id = tg.nid;

END;
$$ LANGUAGE plpgsql;

-- This is the query to call in the model
-- find_all_notes_by_user(userId,limit)
-- SELECT * FROM find_all_notes_by_user(1, 10);

/*
-- chyld's code
select n.id, n.title, n.body, array_agg(t.id) as tagIds, array_agg(t.name) as tags
from notes n
inner join notes_tags nt on n.id = nt.note_id
inner join tags t on t.id = nt.tag_id
where n.userid = 8
group by n.id
order by n.title asc
limit 3
offset 0; --offset 3 goes to page 2, offset 6 goes to page 3, etc.
*/
