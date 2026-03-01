# Resume Builder – Test Checklist

Use this checklist to verify all features. Run the app with `npm run dev` and test manually.

## 1. All form sections save to localStorage

- [ ] Fill **Personal Info** (name, email, phone, location) → refresh page → values persist
- [ ] Fill **Summary** → refresh → persists
- [ ] Add **Education** entries → refresh → persists
- [ ] Add **Experience** entries with descriptions → refresh → persists
- [ ] Add **Projects** (name, description, tech stack, URLs) → refresh → persists
- [ ] Add **Skills** (technical, soft, tools) → refresh → persists
- [ ] Fill **Links** (GitHub, LinkedIn) → refresh → persists

## 2. Live preview updates in real-time

- [ ] Type in any form field → preview panel updates immediately without clicking away
- [ ] Add/remove education, experience, projects, skills → preview reflects changes

## 3. Template switching preserves data

- [ ] Fill some resume data
- [ ] Switch between **Classic**, **Modern**, **Minimal** → same data appears in each layout
- [ ] No data loss when switching templates

## 4. Color theme persists after refresh

- [ ] Select a color (Teal, Navy, Burgundy, Forest, Charcoal)
- [ ] Refresh the page → same color is still selected and applied to headings/borders/sidebar

## 5. ATS score calculates correctly

- [ ] Empty resume → score **0**
- [ ] Add **name** only → score **10**
- [ ] Add **email** → +10 (e.g. 20 total)
- [ ] Summary **> 50 characters** → +10
- [ ] At least **1 experience with bullets** (description) → +15
- [ ] At least **1 education entry** → +10
- [ ] At least **5 skills** → +10
- [ ] At least **1 project** → +10
- [ ] **Phone** → +5; **LinkedIn** → +5; **GitHub** → +5
- [ ] Summary contains **action verb** (e.g. "built", "led", "designed") → +10
- [ ] Full resume can reach **100**

## 6. Score updates live on edit

- [ ] On **Builder** page: change any field (e.g. add name, add summary) → ATS score in sidebar updates immediately
- [ ] On **Preview** page: score and tier (Needs Work / Getting There / Strong Resume) match current data and update when you return from Builder after editing

## 7. Export buttons work (copy / download)

- [ ] **Download PDF** → toast appears: "PDF export ready! Check your downloads."
- [ ] **Print / Save as PDF** → print dialog opens (or PDF save in browser)
- [ ] **Copy Resume as Text** → button shows "Copied!" and clipboard contains resume text

## 8. Empty states handled gracefully

- [ ] New/empty resume → preview shows placeholders (e.g. "Your Name", "Fill the form to see your resume here" on Builder)
- [ ] No console errors when sections are empty
- [ ] ATS suggestions list appears when score < 100

## 9. Mobile responsive layout works

- [ ] Resize browser to mobile width (~375px) or use device toolbar
- [ ] Builder: form and preview stack vertically; no horizontal scroll
- [ ] Preview page: template picker, export bar, and resume content are usable
- [ ] Template thumbnails and color circles wrap or fit on small screens

## 10. No console errors on any page

- [ ] Open **Builder** (`/`) → Console has no errors
- [ ] Open **Preview** (`/preview`) → Console has no errors
- [ ] Navigate between pages and interact (template switch, color change, form edit) → no errors

---

## Automated ATS tests

Run unit tests for the ATS score calculator:

```bash
npm run test
```

This runs `src/utils/atsScore.test.ts` and verifies score rules and suggestions.
