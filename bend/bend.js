const ROUNDABOUT = "https://roundabout.fyi";
const BEND = { lat: 44.0582, lon: -121.3153 };

const endpoints = {
  smoke: `${ROUNDABOUT}/api/v1/smoke-fire`,
  conditions: `${ROUNDABOUT}/api/v1/conditions`,
  fuel: `${ROUNDABOUT}/api/v1/fuel-finder`,
  busyness: `${ROUNDABOUT}/api/v1/bend-busyness`,
  roads: `${ROUNDABOUT}/api/v1/road-work`,
  blotter: `${ROUNDABOUT}/api/v1/bpd-calls/snapshot`,
  permits: `${ROUNDABOUT}/api/v1/permits?tab=biggest-projects&limit=8`,
  restaurants: `${ROUNDABOUT}/api/v1/restaurants/inspections?view=hall-of-shame&limit=6`,
  openings: `${ROUNDABOUT}/api/v1/restaurants/openings?tab=recently-opened&limit=6`,
  contractors: `${ROUNDABOUT}/api/v1/contractors`,
  events: `${ROUNDABOUT}/api/v1/upcoming-events?limit=12`,
  news: `${ROUNDABOUT}/api/v1/local-headlines?limit=8`,
  tourism: `${ROUNDABOUT}/api/v1/tourism`,
  weatherPoint: `https://api.weather.gov/points/${BEND.lat},${BEND.lon}`
};

const data = {};

const sources = [
  ["City of Bend", "Permits, roads", "CB"],
  ["Deschutes County", "Permits, roads", "DC"],
  ["NOAA", "Weather forecasts", "WX"],
  ["ODOT", "Traffic & road conditions", "OR"],
  ["USGS", "River & water levels", "US"],
  ["OR Dept. Forestry", "Fire danger", "ODF"],
  ["Google Popular Times", "Place busyness", "G"],
  ["Local News", "Events & headlines", "N"]
];

document.querySelectorAll("[data-place-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-place-filter]").forEach((item) => item.classList.toggle("active", item === button));
    renderFoodSpots(button.dataset.placeFilter);
  });
});

loadDashboard();

async function loadDashboard() {
  const jobs = Object.entries(endpoints).filter(([key]) => key !== "weatherPoint").map(([key, url]) => (
    fetchJson(url).then((value) => { data[key] = value; }).catch(() => { data[key] = null; })
  ));
  jobs.push(loadWeather());
  await Promise.all(jobs);
  renderAll();
}

