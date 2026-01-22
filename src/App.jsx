// Little Lemon — Booking Table (TypeScript)


import React, { useEffect, useMemo, useReducer, useState } from "react";

/** =====================
 *  Style Guide (CSS vars)
 *  ===================== */
const styles = `
:root{
  --primary-1:#495E57;
  --primary-2:#F4CE14;
  --black:#000000;
  --white:#ffffff;
  --secondary-1:#EE9972;
  --secondary-2:#FBDABB;
  --highlight-1:#EDEFEE;
  --highlight-2:#333333;

  --radius:16px;
  --shadow: 0 10px 30px rgba(0,0,0,.12);
  --max: 1024px;
  --focus: 0 0 0 3px rgba(244,206,20,.55);

  --h1: clamp(2rem, 3vw, 2.75rem);
  --h2: clamp(1.5rem, 2.2vw, 2rem);
  --h3: 1.125rem;
  --p: 1rem;
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  color: var(--highlight-2);
  background: linear-gradient(180deg, var(--highlight-1), #fff);
}

a{ color:inherit; }

.container{ width:min(var(--max), calc(100% - 2rem)); margin-inline:auto; }

.skip-link{
  position:absolute; left:-999px; top:0;
  background: var(--primary-2);
  padding:.75rem 1rem;
  border-radius: 12px;
  z-index:999;
}
.skip-link:focus{ left:1rem; top:1rem; outline:none; box-shadow: var(--focus); }

header{
  position:sticky; top:0; z-index: 20;
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0,0,0,.06);
}

.nav{
  display:flex; align-items:center; justify-content:space-between;
  padding: .85rem 0;
  gap: 1rem;
}

.brand{
  display:flex; align-items:center; gap:.75rem;
  font-weight: 800;
  letter-spacing: .2px;
}

.logo{
  width:40px; height:40px;
  border-radius: 12px;
  background: conic-gradient(from 180deg, var(--primary-2), var(--secondary-1), var(--primary-1));
  box-shadow: var(--shadow);
}

.nav-actions{ display:flex; gap:.75rem; align-items:center; }

.btn{
  border:0;
  border-radius: 999px;
  padding: .75rem 1rem;
  font-weight: 700;
  cursor:pointer;
  transition: transform .08s ease, filter .2s ease, box-shadow .2s ease;
  display:inline-flex; align-items:center; justify-content:center;
  gap:.5rem;
}
.btn:active{ transform: translateY(1px); }
.btn:focus{ outline:none; box-shadow: var(--focus); }

.btn-primary{ background: var(--primary-2); color: var(--black); }
.btn-primary:hover{ filter: brightness(.98); }
.btn-ghost{ background: transparent; border: 1px solid rgba(0,0,0,.18); }
.btn-ghost:hover{ background: rgba(0,0,0,.04); }
.btn-dark{ background: var(--primary-1); color: var(--white); }

main{ padding: 1.5rem 0 3rem; }

.hero{
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 1.25rem;
  align-items: stretch;
  margin-top: 1rem;
}

@media (max-width: 860px){
  .hero{ grid-template-columns: 1fr; }
}

.card{
  background: rgba(255,255,255,.85);
  border: 1px solid rgba(0,0,0,.06);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.hero-left{ padding: 1.25rem 1.25rem 1rem; }
.hero-right{ padding: 1.25rem; display:grid; place-items:center; }

.badge{
  display:inline-flex;
  gap:.5rem;
  align-items:center;
  background: rgba(73,94,87,.08);
  padding: .35rem .7rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: .9rem;
}

h1{ font-size: var(--h1); margin: .75rem 0 .25rem; line-height:1.05; }
.hero p{ font-size: var(--p); line-height:1.55; margin: .5rem 0 1rem; max-width: 62ch; }

.kpis{ display:flex; flex-wrap:wrap; gap:.6rem; margin:.8rem 0 1rem; }
.kpi{
  background: var(--highlight-1);
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 14px;
  padding: .65rem .8rem;
  min-width: 140px;
}
.kpi strong{ display:block; font-size: 1.05rem; }
.kpi span{ font-size:.9rem; color: rgba(0,0,0,.65); }

.section{ margin-top: 2rem; }
.section h2{ font-size: var(--h2); margin: 0 0 .75rem; }

.grid2{ display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 860px){ .grid2{ grid-template-columns: 1fr; } }

.form-card{ padding: 1.25rem; }

fieldset{ border:0; padding:0; margin:0; }
legend{ font-weight: 800; margin-bottom: .75rem; }

.form-grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: .85rem;
}
@media (max-width: 560px){ .form-grid{ grid-template-columns: 1fr; } }

.label{ display:flex; flex-direction:column; gap:.35rem; font-weight:700; }

.req{ color: #B00020; font-weight: 800; margin-left:.2rem; }

input, select{
  font: inherit;
  padding: .7rem .75rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,.22);
  background: rgba(255,255,255,.9);
}
input:focus, select:focus{ outline:none; box-shadow: var(--focus); border-color: rgba(244,206,20,.9); }

.hint{ font-size: .9rem; color: rgba(0,0,0,.65); margin-top: .15rem; }
.error{ font-size: .9rem; color: #B00020; margin-top: .15rem; }

.form-actions{ display:flex; flex-wrap:wrap; gap:.75rem; margin-top: 1rem; }

.notice{
  border-left: 6px solid var(--primary-2);
  background: rgba(244,206,20,.12);
  padding: .85rem 1rem;
  border-radius: 14px;
}

.summary{
  background: var(--highlight-1);
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 14px;
  padding: .85rem 1rem;
}
.summary p{ margin:.25rem 0; }

footer{ padding: 2rem 0 3rem; color: rgba(0,0,0,.7); }
.footer-card{ padding: 1.25rem; }

ul{ margin:.5rem 0 0 1.1rem; }
code, pre{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
pre{
  overflow:auto;
  padding: 1rem;
  background: rgba(0,0,0,.06);
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.08);
}

.toast{
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: min(420px, calc(100% - 2rem));
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(0,0,0,.10);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: .9rem 1rem;
}
.toast strong{ display:block; margin-bottom:.25rem; }

/* ---- Table layout preview (Home right side) ---- */
.layout{
  width: 100%;
  margin: 0;
}
.layout svg{
  width: 100%;
  height: auto;
  border-radius: calc(var(--radius) + 10px);
}
.layout-caption{
  margin-top: .75rem;
  font-size: .95rem;
  color: rgba(0,0,0,.65);
  text-align: center;
}

.table{
  stroke: rgba(0,0,0,.18);
  stroke-width: 1;
}
.table-available{ fill: rgba(73,94,87,.18); }
.table-selected{ fill: rgba(244,206,20,.92); stroke: rgba(0,0,0,.25); }
.table-reserved{ fill: rgba(0,0,0,.18); }

.chair{ stroke: rgba(0,0,0,.18); stroke-width: 1; }
.chair-available{ fill: rgba(255,255,255,.65); }
.chair-selected{ fill: rgba(255,255,255,.85); }
.chair-reserved{ fill: rgba(255,255,255,.40); }
`;

