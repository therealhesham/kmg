const fs = require('fs');
const fetch = require('node-fetch'); // لو Node.js قبل v18

const API_TOKEN = "hzanISkWJ5tNgYa2fESwe8mv77OFxjUa"; // حط التوكن بتاعك
const BASE_URL = "https://base.alfagolden.com/api/database";

// دالة لجلب كل الجداول
async function fetchAllTables() {
  const res = await fetch(`${BASE_URL}/tables/all-tables/`, {
    headers: { "Authorization": `Token ${API_TOKEN}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// دالة لجلب الحقول لكل جدول
async function fetchFieldsByTable(tableId) {
  const res = await fetch(`${BASE_URL}/fields/table/${tableId}/`, {
    headers: { "Authorization": `Token ${API_TOKEN}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const fields = await res.json();

  // ترتيب الحقول مع روابط الجداول لو في relations
  return fields.map(f => {
    if (f.type === "link_row") {
      return {
        id: f.id,
        name: f.name,
        type: f.type,
        table_id: f.table_id,
        link_to_table_id: f.link_row_table_id,
        link_to_field_id: f.link_row_related_field_id,
        primary_field_of_linked_table: f.link_row_table_primary_field || null,
        multiple_relationships: f.link_row_multiple_relationships
      };
    } else {
      return {
        id: f.id,
        name: f.name,
        type: f.type,
        table_id: f.table_id
      };
    }
  });
}

// دالة رئيسية لجلب كل شيء
async function fetchTablesWithFields() {
  const tables = await fetchAllTables();
  const result = {};

  for (const table of tables) {
    const fields = await fetchFieldsByTable(table.id);
    result[table.name] = {
      tableId: table.id,
      databaseId: table.database_id,
      fields
    };
  }

  return result;
}

// تنفيذ السكربت وحفظ الملف
(async () => {
  try {
    const data = await fetchTablesWithFields();
    const jsonString = JSON.stringify(data, null, 2); // تنسيق جميل

    fs.writeFileSync('tables.txt', jsonString, 'utf8');
    console.log('تم حفظ الجداول والحقول في ملف tables.txt في نفس المسار!');
  } catch (err) {
    console.error("Error:", err);
  }
})();
