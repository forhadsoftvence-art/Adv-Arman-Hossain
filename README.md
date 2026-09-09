# অ্যাডভোকেট আরমান হোসেন — Premium v2

ভোলা-কেন্দ্রিক, সম্পূর্ণ স্ট্যাটিক বাংলা আইনজীবীর ওয়েবসাইট। কোনো বিল্ড ধাপ, ব্যাকএন্ড বা production JavaScript dependency নেই।

## ডিজাইন ও সুবিধা

- নেভি–গোল্ড–ক্রিম রং, সূক্ষ্ম গ্রিড, বাংলাদেশের পতাকার স্ট্রাইপ ও স্ক্রল-প্রগ্রেস বার।
- হিরোতে দুটি হাইলাইট CTA: **ফ্রি পরামর্শ নিন** (গোল্ড `#dcb968`, গাঢ় নেভি টেক্সট) ও **সরাসরি কল** (ক্রিম `#faf9f6`, নেভি টেক্সট/আইকন)। দুটোতেই স্পষ্ট বর্ডার, subtle shadow, কীবোর্ড ফোকাস ও কমপক্ষে ৫৪px উচ্চতা। Header/form-এর CTA অপরিবর্তিত।
- Topbar ও footer-এ “🇧🇩 গর্বিতভাবে বাংলাদেশের সেবায়” আলাদা `.bd-flag` + `.country-label` এলিমেন্টে `inline-flex`, `align-items:center`, `gap:8px`।
- অভিজ্ঞতা সর্বত্র **৫+ বছরের** (১৫+ নয়): হিরো ফ্লোট-ব্যাজ ও পরিসংখ্যান, `data-count="5"`।
- প্রিমিয়াম header: header/footer-এ একই SVG স্কেল-লোগো, হালকা বর্ডার/ছায়া, পিল-গ্রুপ নেভিগেশন ও নেভি active item; “ফ্রি পরামর্শ” `.header-actions`-এ আলাদা ও সবসময় দৃশ্যমান, মোবাইলে বার্গারের পাশে।
- সাদা পটভূমির গ্রিড ৫৬px ও `rgba(19,37,61,.016)`-এ হালকা; পরিচিতির (০১) লেখা soft-white প্যানেলে, টেক্সট কনট্রাস্ট বাড়ানো।
- সাইটজুড়ে নেভি primary theme; জরুরি সহায়তা সেকশন লাল নয়, নেভি। গোল্ড restrained accent ও হিরো CTA-তে; পতাকার রং (সবুজ-লাল) ও WhatsApp-এর সবুজ অপরিবর্তিত।
- Hind Siliguri ও Noto Serif Bengali ফন্ট লোকালি হোস্ট করা; Bengali/Latin WOFF2 subset ও OFL লাইসেন্স `assets/fonts/`-এ। Google Fonts-এ কোনো runtime request লাগে না।
- নেভিগেশন থেকে আলাদা `.header-actions`-এ সবসময় দৃশ্যমান **ফ্রি পরামর্শ** CTA; মোবাইলে বার্গারের পাশে।
- গোল্ড নম্বর-চিপসহ ০১–০৯: পরিচিতি, আটটি সেবা, আদালত ও এখতিয়ার, কর্মপদ্ধতি, কাগজপত্র, কেন আমি, নমুনা মতামত ও FAQ, জরুরি সহায়তা, যোগাযোগ।
- ভোলায় একটি চেম্বার: **২য় তলা, পৌর মার্কেট, সদর রোড, ভোলা-৮৬০০**। কপি ও Attorney JSON-LD একই ঠিকানা ব্যবহার করে।
- আদালত ও এলাকার কার্ড: ডেস্কটপে ৩ কলাম (≥১০২৪px), ট্যাবলেটে ২ (৭৬৮–১০২৩px), মোবাইলে ১ (<৭৬৮px)।
- বাংলা সংখ্যায় কাউন্টার ও বছর, স্ক্রল-স্পাই, রিভিল, থামানো যায় এমন মারকুই, কিবোর্ডে ব্যবহারযোগ্য FAQ, ব্যাক-টু-টপ।
- ডান-নিচে কল ও হোয়াটসঅ্যাপ স্ট্যাক; যোগাযোগের ফোন ও হোয়াটসঅ্যাপ কার্ডের পুরো অংশ ক্লিকযোগ্য।
- Reduced-motion সম্মান করা হয়। JavaScript ছাড়াও বিষয়বস্তু, নেভিগেশন, FAQ, চূড়ান্ত কাউন্টার এবং সরাসরি যোগাযোগ লিংক ব্যবহারযোগ্য।
- আগের `assets/img/advocate-portrait.jpg` ও `assets/img/law-chamber.jpg` অপরিবর্তিত।

## লোকালি চালানো

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

নিজের কম্পিউটারে `http://localhost:8000` খুলুন। Arena-তে Live Preview ব্যবহার করুন। Netlify-তে আগের `netlify.toml` অনুযায়ী root directory-ই publish হবে; কোনো build দরকার নেই।

## ফর্মের আচরণ

নাম, ফোন, বিষয় ও বার্তা আবশ্যক। বাংলা `০–৯` ইংরেজি সংখ্যায় রূপান্তর এবং whitespace/hyphen বাদ দেওয়ার পর ফোন যাচাই হয়:

```regex
^(\+?88)?01[3-9]\d{8}$
```