/** =====================
 *  Types
 *  ===================== */
type Route = "home" | "reserve" | "details" | "success";

type Booking = {
  date: string;
  time: string;
  diners: number;
  occasion: string;
};

type BookingAction =
  | { type: "setDate"; value: string }
  | { type: "setTime"; value: string }
  | { type: "setDiners"; value: number }
  | { type: "setOccasion"; value: string }
  | { type: "reset" };

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

type CustomerErrors = Partial<Record<keyof Customer, string>>;

type Touched = Partial<Record<keyof Customer, boolean>>;

/** =====================
 *  Utilities
 *  ===================== */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function isPhone(value: string): boolean {
  // permissive check (digits + spaces + +() -)
  return (
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(String(value).trim()) &&
    String(value).replace(/\D/g, "").length >= 7
  );
}

function makeTimes(): string[] {
  // 17:00–22:30 every 30 minutes
  const slots: string[] = [];
  for (let h = 17; h <= 22; h++) {
    slots.push(`${pad2(h)}:00`);
    if (h !== 22) slots.push(`${pad2(h)}:30`);
    else slots.push("22:30");
  }
  return slots;
}

/** =====================
 *  State
 *  ===================== */
const initialBooking: Booking = {
  date: todayISO(),
  time: "19:00",
  diners: 2,
  occasion: "Dinner",
};

