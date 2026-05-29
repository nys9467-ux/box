import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

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
