const axios = require('axios');
const cheerio = require('cheerio');

exports.getNews = async (req, res) => {
    try {
        const response = await axios.get('https://search.naver.com/search.naver?where=news&query=삼성중공업');
        const $ = cheerio.load(response.data);

        // 필터링할 키워드 목록
        const excludeKeywords = ["주식", "조선주", "테마주", "증권", "주가", "시가", "코스피"];
        
        const news = [];
        $('.news_tit').each((index, element) => {
            const title = $(element).text().trim();
            const link = $(element).attr('href');

            // 키워드 배열에 포함된 단어가 제목에 있는지 확인
            const containsExcludedKeyword = excludeKeywords.some(keyword => title.includes(keyword));

            if (!containsExcludedKeyword) {
                news.push({ title, link });
            }

            if (news.length >= 5) {
                return false; // each 반복문 종료
            }
        });

        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
};
