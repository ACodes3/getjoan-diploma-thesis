import { Cloud, CloudFog, CloudRain, CloudSnow, Sun } from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { db, onValue, ref } from "./firebase";

function App() {
  const [message, setMessage] = useState("Loading…");
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

  /* Firebase message */
  useEffect(() => {
    const messageRef = ref(db, "message");

    const unsubscribe = onValue(
      messageRef,
      (snapshot) => {
        console.log("Firebase callback fired");
        console.log("Exists:", snapshot.exists());
        console.log("Value:", snapshot.val());

        const value = snapshot.val();

        if (value !== null) {
          setMessage(String(value));
        } else {
          setMessage("NO MESSAGE IN FIREBASE");
        }
      },
      (error) => {
        console.error("Firebase read error:", error);
        setMessage("FIREBASE ERROR");
      }
    );

  return () => unsubscribe();
}, []);

  /* Live clock */
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* Weather */
  useEffect(() => {
    const API_KEY = "aed373fe334de33e80ec4801a72280ad"; // 🔑 replace
    const CITY = "Ljubljana"; // change if needed

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            desc: data.weather[0].description,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.time}>
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div style={styles.date}>
              {time.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {weather && (
            <div style={styles.weather}>
              <div style={styles.weatherIcon}>
                {weather.desc.includes("rain") && <CloudRain size={32} />}
                {weather.desc.includes("cloud") && <Cloud size={32} />}
                {weather.desc.includes("clear") || weather.desc.includes("sunny") && <Sun size={32} />}
                {weather.desc.includes("snow") && <CloudSnow size={32} />}
                {weather.desc.includes("mist") && <CloudFog size={32} />}
              </div>
              {weather.temp}°C<br />
              <span style={{ fontSize: "14px" }}>{weather.desc}</span>
            </div>
          )}
        </div>

        <h1 style={styles.message}>{message}</h1>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    height: "100vh",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1431540015161-0bf868a2d407)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "'Segoe UI', sans-serif",
  } as CSSProperties,
  overlay: {
    height: "100%",
    background: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.35))",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "40px",
    boxSizing: "border-box",
  } as CSSProperties,
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  time: {
    fontSize: "48px",
    fontWeight: 300,
  },
  date: {
    fontSize: "16px",
    opacity: 0.8,
  },
  weather: {
    textAlign: "right",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  weatherIcon: {
    display: "flex",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    fontSize: "64px",
    fontWeight: 600,
    lineHeight: 1.2,
    marginBottom: "200px",
    textShadow: "0 4px 20px rgba(0,0,0,0.6)",
  },
};

export default App;
