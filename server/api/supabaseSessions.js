const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://qyxjjbabbygzczkqsvua.supabase.co",
  "sb_publishable_O6VYy6woDofyzt6DnmZkgQ_p8lkLwpt"
);

function validateItemsMas(items) {
  if (!Array.isArray(items)) throw new Error("items_mas 必須是 array");
  if (items.length !== 9) throw new Error("items_mas 長度必須為 9");
  if (typeof items[0] !== "string") throw new Error("items_mas[0] 必須是 string");
  for (let i = 1; i < 9; i++) {
    if (!Number.isInteger(items[i])) throw new Error(`items_mas[${i}] 必須是整數`);
  }
}

async function createSession(items_mas) {
  validateItemsMas(items_mas);

  const { data, error } = await supabase
    .from("sessions")
    .insert([{ items_mas, last_event_at: new Date() }])
    .select("id, items_mas, created_at, last_event_at")
    .single();

  if (error) throw error;
  return data;
}

async function readSession(id) {
  if (!id) throw new Error("id 不可為空");

  const { data, error } = await supabase
    .from("sessions")
    .select("id, items_mas, created_at, last_event_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

async function updateSession(id, items_mas) {
  if (!id) throw new Error("id 不可為空");
  validateItemsMas(items_mas);

  const { data, error } = await supabase
    .from("sessions")
    .update({ items_mas, last_event_at: new Date() })
    .eq("id", id)
    .select("id, items_mas, created_at, last_event_at")
    .single();

  if (error) throw error;
  return data;
}

async function deleteSession(id) {
  if (!id) throw new Error("id 不可為空");

  const { data, error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id)
    .select("id, items_mas, created_at, last_event_at")
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  createSession,
  readSession,
  updateSession,
  deleteSession
};
