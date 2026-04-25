import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update title
html = html.replace(
    '<title>Smart Digital - Assam</title>',
    '<title>Smart Digital — Website, PAN Card, Aadhaar & Digital Services | Kampur, Nagaon, Assam</title>'
)

# 2. Update description and add SEO meta tags
html = html.replace(
    '<meta name="description" content="Welcome to Smart Digital, your trusted local shop for digital services and website design in Assam. Browse our online demos today!">',
    '<meta name="description" content="Your trusted digital shop at Kachua Tiniali, Kampur, Nagaon (PIN 782426). Get website design, PAN card help, Aadhaar update, QR codes, WhatsApp bots, exam paper generators, resume builder & more. Call 86387 59478.">\n    <meta name="keywords" content="smart digital kampur, website design assam, pan card nagaon, aadhaar update kampur, digital shop kachua tiniali, whatsapp bot assam, qr code generator, resume builder, exam paper generator, online services nagaon, digital services assam">\n    <link rel="canonical" href="https://smartdigitalkampur.netlify.app/">\n    <link rel="alternate" hreflang="en" href="https://smartdigitalkampur.netlify.app/" />\n    <link rel="alternate" hreflang="as" href="https://smartdigitalkampur.netlify.app/" />'
)

# 3. Update OG title
html = html.replace(
    '<meta property="og:title" content="Smart Digital - Assam">',
    '<meta property="og:title" content="Smart Digital — Website, PAN Card, Aadhaar & Digital Services | Kampur, Nagaon, Assam">'
)

# 4. Update OG description and add more tags
html = html.replace(
    '<meta property="og:description" content="Digital services for everyone in Kampur and surrounding areas.">',
    '<meta property="og:description" content="Your trusted digital shop at Kachua Tiniali, Kampur, Nagaon. Get website design, PAN card, Aadhaar, QR codes, WhatsApp bots & more. Call 86387 59478.">\n    <meta property="og:image" content="https://smartdigitalkampur.netlify.app/assets/img/logo.png">\n    <meta property="og:url" content="https://smartdigitalkampur.netlify.app/">\n    <meta property="og:type" content="website">\n    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:title" content="Smart Digital — Website, PAN Card, Aadhaar & Digital Services | Kampur, Nagaon, Assam">\n    <meta name="twitter:description" content="Your trusted digital shop at Kachua Tiniali, Kampur, Nagaon. Get website design, PAN card, Aadhaar, QR codes, WhatsApp bots & more.">\n    <meta name="twitter:image" content="https://smartdigitalkampur.netlify.app/assets/img/logo.png">'
)

# 5. Remove old relative og:image
html = html.replace('<meta property="og:image" content="assets/img/logo.png">', '')

# 6. Remove the address comment
html = html.replace('    <!-- Future Shop Address: Kachua Tiniali Main Market, Kampur, Assam 782426 -->\n', '')

# 7. Add LocalBusiness schema before </head>
schema = '''    <!-- LocalBusiness Structured Data (SEO) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Smart Digital",
      "image": "https://smartdigitalkampur.netlify.app/assets/img/logo.png",
      "@id": "https://smartdigitalkampur.netlify.app/",
      "url": "https://smartdigitalkampur.netlify.app/",
      "telephone": "+91-86387-59478",
      "email": "smartdigitalassam@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kachua Tiniali Main Market",
        "addressLocality": "Kampur",
        "addressRegion": "Assam",
        "postalCode": "782426",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "PLACEHOLDER_ADD_LATITUDE",
        "longitude": "PLACEHOLDER_ADD_LONGITUDE"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "priceRange": "Rs",
      "serviceType": ["Website Design", "PAN Card Services", "Aadhaar Services", "QR Code Generation", "WhatsApp Bot Automation", "Resume Building", "Exam Paper Generation", "Digital Marketing", "Document Services", "Printing & Scanning"],
      "areaServed": {
        "@type": "City",
        "name": "Kampur, Nagaon, Assam"
      }
    }
    </script>
'''

html = html.replace('</head>', schema + '</head>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done! SEO tags and schema updated.')
