# LCR Chart - Quick Visual Guide

## 🎨 WHAT YOU'LL SEE

### Full Chart View
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Liquidity Coverage Ratio (LCR) Trend                                   │
│  12-month historical performance                    ● LCR % | Min: 100% │
├─────────────────────────────────────────────────────────────────────────┤
│  155% ┤                                                                  │
│       │                                                    ●             │
│  150% ┤                                              ●     │             │
│       │                                        ●     │     │             │
│  145% ┤                                  ●     │  ●  │  ●  │             │
│       │                            ●     │     │  │  │  │  │             │
│  140% ┤                      ●     │     │     │  │  │  │  │             │
│       │                ●     │     │     │     │  │  │  │  │             │
│  135% ┤          ●     │     │     │     │     │  │  │  │  │             │
│       │    ●     │     │     │     │     │     │  │  │  │  │             │
│  130% ┤    │     │     │     │     │     │     │  │  │  │  │             │
│       │────┼─────┼─────┼─────┼─────┼─────┼─────┼──┼──┼──┼──┼─────────   │
│  120% └────┴─────┴─────┴─────┴─────┴─────┴─────┴──┴──┴──┴──┴─────────   │
│       - - - - - - - - 100% (Regulatory Min) - - - - - - - - - - - - -   │
│       Jan  Feb  Mar  Apr  May  Jun  Jul  Aug Sep Oct Nov Dec            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ Current LCR     │  │ 12-Month Avg    │  │ Trend Direction │         │
│  │      145%       │  │      141%       │  │    ↑ Upward     │         │
│  │ ↑ 45% above min │  │ Consistently... │  │ +10% YoY growth │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY ELEMENTS

### 1. Header Section
```
Liquidity Coverage Ratio (LCR) Trend
12-month historical performance

● LCR %  |  Regulatory Min: 100%
```
- Title and subtitle
- Legend indicator
- Regulatory minimum badge

---

### 2. Chart Area
```
155% ┤     ●─────●─────●
     │    /│\   /│\   /│
145% ┤   / │ \ / │ \ / │
     │  /  │  ●  │  ●  │
135% ┤ /   │  │  │  │  │
     ●─────┼──┼──┼──┼──┼
     Jan Feb Mar Apr May
```

**Features**:
- Blue line with smooth curve
- Blue dots at each data point
- Blue area fill (subtle gradient)
- Gray grid lines (horizontal)
- Red dashed line at 100%

---

### 3. Interactive Tooltip (on hover)
```
┌─────────────────┐
│  March          │
│  138.0%         │ ← Large, bold
│  ✓ Above min    │ ← Green checkmark
└─────────────────┘
```

**Appears when you hover over any dot**

---

### 4. Insight Cards
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Current LCR     │  │ 12-Month Avg    │  │ Trend Direction │
│                 │  │                 │  │                 │
│     145%        │  │     141%        │  │   ↑ Upward      │
│                 │  │                 │  │                 │
│ ↑ 45% above min │  │ Consistently... │  │ +10% YoY growth │
└─────────────────┘  └─────────────────┘  └─────────────────┘
  Blue theme          Green theme          Cyan theme
