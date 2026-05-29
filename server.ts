import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API middleware
  app.use(express.json());

  // API routes FIRST
  app.get("/api/boxoffice", async (req, res) => {
    try {
      const { date } = req.query;
      if (!date || typeof date !== "string" || !/^\d{8}$/.test(date)) {
        return res.status(400).json({ 
          error: "올바른 날짜 형식이 아닙니다. (예: YYYYMMDD)" 
        });
      }

      const apiKey = process.env.KOBIS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "서버에 KOBIS API Key가 설정되지 않았습니다. .env 파일을 구성해주세요." 
        });
      }

      const url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${apiKey}&targetDt=${date}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API returned status ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching daily box office:", error);
      res.status(500).json({ error: error.message || "박스오피스 데이터를 가져오는데 실패했습니다." });
    }
  });

  app.get("/api/movie", async (req, res) => {
    try {
      const { movieCd } = req.query;
      if (!movieCd || typeof movieCd !== "string") {
        return res.status(400).json({ error: "movieCd 파라미터가 필요합니다." });
      }

      const apiKey = process.env.KOBIS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "서버에 KOBIS API Key가 설정되지 않았습니다. .env 파일을 구성해주세요." 
        });
      }

      const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${apiKey}&movieCd=${movieCd}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API returned status ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching movie info:", error);
      res.status(500).json({ error: error.message || "영화 상세 정보를 가져오는데 실패했습니다." });
    }
  });

  app.post("/api/review", async (req, res) => {
    try {
      const { movieNm, keywords, genres, directors } = req.body;
      if (!movieNm) {
        return res.status(400).json({ error: "영화 제목(movieNm)이 필요합니다." });
      }
      if (!keywords || !Array.isArray(keywords) || keywords.length < 3) {
        return res.status(400).json({ error: "감상평을 만드려면 3개의 키워드가 모두 입력되어야 합니다." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API Key가 설정되지 않았습니다. AI 기능을 사용하려면 Settings > Secrets에 GEMINI_API_KEY를 추가하거나, 임시로 설정해주세요."
        });
      }

      // Initialize GoogleGenAI SDK as per guidelines
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `영화 제목: "${movieNm}"
장르: ${genres || "미지정"}
감독: ${directors || "미지정"}
사용할 필수 키워드 3개: [${keywords.join(", ")}]

위 영화 정보를 바탕으로, 지정한 3개의 키워드([${keywords.join(", ")}])를 자연스럽게 포함하여 정성스럽고 몰입감 넘치는 영화 감상평을 작성해주세요.
- 감상평은 약 4~5개의 문장(200~300자 내외)으로 아주 자연스럽고 가독성 좋게 한국어로 작성해주세요.
- 지정한 3개의 키워드를 감상평 텍스트 안에 있는 그대로 꼭 포함(글자 변형 없이 정확하게 매칭되도록)해주세요!
- 영화 분위기에 어울리는 어조로 작성해주시며, 마지막에 추천 멘트와 별점(★5개 만점 기준)도 포함해주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ review: response.text });
    } catch (err: any) {
      console.error("Error generating review:", err);
      res.status(500).json({ error: err.message || "감상평 매끄럽게 작성하기에 실패했습니다." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
