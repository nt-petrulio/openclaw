export async function getNotionTasks() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = '519c4ea61b2d49fe8c94f571729fc245';
  
  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 10,
        sorts: [{ property: 'Priority', direction: 'ascending' }],
      }),
    });
    const data = await res.json();
    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title[0]?.plain_text || 'Untitled',
      status: page.properties.Status?.select?.name || 'No Status',
      priority: page.properties.Priority?.select?.name || 'P4',
    }));
  } catch (e) {
    console.error('Notion fetch error', e);
    return [];
  }
}
