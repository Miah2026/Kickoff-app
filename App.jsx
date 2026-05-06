import { useState } from "react";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Striker", "Any"];
const LEVELS = ["Beginner", "Casual", "Intermediate", "Competitive"];
const FORMATS = ["5-a-side", "7-a-side", "11-a-side"];

const initialGames = [
  {
    id: 1,
    title: "Lunchtime Kickabout",
    format: "5-a-side",
    location: "Powerleague, Old Street",
    date: "2026-05-07",
    time: "12:30",
    totalSlots: 10,
    players: [
      { name: "Marcus T.", position: "Striker", level: "Casual" },
      { name: "Dev P.", position: "Goalkeeper", level: "Intermediate" },
      { name: "Liam O.", position: "Midfielder", level: "Casual" },
    ],
    host: "Marcus T.",
    notes: "Bibs provided. Bring water.",
  },
  {
    id: 2,
    title: "Evening 7s",
    format: "7-a-side",
    location: "Goals Soccer, Wembley",
    date: "2026-05-08",
    time: "19:00",
    totalSlots: 14,
    players: [
      { name: "Jamie R.", position: "Defender", level: "Intermediate" },
      { name: "Sam K.", position: "Midfielder", level: "Competitive" },
    ],
    host: "Jamie R.",
    notes: "Competitive but friendly. All welcome.",
  },
  {
    id: 3,
    title: "Weekend Warriors 11s",
    format: "11-a-side",
    location: "Hackney Marshes, Pitch 4",
    date: "2026-05-10",
    time: "10:00",
    totalSlots: 22,
    players: [
      { name: "Tobi A.", position: "Goalkeeper", level: "Casual" },
      { name: "Ben S.", position: "Striker", level: "Casual" },
      { name: "Noah W.", position: "Defender", level: "Beginner" },
      { name: "Elias M.", position: "Midfielder", level: "Intermediate" },
      { name: "Kyle J.", position: "Midfielder", level: "Casual" },
    ],
    host: "Tobi A.",
    notes: "Bring your own boots. Muddy pitch likely!",
  },
];

const formatColors = {
  "5-a-side": "#00e676",
  "7-a-side": "#29b6f6",
  "11-a-side": "#ff7043",
};

