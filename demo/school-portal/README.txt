SCHOOLWISE — DEMONSTRATION ADMIN PORTAL (static HTML)
Smart Digital CSC Centre & Online Service · smartdigitalassam.com

WHERE THIS LIVES
  This folder is part of the website and is served at:
      https://smartdigitalassam.com/demo/school-portal/

  The public landing page that introduces it is /demo/ (file: demo/index.html).
  That page explains the modules, links to all 18 screens, and makes the key
  sales point: any school or college can take only the modules it wants, and
  the price is quoted against that list.

  Every portal page shows a blue "Demo" bar at the top of the main column with
  the same message and links back to /demo/ and /contact/. The bar is hidden
  when a page is printed, so receipts, report cards and certificates still
  print clean.

HOW TO USE
  On the web: open /demo/ and click through, or send someone straight to
  /demo/school-portal/ for the dashboard.

  Offline (school visit with no internet): open index.html directly from this
  folder. All page-to-page links are relative and still work. Only the two
  buttons in the top demo bar ("All demo screens" and "Get a quotation") need
  the live site, because they are site-root links.

  Press F11 for full screen before taking screenshots (cleaner images).

PAGES (18)
  index.html             Management dashboard
  students.html          Student directory
  student-profile.html   One student — profile, attendance calendar, exam & fee history
  attendance.html        Mark daily attendance
  attendance-report.html Monthly register, class comparison, low-attendance list
  fees.html              Fee collection register + fee structure
  receipt.html           Printed fee receipt
  exams.html             Marks entry grid (auto total / % / grade)
  report-card.html       Printable report card
  results.html           Consolidated result, subject analysis, merit list
  timetable.html         Weekly timetable with clash detection
  academics.html         Homework, study material, syllabus tracking, library
  staff.html             Staff directory
  class-setup.html       Classes, sections and year-end promotion
  announcements.html     Notices to all parents (SMS / app / website)
  certificates.html      Bonafide certificate, TC, photo ID card, admit card
  reports.html           Defaulter report, enrolment trend, standard reports, data safety
  parent.html            Parent & student mobile app view + role permissions
  style.css              Shared styling — do not delete

CUSTOMISING FOR A DEMO
  School name, address and the "NHS" crest appear in every page.
  Search & replace "Nabajyoti Higher Secondary School", "Nabajyoti H.S. School",
  "Kachua Tiniali, Kampur, Nagaon, Assam" and "NHS" to fit the school you are visiting.

  For a college visit, the same portal applies — the demo bar and the /demo/
  page already say so, so there is no need to rename anything to show a college.

IF YOU ADD OR RENAME A PAGE
  Update three places so nothing goes stale:
    1. the sidebar nav in each portal page
    2. the screen list on demo/index.html (and its source, src/pages/demo.html)
    3. this file
