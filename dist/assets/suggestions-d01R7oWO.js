import{c as a}from"./index-BlJINz3T.js";/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=a("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=a("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=a("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=a("Kanban",[["path",{d:"M6 5v11",key:"mdvv1e"}],["path",{d:"M12 5v6",key:"14ar3b"}],["path",{d:"M18 5v14",key:"7ji314"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=a("Lightbulb",[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=a("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=a("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=a("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),o="interviewos_tracked_jobs";async function n(){if(typeof chrome<"u"&&chrome.storage&&chrome.storage.local)return(await chrome.storage.local.get(o))[o]||[];{const t=localStorage.getItem(o);return t?JSON.parse(t):[]}}async function r(t){const e=await n(),i=e.findIndex(s=>s.id===t.id);i>=0?e[i]={...t,updatedAt:new Date().toISOString()}:e.unshift({...t,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),typeof chrome<"u"&&chrome.storage&&chrome.storage.local?await chrome.storage.local.set({[o]:e}):localStorage.setItem(o,JSON.stringify(e))}async function f(t,e){const s=(await n()).find(c=>c.id===t);s&&(s.status=e,s.updatedAt=new Date().toISOString(),e==="Applied"&&!s.appliedDate&&(s.appliedDate=new Date().toLocaleDateString()),await r(s))}async function b(t){let e=await n();e=e.filter(i=>i.id!==t),typeof chrome<"u"&&chrome.storage&&chrome.storage.local?await chrome.storage.local.set({[o]:e}):localStorage.setItem(o,JSON.stringify(e))}function x(t,e,i){const s=[];return i.missingTechnologies.length>0&&s.push({id:"sugg_tech_1",type:"technology",title:`Emphasize target technologies: ${i.missingTechnologies.slice(0,3).join(", ")}`,description:`The job posting for ${e.title} explicitly mentions ${i.missingTechnologies.slice(0,3).join(", ")}. If you have experience with these, ensure they appear in your Skills section and Work Experience.`,impact:"High"}),i.weakBulletPoints.length>0&&s.push({id:"sugg_metric_1",type:"metric",title:"Add measurable metrics to bullet points",description:`We detected ${i.weakBulletPoints.length} bullet points that lack quantifiable achievements (%, $, time saved, users impacted). Quantified achievements increase interview callback rates by 40%.`,impact:"High"}),t.projects.length>0&&s.push({id:"sugg_proj_1",type:"project",title:`Highlight ${t.projects[0].title} project`,description:`Your project '${t.projects[0].title}' contains technologies aligned with ${e.company}'s Tech stack. Move this project near the top of your resume.`,impact:"Medium"}),i.missingActionVerbs.length>0&&s.push({id:"sugg_verb_1",type:"action_verb",title:`Incorporate key action verbs: ${i.missingActionVerbs.slice(0,3).join(", ")}`,description:`Replace passive phrasing in your experience bullets with strong action verbs like ${i.missingActionVerbs.slice(0,3).join(", ")} to boost ATS parsing score.`,impact:"Medium"}),s}export{p as B,h as C,g as K,y as L,u as P,m as S,k as T,d as a,x as b,b as d,n as g,r as s,f as u};
