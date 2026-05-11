export default async function handler(req, res) {
  // Bật CORS để frontend của bạn ở domain khác có thể gọi được API này
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Danh sách các giải đấu bạn muốn lấy dữ liệu ("full" các giải phổ biến)
  const leagues = [
    { id: 'nba', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
    { id: 'epl', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard' },
    { id: 'laliga', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard' },
    { id: 'nfl', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' },
    // Bạn có thể copy paste thêm các giải khác vào đây...
  ];

  try {
    // Gọi tất cả các API cùng một lúc để tối ưu tốc độ
    const fetchPromises = leagues.map(league => 
      fetch(league.url)
        .then(response => {
          if (!response.ok) throw new Error(`Lỗi khi gọi giải ${league.id}`);
          return response.json();
        })
        .then(data => ({ id: league.id, status: 'success', data }))
        .catch(error => ({ id: league.id, status: 'error', message: error.message }))
    );

    const results = await Promise.allSettled(fetchPromises);

    // Xử lý dữ liệu trả về
    const combinedData = results.map(result => result.value);

    // Trả về JSON tổng hợp
    res.status(200).json({
      timestamp: new Date().toISOString(),
      total_leagues: leagues.length,
      results: combinedData
    });

  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tổng hợp dữ liệu.' });
  }
}