export default function App() {
  const [screen, setScreen] = useState("home"); // home | profile | create | browse | game
  const [profile, setProfile] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: "", position: "Any", level: "Casual" });
  const [games, setGames] = useState(initialGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGame, setNewGame] = useState({
    title: "", format: "5-a-side", location: "", date: "", time: "", notes: "",
  });
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function saveProfile() {
    if (!profileDraft.name.trim()) return showToast("Please enter your name.");
    setProfile(profileDraft);
    showToast("Profile saved! Welcome, " + profileDraft.name + " 🎉");
    setScreen("browse");
  }

  function createGame() {
    if (!newGame.title || !newGame.location || !newGame.date || !newGame.time) {
      return showToast("Please fill in all fields.");
    }
    if (!profile) return showToast("Set up your profile first!");
    const slots = newGame.format === "5-a-side" ? 10 : newGame.format === "7-a-side" ? 14 : 22;
    const game = {
      id: Date.now(),
      ...newGame,
      totalSlots: slots,
      players: [{ name: profile.name, position: profile.position, level: profile.level }],
      host: profile.name,
    };
    setGames([game, ...games]);
    setNewGame({ title: "", format: "5-a-side", location: "", date: "", time: "", notes: "" });
    showToast("Game created! 🏟️");
    setScreen("browse");
  }

  function joinGame(game) {
    if (!profile) return showToast("Set up your profile first!");
    if (game.players.find(p => p.name === profile.name)) return showToast("You're already in this game.");
    if (game.players.length >= game.totalSlots) return showToast("This game is full.");
    const updated = games.map(g =>
      g.id === game.id ? { ...g, players: [...g.players, { name: profile.name, position: profile.position, level: profile.level }] } : g
    );
    setGames(updated);
    setSelectedGame(updated.find(g => g.id === game.id));
    showToast("You joined the game! ⚽");
  }

  const spotsLeft = (g) => g.totalSlots - g.players.length;

  return (
    <div style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#fff", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .body-font { font-family: 'DM Sans', sans-serif; }
        input, textarea, select {
          font-family: 'DM Sans', sans-serif;
          background: #16161f;
          border: 1.5px solid #2a2a3a;
          color: #fff;
          border-radius: 10px;
          padding: 12px 14px;
          width: 100%;
          font-size: 15px;
          outline: none;
          transition: border 0.2s;
        }
        input:focus, textarea:focus, select:focus { border-color: #00e676; }
        select option { background: #16161f; }
        .btn {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1.5px;
          font-size: 17px;
          border: none;
          border-radius: 10px;
          padding: 13px 28px;
          cursor: pointer;
          transition: transform 0.1s, opacity 0.2s;
        }
        .btn:active { transform: scale(0.97); }
        .btn-green { background: #00e676; color: #0a0a0f; }
        .btn-outline { background: transparent; border: 1.5px solid #2a2a3a; color: #aaa; }
        .btn-outline:hover { border-color: #555; color: #fff; }
        .card {
          background: #13131c;
          border: 1px solid #1e1e2e;
          border-radius: 16px;
          padding: 20px;
          transition: border-color 0.2s, transform 0.15s;
        }
        .card:hover { border-color: #333; transform: translateY(-2px); }
        .pill {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .nav-tab {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #555;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 16px;
          transition: color 0.2s;
        }
        .nav-tab.active { color: #00e676; }
        .nav-tab span { font-size: 20px; }
        .progress-bar { background: #1e1e2e; border-radius: 99px; height: 6px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 99px; transition: width 0.4s; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 4px; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="body-font" style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#00e676", color: "#0a0a0f", padding: "12px 22px", borderRadius: 12, fontWeight: 600, zIndex: 999, fontSize: 14, whiteSpace: "nowrap", boxShadow: "0 8px 32px rgba(0,230,118,0.3)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "24px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>⚽ KICKOFF</div>
          <div className="body-font" style={{ fontSize: 12, color: "#555", marginTop: 2 }}>Find your game</div>
        </div>
        {profile && (
          <button onClick={() => setScreen("profile")} style={{ background: "#16161f", border: "1.5px solid #2a2a3a", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#fff", textAlign: "left" }}>
            <div style={{ fontSize: 11, fontFamily: "'DM Sans',sans-serif", color: "#555" }}>Playing as</div>
            <div className="body-font" style={{ fontSize: 13, fontWeight: 600 }}>{profile.name}</div>
          </button>
        )}
      </div>

      {/* Screens */}
      <div style={{ padding: "20px 20px 100px", maxWidth: 480, margin: "0 auto" }}>

        {/* HOME */}
        {screen === "home" && (
          <div>
            <div style={{ marginTop: 32, marginBottom: 40 }}>
              <div style={{ fontSize: 52, lineHeight: 1, letterSpacing: 1 }}>FIND YOUR<br /><span style={{ color: "#00e676" }}>NEXT GAME.</span></div>
              <div className="body-font" style={{ marginTop: 12, color: "#888", fontSize: 15, lineHeight: 1.6 }}>Join open football sessions near you. No team needed — just show up and play.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-green" style={{ fontSize: 20, padding: "16px" }} onClick={() => setScreen("profile")}>Set Up My Profile</button>
              <button className="btn btn-outline" onClick={() => setScreen("browse")}>Browse Games</button>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {["5-a-side", "7-a-side", "11-a-side"].map(f => (
                <div key={f} style={{ flex: 1, background: "#13131c", border: "1px solid #1e1e2e", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{f === "5-a-side" ? "🥅" : f === "7-a-side" ? "⚡" : "🏟️"}</div>
                  <div className="body-font" style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen === "profile" && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 4 }}>MY PROFILE</div>
            <div className="body-font" style={{ color: "#555", fontSize: 13, marginBottom: 28 }}>Tell us about yourself so we can match you to the right games.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Your Name</label>
                <input placeholder="e.g. Jamie R." value={profileDraft.name} onChange={e => setProfileDraft({ ...profileDraft, name: e.target.value })} />
              </div>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Preferred Position</label>
                <select value={profileDraft.position} onChange={e => setProfileDraft({ ...profileDraft, position: e.target.value })}>
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Skill Level</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {LEVELS.map(l => (
                    <button key={l} className="body-font" onClick={() => setProfileDraft({ ...profileDraft, level: l })} style={{ padding: "12px", borderRadius: 10, border: `1.5px solid ${profileDraft.level === l ? "#00e676" : "#2a2a3a"}`, background: profileDraft.level === l ? "rgba(0,230,118,0.08)" : "#16161f", color: profileDraft.level === l ? "#00e676" : "#aaa", cursor: "pointer", fontWeight: 500, fontSize: 14 }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-green" style={{ marginTop: 8 }} onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
        )}

        {/* BROWSE */}
        {screen === "browse" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36 }}>OPEN GAMES</div>
              <button className="btn btn-green" style={{ fontSize: 14, padding: "10px 16px" }} onClick={() => setScreen("create")}>+ Create</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {games.map(game => {
                const spots = spotsLeft(game);
                const pct = (game.players.length / game.totalSlots) * 100;
                const fmtColor = formatColors[game.format];
                const isJoined = profile && game.players.find(p => p.name === profile.name);
                return (
                  <div key={game.id} className="card" style={{ cursor: "pointer" }} onClick={() => { setSelectedGame(game); setScreen("game"); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="body-font" style={{ fontWeight: 600, fontSize: 16 }}>{game.title}</div>
                        <div className="body-font" style={{ fontSize: 13, color: "#666", marginTop: 2 }}>📍 {game.location}</div>
                      </div>
                      <span className="pill" style={{ background: fmtColor + "22", color: fmtColor }}>{game.format}</span>
                    </div>
                    <div className="body-font" style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, color: "#888" }}>
                      <span>📅 {new Date(game.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                      <span>🕐 {game.time}</span>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span className="body-font" style={{ fontSize: 12, color: "#555" }}>{game.players.length} / {game.totalSlots} players</span>
                        <span className="body-font" style={{ fontSize: 12, color: spots === 0 ? "#ff5252" : spots <= 2 ? "#ffab40" : "#00e676" }}>
                          {spots === 0 ? "FULL" : `${spots} spots left`}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: pct + "%", background: spots === 0 ? "#ff5252" : fmtColor }} />
                      </div>
                    </div>
                    {isJoined && <div className="body-font" style={{ marginTop: 10, fontSize: 12, color: "#00e676", fontWeight: 600 }}>✓ You're in this game</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CREATE GAME */}
        {screen === "create" && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 4 }}>CREATE GAME</div>
            <div className="body-font" style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>Set up your session and let others join.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Game Title</label>
                <input placeholder="e.g. Tuesday Night Kickabout" value={newGame.title} onChange={e => setNewGame({ ...newGame, title: e.target.value })} />
              </div>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Format</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {FORMATS.map(f => (
                    <button key={f} className="body-font" onClick={() => setNewGame({ ...newGame, format: f })} style={{ flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${newGame.format === f ? formatColors[f] : "#2a2a3a"}`, background: newGame.format === f ? formatColors[f] + "15" : "#16161f", color: newGame.format === f ? formatColors[f] : "#aaa", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Location</label>
                <input placeholder="e.g. Powerleague, Shoreditch" value={newGame.location} onChange={e => setNewGame({ ...newGame, location: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Date</label>
                  <input type="date" value={newGame.date} onChange={e => setNewGame({ ...newGame, date: e.target.value })} />
                </div>
                <div>
                  <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Time</label>
                  <input type="time" value={newGame.time} onChange={e => setNewGame({ ...newGame, time: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="body-font" style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Notes (optional)</label>
                <textarea placeholder="e.g. Bibs provided, bring water..." rows={3} value={newGame.notes} onChange={e => setNewGame({ ...newGame, notes: e.target.value })} style={{ resize: "none" }} />
              </div>
              <button className="btn btn-green" style={{ marginTop: 4 }} onClick={createGame}>Create Game</button>
            </div>
          </div>
        )}

        {/* GAME DETAIL */}
        {screen === "game" && selectedGame && (() => {
          const game = games.find(g => g.id === selectedGame.id) || selectedGame;
          const spots = spotsLeft(game);
          const fmtColor = formatColors[game.format];
          const isJoined = profile && game.players.find(p => p.name === profile.name);
          return (
            <div>
              <button className="body-font" onClick={() => setScreen("browse")} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 20 }}>← Back to games</button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 36, lineHeight: 1.1 }}>{game.title.toUpperCase()}</div>
                <span className="pill" style={{ background: fmtColor + "22", color: fmtColor, marginTop: 4 }}>{game.format}</span>
              </div>
              <div className="body-font" style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: "#888", fontSize: 14 }}>📍 {game.location}</div>
                <div style={{ color: "#888", fontSize: 14 }}>📅 {new Date(game.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {game.time}</div>
                <div style={{ color: "#888", fontSize: 14 }}>👤 Hosted by {game.host}</div>
                {game.notes && <div style={{ color: "#666", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>"{game.notes}"</div>}
              </div>

              {/* Fill bar */}
              <div style={{ marginTop: 20, background: "#13131c", borderRadius: 14, padding: 16, border: "1px solid #1e1e2e" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="body-font" style={{ fontWeight: 600, fontSize: 15 }}>{game.players.length} / {game.totalSlots} players</span>
                  <span className="body-font" style={{ fontSize: 13, color: spots === 0 ? "#ff5252" : spots <= 2 ? "#ffab40" : "#00e676" }}>
                    {spots === 0 ? "FULL" : `${spots} spots left`}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${(game.players.length / game.totalSlots) * 100}%`, background: fmtColor }} />
                </div>
              </div>

              {/* Players */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 22, marginBottom: 12 }}>SQUAD</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {game.players.map((p, i) => (
                    <div key={i} className="body-font" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#13131c", borderRadius: 10, padding: "12px 14px", border: "1px solid #1e1e2e" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: fmtColor + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: fmtColor }}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name} {p.name === game.host ? <span style={{ fontSize: 11, color: "#555" }}>(host)</span> : ""}</div>
                          <div style={{ fontSize: 12, color: "#555" }}>{p.position}</div>
                        </div>
                      </div>
                      <span className="pill" style={{ background: "#1e1e2e", color: "#888" }}>{p.level}</span>
                    </div>
                  ))}
                  {/* Empty slots */}
                  {spots > 0 && Array.from({ length: Math.min(spots, 3) }).map((_, i) => (
                    <div key={"empty-" + i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0f0f18", borderRadius: 10, padding: "12px 14px", border: "1px dashed #1e1e2e" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a1a24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#333" }}>+</div>
                      <span className="body-font" style={{ fontSize: 13, color: "#333" }}>Open spot</span>
                    </div>
                  ))}
                  {spots > 3 && <div className="body-font" style={{ fontSize: 12, color: "#333", textAlign: "center", padding: "8px" }}>+ {spots - 3} more open spots</div>}
                </div>
              </div>

              {/* Join button */}
              {!isJoined && spots > 0 && (
                <button className="btn btn-green" style={{ width: "100%", marginTop: 24, fontSize: 20, padding: "16px" }} onClick={() => joinGame(game)}>
                  Join This Game ⚽
                </button>
              )}
              {isJoined && (
                <div style={{ marginTop: 24, background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                  <div className="body-font" style={{ color: "#00e676", fontWeight: 600 }}>✓ You're in this game!</div>
                  <div className="body-font" style={{ fontSize: 13, color: "#555", marginTop: 4 }}>See you on the pitch.</div>
                </div>
              )}
              {spots === 0 && !isJoined && (
                <div style={{ marginTop: 24, background: "#1a1015", border: "1px solid #3a1a1a", borderRadius: 14, padding: "16px", textAlign: "center" }}>
                  <div className="body-font" style={{ color: "#ff5252", fontWeight: 600 }}>Game is full</div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0d0d15", borderTop: "1px solid #1a1a28", display: "flex", justifyContent: "space-around", padding: "6px 0 12px" }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "browse", icon: "🔍", label: "Games" },
          { id: "create", icon: "➕", label: "Create" },
          { id: "profile", icon: "👤", label: "Profile" },
        ].map(tab => (
          <button key={tab.id} className={`nav-tab ${screen === tab.id ? "active" : ""}`} onClick={() => setScreen(tab.id)}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
