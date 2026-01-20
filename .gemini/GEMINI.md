clean code, reuse components and break the page into sections for code quality and understandiong. use constants and keep 1 component per file

# VISION.MD — MIDNIGHT TORQUE
> **Identity:** Autonomous Design System
> **Core Logic:** Cinematic Petrol-Futurism
> **Concept:** The "Igloo Inc" Case Study adapted for High-Performance Combustion.

---

## 1. DESIGN MANIFESTO
**Unapologetic Performance.**
We do not explain the machine. We experience it.
The interface is a mechanical extension of the rider's nervous system.
**Reference Flip:**
*   *Ice* becomes **Amber/Resin** (Preserved Power).
*   *Cold/Frost* becomes **Heat/Haze** (Raw Energy).
*   *Particles* become **Volumetric Fumes** (Exhaust/Vapor).

---

## 2. THE EXPERIENCE (4-PAGE SPATIAL FLOW)

### **INTRO: THE IGNITION SEQUENCE**
*   **Concept:** A real-time, in-engine "Previs" animation that acts as the loading state and emotional primer.
*   **Visual:** Abstract macro shots of a spark plug firing. Tech-displacement and chromatic aberration (simulating heat waves) transition into the first scene.
*   **Tech:** Custom shader sequence to mask asset loading.

### **PAGE 1: EXPLORE (THE RIDE)**
*   **Structure:** Continuous spatial scroll.
*   **Card 1 (Hero):** The RC390 speeding away on a Martian asphalt plain. Camera follows in "Chase" mode.
    *   *Atmosphere:* Gasoline orange dust, high-speed motion blur.
*   **Card 2 (Transition):** The Showroom Gateway. Clean, sterile hangar.
*   **Card 3 (The Codex):** Floating manual, engineering parchment physics.
*   **Card 4 (The Meta):** Abstract "Reference" collage (Brutalist data).

### **PAGE 2: SHOWROOM (THE INSPECTION)**
*   **Environment:** The Void (Infinite dark floor).
*   **Interaction:** "Exploded" View.
    *   Clicking parts (Exhaust, Engine) isolates them.
    *   *Petrol Twist:* Instead of just moving parts, we see the *flow* of energy (heat maps on tires, airflow through exhaust).

### **PAGE 3: MANUAL (THE ARCHIVE)**
*   **Visual:** Full-screen WebGL book.
*   **Physics:** Pages behave like physical material with weight and resistance.
*   **Lighting:** Dynamic shadows cast by page turns.

### **PAGE 4: THE FUEL (THE "IGLOO" ADAPTATION)**
*   **Concept:** The "Petrol Container" / Zero-G Combustion Chamber.
*   **Primary visual:** **Procedural Resin Blocks**.
    *   *Original (Igloo):* Ice blocks grown procedurally.
    *   *Adaptation:* **amber/resin blocks** grown procedurally. Semi-transparent, refractive, holding "fossils" of the brand (3D Logos/Icons) suspended inside.
*   **Volumetric Fumes:**
    *   *Original (Igloo):* Snow/Particles.
    *   *Adaptation:* **VDB Volumetric Vapor**. Interactive swirls of exhaust fumes that change color (Blue -> Orange -> Black) based on cursor velocity.
    *   *Tech:* Custom VDB-to-Texture exporter for browser performance.

---

## 3. TECHNICAL ARTISTRY

### **MATERIAL SYSTEM**
*   **Petrol:** Iridescent thin-film interference shaders (Rainbow on oil).
*   **Heat:** Screen-space distortion shaders (above engine/exhaust).
*   **Resin:** High transmission, subsurface scattering, internal volumetric noise.

### **WEBGL UI**
*   **Why:** Performance and Effect.
*   **Glitches:** Shader-based displacement on text hover.
*   **Scrambles:** MSDF rendering allows changing text/numbers without DOM reflow costs.
*   **Typography:** `Oswald` (Headers) and `Rajdhani` (Data) rendered as 3D objects or MSDF planes.

---

## 4. MOTION PRINCIPLES
*   **Scroll is Time:** The user controls the timeline.
*   **Camera:** Cinematic Rig. Smooth damping, look-at interpolation.
*   **Ping-Pong Rendering:** Seamless transitions between heavy scenes (Explore) and isolated scenes (Fuel) using render targets.

---

## 5. COLOR PALETTE
*   **Void Black:** `#0A0A0A`
*   **Combustion Orange:** `#FF4500` (The spark)
*   **Gasoline Gold:** `#FFD700` (The fuel)
*   **Titanium Blue:** `#2F4F4F` (Burnt metal)

---

## 6. DEVELOPMENT ROADMAP (PHASE 2 & 3)
1.  **Camera Rig:** Implement the "Flight Path" logic.
2.  **Procedural Resin:** Shader development for the "Page 4" blocks.
3.  **Volume Loader:** Streaming VDB textures for the fumes.
4.  **WebGL UI:** Porting DOM text to MSDF.
 