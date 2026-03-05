import { useState, useEffect, useRef } from "react";

const BRAND = {
  primary: "#0D1B2A",
  accent: "#E85D3A",
  accentHover: "#D14E2D",
  surface: "#F7F5F2",
  card: "#FFFFFF",
  muted: "#8A8578",
  border: "#E8E4DE",
  success: "#2D8A54",
  successBg: "#E8F5ED",
  text: "#1B1B18",
  textSecondary: "#5C584F",
  warm: "#FFF8F0",
};

const MENU_ITEMS = [
  { id: 1, name: "Smash Burger", emoji: "🍔", price: 149, desc: "Dobbel smash patty, cheddar, karamellisert løk", category: "Burgere" },
  { id: 2, name: "Cheeseburger", emoji: "🍔", price: 129, desc: "Klassisk med cheddar, salat, tomat", category: "Burgere" },
  { id: 3, name: "Crispy Chicken", emoji: "🍗", price: 139, desc: "Sprøstekt kylling, sriracha-mayo, coleslaw", category: "Burgere" },
  { id: 4, name: "Loaded Fries", emoji: "🍟", price: 89, desc: "Cheese sauce, bacon bits, jalapeño", category: "Sides" },
  { id: 5, name: "Sweet Potato Fries", emoji: "🍠", price: 69, desc: "Med aioli", category: "Sides" },
  { id: 6, name: "Cola", emoji: "🥤", price: 39, desc: "0.5L", category: "Drikke" },
  { id: 7, name: "Lemonade", emoji: "🍋", price: 49, desc: "Hjemmelaget sitronlimonade", category: "Drikke" },
  { id: 8, name: "Milkshake", emoji: "🥛", price: 79, desc: "Vanilje, sjokolade eller jordbær", category: "Drikke" },
];

const PICKUP_TIMES = ["18:15", "18:30", "18:45", "19:00", "19:15", "19:30"];

const STEPS = ["Meny", "Handlekurv", "Levering", "Detaljer", "Info", "Oversikt", "Betaling", "Bekreftelse"];

// ── Utility ──
const fmt = (n) => `${n} kr`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Animated mount wrapper ──
function FadeIn({ children, delay = 0, className = "" }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}

// ── Components ──

function ProgressBar({ step }) {
  const labels = ["Meny", "Kurv", "Type", "Detaljer", "Info", "Oversikt", "Betal", "✓"];
  const activeIndex = STEPS.indexOf(step);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "16px 20px", background: BRAND.card, borderBottom: `1px solid ${BRAND.border}` }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < labels.length - 1 ? 1 : "none" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            background: i <= activeIndex ? BRAND.accent : BRAND.border,
            color: i <= activeIndex ? "#fff" : BRAND.muted,
            transition: "all 0.3s ease",
          }}>
            {i < activeIndex ? "✓" : i + 1}
          </div>
          {i < labels.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 4px",
              background: i < activeIndex ? BRAND.accent : BRAND.border,
              transition: "background 0.3s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function StickyBottom({ children }) {
  return (
    <div style={{
      position: "sticky", bottom: 0, padding: "16px 20px", paddingBottom: 20,
      background: `linear-gradient(transparent, ${BRAND.surface} 20%)`,
      pointerEvents: "none",
    }}>
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, small }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: small ? "auto" : "100%",
        padding: small ? "10px 24px" : "16px 24px",
        background: disabled ? BRAND.border : hover ? BRAND.accentHover : BRAND.accent,
        color: disabled ? BRAND.muted : "#fff",
        border: "none",
        borderRadius: 14,
        fontSize: small ? 14 : 16,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        boxShadow: hover && !disabled ? "0 4px 16px rgba(232,93,58,0.3)" : "none",
        fontFamily: "inherit",
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        padding: "16px 20px",
        background: active ? BRAND.warm : hover ? "#FAFAF7" : BRAND.card,
        border: `2px solid ${active ? BRAND.accent : BRAND.border}`,
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        color: BRAND.text,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: BRAND.card,
      borderRadius: 16,
      border: `1px solid ${BRAND.border}`,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function QuantityControl({ qty, onInc, onDec }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, background: BRAND.surface, borderRadius: 10, border: `1px solid ${BRAND.border}` }}>
      <button onClick={onDec} style={{
        width: 36, height: 36, border: "none", background: "transparent",
        cursor: "pointer", fontSize: 18, color: BRAND.muted, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit",
      }}>−</button>
      <span style={{ width: 28, textAlign: "center", fontWeight: 700, fontSize: 14, color: BRAND.text }}>{qty}</span>
      <button onClick={onInc} style={{
        width: 36, height: 36, border: "none", background: "transparent",
        cursor: "pointer", fontSize: 18, color: BRAND.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit",
      }}>+</button>
    </div>
  );
}

