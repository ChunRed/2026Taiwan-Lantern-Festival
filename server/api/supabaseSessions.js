const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://qyxjjbabbygzczkqsvua.supabase.co",
  "sb_publishable_O6VYy6woDofyzt6DnmZkgQ_p8lkLwpt"
);

function validateItemsMas(items) {
  if (!Array.isArray(items)) throw new Error("items_mas 必須是 array");
  if (items.length < 9 || items.length > 11) throw new Error("items_mas 長度必須介於 9 到 11 之間");
  if (typeof items[0] !== "string") throw new Error("items_mas[0] 必須是 string");

  for (let i = 1; i < items.length; i++) {
    // 若陣列為 11 筆，則最後一筆一定是 string (uploadName)
    // 若陣列為 10 筆，最後一筆可能是數字 (舊的鹿神) 也可能是 string (uploadName沒鹿神)
    if (i === items.length - 1 && typeof items[i] === "string") {
      continue; // 符合上傳字串的條件
    }
    if (!Number.isInteger(items[i])) {
      throw new Error(`items_mas[${i}] 必須是整數`);
    }
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

async function findSessionByUserId(userId) {
  if (!userId) throw new Error("userId 不可為空");

  // 使用含有運算子 @> 檢查 items_mas 是否包含 userId
  const { data, error } = await supabase
    .from("sessions")
    .select("id, items_mas, created_at, last_event_at")
    .filter('items_mas->>0', 'eq', userId)
    .order('last_event_at', { ascending: false }); // Sort by latest first

  if (error) throw error;

  if (data && data.length > 0) {
    const latestSession = data[0];

    // If duplicates exist, delete them
    if (data.length > 1) {
      const idsToDelete = data.slice(1).map(s => s.id);
      console.log(`Found ${data.length} sessions for user ${userId}. Keeping ${latestSession.id}, deleting: ${idsToDelete.join(', ')}`);

      const { error: deleteError } = await supabase
        .from("sessions")
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error("Failed to delete duplicate sessions:", deleteError);
        // We still return the latest session found, even if cleanup failed
      }
    }

    return latestSession;
  }

  return null;
}

module.exports = {
  createSession,
  readSession,
  updateSession,
  deleteSession,
  findSessionByUserId
};
