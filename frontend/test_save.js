const axios = require('axios');

async function testSave() {
  try {
    const res = await axios.post('http://localhost:3000/api/save-analysis', {
      report: {
        overall_score: 90,
        accessibility_score: 90,
        visual_clarity_score: 90,
        conversion_score: 90,
        strengths: ["a"],
        weaknesses: ["b"],
        recommendations: [
          {
            severity: "Minor",
            impact: "Low",
            category: "Typography",
            description: "Test",
            suggested_fix: "Test",
            marker_x: 0.5,
            marker_y: 0.5
          }
        ]
      },
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    }, {
      // simulate no auth or we'll get 401
    });
    console.log(res.data);
  } catch (err) {
    console.log("Error status:", err.response?.status);
    console.log("Error data:", err.response?.data);
  }
}
testSave();