function Header({ title, onBack, step }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      background: BRAND.primary, color: "#fff",
      padding: "0",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
        {onBack ? (
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
            width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit",
          }}>←</button>
        ) : <div style={{ width: 36 }} />}
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "0.02em" }}>{title}</span>
        <div style={{ width: 36 }} />
      </div>
      <ProgressBar step={step} />
    </div>
  );
}

// ── Steps ──

function MenuStep({ cart, setCart, onNext }) {
  const categories = [...new Set(MENU_ITEMS.map(i => i.category))];
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = MENU_ITEMS.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);

  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(prev => {
    const n = { ...prev };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  return (
    <div style={{ paddingBottom: cartCount > 0 ? 100 : 20 }}>
      {categories.map((cat, ci) => (
        <FadeIn key={cat} delay={ci * 80}>
          <div style={{ padding: "20px 20px 8px" }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BRAND.muted }}>{cat}</h3>
          </div>
          {MENU_ITEMS.filter(i => i.category === cat).map((item, ii) => (
            <FadeIn key={item.id} delay={ci * 80 + ii * 50}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                borderBottom: `1px solid ${BRAND.border}`,
                background: cart[item.id] ? BRAND.warm : "transparent",
                transition: "background 0.2s ease",
              }}>
                <div style={{ fontSize: 32, width: 44, textAlign: "center", flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 2 }}>{item.desc}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.accent, marginTop: 4 }}>{fmt(item.price)}</div>
                </div>
                {cart[item.id] ? (
                  <QuantityControl qty={cart[item.id]} onInc={() => addToCart(item.id)} onDec={() => removeFromCart(item.id)} />
                ) : (
                  <button onClick={() => addToCart(item.id)} style={{
                    background: BRAND.accent, color: "#fff", border: "none",
                    width: 36, height: 36, borderRadius: 10, fontSize: 20,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "inherit", fontWeight: 400, transition: "transform 0.15s ease",
                  }}>+</button>
                )}
              </div>
            </FadeIn>
          ))}
        </FadeIn>
      ))}
      {cartCount > 0 && (
        <StickyBottom>
          <PrimaryButton onClick={onNext}>
            Handlekurv ({cartCount}) — {fmt(cartTotal)}
          </PrimaryButton>
        </StickyBottom>
      )}
    </div>
  );
}