async function loadWeather() {
  try {
    const point = await fetchJson(endpoints.weatherPoint);
    const [hourly, forecast] = await Promise.all([
      fetchJson(point.properties.forecastHourly),
      fetchJson(point.properties.forecast)
    ]);
    data.weather = { point, hourly, forecast };
  } catch {
    data.weather = null;
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function renderAll() {
  renderTopMetrics();
  renderBusy();
  renderRightNow();
  renderFoodSpots("food-drink");
  renderSidePanels();
  renderEventsCommunity();
  renderReports();
  renderSources();
}

function renderTopMetrics() {
  const places = realPlaces();
  const average = places.length ? Math.round(avg(places.map((place) => place.display_percent))) : null;
  const busiest = places[0];
  const roads = data.roads?.items || [];
  const events = data.events?.items || [];
  const weather = currentWeather();
  set("overall-activity", average === null ? "No signal" : `${average}%`);
  set("overall-label", activityLabel(average));
  set("busiest-spot", busiest?.name || "No signal");
  set("busiest-label", busiest ? `${busiest.display_percent}% · ${busiest.tier_label || "Popular Times"}` : "Google Popular Times");
  set("traffic-level", roads.length ? `${roads.length} items` : "None");
  set("traffic-detail", roadSummary(roads));
  set("weather-temp", weather ? `${weather.temperature}°F` : "No feed");
  set("weather-short", weather?.shortForecast || "NOAA unavailable");
  set("event-load", events.length ? eventLoad(events.length) : "None");
  set("event-detail", events.length ? `${events.length} upcoming events` : "No events returned");
}

function renderBusy() {
  const places = realPlaces();
  renderActivityChart(places);
  renderBusyRanks(places);
  renderHourBars(places);
}

function renderActivityChart(places) {
  const target = document.querySelector('[data-chart="activity"]');
  if (!target) return;
  const curve = averageCurve(places);
  if (!curve.length) {
    target.innerHTML = `<p class="empty">No busyness curve returned.</p>`;
    return;
  }
  const points = curve.map((value, index) => {
    const x = (index / 23) * 1000;
    const y = 238 - (Math.max(0, Math.min(100, value)) / 100) * 210;
    return `${x},${y}`;
  }).join(" ");
  target.innerHTML = `
    <svg class="sparkline" viewBox="0 0 1000 255" preserveAspectRatio="none" aria-label="Average Bend activity curve">
      <defs>
        <linearGradient id="busyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#55d181" stop-opacity=".38"/>
          <stop offset="1" stop-color="#55d181" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polyline points="${points}" fill="none" stroke="#8be39d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="0,255 ${points} 1000,255" fill="url(#busyFill)"/>
    </svg>
  `;
}

function renderBusyRanks(places) {
  const top = places.slice(0, 5);
  html("busy-ranks", top.map((place, index) => `
    <div class="rank-item">
      <span class="rank-num">${index + 1}</span>
      <span><span class="item-title">${esc(place.name)}</span><span class="item-sub">${esc(title(place.category))}</span></span>
      <span class="item-stat">${place.display_percent}%</span>
    </div>
  `), "No Popular Times locations returned.");
}

function renderHourBars(places) {
  const target = document.querySelector('[data-chart="hours"]');
  if (!target) return;
  const curve = averageCurve(places);
  if (!curve.length) {
    target.innerHTML = `<p class="empty">No hourly curve returned.</p>`;
    return;
  }
  target.innerHTML = curve.map((value, hour) => `
    <div class="hour-row">
      <span>${hourLabel(hour)}</span>
      <span class="hour-bar" style="width:${Math.max(2, value)}%"></span>
      <span>${Math.round(value)}%</span>
    </div>
  `).join("");
}

function renderRightNow() {
  const weather = currentWeather();
  const daily = dailyForecasts();
  const high = daily[0]?.temperature;
  const low = daily[1]?.temperature;
  set("weather-temp-large", weather ? `${weather.temperature}°F` : "No feed");
  set("weather-summary", weather?.shortForecast || "NOAA forecast unavailable");
  set("weather-high-low", high && low ? `H ${high}° · L ${low}°` : "--");
  set("weather-wind", weather?.windSpeed ? `Wind ${weather.windSpeed}` : "--");

  const trail = (data.conditions?.trails || [])[0];
  set("trail-status", trail?.status || trail?.trail_status || "No feed");
  set("trail-summary", trail?.conditions_summary || "No trail condition returned");
  link("trail-report", trail?.source_url);

  const roads = data.roads?.items || [];
  set("road-count", roads.length ? `${roads.length}` : "None");
  set("road-summary", roads[0]?.location_description || "No active road work returned");

  const river = data.conditions?.river?.[0];
  set("river-level", river?.flow_cfs ? `${num(river.flow_cfs)} ft` : "No feed");
  set("river-summary", river ? `${river.flow_cfs} cfs · ${river.status}` : "USGS river feed unavailable");
  link("river-report", river?.source_url);

  const aqi = data.smoke?.aqi_current;
  set("aqi-status", aqi?.aqi_category || "No feed");
  set("aqi-summary", aqi ? `AQI ${aqi.aqi} · ${aqi.sensor_name}` : "Air quality feed unavailable");

  renderSun();
}

function renderSun() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - yearStart) / 86400000);
  const lat = BEND.lat * Math.PI / 180;
  const decl = 23.44 * Math.PI / 180 * Math.sin(2 * Math.PI * (day - 81) / 365);
  const hourAngle = Math.acos(-Math.tan(lat) * Math.tan(decl));
  const daylight = 24 * hourAngle / Math.PI;
  const noon = 12.1;
  const sunrise = noon - daylight / 2;
  const sunset = noon + daylight / 2;
  set("sunset", decimalHour(sunset));
  set("sunrise", `Sunrise ${decimalHour(sunrise)}`);
  set("daylight", `Daylight ${Math.floor(daylight)}h ${Math.round((daylight % 1) * 60)}m`);
}

