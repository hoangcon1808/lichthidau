export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // DANH SÁCH FULL CÁC GIẢI ĐẤU LỚN
  const leagues = [
    // --- Bóng đá ---
    { id: 'EPL', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard' }, // Ngoại hạng Anh
    { id: 'LaLiga', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard' }, // Tây Ban Nha
    { id: 'SerieA', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard' }, // Ý
    { id: 'Bundesliga', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/ger.1/scoreboard' }, // Đức
    { id: 'Ligue1', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard' }, // Pháp
    { id: 'ChampionsLeague', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard' }, // Cúp C1
    
    // --- Thể thao Mỹ ---
    { id: 'NBA', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' }, // Bóng rổ
    { id: 'NFL', url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard' }, // Bóng bầu dục
    { id: 'MLB', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' }, // Bóng chày
    { id: 'NHL', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' } // Khúc côn cầu
  ];

  try {
    const fetchPromises = leagues.map(league => 
      fetch(league.url)
        .then(response => {
          if (!response.ok) throw new Error(`Lỗi API`);
          return response.json();
        })
        .then(data => ({ id: league.id, status: 'success', data }))
        .catch(error => ({ id: league.id, status: 'error', message: error.message }))
    );

    const results = await Promise.allSettled(fetchPromises);
    const combinedData = results.map(result => result.value);

    res.status(200).json({
      timestamp: new Date().toISOString(),
      results: combinedData
    });

  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
}
