import { inspectUrl } from './src/api/indexing.ts';
import { getSearchConsoleClient, getSiteUrl } from './src/core/client.ts';

async function getSitemapUrls(limit=25): Promise<string[]> {
  const candidates = ['https://beyondzenith.org/sitemap.xml','https://www.beyondzenith.org/sitemap.xml'];
  for (const s of candidates) {
    try {
      const res = await fetch(s);
      if (!res.ok) continue;
      const xml = await res.text();
      const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m=>m[1].trim());
      if (urls.length) return urls.slice(0, limit);
    } catch {}
  }
  return ['https://beyondzenith.org/','https://beyondzenith.org/about/','https://beyondzenith.org/contact/'];
}

async function main(){
  const out:any = { siteUrl: getSiteUrl() };

  try {
    const sc = getSearchConsoleClient();
    const sites = await sc.sites.list({});
    const entries = sites.data.siteEntry || [];
    out.accessibleSiteCount = entries.length;
    out.permissionLevels = Array.from(new Set(entries.map((s:any)=>s.permissionLevel).filter(Boolean)));
  } catch (e:any) {
    out.sitesListError = e?.response?.data?.error?.message || e?.message || String(e);
  }

  const urls = await getSitemapUrls(20);
  out.sampledUrls = urls;

  const results:any[]=[];
  const reasonCounts: Record<string, number> = {};
  for (const url of urls) {
    try {
      const r = await inspectUrl(url,{save:false});
      results.push({url, verdict:r.indexStatus.verdict, coverageState:r.indexStatus.coverageState, indexingState:r.indexStatus.indexingState});
      if (r.indexStatus.verdict !== 'PASS') {
        const reason = r.indexStatus.coverageState || r.indexStatus.indexingState || 'Unknown';
        reasonCounts[reason] = (reasonCounts[reason]||0)+1;
      }
    } catch (e:any) {
      const msg = e?.response?.data?.error?.message || e?.message || String(e);
      results.push({url, error:msg, code:e?.code, status:e?.response?.status});
      out.firstError = {url, code:e?.code, status:e?.response?.status, message:msg};
      break;
    }
  }

  const inspected = results.filter(r=>!r.error).length;
  const indexed = results.filter(r=>r.verdict==='PASS').length;
  out.summary = { inspected, indexed, indexedRate: inspected? indexed/inspected : null, nonIndexedReasons: Object.entries(reasonCounts).sort((a,b)=>b[1]-a[1]).slice(0,5)};
  out.results = results;
  console.log(JSON.stringify(out,null,2));
}

main().catch(e=>{console.error(e); process.exit(1)});
