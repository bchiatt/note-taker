--DROP FUNCTION delete_note(integer);
CREATE OR REPLACE FUNCTION delete_note(nid integer)
RETURNS integer AS $$
DECLARE
BEGIN
  DELETE FROM notes_tags nt
    WHERE nt.note_id = nid;

  DELETE FROM photos p
    WHERE p.note_id = nid;

  DELETE FROM notes n
    WHERE n.id = nid;

  RETURN nid;
END
$$ language plpgsql;

--call this in the model
--input is note id to be removed
--SELECT delete_note(85);
