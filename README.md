# অ্যাডভোকেট আরমান হোসেন — Premium v2

ভোলা-কেন্দ্রিক, সম্পূর্ণ স্ট্যাটিক বাংলা আইনজীবীর ওয়েবসাইট। কোনো বিল্ড ধাপ, ব্যাকএন্ড বা production JavaScript dependency নেই।

## ডিজাইন ও সুবিধা

- নেভি–গোল্ড–ক্রিম রং, সূক্ষ্ম গ্রিড, বাংলাদেশের পতাকার স্ট্রাইপ ও স্ক্রল-প্রগ্রেস বার।
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
- সেকশন/কার্ড সংখ্যা, ঠিকানা/JSON-LD, ছবি, anchor target এবং browser errors।

## প্রকাশের আগে

- ফোন, ইমেইল, চেম্বারের ঠিকানা ও সময়সূচি মালিকের সঙ্গে নিশ্চিত করুন। আগের সংস্করণে যোগাযোগের তথ্য placeholder হিসেবে উল্লেখ ছিল।
- শিক্ষা, পেশাগত নিবন্ধন, আদালতে প্রতিনিধিত্বের যোগ্যতা, অভিজ্ঞতা ও পরিসংখ্যান যাচাই করুন। অনুরোধ অনুযায়ী hero-তে **৭০+**, পরিসংখ্যানে **৭০০+** রাখা হয়েছে; প্রকাশের আগে একই সংজ্ঞা/সময়কাল অনুযায়ী মিলিয়ে নিন।
- মতামতগুলো স্পষ্টভাবে **নমুনা**, যাচাইকৃত মক্কেলের testimonial নয়। অনুমতি ও যাচাই ছাড়া প্রকৃত মতামত হিসেবে প্রকাশ করবেন না।
- চেক ডিজঅনারের জন্য সঠিক **১৩৮ ধারা** ব্যবহার করা হয়েছে। নির্দিষ্ট মামলার পরামর্শ বা ফলাফলের নিশ্চয়তা দাবি করা হয়নি।
- নিজের public domain জানা হলে `og:image` ও JSON-LD `image`-এ absolute public URL বসান; এখন আগের মতো relative asset path আছে।
- যোগাযোগ বদলালে `index.html` ও `js/main.js` দুটোতেই ইমেইল/ফোন এবং JSON-LD মিলিয়ে আপডেট করুন।


## Netlify Deploy Preview toolbar

Deploy Preview-এ toolbar drawer ডিফল্টভাবে hidden করা হয়: কেবল `deploy-preview-N--SITE.netlify.app` hostname-এ, URL-এ `ntl-drawer-state` বা explicit `ntl-drawer-visible` না থাকলে query/hash অক্ষুণ্ণ রেখে একবার URL replace হয়। Localhost, Arena preview, production ও custom domain বদলায় না। স্থায়ীভাবে Collaboration tools বন্ধ করতে Netlify dashboard-এর **Project configuration → Notifications → Collaboration tools** setting ব্যবহার করুন; dashboard access ছাড়া repository থেকে setting পরিবর্তন দাবি করা হয়নি।