function bookingReducer(state: Booking, action: BookingAction): Booking {
  switch (action.type) {
    case "setDate":
      return { ...state, date: action.value };
    case "setTime":
      return { ...state, time: action.value };
    case "setDiners":
      return { ...state, diners: action.value };
    case "setOccasion":
      return { ...state, occasion: action.value };
    case "reset":
      return initialBooking;
    default:
      return state;
  }
}

const initialCustomer: Customer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
};

function validateCustomer(values: Customer): CustomerErrors {
  const errors: CustomerErrors = {};

  if (!values.firstName.trim()) errors.firstName = "First name is required.";
  if (!values.lastName.trim()) errors.lastName = "Last name is required.";

  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!isEmail(values.email)) errors.email = "Please enter a valid email.";

  if (!values.phone.trim()) errors.phone = "Phone is required.";
  else if (!isPhone(values.phone)) errors.phone = "Please enter a valid phone number.";

  return errors;
}

/** =====================
 *  App
 *  ===================== */
export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>("home");

  const [booking, dispatchBooking] = useReducer(bookingReducer, initialBooking);
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const times = useMemo(() => makeTimes(), []);

  // UX: auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Derived validation
  const errors = useMemo(() => validateCustomer(customer), [customer]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  function goReserve(): void {
    setRoute("reserve");
    setSubmitted(false);
    setTouched({});
    setToast(null);
  }

  function goDetails(): void {
    setRoute("details");
    setSubmitted(false);
    setToast(null);
  }

  function goHome(): void {
    setRoute("home");
    setSubmitted(false);
    setToast(null);
  }

  function onCustomerChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value } as Customer));
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>): void {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function submitReservation(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, phone: true, notes: true });

    const finalErrors = validateCustomer(customer);
    if (Object.keys(finalErrors).length) {
      setToast({
        title: "Please fix the highlighted fields",
        message: "Some required information is missing or invalid.",
      });
      return;
    }

    setSubmitted(true);
    setRoute("success");
    setToast({ title: "Reservation confirmed!", message: "See you soon at Little Lemon." });
  }

  function resetAll(): void {
    dispatchBooking({ type: "reset" });
    setCustomer(initialCustomer);
    setTouched({});
    setSubmitted(false);
    setRoute("home");
    setToast({ title: "Reset", message: "Booking details cleared." });
  }

  return (
    <>
      <style>{styles}</style>
      <a className="skip-link" href="#main">Skip to content</a>

      <header>
        <div className="container">
          <div className="nav" role="navigation" aria-label="Primary">
            <div className="brand" aria-label="Little Lemon">
              <div className="logo" aria-hidden="true" />
              <div>
                <div style={{ fontSize: ".95rem", color: "rgba(0,0,0,.7)", fontWeight: 800 }}>Little Lemon</div>
                <div style={{ fontSize: ".85rem", color: "rgba(0,0,0,.6)" }}>Chicago • Mediterranean</div>
              </div>
            </div>

            <div className="nav-actions">
              <button className="btn btn-ghost" onClick={goHome} aria-current={route === "home" ? "page" : undefined}>
                Home
              </button>
              <button className="btn btn-primary" onClick={goReserve}>
                Reserve a Table
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="container">
        {route === "home" && <Home onReserve={goReserve} />}

        {route === "reserve" && (
          <ReserveScreen
            booking={booking}
            dispatchBooking={dispatchBooking}
            times={times}
            onNext={goDetails}
            onBack={goHome}
          />
        )}

        {route === "details" && (
          <DetailsScreen
            booking={booking}
            customer={customer}
            onChange={onCustomerChange}
            onBlur={onBlur}
            errors={errors}
            touched={touched}
            isValid={isValid}
            onSubmit={submitReservation}
            onBack={() => setRoute("reserve")}
          />
        )}

        {route === "success" && (
          <SuccessScreen
            booking={booking}
            customer={customer}
            onHome={goHome}
            onNew={resetAll}
            submitted={submitted}
          />
        )}

        <LearningAndDevSection />
      </main>

      <footer>
        <div className="container">
          <div className="card footer-card">
            <strong>Built with</strong>
            <p style={{ margin: ".5rem 0 0" }}>
              Semantic HTML5 markup • CSS custom properties • React
            </p>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <strong>{toast.title}</strong>
          <div>{toast.message}</div>
        </div>
      )}
    </>
  );
}

