# Owner Dashboard - Quick Test Guide

## 🧪 TESTING YOUR NEW TABS

### Start the Development Server
```powershell
cd frontend
npm run dev
```

---

## 📋 TEST EACH TAB

### 1️⃣ Executive Overview (Default)
**URL**: `http://localhost:3000/banking/smart-bank/owner`

**What to Check**:
- ✅ Shows all existing KPI cards
- ✅ Revenue, Assets, Customers, Profit metrics
- ✅ Performance charts
- ✅ Money distribution
- ✅ AI insights panel
- ✅ **Nothing changed here!**

---

### 2️⃣ Treasury & Investments
**URL**: `http://localhost:3000/banking/smart-bank/owner?tab=treasury`

**What to Check**:
- ✅ Blue-teal gradient header
- ✅ "Treasury & Investments" title
- ✅ 6 feature cards:
  - Liquidity Coverage Ratio
  - Sukuk Portfolio
  - ROI by Contract
  - Funding Sources
  - FX & Commodity
  - Safe vs Strategic
- ✅ Blue information banner at bottom

---

### 3️⃣ Risk & Compliance
**URL**: `http://localhost:3000/banking/smart-bank/owner?tab=risk-compliance`

**What to Check**:
- ✅ Amber-blue gradient header
- ✅ "Risk & Compliance" title
- ✅ 6 feature cards:
  - Credit Risk Index
  - Market Risk Index
  - Operational Risk
  - NPF Ratio
  - Shariah Monitor
  - AI Early Warning
- ✅ Amber information banner

---

### 4️⃣ AI Intelligence Hub
**URL**: `http://localhost:3000/banking/smart-bank/owner?tab=ai-intelligence`

**What to Check**:
- ✅ Shows existing AI Insights page
- ✅ AI recommendations
- ✅ Forecasts and opportunities
- ✅ Same content as before (just renamed in sidebar)

---

### 5️⃣ Strategic Governance
**URL**: `http://localhost:3000/banking/smart-bank/owner?tab=governance`

**What to Check**:
- ✅ Gray-blue gradient header
- ✅ "Strategic Governance" title
- ✅ 6 feature cards:
  - Department Index
  - Staff Productivity
  - CSR / Zakat Impact
  - Board Decisions
  - ESG Overview
  - Culture & Values
- ✅ Purple information banner

---

### 6️⃣ Department Overview
**URL**: `http://localhost:3000/banking/smart-bank`

**What to Check**:
- ✅ Shows main department selection page
- ✅ All departments listed
- ✅ Navigation to other departments works

---

## 📱 MOBILE TESTING

### Desktop (Width ≥ 1024px)
1. Open browser to full screen
2. ✅ Sidebar should be always visible on left
3. ✅ No hamburger menu
4. ✅ Content on right side

### Tablet/Mobile (Width < 1024px)
1. Resize browser window to < 1024px wide
2. ✅ Hamburger menu appears (top-left)
3. ✅ Click hamburger → sidebar slides in
4. ✅ Click any tab → sidebar closes automatically
5. ✅ Click backdrop → sidebar closes

---

## 🎨 SIDEBAR VISUAL CHECK

### In Sidebar, You Should See:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🏦 Smart Bank                 ┃
┃     Enterprise Portal           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Department                     ┃
┃  CEO / Owner                    ┃
┃  Executive Leadership           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  📊 Executive Overview          ┃
┃  📈 Treasury & Investments      ┃
┃  🛡️  Risk & Compliance          ┃
┃  🧠 AI Intelligence Hub    [AI] ┃
┃  👥 Strategic Governance        ┃
┃  🏦 Department Overview         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## ✅ ACTIVE STATE CHECK

Click each tab and verify:
- ✅ Background turns blue when active
- ✅ Text color becomes darker blue
- ✅ Icon color matches text
- ✅ URL changes in browser
- ✅ Content changes correctly

---

## 🐛 TROUBLESHOOTING

### Tab Doesn't Navigate?
1. Check console for errors (F12)
2. Verify URL has `?tab=` parameter
3. Check sidebar `href` matches route

### Content Not Showing?
1. Verify component imported in page.tsx
2. Check routing logic has correct tab name
3. Ensure component exported correctly

### Sidebar Not Visible on Mobile?
1. Click hamburger menu (top-left)
2. Check browser width is < 1024px
3. Verify z-index not blocked

### Active State Not Highlighting?
1. Check URL parameter matches href
2. Verify `isActive()` function working
3. Ensure tab name exactly matches

---

## 🎯 QUICK VALIDATION CHECKLIST

Run through this in 2 minutes:

- [ ] Load main page (Executive Overview shows)
- [ ] Click Treasury → new component loads
- [ ] Click Risk & Compliance → new component loads
- [ ] Click AI Intelligence Hub → AI insights show
- [ ] Click Governance → new component loads
- [ ] Click Executive Overview → back to dashboard
- [ ] Resize to mobile → hamburger appears
- [ ] Click hamburger → sidebar opens
- [ ] Click tab → sidebar closes
- [ ] Active tab highlights correctly

If all ✅ → **You're good to go!** 🚀

---

## 🎨 COLOR VERIFICATION

### Each Tab Should Have Unique Colors:

| Tab | Header Gradient | Border/Accent |
|-----|----------------|---------------|
| Executive Overview | Blue-Black | Blue |
| Treasury | Blue-Teal | Blue/Green |
| Risk & Compliance | Amber-Blue | Amber/Blue |
| AI Intelligence | Same as existing | Yellow/Blue |
| Governance | Gray-Blue | Purple |

---

## 📊 CONSOLE CHECK

Open browser console (F12) and verify:
- ✅ No red errors
- ✅ No 404 file not found
- ✅ No module import errors
- ✅ No React warnings

---

## 🏁 FINAL CHECK

If you can click through all 5 tabs without errors, see the placeholder content, and the sidebar highlights the active tab → **✅ PERFECT!**

---

**Happy Testing!** 🎉

If everything works, you now have a fully functional Owner dashboard with professional navigation and structure ready for content!
