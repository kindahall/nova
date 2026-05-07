"use client";

import { CloudRain, CloudSun, Droplets, MapPin, RefreshCw, SunMedium, ThermometerSun, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type WeatherWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
};

function localPlace() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
  return zone.split("/").at(-1)?.replaceAll("_", " ") || "Local";
}

function weatherFor(date: Date) {
  const hour = date.getHours();
  const daySeed = date.getDate() % 5;
  const celsius = 15 + daySeed + (hour > 11 && hour < 18 ? 4 : hour < 7 ? -2 : 1);
  const wind = 8 + ((hour + daySeed) % 7);
  const rain = (hour + daySeed) % 4 === 0 ? 38 : 12 + daySeed * 4;
  const condition = rain > 30 ? "Light rain nearby" : hour > 19 || hour < 7 ? "Clear evening" : "Partly sunny";

  return { celsius, wind, rain, condition };
}

function toFahrenheit(celsius: number) {
  return Math.round(celsius * 1.8 + 32);
}

export function WeatherWindow({ system, systemActions, onClose, onMinimize, onFocus }: WeatherWindowProps) {
  const [now, setNow] = useState(() => new Date());
  const [unit, setUnit] = useState<"C" | "F">("C");
  const forecast = useMemo(() => weatherFor(now), [now]);
  const temp = unit === "C" ? forecast.celsius : toFahrenheit(forecast.celsius);
  const place = localPlace();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  function refresh() {
    setNow(new Date());
    systemActions.recordCommand("Refresh local weather", `Weather refreshed for ${place}.`);
  }

  return (
    <WindowFrame
      title="Weather"
      subtitle="Local conditions"
      icon={<CloudSun size={18} />}
      className="window--weather"
      tone="dark"
      windowKey="weather"
      windowSize={system.windowSizes.weather}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("weather", size)}
    >
      <div className="weather-layout">
        <section className="weather-hero">
          <span className="weather-icon-cloud">
            {forecast.rain > 30 ? <CloudRain size={46} /> : <SunMedium size={46} />}
          </span>
          <div>
            <span className="weather-location">
              <MapPin size={15} />
              {place}
            </span>
            <strong>{temp}°{unit}</strong>
            <p>{forecast.condition}</p>
          </div>
          <div className="weather-actions">
            <button className="compact-button" type="button" onClick={() => setUnit(unit === "C" ? "F" : "C")}>
              °{unit === "C" ? "F" : "C"}
            </button>
            <button className="compact-button" type="button" onClick={refresh}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </section>

        <div className="weather-grid">
          <div className="glass-card">
            <ThermometerSun size={19} />
            <h3>Feels like</h3>
            <div className="metric">{unit === "C" ? forecast.celsius + 1 : toFahrenheit(forecast.celsius + 1)}°</div>
          </div>
          <div className="glass-card">
            <Wind size={19} />
            <h3>Wind</h3>
            <div className="metric">{forecast.wind}</div>
            <p>km/h</p>
          </div>
          <div className="glass-card">
            <Droplets size={19} />
            <h3>Rain chance</h3>
            <div className="metric">{forecast.rain}%</div>
          </div>
        </div>

        <div className="weather-forecast">
          {["Now", "+2h", "+4h", "+6h", "Tonight"].map((label, index) => {
            const nextTemp = forecast.celsius + (index === 0 ? 0 : index - 2);
            return (
              <span key={label}>
                <small>{label}</small>
                <CloudSun size={17} />
                <strong>{unit === "C" ? nextTemp : toFahrenheit(nextTemp)}°</strong>
              </span>
            );
          })}
        </div>
      </div>
    </WindowFrame>
  );
}
