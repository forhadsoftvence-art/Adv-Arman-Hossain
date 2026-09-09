/* Run against a local static server; see README.md. No form emails are sent.
 * Optional CHROMIUM_EXECUTABLE_PATH supports an existing Chromium installation.
 */
const {chromium} = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  headless: true
 });
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const errors=[]; const failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>{if(r.url().startsWith('http:'))failed.push(r.url())});
 await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8000',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('html').getAttribute('lang'),'bn');
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
 assert.equal(schema['@type'],'Attorney'); assert.equal(schema.address.addressLocality,'ভোলা');
 assert.equal(await page.locator('.number-chip').count(),9);
 assert.equal(await page.locator('.service-card').count(),8);
 assert.deepEqual(await page.locator('.service-card').evaluateAll(cards=>cards.map(c=>c.querySelectorAll('li').length)),Array(8).fill(3));
 assert.equal(await page.locator('.court-grid li').count(),10);
 assert.equal(await page.locator('.area-grid li').count(),8);
 assert.equal(await page.locator('.header-actions > .header-cta').count(),1);
 assert.equal(await page.locator('.site-nav .header-cta').count(),0);
 assert.equal(await page.locator('.phone-card').getAttribute('href'),'tel:+8801711234567');
 assert.equal(await page.locator('.whatsapp-card').getAttribute('href'),'https://wa.me/8801711234567');
 assert.equal(await page.locator('.chamber-card').count(),1);
 assert.ok(!/ঢাকা|গাজীপুর|Dhaka|Gazipur/.test(await page.content()));
 assert.ok((await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))));
 assert.equal(await page.locator('#year').textContent(),String(new Date().getFullYear()).replace(/\d/g,n=>'০১২৩৪৫৬৭৮৯'[n]));
 const brokenAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(l=>!document.querySelector(l.getAttribute('href'))).map(l=>l.href));
 assert.deepEqual(brokenAnchors,[]);
 console.log('PASS: structure, content, metadata, image loading, anchor targets, CTA and full-card links');
 // Scroll observers and counters.
 await page.locator('.stats').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('[data-count="700"]').textContent!=='৭০০+');
 await page.waitForFunction(()=>document.querySelector('[data-count="700"]').textContent==='৭০০+');
 assert.deepEqual(await page.locator('[data-count]').allTextContents(),['৫+','৭০০+','৯৫%','২৪-৭']);
 await page.locator('#services').evaluate(e=>e.scrollIntoView({behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('#siteNav a.active').hash==='#services');
 await page.waitForFunction(()=>!document.querySelector('#services .reveal').classList.contains('is-pending'));
 assert.equal(await page.locator('#siteNav a[aria-current="location"]').count(),1);
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('#scrollProgress').style.transform==='scaleX(1)');
 assert.ok(await page.locator('#backTop').isVisible());
 await page.locator('#backTop').click();
 await page.waitForFunction(()=>scrollY===0);
 assert.ok(await page.locator('#backTop').isHidden());
 await page.locator('#marqueeToggle').click();
 assert.equal(await page.locator('#marqueeToggle').getAttribute('aria-pressed'),'true');
 console.log('PASS: Bengali animated counters, reveal, scroll-spy, progress, back-to-top, marquee pause');
 // Native accessible accordion: Enter + Space, one open at a time.
 const summaries=page.locator('.faq-item summary');
 await summaries.nth(0).focus(); await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('.faq-item').open);
 await summaries.nth(1).focus(); await page.keyboard.press('Space');
 await page.waitForFunction(()=>document.querySelectorAll('.faq-item[open]').length===1 && document.querySelectorAll('.faq-item')[1].open);
 console.log('PASS: keyboard FAQ, single-open behavior');
 // Validate invalid fields and ensure correct focus / status.
 await page.locator('#contactForm button').click();
 assert.equal(await page.locator('[aria-invalid="true"]').count(),4);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'fName');
 await page.locator('#fName').fill('রফিকুল ইসলাম');
 await page.locator('#fTopic').selectOption({label:'জমিজমা ও দলিল'});
 await page.locator('#fMessage').fill('আমার জমির দলিল সম্পর্কে পরামর্শ প্রয়োজন। & + ? #');
 const session=await context.newCDPSession(page); await session.send('Page.enable');
 let lastMailto=''; session.on('Page.frameRequestedNavigation',e=>{if(e.url.startsWith('mailto:'))lastMailto=e.url});
 const valid=['01711234567','০১৭১১২৩৪৫৬৭','+8801711234567','+৮৮০১৭১১২৩৪৫৬৭','8801711234567','০১৭১১-২৩৪৫৬৭','+৮৮০ ১৭১১-২৩৪৫৬৭','০1৭১1২৩৪৫৬৭','01312345678','01912345678'];
 for(const phone of valid){
  lastMailto=''; await page.locator('#fPhone').fill(phone); await page.locator('#contactForm button').click();
  assert.ok(await page.locator('#formStatus').evaluate(e=>e.classList.contains('success')),phone);
  await page.waitForTimeout(80);
  assert.ok(lastMailto.startsWith('mailto:adv.armanhossain.du@gmail.com?subject='),phone+' mailto');
  const url=new URL(lastMailto);
  assert.ok(url.searchParams.get('body').includes('আমার জমির দলিল সম্পর্কে পরামর্শ প্রয়োজন। & + ? #'));
  assert.ok(url.searchParams.get('body').includes('মোবাইল: '+phone.replace(/[০-৯]/g,n=>'০১২৩৪৫৬৭৮৯'.indexOf(n)).replace(/[\s-]/g,'')));
 }
 const invalid=['','01212345678','01112345678','0171123456','017112345678','+9901711234567','++8801711234567','01711abcd67','১২৩৪৫','০১৭১১২৩৪৫৬৭x'];
 for(const phone of invalid){await page.locator('#fPhone').fill(phone);await page.locator('#contactForm button').click();assert.equal(await page.locator('#fPhone').getAttribute('aria-invalid'),'true',phone);assert.equal(await page.evaluate(()=>document.activeElement.id),'fPhone')}
 assert.notEqual(await page.locator('#fMessage').inputValue(),'');
 console.log('PASS: 10 valid + 10 invalid phone cases, Bengali/mixed normalization, error focus, encoded mailto, preserved form');
 // Reveal all sections as a scrolling user would before full-page accessibility audit.
 await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(e=>e.classList.remove('is-pending')));
 await page.waitForTimeout(700);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const violations=(await new AxeBuilder({page}).analyze()).violations;
 console.log('DESKTOP AXE',JSON.stringify(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))})),null,2));
 assert.equal(violations.length,0);
 for(const width of [1440,1280,1024,1023,820,768,767,600,480,479,390,375,360,320]){
  await page.setViewportSize({width,height:900});
  const layout=await page.evaluate(()=>{
   const actions=document.querySelector('.header-actions').getBoundingClientRect(),brand=document.querySelector('.site-header .brand').getBoundingClientRect();
   return {width:document.documentElement.scrollWidth,cols:getComputedStyle(document.querySelector('.court-grid')).gridTemplateColumns.split(' ').length,areaCols:getComputedStyle(document.querySelector('.area-grid')).gridTemplateColumns.split(' ').length,overlap:brand.right>actions.left,actionsRight:actions.right};
  });
  assert.equal(layout.width,width,'overflow '+width);assert.equal(layout.cols,width>=1024?3:width>=768?2:1,'columns '+width);assert.equal(layout.areaCols,layout.cols);
  assert.ok(!layout.overlap,'header overlap '+width);assert.ok(layout.actionsRight<=width,'CTA overflow '+width);
 }
 console.log('PASS: responsive grid and overflow-free header/content at 14 viewport widths (320–1440px)');
 await page.setViewportSize({width:390,height:844});
 await page.locator('#navToggle').click();
 assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('.header-cta').isVisible());
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'navToggle');
 await page.locator('#navToggle').click(); await page.locator('#siteNav a[href="#contact"]').click();
 assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');
 await page.waitForFunction(()=>document.querySelector('#siteNav a.active').hash==='#contact');
 assert.ok(await page.locator('.header-cta').isVisible());
 assert.equal((await page.locator('.site-header').boundingBox()).y,0);
 await page.locator('#navToggle').click();await page.setViewportSize({width:1280,height:900});await page.setViewportSize({width:390,height:844});
 assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'false');
 const mobileViolations=(await new AxeBuilder({page}).analyze()).violations;
 console.log('MOBILE AXE',JSON.stringify(mobileViolations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))})),null,2));
 assert.equal(mobileViolations.length,0);
 await page.locator('#backTop').click();await page.waitForFunction(()=>scrollY===0);
 console.log('PASS: mobile menu, Escape/focus, anchor close, resize reset, sticky CTA; desktop/mobile axe: 0 violations');
 await context.close();
 // New browser contexts verify progressive enhancement and reduced motion.
 const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
 const rp=await reduced.newPage(); await rp.goto(process.env.SITE_URL || 'http://127.0.0.1:8000',{waitUntil:'networkidle'});
 assert.equal(await rp.locator('.is-pending').count(),0);
 assert.deepEqual(await rp.locator('[data-count]').allTextContents(),['৫+','৭০০+','৯৫%','২৪-৭']);
 assert.equal(await rp.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
 await reduced.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const np=await nojs.newPage();await np.goto(process.env.SITE_URL || 'http://127.0.0.1:8000',{waitUntil:'networkidle'});
 assert.ok(await np.locator('#siteNav a[href="#services"]').isVisible());
 assert.equal(await np.locator('.is-pending').count(),0);
 assert.deepEqual(await np.locator('[data-count]').allTextContents(),['৫+','৭০০+','৯৫%','২৪-৭']);
 await np.locator('.faq-item summary').first().click();assert.ok(await np.locator('.faq-item').first().getAttribute('open')!==null);
 assert.equal(await np.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
 await nojs.close();
 const fallback=await browser.newContext();await fallback.addInitScript(()=>delete window.IntersectionObserver);
 const fp=await fallback.newPage();await fp.goto(process.env.SITE_URL || 'http://127.0.0.1:8000',{waitUntil:'networkidle'});
 assert.equal(await fp.locator('.is-pending').count(),0);assert.equal(await fp.locator('[data-count="700"]').textContent(),'৭০০+');
 console.log('PASS: reduced motion, no-JS navigation/FAQ/content/counters, missing IntersectionObserver fallback');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 console.log('ALL TESTS PASSED; no JS errors or failed local requests');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
