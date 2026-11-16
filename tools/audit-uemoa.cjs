// Read-only validation of the saved PBIP. Run with Node.js 18+.
const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'..'),root=path.join(project,'Uemoa.Report/definition');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const meta=json(path.join(root,'pages/pages.json')),errors=[],warnings=[],types=new Set();let visuals=0,links=0,measures=0;
const tables=new Map();
for(const f of fs.readdirSync(path.join(project,'Uemoa.SemanticModel/definition/tables'))){
 const source=fs.readFileSync(path.join(project,'Uemoa.SemanticModel/definition/tables',f),'utf8');
 const table=/^table (.+)$/m.exec(source)?.[1]?.trim();if(!table){errors.push('Table declaration: '+f);continue;}
 const names=kind=>new Set([...source.matchAll(new RegExp('^\\t'+kind+" (?:'((?:[^']|'')+)'|([^\\s=]+))",'gm'))].map(m=>(m[1]||m[2]).replace(/''/g,"'")));
 const m=names('measure');measures+=m.size;tables.set(table,{columns:names('column'),measures:m});
}
const visit=(o,fn)=>{if(!o||typeof o!=='object')return;fn(o);for(const v of Object.values(o))visit(v,fn);};
if(!meta.pageOrder.includes(meta.activePageName))errors.push('Active page missing');
for(const id of meta.pageOrder){
 const dir=path.join(root,'pages',id);if(!fs.existsSync(path.join(dir,'page.json'))){errors.push('Missing page '+id);continue;}
 const page=json(path.join(dir,'page.json')),ids=new Set();
 for(const n of fs.readdirSync(path.join(dir,'visuals'))){
  const v=json(path.join(dir,'visuals',n,'visual.json'));visuals++;types.add(v.visual.visualType);if(ids.has(v.name))errors.push('Duplicate visual '+v.name);ids.add(v.name);
  const p=v.position;if(p.x<0||p.y<0||p.x+p.width>page.width+.1||p.y+p.height>page.height+.1)errors.push('Outside page '+v.name);
  for(const link of v.visual.visualContainerObjects?.visualLink||[]){const dest=link.properties.navigationSection?.expr?.Literal?.Value?.slice(1,-1);if(dest){links++;if(!meta.pageOrder.includes(dest))errors.push('Dead navigation '+v.name);}}
  visit(v,o=>{for(const kind of ['Column','Measure'])if(o[kind]){const field=o[kind],entity=field.Expression?.SourceRef?.Entity;if(!entity)continue;const table=tables.get(entity);if(!table||!table[kind==='Column'?'columns':'measures'].has(field.Property))errors.push('Unresolved '+kind+' '+entity+'.'+field.Property+' in '+v.name);}});
 }
 for(const link of page.visualInteractions||[])if(!ids.has(link.source)||!ids.has(link.target))errors.push('Stale interaction '+id);
}
const report=json(path.join(root,'report.json'));
for(const name of report.publicCustomVisuals||[])if(!types.has(name))warnings.push('Unused custom visual '+name);
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.pbi')continue;const f=path.join(dir,entry.name);if(entry.isDirectory())walk(f);else if(/\.(csv|pbix|pbit)$/i.test(entry.name))warnings.push('Data file must remain untracked: '+path.relative(project,f));else if(/\.(json|tmdl|pbip|pbir|pbism)$/i.test(entry.name)){const content=fs.readFileSync(f,'utf8');if(/(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{24,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/.test(content))errors.push('Potential secret: '+path.relative(project,f));}}}walk(project);
console.log(JSON.stringify({pages:meta.pageOrder.length,tables:tables.size,measures,visuals,navigationLinks:links,customVisuals:report.publicCustomVisuals,errors,warnings},null,2));if(errors.length)process.exitCode=1;