function renderFoodSpots(filter = "food-drink") {
  const places = (data.busyness?.locations || []).filter((place) => filter === "all" || place.category === filter);
  const sorted = [...places].sort((a, b) => (b.display_percent ?? -1) - (a.display_percent ?? -1));
  html("food-spots", sorted.map((place, index) => {
    const percent = place.display_percent;
    return `
      <div class="spot-item">
        <span class="rank-num">${index + 1}</span>
        <span><span class="item-title">${esc(place.name)}</span><span class="item-sub">${esc(place.is_live ? "Live Google signal" : "Predicted Google curve")}</span></span>
        <span class="spot-meter"><span style="width:${percent ?? 0}%"></span></span>
        <span class="item-stat">${percent === null || percent === undefined ? "No signal" : `${percent}%`}</span>
      </div>
    `;
  }), "No places returned for this category.");
}

function renderSidePanels() {
  const fuel = (data.fuel?.items || []).filter((item) => item.regular !== null && item.regular !== undefined).sort((a, b) => a.regular - b.regular);
  set("fuel-low", fuel[0] ? money(fuel[0].regular) : "No feed");
  set("fuel-range", fuel.length ? `Lowest: ${fuel[0].station_name}` : "No fuel records returned");
  html("fuel", fuel.slice(0, 3).map((item) => small(item.station_name, `${money(item.regular)} regular`)), "No fuel records.");

  const permits = [data.permits?.featured, ...(data.permits?.permits || [])].filter(Boolean);
  set("permit-count", data.permits?.total ?? permits.length);
  set("project-value", permits[0]?.estimated_value ? money(permits[0].estimated_value) : "n/a");
  html("permits-mini", permits.slice(0, 3).map((item) => small(item.permit_type || "Permit", item.work_description)), "No permit records.");

  const snapshot = data.blotter?.snapshot;
  set("call-count", snapshot?.total_calls_interesting ?? "No feed");
  set("inspection-count", data.restaurants?.total ?? (data.restaurants?.inspections || []).length);
  html("records", [
    small("Public safety", snapshot ? `${snapshot.total_calls_raw} raw calls` : "No feed"),
    small("Inspection scores", data.restaurants?.total ? `${data.restaurants.total} records` : "No feed")
  ], "No records returned.");
}

function renderEventsCommunity() {
  const events = data.events?.items || [];
  const today = new Date().toDateString();
  const tonight = events.filter((event) => new Date(event.start_at).toDateString() === today).slice(0, 5);
  html("tonight", tonight.map(eventRow), "No events returned for tonight.");
  html("events", events.slice(0, 5).map(eventRow), "No upcoming events returned.");

  const permits = [data.permits?.featured, ...(data.permits?.permits || [])].filter(Boolean).slice(0, 5);
  html("permits", permits.map((item) => eventLine(formatDate(item.issued_date), item.work_description, item.estimated_value ? money(item.estimated_value) : item.status)), "No permit records.");

  html("openings", (data.openings?.openings || []).slice(0, 5).map((item) => eventLine(formatDate(item.actual_open_date || item.projected_open_date), item.business_name, item.neighborhood || item.status)), "No opening records.");
}

function renderReports() {
  html("roads", (data.roads?.items || []).slice(0, 5).map((item) => `<li>${esc(item.road_name)}: ${esc(item.location_description)}</li>`), "No road feed items.");
  const safety = data.blotter?.snapshot?.top_categories || [];
  html("safety", safety.slice(0, 5).map((item) => `<li>${esc(item.category)}: ${item.count} calls</li>`), "No public safety snapshot.");
  const parks = [...(data.conditions?.trails || []), ...(data.conditions?.reservoirs || [])];
  html("parks", parks.slice(0, 5).map((item) => `<li>${esc(item.asset_name)}: ${esc(item.status || item.trail_status || "Status returned")}</li>`), "No parks or trail records.");
  html("city", [
    ...(data.news?.items || []).slice(0, 2).map((item) => `<li>${esc(item.title)}</li>`),
    ...(data.roads?.items || []).slice(0, 2).map((item) => `<li>${esc(item.road_name)} road item active</li>`)
  ], "No city service items.");
  renderForecast();
}

