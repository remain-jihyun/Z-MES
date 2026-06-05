const { chromium } = require('playwright');
const BASE = 'http://localhost:3100';

const pages = [
  { url: '/production/order',          name: '주문',          buttons: ['WES 수신'] },
  { url: '/production/expansion',      name: '전개',          buttons: ['전개 실행'] },
  { url: '/production/kanban',         name: '간반',          buttons: ['자동 생성'] },
  { url: '/production/execute',        name: '생산',          buttons: [] },
  { url: '/production/close',          name: '일일마감',      buttons: ['일일 마감'] },
  { url: '/production/extra',          name: '추가생산',      buttons: ['추가생산 요청'] },
  { url: '/production/extra-material', name: '추가불출',      buttons: ['추가불출 요청'] },
  { url: '/push/weekly',               name: '주간계획',      buttons: ['계획 저장'] },
  { url: '/push/execute',              name: '생산실행',      buttons: [] },
  { url: '/quality/waste',             name: '폐기',          buttons: ['폐기 등록'] },
  { url: '/quality/deviation',         name: '미출/과생산',   buttons: [] },
  { url: '/inventory/receiving',       name: '입고',          buttons: ['입고 등록'] },
  { url: '/inventory/inspection',      name: '재고실사',      buttons: [] },
  { url: '/inventory/status',          name: '재고현황',      buttons: [] },
  { url: '/order/forecast',            name: 'AI수요예측',    buttons: ['예측 실행'] },
  { url: '/order/purchase',            name: '발주서',        buttons: ['발주서 작성'] },
  { url: '/order/feedback',            name: '예측피드백',    buttons: [] },
  { url: '/equipment/status',          name: '설비현황',      buttons: ['설비 등록'] },
  { url: '/equipment/haccp',           name: 'HACCP',         buttons: [] },
  { url: '/equipment/maintenance',     name: '보전관리',      buttons: ['점검 등록'] },
  { url: '/equipment/repair',          name: '수리이력',      buttons: ['수리 등록'] },
  { url: '/trace/lot',                 name: '로트관리',      buttons: [] },
  { url: '/trace/expiry',              name: '소비기한',      buttons: [] },
  { url: '/trace/bidirectional',       name: '양방향추적',    buttons: ['조회'] },
  { url: '/master/products',           name: '품목DB',        buttons: ['품목 등록'] },
  { url: '/master/menu',               name: '정기식단',      buttons: [] },
  { url: '/master/bom',                name: 'BOM',           buttons: ['신규 등록'] },
  { url: '/master/bop',                name: 'BOP',           buttons: [] },
  { url: '/master/types',              name: '유형관리',      buttons: [] },
  { url: '/master/partners',           name: '거래처/작업자', buttons: ['거래처 등록'] },
  { url: '/master/yield',              name: '수율',          buttons: ['수율 등록'] },
  { url: '/master/domino',             name: '도미노',        buttons: [] },
  { url: '/master/order-settings',     name: '발주설정',      buttons: [] },
  { url: '/system/device',             name: '디바이스',      buttons: ['디바이스 등록'] },
  { url: '/system/nfc',                name: 'NFC',           buttons: ['NFC 등록'] },
  { url: '/dashboard/stats',           name: '생산통계',      buttons: [] },
  { url: '/dashboard/field',           name: '현장관제',      buttons: [] },
  { url: '/dashboard/office',          name: '사무실관제',    buttons: [] },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const results = [];

  for (const { url, name, buttons } of pages) {
    const issues = [];
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 12000 });
      await page.waitForTimeout(400);

      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (bodyText.includes('404') || bodyText.includes('Application error')) {
        issues.push('페이지 오류');
      }

      for (const btnText of buttons) {
        const btn = page.getByRole('button', { name: btnText }).first();
        const visible = await btn.isVisible().catch(() => false);
        if (!visible) { issues.push(`버튼 없음: "${btnText}"`); continue; }
        const disabled = await btn.isDisabled().catch(() => false);
        if (disabled) { issues.push(`버튼 비활성: "${btnText}"`); continue; }

        await btn.click().catch(() => {});
        await page.waitForTimeout(500);
        const overlay = await page.locator('[data-slot="dialog-content"], [data-slot="sheet-content"], form').first().isVisible().catch(() => false);
        const navChanged = !page.url().includes(url);
        if (!overlay && !navChanged) {
          // check if any visible change (new element, text change)
          const anyChange = await page.locator('input:visible, select:visible, textarea:visible').count();
          if (anyChange === 0) issues.push(`클릭 무반응: "${btnText}"`);
        }
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(300);
      }

      // Row click test
      const firstRow = page.locator('table tbody tr').first();
      const rowCount = await page.locator('table tbody tr').count();
      if (rowCount > 0 && rowCount < 200) {
        const rowText = await firstRow.innerText().catch(() => '');
        if (rowText.trim() && !rowText.includes('없습니다')) {
          await firstRow.click().catch(() => {});
          await page.waitForTimeout(400);
          const overlay = await page.locator('[data-slot="dialog-content"], [data-slot="sheet-content"]').first().isVisible().catch(() => false);
          if (!overlay) issues.push('행 클릭 무반응');
          await page.keyboard.press('Escape').catch(() => {});
          await page.waitForTimeout(200);
        }
      }

      results.push({ name, url, ok: issues.length === 0, issues });
    } catch (e) {
      results.push({ name, url, ok: false, issues: ['오류: ' + String(e).slice(0, 80)] });
    }
  }
  await browser.close();

  let pass = 0, fail = 0;
  const lines = [];
  for (const r of results) {
    if (r.ok) { pass++; lines.push(`✅ ${r.name}`); }
    else { fail++; lines.push(`⚠️  ${r.name}\n   └ ${r.issues.join('\n   └ ')}`); }
  }
  console.log('\n=== MES 버튼 동작 검증 ===\n');
  console.log(lines.join('\n'));
  console.log(`\n결과: ✅ ${pass}통과  ⚠️ ${fail}이슈  /  전체 ${results.length}페이지`);
}
run().catch(console.error);