```

---

## 📊 DATA VISUALIZATION

### Monthly LCR Values
```
Month    LCR     Visual
───────────────────────────────
Jan      132%    ●
Feb      135%     ●
Mar      138%      ●
Apr      136%     ● (dip)
May      140%       ●
Jun      142%        ●
Jul      141%       ● (slight dip)
Aug      143%         ●
Sep      144%          ●
Oct      145%           ●
Nov      147%            ● (peak)
Dec      145%           ● (current)
```

---

## 🎨 COLOR SCHEME

### Chart Colors
| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Line | Blue | #3B82F6 | Main trend line |
| Area Fill | Blue (10%) | rgba(59,130,246,0.1) | Under the line |
| Dots | Blue + White | #3B82F6 + #FFFFFF | Data points |
| Grid | Light Gray | #E5E7EB | Horizontal lines |
| Reference | Red Dashed | #EF4444 | 100% line |
| Tooltip BG | White | #FFFFFF | Tooltip background |

### Card Colors
| Card | Background | Text |
|------|------------|------|
| Current LCR | Blue-50 | Blue-600 |
| Average | Green-50 | Green-600 |
| Trend | Cyan-50 | Cyan-600 |

---

## 🔍 WHAT TO LOOK FOR

### ✅ Good Signs
- Line stays above red dashed line (100%)
- Upward trend over time
- Consistent values (no wild swings)
- Current value > average

### ⚠️ Warning Signs
- Line approaching red line
- Downward trend
- High volatility
- Current < average

---

## 📱 MOBILE VIEW

### Compact Version
```
┌─────────────────────────┐
│ LCR Trend               │
│ 12-month history        │
├─────────────────────────┤
│       ●                 │
│      /│\                │
│     / │ \               │
│    ●  │  ●              │
│   /│  │  │\             │
│  / │  │  │ \            │
│ ●──┼──┼──┼──●───────    │
│ Jan ... Dec             │
├─────────────────────────┤
│ Current: 145%           │
│ Average: 141%           │
│ Trend: ↑ Upward         │
└─────────────────────────┘
```

**Cards stack vertically on mobile**

---

## 🎯 HOW TO READ THE CHART

### Step-by-Step:

1. **Check current position** (rightmost dot)
   - Is it above the red line? ✅ Good
   - How far above 100%? Higher = better

2. **Look at the trend** (line direction)
   - Upward slope? ✅ Improving
   - Downward? ⚠️ Needs attention

3. **Check consistency** (line smoothness)
   - Smooth line? ✅ Stable
   - Jagged? ⚠️ Volatile

4. **Compare to average** (insight card)
   - Current > Average? ✅ Above normal
   - Current < Average? ⚠️ Below normal

---

## 💡 INTERPRETATION GUIDE

### LCR Ranges:

| LCR % | Status | What It Means |
|-------|--------|---------------|
| < 100% | ❌ Critical | Below regulatory minimum |
| 100-110% | ⚠️ Caution | Just meeting requirement |
| 110-130% | ✅ Good | Healthy buffer |
| 130-150% | ✅ Excellent | Strong liquidity position |
| > 150% | ✅ Superior | Very strong, may be over-liquid |

### Current Chart Shows:
```
145% = Excellent
✅ 45% above regulatory minimum
✅ Strong liquidity position
✅ Upward trend
✅ Consistent performance
```

---

## 🖱️ INTERACTIONS

### What You Can Do:

1. **Hover over dots**
   - Shows exact percentage
   - Shows month name
   - Shows compliance status

2. **View trend**
   - Visual pattern recognition
   - Identify peaks and valleys

3. **Read insights**
   - Quick stats in cards
   - No math needed

---

## 📐 TECHNICAL SPECS

### Chart Dimensions:
- Height: 320px (h-80)
- Width: 100% (responsive)
- Top margin: 10px
- Right margin: 30px
- Left margin: 20px
- Bottom margin: 10px

### Data Point Specs:
- Dot radius: 4px (normal)
- Dot radius: 6px (hover)
- Stroke width: 3px
- Line type: Monotone (smooth curve)

---

## 🎓 FOR RISK MANAGERS

### What This Chart Tells You:

**Liquidity Position**:
- Current LCR: 145%
- Regulatory buffer: 45%
- Trend: Improving (+10% YoY)

**Risk Assessment**:
- ✅ Low liquidity risk
- ✅ Regulatory compliance
- ✅ Strong resilience
- ✅ Positive trajectory

**Action Items**:
- ✅ Continue monitoring
- ✅ Maintain current strategy
- ⏸️ No immediate action needed
- 📊 Report to board: Positive

---

## 🚀 QUICK START

### To View:
1. Go to Risk Management dashboard
2. Click "Market & Liquidity Risk"
3. Scroll to "LCR Trend" section
4. Hover over chart for details

### To Understand:
- **Blue line** = Your LCR over time
- **Red dashed line** = Don't go below this (100%)
- **Higher is better** = More liquidity
- **Upward slope** = Improving position

---

**That's it! You now know how to read the LCR chart like a pro!** 📊✨