function renderForecast() {
  const days = dailyForecasts().filter((_, index) => index % 2 === 0).slice(0, 4);
  html("forecast", days.map((day) => `
    <div class="forecast-day">
      <strong>${esc(shortWeekday(day.startTime))}</strong>
      <span>${esc(day.shortForecast)}</span>
      <span>${day.temperature}°${day.temperatureUnit}</span>
    </div>
  `), "NOAA forecast unavailable.");
}

function renderSources() {
  html("sources", sources.map(([name, detail, icon]) => `
    <article class="source-card">
      <span class="source-icon">${esc(icon)}</span>
      <strong>${esc(name)}</strong>
      <span>${esc(detail)}</span>
    </article>
  `), "");
}

function currentWeather() {
  return data.weather?.hourly?.properties?.periods?.[0] || null;
}

function dailyForecasts() {
  return data.weather?.forecast?.properties?.periods || [];
}

function realPlaces() {
  return (data.busyness?.locations || [])
    .filter((place) => place.display_percent !== null && place.display_percent !== undefined)
    .sort((a, b) => b.display_percent - a.display_percent);
}

function averageCurve(places) {
  const curves = places.map((place) => place.hourly_curve).filter((curve) => Array.isArray(curve) && curve.length >= 24);
  if (!curves.length) return [];
  return Array.from({ length: 24 }, (_, hour) => avg(curves.map((curve) => Number(curve[hour]) || 0)));
}

function eventRow(event) {
  return eventLine(timeOnly(event.start_at), event.event_name, event.venue || title(event.category));
}

function eventLine(left, titleText, right) {
  return `
    <div class="event-item">
      <span class="event-time">${esc(left || "--")}</span>
      <span><span class="item-title">${esc(titleText || "Untitled")}</span><span class="item-sub">${esc(right || "")}</span></span>
      <span class="item-stat">★</span>
    </div>
  `;
}

function small(titleText, detail) {
  return `
    <div class="small-item">
      <span></span>
      <span><span class="item-title">${esc(titleText || "Untitled")}</span><span class="item-sub">${esc(detail || "")}</span></span>
      <span></span>
    </div>
  `;
}

function html(name, rows, emptyText) {
  const target = document.querySelector(`[data-list="${name}"], [data-chart="${name}"]`);
  if (!target) return;
  target.innerHTML = rows.length ? rows.join("") : `<p class="empty">${esc(emptyText)}</p>`;
}

function set(field, value) {
  const target = document.querySelector(`[data-field="${field}"]`);
  if (target) target.textContent = value === null || value === undefined || value === "" ? "--" : String(value);
}

function link(name, href) {
  const target = document.querySelector(`[data-link="${name}"]`);
  if (target && href) {
    target.href = href;
    target.target = "_blank";
    target.rel = "noopener noreferrer";
  }
}

function activityLabel(value) {
  if (value === null || value === undefined) return "No signal";
  if (value >= 75) return "Very busy";
  if (value >= 55) return "Busy";
  if (value >= 30) return "Moderate";
  return "Slow";
}

function roadSummary(roads) {
  if (!roads.length) return "No active feed items";
  const severe = roads.filter((item) => /closure|delay/i.test(`${item.severity} ${item.detour_description}`)).length;
  return severe ? `${severe} closure/delay items` : `${roads.length} road items`;
}

function eventLoad(count) {
  if (count >= 9) return "High";
  if (count >= 4) return "Moderate";
  return "Low";
}

function title(value = "") {
  return String(value).replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function money(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: Number(value) >= 1000 ? 0 : 2 })}`;
}

function num(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function avg(values) {
  const real = values.filter((value) => Number.isFinite(value));
  return real.length ? real.reduce((sum, value) => sum + value, 0) / real.length : 0;
}

function hourLabel(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function timeOnly(value) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDate(value) {
  if (!value) return "--";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function shortWeekday(value) {
  if (!value) return "--";
  return new Date(value).toLocaleDateString(undefined, { weekday: "short" });
}

function decimalHour(value) {
  const hour = Math.floor(value);
  const minute = Math.round((value - hour) * 60);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