/** =====================
 *  Pages (Semantic layout)
 *  ===================== */
function Home({ onReserve }: { onReserve: () => void }): JSX.Element {
  return (
    <>
      <section className="hero">
        <article className="card hero-left" aria-labelledby="home-title">
          <span className="badge" aria-label="Quick booking">
            🍋 Fast booking • instant confirmation
          </span>
          <h1 id="home-title">Little Lemon — Book a table in seconds</h1>
          <p>
            Reserve your spot at our cozy Mediterranean kitchen. Choose your date and time, tell us how many diners,
            and we’ll take care of the rest.
          </p>

          <div className="kpis" aria-label="Key info">
            <div className="kpi">
              <strong>17:00–22:30</strong>
              <span>Daily reservations</span>
            </div>
            <div className="kpi">
              <strong>1–10 diners</strong>
              <span>Flexible tables</span>
            </div>
            <div className="kpi">
              <strong>2 steps</strong>
              <span>Simple flow</span>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={onReserve}>
              Reserve a Table
            </button>
            <a className="btn btn-ghost" href="#learn" style={{ textDecoration: "none" }}>
              What I learned
            </a>
          </div>
        </article>

        <aside className="card hero-right" aria-label="Table layout preview">
          <TableLayoutPreview />
        </aside>
      </section>

      <section className="section" aria-labelledby="why">
        <h2 id="why">Why book with us?</h2>
        <div className="grid2">
          <article className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>No friction</h3>
            <p style={{ marginBottom: 0, lineHeight: 1.55 }}>
              A small form, clear labels, and instant validation so you know what’s needed.
            </p>
          </article>
          <article className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0 }}>Accessible</h3>
            <p style={{ marginBottom: 0, lineHeight: 1.55 }}>
              Semantic structure, focus styles, and helpful error messages.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function TableLayoutPreview(): JSX.Element {
  // purely visual preview 
  const tables: Array<{ id: string; x: number; y: number; seats: number; status: "available" | "selected" | "reserved" }> = [
    { id: "T1", x: 90, y: 95, seats: 2, status: "available" },
    { id: "T2", x: 225, y: 95, seats: 4, status: "available" },
    { id: "T3", x: 360, y: 95, seats: 2, status: "reserved" },
    { id: "T4", x: 135, y: 245, seats: 6, status: "available" },
    { id: "T5", x: 305, y: 265, seats: 4, status: "selected" },
    { id: "T6", x: 455, y: 265, seats: 2, status: "available" },
    { id: "T7", x: 155, y: 410, seats: 2, status: "available" },
    { id: "T8", x: 355, y: 420, seats: 6, status: "available" },
  ];

  return (
    <figure className="layout" aria-label="Dining room layout preview">
      <svg viewBox="0 0 560 520" role="img" aria-label="Dining room tables preview">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(244,206,20,.35)" />
            <stop offset="45%" stopColor="rgba(238,153,114,.25)" />
            <stop offset="100%" stopColor="rgba(73,94,87,.20)" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="rgba(0,0,0,.18)" />
          </filter>
        </defs>

        <rect x="20" y="20" width="520" height="480" rx="26" fill="url(#bg)" stroke="rgba(0,0,0,.10)" />
        <rect x="48" y="48" width="464" height="424" rx="22" fill="rgba(255,255,255,.55)" stroke="rgba(0,0,0,.10)" />

        <g transform="translate(70 70)" fontFamily="system-ui, sans-serif" fontSize="12">
          <rect x="0" y="-18" width="270" height="30" rx="12" fill="rgba(255,255,255,.7)" stroke="rgba(0,0,0,.10)" />
          <circle cx="16" cy="-3" r="6" fill="rgba(73,94,87,.25)" stroke="rgba(0,0,0,.18)" />
          <text x="28" y="1" fill="rgba(0,0,0,.7)">Available</text>

          <circle cx="106" cy="-3" r="6" fill="rgba(244,206,20,.85)" stroke="rgba(0,0,0,.25)" />
          <text x="118" y="1" fill="rgba(0,0,0,.7)">Selected</text>

          <circle cx="196" cy="-3" r="6" fill="rgba(0,0,0,.20)" stroke="rgba(0,0,0,.20)" />
          <text x="208" y="1" fill="rgba(0,0,0,.7)">Reserved</text>
        </g>

        {tables.map((t) => (
          <g
            key={t.id}
            transform={`translate(${t.x} ${t.y})`}
            filter={t.status === "selected" ? "url(#softShadow)" : undefined}
          >
            <rect x="-34" y="-24" width="68" height="48" rx="16" className={`table table-${t.status}`} />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="12"
              fill="rgba(0,0,0,.75)"
              style={{ fontWeight: 800 }}
            >
              {t.seats}
            </text>

            <circle cx="-48" cy="0" r="6" className={`chair chair-${t.status}`} />
            <circle cx="48" cy="0" r="6" className={`chair chair-${t.status}`} />
            <circle cx="0" cy="-38" r="6" className={`chair chair-${t.status}`} />
            <circle cx="0" cy="38" r="6" className={`chair chair-${t.status}`} />
          </g>
        ))}

        <circle cx="280" cy="310" r="150" fill="transparent" stroke="rgba(0,0,0,.12)" strokeDasharray="6 6" />
      </svg>

      <figcaption className="layout-caption">Preview: pick a time & diners, then confirm your booking.</figcaption>
    </figure>
  );
}