function CartStep({ cart, setCart, onNext, subtotal }) {
  const items = MENU_ITEMS.filter(i => cart[i.id]);
  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(prev => {
    const n = { ...prev };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      <Card>
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 60}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 0",
              borderBottom: i < items.length - 1 ? `1px solid ${BRAND.border}` : "none",
            }}>
              <div style={{ fontSize: 28 }}>{item.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                <div style={{ fontSize: 14, color: BRAND.muted, marginTop: 2 }}>{fmt(item.price * cart[item.id])}</div>
              </div>
              <QuantityControl qty={cart[item.id]} onInc={() => addToCart(item.id)} onDec={() => removeFromCart(item.id)} />
            </div>
          </FadeIn>
        ))}
      </Card>

      <FadeIn delay={200}>
        <div style={{ marginTop: 20, padding: "0 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.textSecondary, marginBottom: 8 }}>
            <span>Mat subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.muted }}>
            <span>Levering</span><span>beregnes i neste steg</span>
          </div>
        </div>
      </FadeIn>

      <StickyBottom>
        <PrimaryButton onClick={onNext}>Gå til utsjekk — {fmt(subtotal)}</PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function ServiceStep({ serviceType, setServiceType, onNext }) {
  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      <FadeIn>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Leveringsmåte</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: BRAND.muted }}>Hvordan vil du få maten?</p>
      </FadeIn>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FadeIn delay={80}>
          <SecondaryButton active={serviceType === "pickup"} onClick={() => setServiceType("pickup")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>🏪</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Hent selv</div>
                <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 400, marginTop: 2 }}>Klar om ca. 15 min</div>
              </div>
            </div>
          </SecondaryButton>
        </FadeIn>
        <FadeIn delay={160}>
          <SecondaryButton active={serviceType === "delivery"} onClick={() => setServiceType("delivery")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>🚗</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Levering</div>
                <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 400, marginTop: 2 }}>35–45 min estimert</div>
              </div>
            </div>
          </SecondaryButton>
        </FadeIn>
      </div>

      <StickyBottom>
        <PrimaryButton onClick={onNext} disabled={!serviceType}>Neste</PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function DetailsStep({ serviceType, pickupTime, setPickupTime, address, setAddress, addressError, setAddressError, onNext }) {
  const isPickup = serviceType === "pickup";
  const [addressChecked, setAddressChecked] = useState(false);

  const handleAddressSubmit = () => {
    if (!address.trim()) return;
    if (address.toLowerCase().includes("drammen") || address.toLowerCase().includes("bergen")) {
      setAddressError(true);
      setAddressChecked(true);
    } else {
      setAddressError(false);
      setAddressChecked(true);
    }
  };

  const canProceed = isPickup ? !!pickupTime : (addressChecked && !addressError && address.trim());

  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      {isPickup ? (
        <>
          <FadeIn>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Hentetidspunkt</h2>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: BRAND.muted }}>Når vil du hente?</p>
          </FadeIn>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <FadeIn delay={80}>
              <SecondaryButton active={pickupTime === "asap"} onClick={() => setPickupTime("asap")}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Så snart som mulig</div>
                    <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 400 }}>Klar ca. 15 min</div>
                  </div>
                  <span style={{ fontSize: 22 }}>⚡</span>
                </div>
              </SecondaryButton>
            </FadeIn>
            <FadeIn delay={140}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BRAND.muted, marginTop: 8, marginBottom: 4, paddingLeft: 4 }}>
                Eller velg tidspunkt
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {PICKUP_TIMES.map((t, i) => (
                <FadeIn key={t} delay={180 + i * 40}>
                  <SecondaryButton active={pickupTime === t} onClick={() => setPickupTime(t)}>
                    <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15 }}>{t}</div>
                  </SecondaryButton>
                </FadeIn>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <FadeIn>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Leveringsadresse</h2>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: BRAND.muted }}>Hvor skal vi levere?</p>
          </FadeIn>

          <FadeIn delay={80}>
            <Card>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Skriv adresse..."
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setAddressChecked(false); setAddressError(false); }}
                  style={{
                    flex: 1, padding: "14px 16px", border: `2px solid ${addressError ? "#D44" : BRAND.border}`,
                    borderRadius: 12, fontSize: 15, fontFamily: "inherit", outline: "none",
                    transition: "border-color 0.2s ease", background: BRAND.surface,
                  }}
                  onFocus={(e) => e.target.style.borderColor = BRAND.accent}
                  onBlur={(e) => e.target.style.borderColor = addressError ? "#D44" : BRAND.border}
                />
              </div>
              <button
                onClick={handleAddressSubmit}
                style={{
                  display: "flex", alignItems: "center", gap: 8, marginTop: 12,
                  background: "none", border: "none", color: BRAND.accent, fontSize: 14,
                  fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit",
                }}
              >
                📍 Sjekk adresse
              </button>

              {addressChecked && !addressError && (
                <FadeIn>
                  <div style={{
                    marginTop: 16, padding: 14, background: BRAND.successBg, borderRadius: 12,
                    fontSize: 14, color: BRAND.success, fontWeight: 600,
                  }}>
                    ✓ Levering: 59 kr · Estimert 35–45 min
                  </div>
                </FadeIn>
              )}
              {addressError && (
                <FadeIn>
                  <div style={{
                    marginTop: 16, padding: 14, background: "#FEF1F0", borderRadius: 12,
                    fontSize: 14, color: "#C44", fontWeight: 600,
                  }}>
                    Vi leverer dessverre ikke til denne adressen
                  </div>
                </FadeIn>
              )}
            </Card>
          </FadeIn>

          {!addressChecked && (
            <FadeIn delay={200}>
              <p style={{ fontSize: 13, color: BRAND.muted, marginTop: 16, textAlign: "center" }}>
                Prøv f.eks. «Karl Johans gate 12, Oslo»
              </p>
            </FadeIn>
          )}
        </>
      )}

      <StickyBottom>
        <PrimaryButton onClick={onNext} disabled={!canProceed}>Neste</PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function CustomerInfoStep({ customerInfo, setCustomerInfo, onNext }) {
  const update = (field, val) => setCustomerInfo(prev => ({ ...prev, [field]: val }));
  const canProceed = customerInfo.name.trim() && customerInfo.phone.trim();

  const inputStyle = {
    width: "100%", padding: "14px 16px", border: `2px solid ${BRAND.border}`,
    borderRadius: 12, fontSize: 15, fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s ease", background: BRAND.surface,
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      <FadeIn>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Kontaktinfo</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: BRAND.muted }}>Så vi kan oppdatere deg om bestillingen</p>
      </FadeIn>

      <FadeIn delay={80}>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted, marginBottom: 6 }}>Navn *</label>
              <input type="text" placeholder="Ditt navn" value={customerInfo.name} onChange={(e) => update("name", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = BRAND.accent}
                onBlur={(e) => e.target.style.borderColor = BRAND.border}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted, marginBottom: 6 }}>Telefon *</label>
              <input type="tel" placeholder="900 00 000" value={customerInfo.phone} onChange={(e) => update("phone", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = BRAND.accent}
                onBlur={(e) => e.target.style.borderColor = BRAND.border}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted, marginBottom: 6 }}>E-post (valgfritt)</label>
              <input type="email" placeholder="din@epost.no" value={customerInfo.email} onChange={(e) => update("email", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = BRAND.accent}
                onBlur={(e) => e.target.style.borderColor = BRAND.border}
              />
            </div>
          </div>
        </Card>
      </FadeIn>

      <StickyBottom>
        <PrimaryButton onClick={onNext} disabled={!canProceed}>Neste</PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function ReviewStep({ cart, serviceType, pickupTime, address, customerInfo, comment, setComment, subtotal, onNext }) {
  const deliveryFee = serviceType === "delivery" ? 59 : 0;
  const serviceFee = 5;
  const total = subtotal + deliveryFee + serviceFee;
  const items = MENU_ITEMS.filter(i => cart[i.id]);

  const displayTime = pickupTime === "asap" ? "ca. 15 min" : pickupTime;

  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      <FadeIn>
        <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Din bestilling</h2>
      </FadeIn>

      <FadeIn delay={60}>
        <Card>
          {items.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0",
              borderBottom: i < items.length - 1 ? `1px solid ${BRAND.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                  {cart[item.id] > 1 && <div style={{ fontSize: 13, color: BRAND.muted }}>{cart[item.id]} stk</div>}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{fmt(item.price * cart[item.id])}</div>
            </div>
          ))}

          <div style={{ borderTop: `2px solid ${BRAND.border}`, marginTop: 8, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.textSecondary }}>
              <span>Mat subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            {serviceType === "delivery" && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.textSecondary }}>
                <span>Levering</span><span>{fmt(deliveryFee)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: BRAND.textSecondary }}>
              <span>Service fee</span><span>{fmt(serviceFee)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: BRAND.text, marginTop: 4, paddingTop: 10, borderTop: `2px solid ${BRAND.border}` }}>
              <span>Totalt</span><span>{fmt(total)}</span>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={140}>
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted, marginBottom: 10 }}>
            {serviceType === "delivery" ? "Leveres til" : "Hentes hos"}
          </div>
          {serviceType === "delivery" ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>{address}</div>
              <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 4 }}>Estimert levering: 35–45 min</div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>Burger Lab Grünerløkka</div>
              <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 4 }}>Klar {displayTime}</div>
            </>
          )}
        </Card>
      </FadeIn>

      <FadeIn delay={200}>
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.muted, marginBottom: 10 }}>
            Kommentar til restauranten
          </div>
          <textarea
            placeholder="F.eks. ingen løk, ring på døra..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "12px 14px", border: `2px solid ${BRAND.border}`,
              borderRadius: 12, fontSize: 14, fontFamily: "inherit", outline: "none",
              resize: "vertical", background: BRAND.surface, boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = BRAND.accent}
            onBlur={(e) => e.target.style.borderColor = BRAND.border}
          />
        </Card>
      </FadeIn>

      <StickyBottom>
        <PrimaryButton onClick={onNext}>Velg betaling — {fmt(total)}</PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function PaymentStep({ total, onNext }) {
  const [method, setMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    await sleep(2000);
    onNext();
  };

  return (
    <div style={{ padding: 20, paddingBottom: 110 }}>
      <FadeIn>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: BRAND.text }}>Betaling</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: BRAND.muted }}>Velg betalingsmåte</p>
      </FadeIn>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FadeIn delay={80}>
          <SecondaryButton active={method === "vipps"} onClick={() => setMethod("vipps")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: "#FF5B24",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "-0.02em",
              }}>Vipps</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Vipps</div>
                <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 400, marginTop: 2 }}>Betal med Vipps-appen</div>
              </div>
            </div>
          </SecondaryButton>
        </FadeIn>
        <FadeIn delay={160}>
          <SecondaryButton active={method === "card"} onClick={() => setMethod("card")}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: BRAND.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 20,
              }}>💳</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Kort</div>
                <div style={{ fontSize: 13, color: BRAND.muted, fontWeight: 400, marginTop: 2 }}>Visa, Mastercard</div>
              </div>
            </div>
          </SecondaryButton>
        </FadeIn>
      </div>

      {processing && (
        <FadeIn>
          <div style={{
            position: "fixed", inset: 0, background: "rgba(13,27,42,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}>
            <div style={{
              width: 64, height: 64, border: "4px solid rgba(255,255,255,0.2)",
              borderTopColor: BRAND.accent, borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#fff", marginTop: 20, fontWeight: 600, fontSize: 16 }}>
              {method === "vipps" ? "Åpner Vipps..." : "Behandler betaling..."}
            </p>
          </div>
        </FadeIn>
      )}

      <StickyBottom>
        <PrimaryButton onClick={handlePay} disabled={!method || processing}>
          Betal {fmt(total)}
        </PrimaryButton>
      </StickyBottom>
    </div>
  );
}

function ConfirmationStep({ cart, serviceType, pickupTime, address, total, onReset }) {
  const items = MENU_ITEMS.filter(i => cart[i.id]);
  const orderNum = Math.floor(3000 + Math.random() * 1000);
  const displayTime = pickupTime === "asap" ? "ca. 15 min" : pickupTime;

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <FadeIn>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: BRAND.successBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "20px auto 20px", fontSize: 36,
        }}>
          🎉
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: BRAND.text }}>Takk for bestillingen!</h2>
        <p style={{ margin: 0, fontSize: 15, color: BRAND.muted }}>Ordrenummer <strong>#{orderNum}</strong></p>
      </FadeIn>

      <FadeIn delay={200}>
        <Card style={{ marginTop: 24, textAlign: "left" }}>
          <div style={{
            padding: "14px 0", borderBottom: `1px solid ${BRAND.border}`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>{serviceType === "delivery" ? "🚗" : "🏪"}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {serviceType === "delivery" ? "Estimert levering" : "Klar til henting"}
              </div>
              <div style={{ fontSize: 14, color: BRAND.muted, marginTop: 2 }}>
                {serviceType === "delivery" ? "35–45 min" : displayTime}
              </div>
            </div>
          </div>

          {items.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", justifyContent: "space-between", padding: "10px 0",
              fontSize: 14, borderBottom: i < items.length - 1 ? `1px solid ${BRAND.border}` : "none",
            }}>
              <span>{item.emoji} {item.name} {cart[item.id] > 1 ? `×${cart[item.id]}` : ""}</span>
              <span style={{ fontWeight: 600 }}>{fmt(item.price * cart[item.id])}</span>
            </div>
          ))}

          <div style={{
            display: "flex", justifyContent: "space-between",
            fontWeight: 800, fontSize: 16, paddingTop: 14, marginTop: 8, borderTop: `2px solid ${BRAND.border}`,
          }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={350}>
        <Card style={{ marginTop: 14, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <div style={{ fontSize: 14, color: BRAND.textSecondary }}>
              {serviceType === "delivery"
                ? "Vi ringer når sjåføren er på vei"
                : "Hent maten i baren ved inngangen"}
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={450}>
        <div style={{ marginTop: 28 }}>
          <PrimaryButton onClick={onReset}>Ny bestilling</PrimaryButton>
        </div>
      </FadeIn>
    </div>
  );
}

// ── Main App ──
export default function CheckoutDemo() {
  const [step, setStep] = useState("Meny");
  const [cart, setCart] = useState({});
  const [serviceType, setServiceType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
  const [comment, setComment] = useState("");
  const scrollRef = useRef(null);

  const subtotal = MENU_ITEMS.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);
  const deliveryFee = serviceType === "delivery" ? 59 : 0;
  const serviceFee = 5;
  const total = subtotal + deliveryFee + serviceFee;

  const goTo = (s) => {
    setStep(s);
    scrollRef.current?.scrollTo(0, 0);
  };

  const reset = () => {
    setCart({});
    setServiceType("");
    setPickupTime("");
    setAddress("");
    setAddressError(false);
    setCustomerInfo({ name: "", phone: "", email: "" });
    setComment("");
    goTo("Meny");
  };

  const stepIndex = STEPS.indexOf(step);
  const goBack = stepIndex > 0 && step !== "Bekreftelse" ? () => goTo(STEPS[stepIndex - 1]) : null;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Outfit', system-ui, -apple-system, sans-serif",
      background: BRAND.surface,
      maxWidth: 420,
      margin: "0 auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 0 80px rgba(0,0,0,0.08)",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Top brand bar */}
      <Header
        title={step === "Meny" ? "Burger Lab" : step === "Bekreftelse" ? "Bestilt!" : "Burger Lab"}
        onBack={goBack}
        step={step}
      />

      {/* Live lead time badge */}
      {step === "Meny" && (
        <FadeIn>
          <div style={{
            margin: "16px 20px 0", padding: "10px 16px", background: BRAND.successBg,
            borderRadius: 12, display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 600, color: BRAND.success,
          }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: BRAND.success, animation: "pulse 2s infinite" }} />
            Åpent nå · Klar om ca. 15 min
            <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
          </div>
        </FadeIn>
      )}

      {/* Content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
        {step === "Meny" && <MenuStep cart={cart} setCart={setCart} onNext={() => goTo("Handlekurv")} />}
        {step === "Handlekurv" && <CartStep cart={cart} setCart={setCart} subtotal={subtotal} onNext={() => goTo("Levering")} />}
        {step === "Levering" && <ServiceStep serviceType={serviceType} setServiceType={setServiceType} onNext={() => goTo("Detaljer")} />}
        {step === "Detaljer" && <DetailsStep serviceType={serviceType} pickupTime={pickupTime} setPickupTime={setPickupTime} address={address} setAddress={setAddress} addressError={addressError} setAddressError={setAddressError} onNext={() => goTo("Info")} />}
        {step === "Info" && (
          <CustomerInfoStep customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} onNext={() => goTo("Oversikt")} />
        )}
        {step === "Oversikt" && (
          <ReviewStep cart={cart} serviceType={serviceType} pickupTime={pickupTime} address={address} customerInfo={customerInfo} comment={comment} setComment={setComment} subtotal={subtotal} onNext={() => goTo("Betaling")} />
        )}
        {step === "Betaling" && (
          <PaymentStep total={total} onNext={() => goTo("Bekreftelse")} />
        )}
        {step === "Bekreftelse" && (
          <ConfirmationStep cart={cart} serviceType={serviceType} pickupTime={pickupTime} address={address} total={total} onReset={reset} />
        )}
      </div>
    </div>
  );
}
