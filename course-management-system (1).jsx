import { useState, useEffect, useContext, createContext, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── CONTEXT ───────────────────────────────────────────────────────────────
const AppContext = createContext(null);

const USERS_KEY = "ocms_users";
const AUTH_KEY = "ocms_auth";

const seedUsers = [
  { id: "u1", name: "Alice Johnson", email: "alice@demo.com", password: "demo123", role: "student", avatar: "AJ", bio: "Passionate learner", joinDate: "2024-01-15", enrolledCourses: ["c1","c3"] },
  { id: "u2", name: "Prof. Mark Davis", email: "mark@demo.com", password: "demo123", role: "instructor", avatar: "MD", bio: "10 years teaching CS", joinDate: "2023-06-10", courses: ["c1","c2"] },
  { id: "u3", name: "Sarah Kim", email: "sarah@demo.com", password: "demo123", role: "student", avatar: "SK", bio: "Frontend enthusiast", joinDate: "2024-03-20", enrolledCourses: ["c1","c2"] },
  { id: "u4", name: "Admin User", email: "admin@demo.com", password: "demo123", role: "admin", avatar: "AU", bio: "Platform administrator", joinDate: "2023-01-01", enrolledCourses: [] },
  { id: "u5", name: "Dr. Priya Sharma", email: "priya@demo.com", password: "demo123", role: "instructor", avatar: "PS", bio: "AI/ML researcher", joinDate: "2023-08-05", courses: ["c3","c4"] },
];

const seedCourses = [
  { id: "c1", title: "Complete React & TypeScript Masterclass", instructor: "Prof. Mark Davis", instructorId: "u2", category: "Web Development", level: "Intermediate", price: 89, free: false, rating: 4.8, students: 3420, duration: "42h", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80", description: "Master React 18 with TypeScript, Hooks, Context API, and modern patterns. Build real-world projects.", tags: ["React","TypeScript","Hooks"], approved: true, syllabus: ["Introduction to React","Components & Props","State & Lifecycle","Hooks Deep Dive","TypeScript Integration","Advanced Patterns","Final Project"], videos: 64, progress: { u1: 65, u3: 30 } },
  { id: "c2", title: "Node.js & Express REST API Development", instructor: "Prof. Mark Davis", instructorId: "u2", category: "Backend", level: "Intermediate", price: 79, free: false, rating: 4.7, students: 2180, duration: "35h", thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", description: "Build scalable REST APIs with Node.js, Express, MongoDB, and JWT authentication.", tags: ["Node.js","Express","MongoDB"], approved: true, syllabus: ["Node.js Fundamentals","Express Framework","RESTful Design","MongoDB & Mongoose","Authentication","Testing","Deployment"], videos: 52, progress: { u3: 80 } },
  { id: "c3", title: "Machine Learning with Python & TensorFlow", instructor: "Dr. Priya Sharma", instructorId: "u5", category: "AI & ML", level: "Advanced", price: 0, free: true, rating: 4.9, students: 5670, duration: "58h", thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80", description: "Comprehensive ML course covering supervised/unsupervised learning, neural networks, and deployment.", tags: ["Python","TensorFlow","ML"], approved: true, syllabus: ["ML Fundamentals","Python for Data Science","Supervised Learning","Neural Networks","Deep Learning","Model Deployment","Capstone"], videos: 88, progress: { u1: 20 } },
  { id: "c4", title: "Deep Learning & Computer Vision", instructor: "Dr. Priya Sharma", instructorId: "u5", category: "AI & ML", level: "Advanced", price: 129, free: false, rating: 4.6, students: 1890, duration: "48h", thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80", description: "Advanced deep learning techniques for computer vision, object detection, and image segmentation.", tags: ["PyTorch","CNN","Vision"], approved: true, syllabus: ["CNN Architecture","Transfer Learning","Object Detection","Image Segmentation","GANs","Production Deployment"], videos: 72, progress: {} },
  { id: "c5", title: "UI/UX Design Fundamentals", instructor: "Prof. Mark Davis", instructorId: "u2", category: "Design", level: "Beginner", price: 49, free: false, rating: 4.5, students: 2890, duration: "28h", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", description: "Learn Figma, design principles, user research, prototyping, and create stunning interfaces.", tags: ["Figma","UX","Design"], approved: false, syllabus: ["Design Basics","Color Theory","Typography","Figma Mastery","Prototyping","User Testing"], videos: 40, progress: {} },
];

const testimonials = [
  { name: "Ravi Patel", role: "Software Engineer at Google", text: "This platform transformed my career. The React course was exactly what I needed to land my dream job at Google.", avatar: "RP" },
  { name: "Meera Nair", role: "ML Engineer at Amazon", text: "Dr. Priya's ML course is phenomenal. Clear explanations, real projects, and amazing support.", avatar: "MN" },
  { name: "James Chen", role: "Full Stack Developer", text: "Best investment I made. The instructors are world-class and the content is always up-to-date.", avatar: "JC" },
];

const CATEGORIES = ["All","Web Development","Backend","AI & ML","Design","Data Science","Mobile"];
const LEVELS = ["All","Beginner","Intermediate","Advanced"];

// ─── HELPERS ───────────────────────────────────────────────────────────────
const getUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || seedUsers; } catch { return seedUsers; } };
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const getCourses = () => { try { const s = JSON.parse(localStorage.getItem("ocms_courses")); return s || seedCourses; } catch { return seedCourses; } };
const saveCourses = (c) => localStorage.setItem("ocms_courses", JSON.stringify(c));
const getAuth = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } };
const saveAuth = (u) => localStorage.setItem(AUTH_KEY, JSON.stringify(u));
const clearAuth = () => localStorage.removeItem(AUTH_KEY);

// ─── STYLES ────────────────────────────────────────────────────────────────
const G = {
  primary: "#6C47FF",
  secondary: "#00C9A7",
  accent: "#FF6B6B",
  dark: "#0F0F1A",
  darker: "#080811",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
  text: "#F0EFF5",
  muted: "#8B8A9B",
  gold: "#FFB800",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Sora',sans-serif;background:${G.darker};color:${G.text};min-height:100vh}
  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0F0F1A}::-webkit-scrollbar-thumb{background:#6C47FF44;border-radius:3px}
  a{color:inherit;text-decoration:none}
  input,select,textarea{font-family:'Sora',sans-serif}
  button{font-family:'Sora',sans-serif;cursor:pointer}
  .fade-in{animation:fadeIn 0.5s ease forwards}
  .slide-up{animation:slideUp 0.5s ease forwards}
  .pulse{animation:pulse 2s infinite}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  .float{animation:float 4s ease-in-out infinite}
  .gradient-text{background:linear-gradient(135deg,#6C47FF,#00C9A7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .btn-primary{background:linear-gradient(135deg,#6C47FF,#8B6AFF);color:#fff;border:none;padding:12px 28px;border-radius:12px;font-weight:600;font-size:14px;transition:all 0.3s;cursor:pointer}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(108,71,255,0.4)}
  .btn-secondary{background:transparent;color:${G.text};border:1.5px solid rgba(255,255,255,0.15);padding:12px 28px;border-radius:12px;font-weight:500;font-size:14px;transition:all 0.3s;cursor:pointer}
  .btn-secondary:hover{border-color:#6C47FF;background:rgba(108,71,255,0.1)}
  .card-glass{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;backdrop-filter:blur(10px)}
  .hover-lift{transition:transform 0.3s,box-shadow 0.3s}
  .hover-lift:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.3)}
  .tag{background:rgba(108,71,255,0.15);color:#A78BFF;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500}
  .badge-free{background:rgba(0,201,167,0.15);color:#00C9A7;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600}
  .badge-paid{background:rgba(255,184,0,0.15);color:#FFB800;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600}
  .progress-bar{background:rgba(255,255,255,0.08);border-radius:999px;height:6px;overflow:hidden}
  .progress-fill{background:linear-gradient(90deg,#6C47FF,#00C9A7);border-radius:999px;height:100%;transition:width 0.8s ease}
  .star{color:#FFB800;font-size:13px}
  .nav-link{padding:8px 16px;border-radius:8px;font-size:14px;font-weight:500;transition:all 0.2s;color:${G.muted}}
  .nav-link:hover,.nav-link.active{color:${G.text};background:rgba(255,255,255,0.06)}
  .input-field{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 16px;color:${G.text};font-size:14px;width:100%;outline:none;transition:border 0.2s}
  .input-field:focus{border-color:#6C47FF}
  .input-field::placeholder{color:${G.muted}}
  .sidebar-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:14px;font-weight:500;transition:all 0.2s;color:${G.muted};cursor:pointer}
  .sidebar-link:hover,.sidebar-link.active{color:${G.text};background:rgba(108,71,255,0.15)}
  .sidebar-link.active{border-left:3px solid #6C47FF}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
  .modal-box{background:#161625;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:32px;max-width:520px;width:90%;max-height:85vh;overflow-y:auto}
  .table-row{border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s}
  .table-row:hover{background:rgba(255,255,255,0.03)}
  .chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
  .chip-success{background:rgba(0,201,167,0.15);color:#00C9A7}
  .chip-warning{background:rgba(255,184,0,0.15);color:#FFB800}
  .chip-danger{background:rgba(255,107,107,0.15);color:#FF6B6B}
  .chip-info{background:rgba(108,71,255,0.15);color:#A78BFF}
  @media(max-width:768px){.hide-mobile{display:none!important}.mobile-full{width:100%!important}}
`;

// ─── ICONS ─────────────────────────────────────────────────────────────────
const Icon = ({ n, s = 18, c = "currentColor" }) => {
  const icons = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    book: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 11a4 4 0 100-8 4 4 0 000 8z",
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    chart: "M18 20V10 M12 20V4 M6 20v-6",
    play: "M5 3l14 9-14 9V3z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14 M5 12h14",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    award: "M12 15l-7.5 4.5 2-8.5L1 6.5l8.7-.7L12 -1l2.3 6.8 8.7.7-5.5 4.5 2 8.5z",
    video: "M23 7l-7 5 7 5V7z M1 5h15a2 2 0 012 2v10a2 2 0 01-2 2H1V5z",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    x: "M18 6L6 18 M6 6l12 12",
    chevronRight: "M9 18l6-6-6-6",
    mail: "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 6l-10 7L2 6",
    globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    sun: "M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
    menu: "M3 12h18 M3 6h18 M3 18h18",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
    trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[n] || "").split(" M").map((p, i) => <path key={i} d={i === 0 ? p : "M" + p} />)}
    </svg>
  );
};

const Avatar = ({ name, size = 38, bg = G.primary }) => {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${bg}, #8B6AFF)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Stars = ({ r = 5 }) => (
  <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(r) ? G.gold : "#333", fontSize: 13 }}>★</span>)}
    <span style={{ color: G.muted, fontSize: 12, marginLeft: 4 }}>{r.toFixed(1)}</span>
  </span>
);

// ─── NAVBAR ────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = () => { clearAuth(); setUser(null); setPage("home"); };
  const links = [
    { label: "Home", id: "home" },
    { label: "Courses", id: "courses" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,8,17,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6C47FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="book" s={18} c="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            <span style={{ color: "#6C47FF" }}>Learn</span>
            <span style={{ color: G.text }}>Flow</span>
          </span>
        </div>
        <div className="hide-mobile" style={{ display: "flex", gap: 4 }}>
          {links.map(l => (
            <button key={l.id} className={`nav-link${page === l.id ? " active" : ""}`} onClick={() => setPage(l.id)} style={{ background: "none", border: "none" }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={() => setPage("dashboard")}>
                Dashboard
              </button>
              <div onClick={() => setPage("profile")} style={{ cursor: "pointer" }}>
                <Avatar name={user.name} size={36} />
              </div>
              <button onClick={logout} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer" }}>
                <Icon n="logout" s={18} />
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => setPage("login")}>Login</button>
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => setPage("register")}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── HOMEPAGE ──────────────────────────────────────────────────────────────
const HomePage = ({ setPage, courses }) => {
  const stats = [
    { v: "50K+", l: "Students" }, { v: "200+", l: "Courses" },
    { v: "95%", l: "Success Rate" }, { v: "4.9★", l: "Avg Rating" },
  ];
  const features = [
    { icon: "video", title: "HD Video Lessons", desc: "Stream high-quality lectures from world-class instructors" },
    { icon: "file", title: "Downloadable Notes", desc: "Access PDFs, notes and resources anytime, offline" },
    { icon: "award", title: "Certificates", desc: "Earn recognized certificates upon course completion" },
    { icon: "users", title: "Community", desc: "Join discussion forums and collaborate with peers" },
    { icon: "chart", title: "Progress Tracking", desc: "Visual dashboards to track your learning journey" },
    { icon: "shield", title: "Lifetime Access", desc: "Purchase once, access your courses forever" },
  ];
  const featured = courses.filter(c => c.approved).slice(0, 3);
  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "80px 24px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(108,71,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(0,201,167,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,71,255,0.08) 0%, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div className="slide-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(108,71,255,0.1)", border: "1px solid rgba(108,71,255,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00C9A7", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, color: "#A78BFF" }}>The future of online learning is here</span>
            </div>
            <h1 style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
              Learn Without<br />
              <span className="gradient-text">Limits.</span>
            </h1>
            <p style={{ fontSize: 18, color: G.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Master in-demand skills with expert-led courses. Build real projects, earn certificates, and advance your career.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setPage("courses")}>
                Explore Courses →
              </button>
              <button className="btn-secondary" style={{ fontSize: 15, padding: "14px 32px" }} onClick={() => setPage("register")}>
                Start Free Today
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {stats.map(s => (
                <div key={s.l}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: G.text }}>{s.v}</div>
                  <div style={{ fontSize: 13, color: G.muted, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hide-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {featured.map((c, i) => (
              <div key={c.id} className="card-glass hover-lift" style={{ borderRadius: 16, overflow: "hidden", gridColumn: i === 0 ? "1 / -1" : "auto", cursor: "pointer", animationDelay: `${i * 0.1}s` }} onClick={() => setPage("courseDetail_" + c.id)}>
                <img src={c.thumbnail} alt={c.title} style={{ width: "100%", height: i === 0 ? 160 : 110, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Stars r={c.rating} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.free ? "#00C9A7" : G.gold }}>{c.free ? "Free" : `$${c.price}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 24px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p style={{ color: G.muted, fontSize: 17, maxWidth: 500, margin: "0 auto" }}>A complete learning ecosystem designed to help you grow</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={f.title} className="card-glass hover-lift" style={{ padding: 28, borderRadius: 16, animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,rgba(108,71,255,0.2),rgba(0,201,167,0.1))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon n={f.icon} s={24} c="#A78BFF" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                <div style={{ color: G.muted, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", marginBottom: 50 }}>What Our <span className="gradient-text">Students Say</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card-glass" style={{ padding: 28, borderRadius: 20 }}>
                <div style={{ fontSize: 40, color: "#6C47FF", marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ color: G.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={t.name} size={42} bg="#00C9A7" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#6C47FF", fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", background: "linear-gradient(135deg,rgba(108,71,255,0.15),rgba(0,201,167,0.08))", border: "1px solid rgba(108,71,255,0.2)", borderRadius: 28, padding: "60px 40px" }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Ready to Start <span className="gradient-text">Learning?</span></h2>
          <p style={{ color: G.muted, fontSize: 17, marginBottom: 32 }}>Join 50,000+ students already learning on LearnFlow</p>
          <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }} onClick={() => setPage("register")}>
            Get Started Free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: G.muted, fontSize: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <Icon n="book" s={16} c="#6C47FF" />
          <span style={{ fontWeight: 700, color: G.text }}>LearnFlow</span>
        </div>
        <p>© 2025 LearnFlow. All rights reserved. Built with ❤️ for learners everywhere.</p>
      </footer>
    </div>
  );
};

// ─── COURSES PAGE ──────────────────────────────────────────────────────────
const CoursesPage = ({ courses, setPage, user, setCourses }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("popular");

  const filtered = courses.filter(c => {
    if (!c.approved) return false;
    const q = search.toLowerCase();
    if (q && !c.title.toLowerCase().includes(q) && !c.instructor.toLowerCase().includes(q) && !c.tags.some(t => t.toLowerCase().includes(q))) return false;
    if (cat !== "All" && c.category !== cat) return false;
    if (level !== "All" && c.level !== level) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "popular") return b.students - a.students;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "newest") return b.id.localeCompare(a.id);
    if (sort === "price-low") return a.price - b.price;
    return 0;
  });

  const enroll = (courseId) => {
    if (!user) { setPage("login"); return; }
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;
    if (!users[idx].enrolledCourses) users[idx].enrolledCourses = [];
    if (!users[idx].enrolledCourses.includes(courseId)) {
      users[idx].enrolledCourses.push(courseId);
      saveUsers(users);
      saveAuth(users[idx]);
    }
    setPage("dashboard");
  };

  return (
    <div className="fade-in" style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 8 }}>Browse <span className="gradient-text">Courses</span></h1>
      <p style={{ color: G.muted, marginBottom: 36 }}>{filtered.length} courses available</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32, padding: "20px", background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 16 }}>
        <div style={{ position: "relative", flex: "1 1 220px" }}>
          <Icon n="search" s={16} c={G.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input className="input-field" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <select className="input-field" value={cat} onChange={e => setCat(e.target.value)} style={{ flex: "0 1 160px" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field" value={level} onChange={e => setLevel(e.target.value)} style={{ flex: "0 1 140px" }}>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{ flex: "0 1 150px" }}>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {filtered.map(c => (
          <CourseCard key={c.id} course={c} setPage={setPage} onEnroll={() => enroll(c.id)} user={user} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: G.muted }}>
          <Icon n="search" s={48} c={G.muted} />
          <p style={{ marginTop: 16, fontSize: 18 }}>No courses found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course: c, setPage, onEnroll, user }) => {
  const enrolled = user?.enrolledCourses?.includes(c.id);
  return (
    <div className="card-glass hover-lift" style={{ borderRadius: 20, overflow: "hidden", cursor: "pointer" }}>
      <div onClick={() => setPage("courseDetail_" + c.id)} style={{ position: "relative" }}>
        <img src={c.thumbnail} alt={c.title} style={{ width: "100%", height: 180, objectFit: "cover" }} onError={e => { e.target.src = "https://via.placeholder.com/400x180/161625/6C47FF?text=" + encodeURIComponent(c.title.slice(0,20)); }} />
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          {c.free ? <span className="badge-free">FREE</span> : <span className="badge-paid">${c.price}</span>}
        </div>
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span className="tag">{c.level}</span>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <span style={{ fontSize: 12, color: "#6C47FF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.category}</span>
        <h3 onClick={() => setPage("courseDetail_" + c.id)} style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 10px", lineHeight: 1.4, cursor: "pointer" }}>{c.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Avatar name={c.instructor} size={24} />
          <span style={{ fontSize: 13, color: G.muted }}>{c.instructor}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Stars r={c.rating} />
          <span style={{ fontSize: 13, color: G.muted }}>{c.students.toLocaleString()} students</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <button className={enrolled ? "btn-secondary" : "btn-primary"} style={{ width: "100%", padding: "10px", fontSize: 14 }} onClick={onEnroll}>
          {enrolled ? "✓ Enrolled — Go to Dashboard" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
};

// ─── COURSE DETAIL ─────────────────────────────────────────────────────────
const CourseDetailPage = ({ courseId, courses, setPage, user }) => {
  const c = courses.find(x => x.id === courseId);
  if (!c) return <div style={{ padding: 40, textAlign: "center" }}>Course not found</div>;
  const enrolled = user?.enrolledCourses?.includes(c.id);
  const progress = c.progress?.[user?.id] || 0;

  const enroll = () => {
    if (!user) { setPage("login"); return; }
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1 && !users[idx].enrolledCourses?.includes(c.id)) {
      users[idx].enrolledCourses = [...(users[idx].enrolledCourses || []), c.id];
      saveUsers(users);
      saveAuth(users[idx]);
    }
    setPage("dashboard");
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => setPage("courses")} style={{ background: "none", border: "none", color: G.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, fontSize: 14 }}>
        ← Back to Courses
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <span className="tag" style={{ marginBottom: 12, display: "inline-block" }}>{c.category}</span>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>{c.title}</h1>
          <p style={{ color: G.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{c.description}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            <Stars r={c.rating} />
            <span style={{ color: G.muted, fontSize: 14 }}>{c.students.toLocaleString()} students</span>
            <span style={{ color: G.muted, fontSize: 14 }}>⏱ {c.duration}</span>
            <span className="tag">{c.level}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, padding: 20, background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 14 }}>
            <Avatar name={c.instructor} size={52} bg="#00C9A7" />
            <div>
              <div style={{ fontWeight: 700 }}>{c.instructor}</div>
              <div style={{ color: G.muted, fontSize: 14 }}>Course Instructor</div>
            </div>
          </div>
          {enrolled && (
            <div style={{ marginBottom: 32, padding: 20, background: "rgba(0,201,167,0.08)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: 14 }}>
              <div style={{ fontWeight: 600, marginBottom: 10, color: "#00C9A7" }}>Your Progress</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: progress + "%" }} /></div>
              <div style={{ color: G.muted, fontSize: 13, marginTop: 6 }}>{progress}% Complete</div>
            </div>
          )}
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Course Syllabus</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {c.syllabus?.map((s, i) => (
              <div key={i} className="card-glass" style={{ padding: "14px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(108,71,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#A78BFF" }}>{i + 1}</div>
                <span style={{ fontSize: 14 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "sticky", top: 80, height: "fit-content" }}>
          <div className="card-glass" style={{ borderRadius: 20, overflow: "hidden" }}>
            <img src={c.thumbnail} alt={c.title} style={{ width: "100%", height: 200, objectFit: "cover" }} onError={e => { e.target.style.background = "#161625"; e.target.style.display = "none"; }} />
            <div style={{ padding: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4, color: c.free ? "#00C9A7" : G.gold }}>
                {c.free ? "Free" : `$${c.price}`}
              </div>
              {enrolled ? (
                <div>
                  <div className="chip chip-success" style={{ marginBottom: 16 }}>✓ Enrolled</div>
                  <button className="btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={() => setPage("dashboard")}>
                    Continue Learning →
                  </button>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: "100%", marginBottom: 12, padding: 14, fontSize: 15 }} onClick={enroll}>
                  {c.free ? "Enroll for Free" : "Enroll Now"} →
                </button>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {[["video", `${c.videos} Video Lessons`],["file", "Downloadable Resources"],["clock", c.duration + " Total Duration"],["award", "Certificate of Completion"],["shield", "Lifetime Access"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: G.muted }}>
                    <Icon n={icon} s={15} c="#6C47FF" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AUTH PAGES ────────────────────────────────────────────────────────────
const AuthPage = ({ mode, setPage, setUser }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const submit = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = getUsers();
      if (isLogin) {
        const u = users.find(x => x.email === form.email && x.password === form.password);
        if (!u) { setError("Invalid email or password"); return; }
        saveAuth(u); setUser(u); setPage("dashboard");
      } else {
        if (!form.name || !form.email || !form.password) { setError("All fields required"); return; }
        if (users.find(x => x.email === form.email)) { setError("Email already registered"); return; }
        const nu = { id: "u" + Date.now(), name: form.name, email: form.email, password: form.password, role: form.role, avatar: form.name.slice(0,2).toUpperCase(), bio: "", joinDate: new Date().toISOString().split("T")[0], enrolledCourses: [], courses: [] };
        users.push(nu); saveUsers(users); saveAuth(nu); setUser(nu); setPage("dashboard");
      }
    }, 800);
  };

  const demoAccounts = [
    { label: "Student Demo", email: "alice@demo.com", role: "student" },
    { label: "Instructor Demo", email: "mark@demo.com", role: "instructor" },
    { label: "Admin Demo", email: "admin@demo.com", role: "admin" },
  ];

  return (
    <div className="fade-in" style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="card-glass" style={{ borderRadius: 24, padding: "40px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{isLogin ? "Welcome back" : "Create account"}</h1>
            <p style={{ color: G.muted, fontSize: 14 }}>{isLogin ? "Sign in to continue learning" : "Start your learning journey today"}</p>
          </div>
          {error && <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#FF6B6B" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            {!isLogin && <input className="input-field" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />}
            <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            {!isLogin && (
              <select className="input-field" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            )}
          </div>
          <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: G.muted }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setPage(isLogin ? "register" : "login")} style={{ color: "#6C47FF", cursor: "pointer", fontWeight: 600 }}>
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </div>
          <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: 12, color: G.muted, marginBottom: 12, textAlign: "center" }}>Quick Demo Login:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {demoAccounts.map(d => (
                <button key={d.email} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  onClick={() => { setForm({...form, email: d.email, password: "demo123"}); }}>
                  <span>{d.label}</span>
                  <span style={{ fontSize: 11, color: G.muted }}>{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── STUDENT DASHBOARD ─────────────────────────────────────────────────────
const StudentDashboard = ({ user, courses, setPage, setUser, setCourses }) => {
  const [tab, setTab] = useState("overview");
  const enrolled = courses.filter(c => user.enrolledCourses?.includes(c.id));

  const tabs = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "courses", icon: "book", label: "My Courses" },
    { id: "assignments", icon: "file", label: "Assignments" },
    { id: "profile", icon: "user", label: "Profile" },
  ];

  return (
    <DashboardLayout user={user} tabs={tabs} tab={tab} setTab={setTab} setPage={setPage}>
      {tab === "overview" && <StudentOverview user={user} enrolled={enrolled} setTab={setTab} setPage={setPage} />}
      {tab === "courses" && <StudentCourses enrolled={enrolled} courses={courses} setPage={setPage} user={user} />}
      {tab === "assignments" && <StudentAssignments enrolled={enrolled} />}
      {tab === "profile" && <ProfileTab user={user} setUser={setUser} />}
    </DashboardLayout>
  );
};

const StudentOverview = ({ user, enrolled, setTab, setPage }) => {
  const avgProgress = enrolled.length ? Math.round(enrolled.reduce((s, c) => s + (c.progress?.[user.id] || 0), 0) / enrolled.length) : 0;
  const completed = enrolled.filter(c => (c.progress?.[user.id] || 0) >= 100).length;
  const stats = [
    { label: "Enrolled Courses", value: enrolled.length, icon: "book", color: "#6C47FF" },
    { label: "Avg. Progress", value: avgProgress + "%", icon: "chart", color: "#00C9A7" },
    { label: "Completed", value: completed, icon: "award", color: "#FFB800" },
    { label: "Learning Hours", value: enrolled.reduce((s, c) => s + parseInt(c.duration), 0) + "h", icon: "clock", color: "#FF6B6B" },
  ];
  const activityData = [
    { day: "Mon", mins: 45 }, { day: "Tue", mins: 80 }, { day: "Wed", mins: 30 },
    { day: "Thu", mins: 95 }, { day: "Fri", mins: 60 }, { day: "Sat", mins: 110 }, { day: "Sun", mins: 25 },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
      <p style={{ color: G.muted, marginBottom: 28 }}>Continue where you left off</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card-glass" style={{ padding: "20px 24px", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n={s.icon} s={20} c={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke={G.muted} tick={{ fill: G.muted, fontSize: 12 }} />
              <YAxis stroke={G.muted} tick={{ fill: G.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#161625", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: G.text }} />
              <Bar dataKey="mins" fill="#6C47FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Continue Learning</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {enrolled.slice(0,3).map(c => (
              <div key={c.id} className="card-glass" style={{ padding: 14, borderRadius: 12, cursor: "pointer" }} onClick={() => setPage("courseDetail_" + c.id)}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div className="progress-bar" style={{ marginBottom: 4 }}>
                  <div className="progress-fill" style={{ width: (c.progress?.[user?.id] || 0) + "%" }} />
                </div>
                <div style={{ fontSize: 12, color: G.muted }}>{c.progress?.[user?.id] || 0}%</div>
              </div>
            ))}
            {enrolled.length === 0 && <div style={{ color: G.muted, fontSize: 14, textAlign: "center", padding: 20 }}>No courses yet. <span style={{ color: "#6C47FF", cursor: "pointer" }} onClick={() => setPage("courses")}>Browse courses →</span></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentCourses = ({ enrolled, courses, setPage, user }) => (
  <div>
    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>My Courses</h2>
    {enrolled.length === 0 ? (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Icon n="book" s={48} c={G.muted} />
        <p style={{ color: G.muted, marginTop: 16, fontSize: 16 }}>You haven't enrolled in any courses yet</p>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setPage("courses")}>Browse Courses</button>
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {enrolled.map(c => {
          const p = c.progress?.[user?.id] || 0;
          return (
            <div key={c.id} className="card-glass hover-lift" style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer" }} onClick={() => setPage("courseDetail_" + c.id)}>
              <img src={c.thumbnail} alt={c.title} style={{ width: "100%", height: 150, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
              <div style={{ padding: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{c.title}</h3>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 12 }}>{c.instructor}</div>
                <div className="progress-bar" style={{ marginBottom: 6 }}>
                  <div className="progress-fill" style={{ width: p + "%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.muted }}>
                  <span>{p}% complete</span>
                  {p >= 100 && <span style={{ color: "#00C9A7" }}>✓ Completed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const StudentAssignments = ({ enrolled }) => {
  const assignments = enrolled.flatMap(c => [
    { course: c.title, title: "Chapter Quiz", due: "2025-02-20", status: "pending" },
    { course: c.title, title: "Project Submission", due: "2025-02-25", status: "submitted" },
  ]);
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Assignments</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {assignments.length === 0 && <div style={{ color: G.muted, textAlign: "center", padding: 40 }}>No assignments yet</div>}
        {assignments.map((a, i) => (
          <div key={i} className="card-glass table-row" style={{ padding: "16px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
              <div style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>{a.course}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: G.muted }}>Due: {a.due}</span>
              <span className={`chip ${a.status === "submitted" ? "chip-success" : "chip-warning"}`}>
                {a.status}
              </span>
              {a.status === "pending" && <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Submit</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── INSTRUCTOR DASHBOARD ──────────────────────────────────────────────────
const InstructorDashboard = ({ user, courses, setPage, setUser, setCourses }) => {
  const [tab, setTab] = useState("overview");
  const myCourses = courses.filter(c => c.instructorId === user.id);

  const tabs = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "courses", icon: "book", label: "My Courses" },
    { id: "create", icon: "plus", label: "Create Course" },
    { id: "analytics", icon: "chart", label: "Analytics" },
    { id: "students", icon: "users", label: "Students" },
    { id: "profile", icon: "user", label: "Profile" },
  ];

  return (
    <DashboardLayout user={user} tabs={tabs} tab={tab} setTab={setTab} setPage={setPage}>
      {tab === "overview" && <InstructorOverview user={user} myCourses={myCourses} setTab={setTab} />}
      {tab === "courses" && <InstructorCourses myCourses={myCourses} courses={courses} setCourses={setCourses} user={user} setTab={setTab} />}
      {tab === "create" && <CreateCourse user={user} courses={courses} setCourses={setCourses} setTab={setTab} />}
      {tab === "analytics" && <InstructorAnalytics myCourses={myCourses} />}
      {tab === "students" && <InstructorStudents myCourses={myCourses} />}
      {tab === "profile" && <ProfileTab user={user} setUser={setUser} />}
    </DashboardLayout>
  );
};

const InstructorOverview = ({ user, myCourses, setTab }) => {
  const totalStudents = myCourses.reduce((s, c) => s + c.students, 0);
  const totalRevenue = myCourses.reduce((s, c) => s + (c.free ? 0 : c.price * c.students * 0.7), 0);
  const avgRating = myCourses.length ? (myCourses.reduce((s, c) => s + c.rating, 0) / myCourses.length).toFixed(1) : 0;
  const stats = [
    { label: "Total Courses", value: myCourses.length, icon: "book", color: "#6C47FF" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: "users", color: "#00C9A7" },
    { label: "Avg. Rating", value: avgRating + "★", icon: "star", color: "#FFB800" },
    { label: "Est. Revenue", value: "$" + Math.round(totalRevenue / 1000) + "K", icon: "trending", color: "#FF6B6B" },
  ];
  const revenueData = [
    { month: "Sep", revenue: 4200 }, { month: "Oct", revenue: 5800 }, { month: "Nov", revenue: 4900 },
    { month: "Dec", revenue: 7200 }, { month: "Jan", revenue: 6400 }, { month: "Feb", revenue: 8900 },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Instructor Dashboard</h2>
      <p style={{ color: G.muted, marginBottom: 28 }}>Manage your courses and track performance</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card-glass" style={{ padding: "20px 24px", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n={s.icon} s={20} c={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card-glass" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke={G.muted} tick={{ fill: G.muted, fontSize: 12 }} />
            <YAxis stroke={G.muted} tick={{ fill: G.muted, fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#161625", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: G.text }} formatter={(v) => ["$" + v, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#6C47FF" strokeWidth={2.5} dot={{ fill: "#6C47FF", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your Courses</h3>
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => setTab("create")}>+ New Course</button>
        </div>
        {myCourses.map(c => (
          <div key={c.id} className="card-glass table-row" style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
              <div style={{ color: G.muted, fontSize: 13, marginTop: 2 }}>{c.students.toLocaleString()} students · {c.rating}★</div>
            </div>
            <span className={`chip ${c.approved ? "chip-success" : "chip-warning"}`}>{c.approved ? "Live" : "Pending"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstructorCourses = ({ myCourses, courses, setCourses, user, setTab }) => {
  const [deleteId, setDeleteId] = useState(null);
  const deleteCourse = (id) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    saveCourses(updated);
    setDeleteId(null);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>My Courses</h2>
        <button className="btn-primary" onClick={() => setTab("create")}>+ Create Course</button>
      </div>
      {myCourses.length === 0 && <div style={{ textAlign: "center", padding: "60px 20px", color: G.muted }}>No courses yet</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {myCourses.map(c => (
          <div key={c.id} className="card-glass" style={{ padding: "20px 24px", borderRadius: 14, display: "flex", gap: 20, alignItems: "center" }}>
            <img src={c.thumbnail} alt={c.title} style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 10 }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
              <div style={{ color: G.muted, fontSize: 13 }}>{c.students} students · {c.rating}★ · {c.free ? "Free" : "$" + c.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={`chip ${c.approved ? "chip-success" : "chip-warning"}`}>{c.approved ? "Live" : "Pending"}</span>
              <button style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "#FF6B6B", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer" }} onClick={() => setDeleteId(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Delete Course?</h3>
            <p style={{ color: G.muted, marginBottom: 24 }}>This action cannot be undone. All student data will be lost.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ flex: 1, background: "#FF6B6B", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }} onClick={() => deleteCourse(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateCourse = ({ user, courses, setCourses, setTab }) => {
  const [form, setForm] = useState({ title: "", category: "Web Development", level: "Beginner", price: "", description: "", tags: "", free: false });
  const [saved, setSaved] = useState(false);
  const submit = () => {
    if (!form.title || !form.description) return;
    const nc = {
      id: "c" + Date.now(), title: form.title, instructor: user.name, instructorId: user.id,
      category: form.category, level: form.level, price: form.free ? 0 : parseInt(form.price) || 0,
      free: form.free, rating: 0, students: 0, duration: "0h",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
      description: form.description, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      approved: false, syllabus: ["Module 1", "Module 2", "Module 3"], videos: 0, progress: {},
    };
    const updated = [...courses, nc];
    setCourses(updated); saveCourses(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setTab("courses"); }, 1500);
  };
  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Create New Course</h2>
      {saved && <div style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#00C9A7" }}>✓ Course submitted for review!</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Course Title *</label>
          <input className="input-field" placeholder="e.g. Complete JavaScript Bootcamp" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Category</label>
            <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Level</label>
            <select className="input-field" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
              {LEVELS.filter(l => l !== "All").map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Description *</label>
          <textarea className="input-field" placeholder="Describe your course..." rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" checked={form.free} onChange={e => setForm({...form, free: e.target.checked})} />
            <span>Free Course</span>
          </label>
          {!form.free && <input className="input-field" placeholder="Price ($)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ flex: 1 }} />}
        </div>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Tags (comma separated)</label>
          <input className="input-field" placeholder="e.g. JavaScript, React, Web" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
        </div>
        <div className="card-glass" style={{ padding: 20, borderRadius: 12, border: "2px dashed rgba(255,255,255,0.1)" }}>
          <div style={{ textAlign: "center", color: G.muted }}>
            <Icon n="upload" s={32} c={G.muted} />
            <p style={{ marginTop: 8, fontSize: 14 }}>Upload course thumbnail</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG up to 10MB</p>
          </div>
        </div>
        <button className="btn-primary" style={{ padding: 14, fontSize: 15 }} onClick={submit}>Submit for Review →</button>
      </div>
    </div>
  );
};

const InstructorAnalytics = ({ myCourses }) => {
  const enrollData = myCourses.map(c => ({ name: c.title.slice(0, 20) + "...", students: c.students }));
  const ratingData = myCourses.map(c => ({ name: c.title.slice(0, 20) + "...", rating: c.rating }));
  const COLORS = ["#6C47FF", "#00C9A7", "#FFB800", "#FF6B6B", "#8B6AFF"];
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Student Enrollments</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={enrollData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke={G.muted} tick={{ fill: G.muted, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke={G.muted} tick={{ fill: G.muted, fontSize: 10 }} width={90} />
              <Tooltip contentStyle={{ background: "#161625", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: G.text }} />
              <Bar dataKey="students" radius={[0,4,4,0]}>
                {enrollData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Course Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={enrollData.length ? enrollData : [{ name: "No Courses", students: 1 }]} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {(enrollData.length ? enrollData : [{}]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#161625", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: G.text }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const InstructorStudents = ({ myCourses }) => {
  const students = [
    { name: "Alice Johnson", course: myCourses[0]?.title || "N/A", progress: 65, joined: "2024-01-15" },
    { name: "Sarah Kim", course: myCourses[0]?.title || "N/A", progress: 30, joined: "2024-02-01" },
    { name: "John Doe", course: myCourses[1]?.title || "N/A", progress: 90, joined: "2024-01-20" },
    { name: "Emma Wilson", course: myCourses[0]?.title || "N/A", progress: 45, joined: "2024-02-10" },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Enrolled Students</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {students.map((s, i) => (
          <div key={i} className="card-glass table-row" style={{ padding: "16px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar name={s.name} size={38} bg="#00C9A7" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
              <div style={{ color: G.muted, fontSize: 12, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{s.course}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="progress-bar"><div className="progress-fill" style={{ width: s.progress + "%" }} /></div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 4 }}>{s.progress}%</div>
            </div>
            <div style={{ fontSize: 12, color: G.muted }}>{s.joined}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
const AdminDashboard = ({ user, courses, setPage, setUser, setCourses }) => {
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState(getUsers());

  const tabs = [
    { id: "overview", icon: "grid", label: "Overview" },
    { id: "users", icon: "users", label: "Users" },
    { id: "courses", icon: "book", label: "Courses" },
    { id: "settings", icon: "settings", label: "Settings" },
    { id: "profile", icon: "user", label: "Profile" },
  ];

  return (
    <DashboardLayout user={user} tabs={tabs} tab={tab} setTab={setTab} setPage={setPage}>
      {tab === "overview" && <AdminOverview users={users} courses={courses} />}
      {tab === "users" && <AdminUsers users={users} setUsers={setUsers} />}
      {tab === "courses" && <AdminCourses courses={courses} setCourses={setCourses} />}
      {tab === "settings" && <AdminSettings />}
      {tab === "profile" && <ProfileTab user={user} setUser={setUser} />}
    </DashboardLayout>
  );
};

const AdminOverview = ({ users, courses }) => {
  const stats = [
    { label: "Total Users", value: users.length, icon: "users", color: "#6C47FF" },
    { label: "Total Courses", value: courses.length, icon: "book", color: "#00C9A7" },
    { label: "Pending Approval", value: courses.filter(c => !c.approved).length, icon: "clock", color: "#FFB800" },
    { label: "Total Enrollments", value: users.reduce((s, u) => s + (u.enrolledCourses?.length || 0), 0), icon: "award", color: "#FF6B6B" },
  ];
  const roleData = [
    { name: "Students", value: users.filter(u => u.role === "student").length },
    { name: "Instructors", value: users.filter(u => u.role === "instructor").length },
    { name: "Admins", value: users.filter(u => u.role === "admin").length },
  ];
  const COLORS = ["#6C47FF", "#00C9A7", "#FFB800"];
  return (
    <div>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Admin Dashboard</h2>
      <p style={{ color: G.muted, marginBottom: 28 }}>Platform overview and management</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card-glass" style={{ padding: "20px 24px", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: G.muted, fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n={s.icon} s={20} c={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>User Roles Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#161625", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: G.text }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-glass" style={{ padding: 24, borderRadius: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Platform Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Courses Live", value: courses.filter(c => c.approved).length + "/" + courses.length, p: courses.length ? Math.round(courses.filter(c => c.approved).length / courses.length * 100) : 0 },
              { label: "Student Engagement", value: "78%", p: 78 },
              { label: "Course Completion Rate", value: "61%", p: 61 },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                  <span>{item.label}</span><span style={{ color: G.muted }}>{item.value}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: item.p + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = ({ users, setUsers }) => {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const deleteUser = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated); saveUsers(updated);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>User Management</h2>
        <input className="input-field" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220 }} />
      </div>
      <div className="card-glass" style={{ borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px 80px", gap: 16, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: G.muted, fontWeight: 600, textTransform: "uppercase" }}>
          <span>User</span><span>Email</span><span>Role</span><span>Joined</span><span>Action</span>
        </div>
        {filtered.map(u => (
          <div key={u.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px 80px", gap: 16, padding: "14px 20px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={u.name} size={32} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 13, color: G.muted }}>{u.email}</span>
            <span className={`chip ${u.role === "admin" ? "chip-danger" : u.role === "instructor" ? "chip-info" : "chip-success"}`}>{u.role}</span>
            <span style={{ fontSize: 13, color: G.muted }}>{u.joinDate}</span>
            <button onClick={() => deleteUser(u.id)} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "#FF6B6B", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminCourses = ({ courses, setCourses }) => {
  const approve = (id) => {
    const updated = courses.map(c => c.id === id ? { ...c, approved: true } : c);
    setCourses(updated); saveCourses(updated);
  };
  const remove = (id) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated); saveCourses(updated);
  };
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Course Management</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {courses.map(c => (
          <div key={c.id} className="card-glass table-row" style={{ padding: "16px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 16 }}>
            <img src={c.thumbnail} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</div>
              <div style={{ color: G.muted, fontSize: 13 }}>{c.instructor} · {c.students} students</div>
            </div>
            <span className={`chip ${c.approved ? "chip-success" : "chip-warning"}`}>{c.approved ? "Live" : "Pending"}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {!c.approved && <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => approve(c.id)}>Approve</button>}
              <button onClick={() => remove(c.id)} style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", color: "#FF6B6B", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminSettings = () => (
  <div style={{ maxWidth: 560 }}>
    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>System Settings</h2>
    <div className="card-glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Platform Settings</h3>
      {[
        { label: "Allow new registrations", on: true },
        { label: "Email notifications", on: true },
        { label: "Auto-approve courses", on: false },
        { label: "Maintenance mode", on: false },
      ].map(s => (
        <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 14 }}>{s.label}</span>
          <div style={{ width: 44, height: 24, borderRadius: 999, background: s.on ? "#6C47FF" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", padding: "0 3px", cursor: "pointer", transition: "background 0.2s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", marginLeft: s.on ? "auto" : 0, transition: "margin 0.2s" }} />
          </div>
        </div>
      ))}
    </div>
    <button className="btn-primary" style={{ padding: "12px 28px" }}>Save Settings</button>
  </div>
);

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
const ProfileTab = ({ user, setUser }) => {
  const [form, setForm] = useState({ name: user.name, bio: user.bio || "", email: user.email });
  const [saved, setSaved] = useState(false);
  const save = () => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...form };
      saveUsers(users); saveAuth(users[idx]);
      setUser(users[idx]);
    }
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Profile Settings</h2>
      {saved && <div style={{ background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#00C9A7" }}>✓ Profile saved!</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, padding: 24, background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 16 }}>
        <Avatar name={user.name} size={72} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</div>
          <div style={{ color: G.muted, fontSize: 14, marginTop: 4 }}>@{user.email.split("@")[0]}</div>
          <span className={`chip ${user.role === "admin" ? "chip-danger" : user.role === "instructor" ? "chip-info" : "chip-success"}`} style={{ marginTop: 8, display: "inline-block" }}>{user.role}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Full Name</label>
          <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Email</label>
          <input className="input-field" value={form.email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: G.muted, marginBottom: 6, display: "block" }}>Bio</label>
          <textarea className="input-field" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell us about yourself..." style={{ resize: "vertical" }} />
        </div>
        <button className="btn-primary" style={{ padding: 14 }} onClick={save}>Save Changes</button>
      </div>
    </div>
  );
};

const DashboardLayout = ({ user, tabs, tab, setTab, setPage, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 240 : 64, flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "24px 12px", transition: "width 0.3s", overflow: "hidden" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", marginBottom: 8 }}>
            <Avatar name={user.name} size={38} />
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{user.name.split(" ")[0]}</div>
                <div style={{ fontSize: 12, color: G.muted }}>{user.role}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map(t => (
            <div key={t.id} className={`sidebar-link${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)} style={{ whiteSpace: "nowrap" }}>
              <Icon n={t.icon} s={18} />
              {sidebarOpen && <span>{t.label}</span>}
            </div>
          ))}
          <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div className="sidebar-link" onClick={() => setPage("courses")} style={{ whiteSpace: "nowrap" }}>
              <Icon n="globe" s={18} />
              {sidebarOpen && <span>Browse Courses</span>}
            </div>
          </div>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: "32px 28px", overflow: "auto" }} className="fade-in">
        {children}
      </div>
    </div>
  );
};

// ─── ABOUT PAGE ────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div className="fade-in" style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
    <div style={{ textAlign: "center", marginBottom: 60 }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>About <span className="gradient-text">LearnFlow</span></h1>
      <p style={{ color: G.muted, fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
        We're on a mission to make world-class education accessible to everyone, everywhere.
      </p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 60 }}>
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Our Story</h2>
        <p style={{ color: G.muted, lineHeight: 1.8, marginBottom: 16 }}>
          Founded in 2023, LearnFlow was born from a simple idea: learning should be joyful, not stressful. 
          We built a platform where curiosity thrives and skills grow.
        </p>
        <p style={{ color: G.muted, lineHeight: 1.8 }}>
          Today, we serve 50,000+ students across 120+ countries with courses taught by industry experts 
          from top companies like Google, Amazon, and Meta.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[["50K+","Active Students"],["200+","Expert Courses"],["120","Countries"],["95%","Success Rate"]].map(([v, l]) => (
          <div key={l} className="card-glass" style={{ padding: 24, borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#6C47FF" }}>{v}</div>
            <div style={{ color: G.muted, fontSize: 14, marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>Our Team</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        {[
          { name: "Alex Rivera", role: "CEO & Co-founder", bg: "#6C47FF" },
          { name: "Maya Chen", role: "CTO", bg: "#00C9A7" },
          { name: "David Park", role: "Head of Content", bg: "#FFB800" },
          { name: "Zara Ahmed", role: "Head of Design", bg: "#FF6B6B" },
        ].map(m => (
          <div key={m.name} className="card-glass" style={{ padding: 28, borderRadius: 16, textAlign: "center" }}>
            <Avatar name={m.name} size={64} bg={m.bg} />
            <div style={{ fontWeight: 700, marginTop: 14, marginBottom: 4 }}>{m.name}</div>
            <div style={{ color: G.muted, fontSize: 13 }}>{m.role}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── CONTACT PAGE ──────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h1 style={{ fontSize: 44, fontWeight: 800, marginBottom: 12 }}>Get in <span className="gradient-text">Touch</span></h1>
        <p style={{ color: G.muted, fontSize: 17 }}>We'd love to hear from you. Send us a message!</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#00C9A7" }}>Message Sent!</h3>
              <p style={{ color: G.muted }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="input-field" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              <input className="input-field" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              <textarea className="input-field" rows={5} placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: "vertical" }} />
              <button className="btn-primary" style={{ padding: 14, fontSize: 15 }} onClick={() => setSent(true)}>Send Message →</button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { icon: "mail", title: "Email Us", info: "support@learnflow.com" },
            { icon: "globe", title: "Website", info: "www.learnflow.com" },
            { icon: "clock", title: "Support Hours", info: "Mon–Fri, 9am–6pm IST" },
          ].map(c => (
            <div key={c.title} className="card-glass" style={{ padding: 24, borderRadius: 14, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(108,71,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon n={c.icon} s={22} c="#6C47FF" />
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
                <div style={{ color: G.muted, fontSize: 14 }}>{c.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(getCourses());

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    document.body.style.background = G.darker;
    document.body.style.color = G.text;
    document.body.style.fontFamily = "'Sora', sans-serif";
    const savedUser = getAuth();
    if (savedUser) setUser(savedUser);
    if (!localStorage.getItem("ocms_courses")) saveCourses(seedCourses);
    if (!localStorage.getItem(USERS_KEY)) saveUsers(seedUsers);
    return () => document.head.removeChild(style);
  }, []);

  const navigateTo = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (page === "home") return <HomePage setPage={navigateTo} courses={courses} />;
    if (page === "courses") return <CoursesPage courses={courses} setPage={navigateTo} user={user} setCourses={setCourses} />;
    if (page === "about") return <AboutPage />;
    if (page === "contact") return <ContactPage />;
    if (page === "login") return <AuthPage mode="login" setPage={navigateTo} setUser={setUser} />;
    if (page === "register") return <AuthPage mode="register" setPage={navigateTo} setUser={setUser} />;
    if (page.startsWith("courseDetail_")) {
      const id = page.replace("courseDetail_", "");
      return <CourseDetailPage courseId={id} courses={courses} setPage={navigateTo} user={user} />;
    }
    if (page === "dashboard" || page === "profile") {
      if (!user) { setTimeout(() => navigateTo("login"), 0); return null; }
      if (user.role === "student") return <StudentDashboard user={user} courses={courses} setPage={navigateTo} setUser={setUser} setCourses={setCourses} />;
      if (user.role === "instructor") return <InstructorDashboard user={user} courses={courses} setPage={navigateTo} setUser={setUser} setCourses={setCourses} />;
      if (user.role === "admin") return <AdminDashboard user={user} courses={courses} setPage={navigateTo} setUser={setUser} setCourses={setCourses} />;
    }
    return <HomePage setPage={navigateTo} courses={courses} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: G.darker }}>
      <Navbar page={page} setPage={navigateTo} user={user} setUser={setUser} />
      <main>{renderPage()}</main>
    </div>
  );
}