type ReserveProps = {
  booking: Booking;
  dispatchBooking: React.Dispatch<BookingAction>;
  times: string[];
  onNext: () => void;
  onBack: () => void;
};

function ReserveScreen({ booking, dispatchBooking, times, onNext, onBack }: ReserveProps): JSX.Element {
  return (
    <section className="section" aria-labelledby="reserve-title">
      <h2 id="reserve-title">Reservation</h2>
      <div className="grid2">
        <article className="card form-card">
          <fieldset>
            <legend>Choose your details</legend>
            <div className="form-grid">
              <label className="label">
                Date <span className="req" aria-hidden="true">*</span>
                <input
                  type="date"
                  value={booking.date}
                  min={todayISO()}
                  onChange={(e) => dispatchBooking({ type: "setDate", value: e.target.value })}
                  aria-required="true"
                />
                <div className="hint">Pick any day from today onward.</div>
              </label>

              <label className="label">
                Time <span className="req" aria-hidden="true">*</span>
                <select
                  value={booking.time}
                  onChange={(e) => dispatchBooking({ type: "setTime", value: e.target.value })}
                  aria-required="true"
                >
                  {times.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="hint">Slots every 30 minutes.</div>
              </label>

              <label className="label">
                Number of diners <span className="req" aria-hidden="true">*</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={booking.diners}
                  onChange={(e) => dispatchBooking({ type: "setDiners", value: Number(e.target.value) })}
                  aria-required="true"
                />
                <div className="hint">Up to 10 diners per booking.</div>
              </label>

              <label className="label">
                Occasion
                <select
                  value={booking.occasion}
                  onChange={(e) => dispatchBooking({ type: "setOccasion", value: e.target.value })}
                >
                  <option value="Dinner">Dinner</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business">Business</option>
                </select>
                <div className="hint">Optional, helps us prepare.</div>
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" type="button" onClick={onBack}>Back</button>
              <button className="btn btn-primary" type="button" onClick={onNext}>Next</button>
            </div>
          </fieldset>
        </article>

        <aside className="card" style={{ padding: "1.25rem" }} aria-label="Summary">
          <h3 style={{ marginTop: 0 }}>Summary</h3>
          <div className="summary" aria-live="polite">
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Diners:</strong> {booking.diners}</p>
            <p><strong>Occasion:</strong> {booking.occasion}</p>
          </div>
          <div className="notice" style={{ marginTop: ".9rem" }}>
            Tip: You can still edit these details on the previous step.
          </div>
        </aside>
      </div>
    </section>
  );
}

type DetailsProps = {
  booking: Booking;
  customer: Customer;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors: CustomerErrors;
  touched: Touched;
  isValid: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

function DetailsScreen({ booking, customer, onChange, onBlur, errors, touched, isValid, onSubmit, onBack }: DetailsProps): JSX.Element {
  return (
    <section className="section" aria-labelledby="details-title">
      <h2 id="details-title">Customer details</h2>
      <div className="grid2">
        <article className="card form-card">
          <form onSubmit={onSubmit} noValidate aria-describedby="required-note">
            <p id="required-note" className="hint" style={{ marginTop: 0 }}>
              Fields marked with <span className="req" aria-hidden="true">*</span> are required.
            </p>

            <div className="form-grid">
              <label className="label">
                First name <span className="req" aria-hidden="true">*</span>
                <input
                  name="firstName"
                  value={customer.firstName}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={!!touched.firstName && !!errors.firstName}
                  aria-required="true"
                  autoComplete="given-name"
                />
                {!!touched.firstName && errors.firstName ? (
                  <div className="error" role="alert">{errors.firstName}</div>
                ) : (
                  <div className="hint">Required for the booking.</div>
                )}
              </label>

              <label className="label">
                Last name <span className="req" aria-hidden="true">*</span>
                <input
                  name="lastName"
                  value={customer.lastName}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={!!touched.lastName && !!errors.lastName}
                  aria-required="true"
                  autoComplete="family-name"
                />
                {!!touched.lastName && errors.lastName ? (
                  <div className="error" role="alert">{errors.lastName}</div>
                ) : (
                  <div className="hint">Required for the booking.</div>
                )}
              </label>

              <label className="label">
                Email <span className="req" aria-hidden="true">*</span>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={!!touched.email && !!errors.email}
                  aria-required="true"
                  autoComplete="email"
                  placeholder="name@example.com"
                />
                {!!touched.email && errors.email ? (
                  <div className="error" role="alert">{errors.email}</div>
                ) : (
                  <div className="hint">We’ll send your confirmation here.</div>
                )}
              </label>

              <label className="label">
                Phone <span className="req" aria-hidden="true">*</span>
                <input
                  name="phone"
                  value={customer.phone}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={!!touched.phone && !!errors.phone}
                  aria-required="true"
                  autoComplete="tel"
                  placeholder="+359 ..."
                />
                {!!touched.phone && errors.phone ? (
                  <div className="error" role="alert">{errors.phone}</div>
                ) : (
                  <div className="hint">In case we need to reach you.</div>
                )}
              </label>

              <label className="label" style={{ gridColumn: "1 / -1" }}>
                Notes (optional)
                <input
                  name="notes"
                  value={customer.notes}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Allergies, stroller, seating preferences…"
                />
                <div className="hint">Optional, but helpful for special requests.</div>
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" type="button" onClick={onBack}>Back</button>
              <button
                className="btn btn-primary"
                type="submit"
                aria-disabled={!isValid}
                title={!isValid ? "Please complete required fields" : ""}
              >
                Confirm reservation
              </button>
            </div>
          </form>
        </article>

        <aside className="card" style={{ padding: "1.25rem" }} aria-label="Booking recap">
          <h3 style={{ marginTop: 0 }}>Booking recap</h3>
          <div className="summary">
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Diners:</strong> {booking.diners}</p>
            <p><strong>Occasion:</strong> {booking.occasion}</p>
          </div>
          <div className="notice" style={{ marginTop: ".9rem" }}>
            Required fields show warnings after you leave the input (blur) or on submit.
          </div>
        </aside>
      </div>
    </section>
  );
}

type SuccessProps = {
  booking: Booking;
  customer: Customer;
  onHome: () => void;
  onNew: () => void;
  submitted: boolean;
};

function SuccessScreen({ booking, customer, onHome, onNew }: SuccessProps): JSX.Element {
  return (
    <section className="section" aria-labelledby="success-title">
      <div className="card" style={{ padding: "1.25rem" }}>
        <h2 id="success-title" style={{ marginTop: 0 }}>Reservation confirmed ✅</h2>
        <p style={{ marginTop: ".25rem", lineHeight: 1.6 }}>
          Thanks, <strong>{customer.firstName || "guest"}</strong>! We’ve saved your table.
        </p>

        <div className="grid2" style={{ marginTop: "1rem" }}>
          <article className="summary" aria-label="Confirmation details">
            <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Diners:</strong> {booking.diners}</p>
            <p><strong>Occasion:</strong> {booking.occasion}</p>
          </article>

          <article className="notice" aria-label="Next steps">
            <strong>Next steps</strong>
            <ul>
              <li>Arrive 5–10 minutes early for the best seating.</li>
              <li>If you need changes, just re-book for now (demo).</li>
              <li>See you at Little Lemon!</li>
            </ul>
          </article>
        </div>

        <div className="form-actions" style={{ marginTop: "1rem" }}>
          <button className="btn btn-ghost" onClick={onHome}>Back to Home</button>
          <button className="btn btn-dark" onClick={onNew}>Make another reservation</button>
        </div>
      </div>
    </section>
  );
}

/** =====================
 *  What I learned + Continued development
 *  ===================== */
function LearningAndDevSection(): JSX.Element {
  return (
    <section id="learn" className="section" aria-labelledby="learn-title">
      <h2 id="learn-title">What I learned</h2>
      <div className="grid2">
        <article className="card" style={{ padding: "1.25rem" }}>
          <p style={{ marginTop: 0, lineHeight: 1.6 }}>
            Making this webpage was quite the challenge due to the amount of material I had to incorporate.
            If I had to summarize the three major takeaways, I’d say:
          </p>
          <ul>
            <li>
              Bringing together multiple skills from throughout the course to solve a real-world problem by building an app.
            </li>
            <li>
              Requiring me to think differently about building a page and how to approach it (structure, semantics, state, validation).
            </li>
            <li>
              Working through issues with classmates taught me how to ask better questions to get more specific advice.
            </li>
            <li>
              And being the first time I took a project from guidelines → wireframe → prototype → production.
            </li>
          </ul>
        </article>

        <article className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginTop: 0 }}>Code I’m particularly proud of</h3>
          <p style={{ marginTop: ".25rem", lineHeight: 1.6 }}>
            Using CSS custom properties (design tokens) helped keep the styling consistent across pages.
          </p>
          <pre aria-label="CSS variables snippet"><code>{`* {
  --primary-1: #495E57;
  --primary-2: #f4ce14;
  --black: #000000;
  --white: #ffffff;
  --secondary-1: #ee9972;
  --secondary-2: #fbdabb;
  --highlight-1: #edefee;
  --highlight-2: #333333;
}`}</code></pre>
        </article>
      </div>

      <div className="section" aria-labelledby="dev-title">
        <h2 id="dev-title">Continued development</h2>
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ marginTop: 0, lineHeight: 1.6 }}>
            This webpage is far from being done yet. Here are some things I’d like to do in the future with it:
          </p>
          <ul>
            <li>Fix styling issues</li>
            <li>Make a functional navigation bar (multi-page routing)</li>
            <li>Adding more interactivity (availability API, table types, cancellation)</li>
            <li>And the list goes on…</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