সঠিক তথ্য হলে URL-encoded `mailto:` দিয়ে ব্যবহারকারীর ইমেইল অ্যাপে খসড়া খোলার অনুরোধ করা হয়। **ওয়েবসাইট নিজে ইমেইল পাঠায় না, কোনো server-এ ফর্ম ডেটা জমা বা সংরক্ষণ করে না।** ইমেইল অ্যাপ না থাকলে ফোন/হোয়াটসঅ্যাপ ব্যবহার করতে হবে। সফল handoff-এর পরও ফর্মের লেখা মুছে ফেলা হয় না।

## Netlify Deploy Preview-এর টুলবার

`js/main.js` শুধুমাত্র `deploy-preview-N--SITE.netlify.app` hostname-এ Netlify Drawer/টুলবার ডিফল্টভাবে লুকায়: URL-এর query বা hash-এ `ntl-drawer-state` না থাকলে একবার `location.replace()` দিয়ে `?ntl-drawer-state=hidden` যোগ হয়; অন্য query/hash অক্ষত থাকে, লুপ হয় না এবং explicit `ntl-drawer-state=visible`-এর মতো override-কে সম্মান করা হয়। Localhost, Arena preview, production ও custom domain কখনো বদলানো হয় না।

এটা শুধু Deploy Preview-এর ডিফল্ট দেখার অভিজ্ঞতা। Netlify Drawer **স্থায়ীভাবে বন্ধ** করতে Netlify dashboard-এ করতে হবে: **Project configuration → Build & deploy → Continuous deployment → Collaboration tools → Configure → Netlify Drawer disable**। এই রিপোজিটরি বা কোড দিয়ে dashboard সেটিং বদলানো যায় না — তাই dashboard-এ না বদলালে README-এ দাবি করা হয় না যে এটি “বন্ধ করে দেওয়া হয়েছে”।

## যাচাই

প্রথম টার্মিনালে উপরের static server চালু রেখে দ্বিতীয় টার্মিনালে:

```bash
# শুধু পরীক্ষার জন্য; production-এ এই dependencies লাগে না।
npm install --no-save --package-lock=false playwright@1.63.0 @axe-core/playwright@4.13.0
npx playwright install chromium
node tests/v2.cjs
```

আগে থেকে Chromium ইনস্টল থাকলে `CHROMIUM_EXECUTABLE_PATH` এবং অন্য local server হলে `SITE_URL` environment variable ব্যবহার করা যায়। Linux-এ browser-এর system libraries-ও থাকতে হবে।

পরীক্ষায় অন্তর্ভুক্ত:
- ৩২০–১৪৪০px পর্যন্ত ১৪টি viewport-এ overflow, CTA overlap ও ৩/২/১ গ্রিড।
- নেভিগেশন, Escape/focus, sticky CTA, reveal, scroll-spy, progress, back-to-top, marquee pause।
- ১০টি valid ও ১০টি invalid ফোন ইনপুট, mixed Bengali/English সংখ্যা, error focus, encoded mailto ও ফর্মের লেখা সংরক্ষণ। পরীক্ষায় কোনো ইমেইল পাঠানো হয় না।
- Native FAQ-এর keyboard interaction ও single-open behavior।
- Desktop/mobile axe accessibility audit; reduced-motion, JavaScript বন্ধ ও IntersectionObserver অনুপস্থিত অবস্থার fallback।
- হিরো CTA রং/নেভি টেক্সট/৫৪px উচ্চতা, header CTA অপরিবর্তিত, ৫+ ব্যাজ ও counter, flag inline-flex সারি, about soft-white সারফেস।
- Netlify Deploy Preview toolbar guard (localhost/প্রোডাকশন/custom domain অক্ষত; deploy-preview hostname-এ একবার `ntl-drawer-state=hidden`, explicit visible override মান্য)।
- সেকশন/কার্ড সংখ্যা, ঠিকানা/JSON-LD, ছবি, anchor target এবং browser errors।

## প্রকাশের আগে

- ফোন, ইমেইল, চেম্বারের ঠিকানা ও সময়সূচি মালিকের সঙ্গে নিশ্চিত করুন। আগের সংস্করণে যোগাযোগের তথ্য placeholder হিসেবে উল্লেখ ছিল।
- শিক্ষা, পেশাগত নিবন্ধন, আদালতে প্রতিনিধিত্বের যোগ্যতা, অভিজ্ঞতা ও পরিসংখ্যান যাচাই করুন। অনুরোধ অনুযায়ী এখন সর্বত্র **৫+ বছরের অভিজ্ঞতা**, hero-তে **৭০+** মামলা ও পরিসংখ্যানে **৭০০+** রাখা হয়েছে; প্রকাশের আগে একই সংজ্ঞা/সময়কাল অনুযায়ী মিলিয়ে নিন।
- মতামতগুলো স্পষ্টভাবে **নমুনা**, যাচাইকৃত মক্কেলের testimonial নয়। অনুমতি ও যাচাই ছাড়া প্রকৃত মতামত হিসেবে প্রকাশ করবেন না।
- চেক ডিজঅনারের জন্য সঠিক **১৩৮ ধারা** ব্যবহার করা হয়েছে। নির্দিষ্ট মামলার পরামর্শ বা ফলাফলের নিশ্চয়তা দাবি করা হয়নি।
- নিজের public domain জানা হলে `og:image` ও JSON-LD `image`-এ absolute public URL বসান; এখন আগের মতো relative asset path আছে।
- যোগাযোগ বদলালে `index.html` ও `js/main.js` দুটোতেই ইমেইল/ফোন এবং JSON-LD মিলিয়ে আপডেট করুন।
