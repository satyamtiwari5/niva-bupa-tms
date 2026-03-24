import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const B = {
  blue:"#00AEEF",blueDark:"#0090C8",blueLight:"#E6F7FD",blueMid:"#CCF0FC",
  orange:"#F7941D",orangeLight:"#FFF4E6",orangeMid:"#FFE0B2",
  bg:"#F4F8FB",bgCard:"#FFFFFF",border:"#D0E8F5",borderLight:"#E8F4FB",
  text:"#1A2B3C",textSec:"#4A6580",textMuted:"#8BA0B5",
  green:"#22C55E",greenLight:"#DCFCE7",red:"#EF4444",redLight:"#FEE2E2",
  yellow:"#F59E0B",yellowLight:"#FEF3C7",violet:"#8B5CF6",violetLight:"#EDE9FE",
  cyan:"#06B6D4",cyanLight:"#CFFAFE",teal:"#14B8A6",tealLight:"#CCFBF1",
};

const DEFAULT_CHANNELS = ["Agency","Banca","TPD","NBFC","DST","Others"];
const DEFAULT_COURSES  = ["Reassure","Reassure 2.0","Reassure 3.0","Aspire","Senior First","Personal Accident","Sales Pitch","Objection Handling","Product Knowledge – Health","Regulatory & Compliance","Customer Service Excellence","Digital Tools Training","Leadership Essentials","New Joiner Induction"];
const DEFAULT_TOPICS   = ["Product Training","Sales Skills","Compliance","Leadership","Customer Service","Digital Tools","Induction","Health Insurance"];
const DEFAULT_DEPTS    = ["Sales","Operations","HR","Finance","Compliance","Technology","Marketing","Legal"];
const AUDIENCE_TYPES   = ["Internal Employee","Partner / Agent"];
const ALL_STATUSES     = ["Assigned","In Progress","Completed","Cancelled","Rescheduled","Transferred"];
const PIE_COLS         = [B.blue,B.orange,B.green,B.violet,B.cyan,B.teal,B.red,B.yellow];

// ─── INIT DATA ────────────────────────────────────────────────────────────────
const INIT_TRAINERS = [
  {id:1,name:"Priya Sharma", email:"priya@nivabupa.com", dept:"Sales",     phone:"9876543210",active:true, avatar:"PS",createdAt:"2024-01-15"},
  {id:2,name:"Arjun Mehta",  email:"arjun@nivabupa.com", dept:"Operations",phone:"9876543211",active:true, avatar:"AM",createdAt:"2024-02-10"},
  {id:3,name:"Neha Kapoor",  email:"neha@nivabupa.com",  dept:"HR",        phone:"9876543212",active:true, avatar:"NK",createdAt:"2024-03-05"},
  {id:4,name:"Rahul Verma",  email:"rahul@nivabupa.com", dept:"Finance",   phone:"9876543213",active:true, avatar:"RV",createdAt:"2024-03-20"},
];
const d=(days,h=10,m=0)=>{const dt=new Date();dt.setDate(dt.getDate()+days);dt.setHours(h,m,0,0);return dt.toISOString();};
const INIT_TRAININGS=[
  {id:"NB-001",mode:"Virtual", audienceType:"Internal Employee",channel:"Agency",courseName:"Reassure 2.0",         topic:"Product Training",trainerId:1,date:d(1),  time:"10:00",meetLink:"https://teams.microsoft.com/abc",plannedParticipants:25,actualParticipants:0, attendeeCodes:[],status:"Assigned",   cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-5), notes:"",createdBy:"admin"},
  {id:"NB-002",mode:"Physical",audienceType:"Partner / Agent",  channel:"Banca", courseName:"Sales Pitch",           topic:"Sales Skills",    trainerId:2,date:d(-2), time:"14:00",meetLink:"",plannedParticipants:30,actualParticipants:24,attendeeCodes:Array.from({length:24},(_,i)=>`EMP${String(i+1).padStart(3,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-10),notes:"",createdBy:"admin"},
  {id:"NB-003",mode:"Virtual", audienceType:"Partner / Agent",  channel:"TPD",   courseName:"Objection Handling",    topic:"Sales Skills",    trainerId:3,date:d(3),  time:"11:00",meetLink:"https://zoom.us/j/123456",plannedParticipants:20,actualParticipants:0, attendeeCodes:[],status:"Assigned",   cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-2), notes:"",createdBy:"admin"},
  {id:"NB-004",mode:"Physical",audienceType:"Internal Employee",channel:"NBFC",  courseName:"New Joiner Induction",  topic:"Induction",       trainerId:3,date:d(5),  time:"16:00",meetLink:"",plannedParticipants:35,actualParticipants:0, attendeeCodes:[],status:"Assigned",   cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-1), notes:"",createdBy:"admin"},
  {id:"NB-005",mode:"Virtual", audienceType:"Partner / Agent",  channel:"Agency",courseName:"Aspire",                topic:"Product Training",trainerId:4,date:d(7),  time:"15:00",meetLink:"https://teams.microsoft.com/xyz",plannedParticipants:22,actualParticipants:0, attendeeCodes:[],status:"Rescheduled",cancelReason:"",rescheduleReason:"Trainer conflict",transferReason:"",createdAt:d(-8), notes:"",createdBy:"admin"},
  {id:"NB-006",mode:"Physical",audienceType:"Internal Employee",channel:"DST",   courseName:"Personal Accident",     topic:"Product Training",trainerId:2,date:d(-7), time:"13:00",meetLink:"",plannedParticipants:40,actualParticipants:0, attendeeCodes:[],status:"Cancelled",  cancelReason:"Trainer hospitalized",rescheduleReason:"",transferReason:"",createdAt:d(-20),notes:"",createdBy:"admin"},
  {id:"NB-007",mode:"Virtual", audienceType:"Partner / Agent",  channel:"Others",courseName:"Senior First",           topic:"Product Training",trainerId:4,date:d(0),  time:"09:30",meetLink:"https://meet.google.com/abc",plannedParticipants:15,actualParticipants:0, attendeeCodes:[],status:"In Progress",cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-3), notes:"",createdBy:"admin"},
  {id:"NB-008",mode:"Physical",audienceType:"Internal Employee",channel:"Banca", courseName:"Reassure 3.0",           topic:"Product Training",trainerId:1,date:d(10), time:"10:00",meetLink:"",plannedParticipants:18,actualParticipants:0, attendeeCodes:[],status:"Assigned",   cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-1), notes:"",createdBy:"admin"},
  {id:"NB-009",mode:"Virtual", audienceType:"Partner / Agent",  channel:"Agency",courseName:"Reassure",               topic:"Product Training",trainerId:1,date:d(-15),time:"10:00",meetLink:"https://teams.microsoft.com/r", plannedParticipants:40,actualParticipants:35,attendeeCodes:Array.from({length:35},(_,i)=>`AG${String(i+101).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-20),notes:"Great session",createdBy:"trainer"},
  {id:"NB-010",mode:"Physical",audienceType:"Internal Employee",channel:"NBFC",  courseName:"Sales Pitch",             topic:"Sales Skills",    trainerId:1,date:d(-25),time:"14:00",meetLink:"",plannedParticipants:22,actualParticipants:18,attendeeCodes:Array.from({length:18},(_,i)=>`NB${String(i+201).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-30),notes:"",createdBy:"trainer"},
  {id:"NB-011",mode:"Physical",audienceType:"Internal Employee",channel:"Agency",courseName:"Leadership Essentials",   topic:"Leadership",      trainerId:2,date:d(-12),time:"11:00",meetLink:"",plannedParticipants:25,actualParticipants:22,attendeeCodes:Array.from({length:22},(_,i)=>`HR${String(i+301).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-14),notes:"",createdBy:"admin"},
  {id:"NB-012",mode:"Virtual", audienceType:"Partner / Agent",  channel:"Banca", courseName:"Regulatory & Compliance", topic:"Compliance",      trainerId:3,date:d(-18),time:"15:00",meetLink:"https://zoom.us/j/654321",plannedParticipants:50,actualParticipants:44,attendeeCodes:Array.from({length:44},(_,i)=>`BC${String(i+401).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-22),notes:"",createdBy:"trainer"},
  {id:"NB-013",mode:"Physical",audienceType:"Internal Employee",channel:"Agency",courseName:"Reassure",                topic:"Product Training",trainerId:2,date:d(-30),time:"09:00",meetLink:"",plannedParticipants:20,actualParticipants:17,attendeeCodes:Array.from({length:17},(_,i)=>`AG${String(i+501).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-32),notes:"",createdBy:"admin"},
  {id:"NB-014",mode:"Virtual", audienceType:"Partner / Agent",  channel:"TPD",   courseName:"Aspire",                  topic:"Product Training",trainerId:4,date:d(-35),time:"14:30",meetLink:"https://zoom.us/j/999111",plannedParticipants:30,actualParticipants:28,attendeeCodes:Array.from({length:28},(_,i)=>`TP${String(i+601).padStart(4,"0")}`),status:"Completed", cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:d(-38),notes:"",createdBy:"trainer"},
];
const INIT_USERS=[
  {id:0,email:"admin@nivabupa.com",password:"admin123",role:"admin",  name:"Admin",       avatar:"AD"},
  {id:1,email:"priya@nivabupa.com",password:"pass123", role:"trainer",name:"Priya Sharma",avatar:"PS",trainerId:1},
  {id:2,email:"arjun@nivabupa.com",password:"pass123", role:"trainer",name:"Arjun Mehta", avatar:"AM",trainerId:2},
  {id:3,email:"neha@nivabupa.com", password:"pass123", role:"trainer",name:"Neha Kapoor", avatar:"NK",trainerId:3},
  {id:4,email:"rahul@nivabupa.com",password:"pass123", role:"trainer",name:"Rahul Verma", avatar:"RV",trainerId:4},
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtDate=iso=>iso?new Date(iso).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—";
const genId=()=>`NB-${String(Date.now()).slice(-4)}`;
const genTId=arr=>Math.max(0,...arr.map(t=>t.id))+1;

const STATUS_CFG={
  "Assigned":   {color:B.blue,  bg:B.blueLight,  border:B.blueMid,  icon:"○"},
  "In Progress":{color:B.orange,bg:B.orangeLight, border:B.orangeMid,icon:"▶"},
  "Completed":  {color:B.green, bg:B.greenLight,  border:"#BBF7D0",  icon:"✓"},
  "Cancelled":  {color:B.red,   bg:B.redLight,    border:"#FECACA",  icon:"✕"},
  "Rescheduled":{color:B.violet,bg:B.violetLight, border:"#DDD6FE",  icon:"↺"},
  "Transferred":{color:B.cyan,  bg:B.cyanLight,   border:"#A5F3FC",  icon:"→"},
};

// ─── EXPORT (data URI — works in sandboxed iframes) ───────────────────────────
// Instead of URL.createObjectURL (blocked in sandboxes), we encode as base64 data URI
const buildCSV=(headers,rows)=>{
  const esc=v=>{const s=String(v??"");return(s.includes(",")||s.includes('"')||s.includes("\n"))?`"${s.replace(/"/g,'""')}"`:s;};
  return "\uFEFF"+[headers.join(","),...rows.map(r=>r.map(esc).join(","))].join("\r\n");
};

// Show a copy-paste modal instead of direct download (works everywhere)
let _showExportModal = null; // set by App component

const triggerExport=(csvText,filename)=>{
  if(_showExportModal) _showExportModal(csvText,filename);
};

const exportAllTrainings=(trainings,trainers,label="NivaBupa_Trainings")=>{
  const hdr=["Training ID","Audience Type","Mode","Channel","Course Name","Topic","Trainer","Date","Time","Planned","Actual","Attendance %","Status","Notes","Cancel Reason"];
  const rows=trainings.map(t=>{
    const tr=trainers.find(x=>x.id===t.trainerId);
    const pct=t.plannedParticipants?Math.round((t.actualParticipants/t.plannedParticipants)*100):0;
    return[t.id,t.audienceType||"",t.mode,t.channel,t.courseName,t.topic,tr?.name||"",fmtDate(t.date),t.time||"",t.plannedParticipants,t.actualParticipants,`${pct}%`,t.status,t.notes||"",t.cancelReason||""];
  });
  triggerExport(buildCSV(hdr,rows),label);
};
const exportTrainerSummary=(trainers,trainings)=>{
  const hdr=["Trainer","Dept","Email","Status","Total","Completed","Completion %","Planned","Actual","Avg Att %"];
  const rows=trainers.map(tr=>{
    const all=trainings.filter(t=>t.trainerId===tr.id);
    const dn=all.filter(t=>t.status==="Completed");
    const plan=dn.reduce((s,t)=>s+(t.plannedParticipants||0),0);
    const att=dn.reduce((s,t)=>s+(t.actualParticipants||0),0);
    return[tr.name,tr.dept,tr.email,tr.active?"Active":"Inactive",all.length,dn.length,all.length?`${Math.round(dn.length/all.length*100)}%`:"0%",plan,att,plan?`${Math.round(att/plan*100)}%`:"0%"];
  });
  triggerExport(buildCSV(hdr,rows),"NivaBupa_TrainerSummary");
};
const exportAttendanceSheet=(trainings,trainers)=>{
  const hdr=["Training ID","Audience","Course","Trainer","Date","Channel","Mode","Sr No","Code"];
  const rows=[];
  trainings.filter(t=>t.status==="Completed"&&t.attendeeCodes?.length).forEach(t=>{
    const tr=trainers.find(x=>x.id===t.trainerId);
    t.attendeeCodes.forEach((code,i)=>rows.push([t.id,t.audienceType||"",t.courseName,tr?.name||"",fmtDate(t.date),t.channel,t.mode,i+1,code]));
  });
  triggerExport(buildCSV(hdr,rows),"NivaBupa_AttendanceSheet");
};

// ─── EXPORT MODAL (sandbox-safe: textarea select-all) ────────────────────────
const ExportModal=({data,onClose})=>{
  const taRef=useRef(null);
  const [selected,setSelected]=useState(false);
  if(!data)return null;
  const lines=data.csv.split("\r\n");
  const rowCount=lines.length-1;

  const selectAll=()=>{
    if(taRef.current){
      taRef.current.focus();
      taRef.current.select();
      setSelected(true);
    }
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,50,100,0.28)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.bgCard,borderRadius:18,width:"100%",maxWidth:640,maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 64px rgba(0,100,200,0.2)",border:`1px solid ${B.border}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${B.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:"linear-gradient(135deg,#F0FAF4,#E8F7FD)",borderRadius:"18px 18px 0 0",flexShrink:0}}>
          <div>
            <div className="lex" style={{fontSize:15,fontWeight:700,color:B.text}}>📊 {data.filename}.csv</div>
            <div style={{fontSize:11,color:B.textSec,marginTop:2}}>{rowCount} data row{rowCount!==1?"s":""} ready to copy</div>
          </div>
          <button onClick={onClose} style={{background:"#fff",border:`1px solid ${B.border}`,borderRadius:8,color:B.textMuted,fontSize:20,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:14,flex:1,overflow:"auto"}}>
          <div style={{background:"#FFF8E1",border:"1.5px solid #FFD54F",borderRadius:12,padding:"12px 16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#E65100",marginBottom:8}}>How to copy this data into Excel</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[
                {n:"1",t:'Click the blue "Select All Data" button below'},
                {n:"2",t:"All CSV text gets highlighted"},
                {n:"3",t:"Press Ctrl+C (Windows) or Cmd+C (Mac) to copy"},
                {n:"4",t:"Open Excel → click empty cell → press Ctrl+V"},
                {n:"5",t:'If data lands in one column: Data tab → Text to Columns → Delimited → Comma'},
              ].map(({n,t})=>(
                <div key={n} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{width:18,height:18,borderRadius:"50%",background:"#E65100",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{n}</span>
                  <span style={{fontSize:12,color:"#5D4037"}}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={selectAll} style={{width:"100%",padding:"14px",background:selected?"#1D6F42":B.blue,border:"none",borderRadius:12,color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:`0 4px 14px ${selected?"rgba(29,111,66,0.35)":"rgba(0,174,239,0.35)"}`,transition:"all .2s"}}>
            {selected?"✓ Selected! Now press Ctrl+C to copy":"👆 Step 1: Click Here to Select All Data"}
          </button>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:11,fontWeight:700,color:B.textSec}}>CSV DATA ({rowCount} rows)</span>
              <span style={{fontSize:10,color:B.textMuted}}>Or click inside → Ctrl+A → Ctrl+C</span>
            </div>
            <textarea
              ref={taRef}
              readOnly
              value={data.csv}
              onClick={selectAll}
              style={{width:"100%",height:220,fontFamily:"monospace",fontSize:11,lineHeight:1.6,padding:"10px 12px",background:selected?"#EAF4FB":"#F8FAFB",border:`2px solid ${selected?B.blue:B.border}`,borderRadius:10,color:B.text,resize:"vertical",outline:"none",cursor:"text",transition:"border .2s",boxSizing:"border-box"}}
            />
          </div>
          <div style={{background:B.blueLight,borderRadius:10,padding:"10px 14px",border:`1px solid ${B.blueMid}`,fontSize:11,color:B.textSec,lineHeight:1.7}}>
            💡 <strong>Google Sheets alternative:</strong> Open Google Sheets → paste → it auto-splits columns correctly without any extra steps.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const G=()=>(
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lexend:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{height:100%;background:${B.bg};color:${B.text};font-family:'Plus Jakarta Sans',sans-serif}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:${B.borderLight}}
    ::-webkit-scrollbar-thumb{background:${B.blueMid};border-radius:3px}
    input,select,textarea,button{font-family:inherit}
    button{cursor:pointer}
    .lex{font-family:'Lexend',sans-serif}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fadeUp .3s ease both}
    .fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}
    .fu4{animation-delay:.20s}.fu5{animation-delay:.25s}
    select option{background:#fff;color:${B.text}}
    .sidebar-desktop{display:flex}
    .topbar-mobile,.bottomnav-mobile{display:none}
    .main-pad{padding:28px 24px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .g-stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:11px}
    .g-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:12px}
    .form-g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .page-h{display:flex;justify-content:space-between;align-items:center}
    .filter-chips{display:flex;gap:6px}
    @media(max-width:768px){
      .sidebar-desktop{display:none!important}
      .topbar-mobile,.bottomnav-mobile{display:flex!important}
      .main-pad{padding:72px 12px 90px!important}
      .g2,.g3{grid-template-columns:1fr!important}
      .g-stat{grid-template-columns:1fr 1fr!important}
      .g-cards{grid-template-columns:1fr!important}
      .form-g2{grid-template-columns:1fr!important}
      .page-h{flex-direction:column;align-items:flex-start;gap:10px}
      .filter-chips{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;-webkit-overflow-scrolling:touch}
      .filter-chips::-webkit-scrollbar{display:none}
      .hide-mob{display:none!important}
    }
  `}</style>
);

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Card=({children,style,className=""})=>(
  <div className={className} style={{background:B.bgCard,border:`1px solid ${B.border}`,borderRadius:14,boxShadow:"0 1px 4px rgba(0,174,239,0.06)",...style}}>{children}</div>
);
const Badge=({status,small})=>{
  const c=STATUS_CFG[status]||{color:B.textMuted,bg:B.bg,border:B.border,icon:"·"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:20,padding:small?"2px 8px":"4px 10px",fontSize:small?10:11,fontWeight:700,whiteSpace:"nowrap"}}><span style={{fontSize:9}}>{c.icon}</span>{status}</span>;
};
const ModeBadge=({mode})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:3,background:mode==="Virtual"?B.blueLight:B.orangeLight,color:mode==="Virtual"?B.blue:B.orange,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
    {mode==="Virtual"?"💻":"🏢"} {mode}
  </span>
);
const AudBadge=({type})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:3,background:type==="Internal Employee"?B.tealLight:B.violetLight,color:type==="Internal Employee"?B.teal:B.violet,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
    {type==="Internal Employee"?"🏛":"🤝"} {type==="Internal Employee"?"Internal":"Partner"}
  </span>
);
const Btn=({children,onClick,variant="primary",disabled,style,small,full})=>{
  const V={
    primary:{background:B.blue,    color:"#fff",border:"none",             shadow:`0 2px 8px rgba(0,174,239,0.28)`},
    orange: {background:B.orange,  color:"#fff",border:"none",             shadow:`0 2px 8px rgba(247,148,29,0.28)`},
    outline:{background:"transparent",color:B.blue,border:`1.5px solid ${B.blue}`,shadow:"none"},
    ghost:  {background:B.bg,      color:B.textSec,border:`1px solid ${B.border}`,shadow:"none"},
    danger: {background:B.redLight,color:B.red,  border:`1px solid #FECACA`,shadow:"none"},
    success:{background:B.greenLight,color:B.green,border:`1px solid #BBF7D0`,shadow:"none"},
    amber:  {background:B.yellowLight,color:B.yellow,border:`1px solid #FDE68A`,shadow:"none"},
    violet: {background:B.violetLight,color:B.violet,border:`1px solid #DDD6FE`,shadow:"none"},
    cyan:   {background:B.cyanLight,color:B.cyan,border:`1px solid #A5F3FC`,shadow:"none"},
    teal:   {background:B.tealLight,color:B.teal,border:`1px solid #99F6E4`,shadow:"none"},
    excel:  {background:"#1D6F42",  color:"#fff",border:"none",             shadow:"0 2px 8px rgba(29,111,66,0.22)"},
  };
  const s=V[variant]||V.primary;
  return <button onClick={onClick} disabled={disabled} style={{...s,borderRadius:9,padding:small?"5px 11px":"9px 18px",fontSize:small?11:13,fontWeight:700,opacity:disabled?.5:1,boxShadow:s.shadow,transition:"all .15s",width:full?"100%":undefined,...style}}>{children}</button>;
};
const iBase=(err)=>({background:"#fff",border:`1.5px solid ${err?B.red:B.border}`,borderRadius:9,padding:"9px 13px",color:B.text,fontSize:13,outline:"none",width:"100%",transition:"border .15s"});
const Field=({label,required,error,children})=>(
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:12,color:B.textSec,fontWeight:600}}>{label}{required&&<span style={{color:B.red}}> *</span>}</label>}
    {children}
    {error&&<span style={{fontSize:11,color:B.red}}>⚠ {error}</span>}
  </div>
);
const Inp=({label,value,onChange,type="text",placeholder,error,required})=>(
  <Field label={label} required={required} error={error}><input type={type} value={value} onChange={onChange} placeholder={placeholder} style={iBase(error)} /></Field>
);
const Sel=({label,value,onChange,options,required,error})=>(
  <Field label={label} required={required} error={error}>
    <select value={value} onChange={onChange} style={iBase(error)}>
      <option value="">Select...</option>
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
  </Field>
);
const Txt=({label,value,onChange,placeholder,rows=3,required})=>(
  <Field label={label} required={required}><textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...iBase(),resize:"vertical"}} /></Field>
);
const ModeToggle=({value,onChange})=>(
  <Field label="Mode of Training" required>
    <div style={{display:"flex",borderRadius:9,border:`1.5px solid ${B.border}`,overflow:"hidden",background:B.bg}}>
      {["Physical","Virtual"].map(m=>(
        <button key={m} onClick={()=>onChange(m)} style={{flex:1,padding:"10px 0",border:"none",fontWeight:700,fontSize:13,background:value===m?(m==="Physical"?B.orange:B.blue):"transparent",color:value===m?"#fff":B.textSec,transition:"all .2s"}}>
          {m==="Physical"?"🏢 Physical":"💻 Virtual"}
        </button>
      ))}
    </div>
  </Field>
);

// ─── REUSABLE FILTER BAR ──────────────────────────────────────────────────────
const FilterBar=({filters,onChange,onClear,options,showCount,filteredCount,totalCount})=>{
  const hasActive=Object.values(filters).some(v=>v!=="All"&&v!=="all");
  return (
    <Card style={{padding:"12px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:B.text}}>🔍 Filters</span>
        {showCount&&<span style={{fontSize:11,color:B.textSec}}>Showing <strong style={{color:B.blue}}>{filteredCount}</strong> of <strong>{totalCount}</strong></span>}
        {hasActive&&<button onClick={onClear} style={{fontSize:10,color:B.red,background:B.redLight,border:"none",borderRadius:6,padding:"2px 8px",fontWeight:700,cursor:"pointer",marginLeft:"auto"}}>✕ Clear All</button>}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
        {options.map(opt=>(
          <div key={opt.key}>
            <div style={{fontSize:10,color:B.textMuted,fontWeight:700,letterSpacing:".3px",marginBottom:4}}>{opt.label}</div>
            {opt.type==="select"?(
              <select value={filters[opt.key]} onChange={e=>onChange(opt.key,e.target.value)} style={{...iBase(),padding:"5px 10px",fontSize:11,width:"auto",minWidth:opt.minWidth||100}}>
                {opt.options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
              </select>
            ):(
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {opt.options.map(o=>{
                  const v=o.value??o;const l=o.label??o;const active=filters[opt.key]===v;
                  return <button key={v} onClick={()=>onChange(opt.key,v)} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${active?opt.activeColor||B.blue:B.border}`,background:active?opt.activeBg||B.blueLight:"#fff",color:active?opt.activeColor||B.blue:B.textSec,fontSize:11,fontWeight:active?700:500,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal=({open,onClose,title,children,width=540})=>{
  if(!open)return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,50,100,0.22)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:1000}}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.bgCard,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:width,maxHeight:"94vh",overflow:"auto",boxShadow:"0 -8px 40px rgba(0,100,200,0.14)",animation:"fadeUp .22s ease"}}>
        <div style={{padding:"14px 18px 12px",borderBottom:`1px solid ${B.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:B.bgCard,zIndex:1}}>
          <span className="lex" style={{fontSize:15,fontWeight:700,color:B.text}}>{title}</span>
          <button onClick={onClose} style={{background:B.bg,border:`1px solid ${B.border}`,borderRadius:8,color:B.textMuted,fontSize:18,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"16px 18px 28px"}}>{children}</div>
      </div>
    </div>
  );
};

const Stat=({label,value,icon,color,bg,sub,className})=>(
  <Card className={`fu ${className||""}`} style={{padding:"13px 15px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:10,color:B.textMuted,fontWeight:700,letterSpacing:".4px",marginBottom:5}}>{label}</div>
        <div className="lex" style={{fontSize:22,fontWeight:800,color,lineHeight:1}}>{value}</div>
        {sub&&<div style={{fontSize:10,color:B.textMuted,marginTop:4}}>{sub}</div>}
      </div>
      <div style={{width:34,height:34,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{icon}</div>
    </div>
  </Card>
);

// ─── MOBILE NAV ───────────────────────────────────────────────────────────────
const MobileTopBar=({user})=>(
  <div className="topbar-mobile" style={{position:"fixed",top:0,left:0,right:0,zIndex:900,background:"#fff",borderBottom:`1px solid ${B.border}`,padding:"10px 16px",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 8px rgba(0,174,239,0.08)"}}>
    <div style={{display:"flex",alignItems:"center",gap:7}}>
      <div style={{background:B.blue,borderRadius:8,padding:"5px 9px"}}><span className="lex" style={{color:"#fff",fontSize:12,fontWeight:800}}>niva</span></div>
      <div style={{background:B.orange,borderRadius:6,padding:"3px 7px"}}><span className="lex" style={{color:"#fff",fontSize:10,fontWeight:700}}>Bupa</span></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{fontSize:12,color:B.textSec,fontWeight:600}}>{user.name.split(" ")[0]}</div>
      <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${B.blue},${B.orange})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{user.avatar}</div>
    </div>
  </div>
);
const MobileBottomNav=({role,active,setActive,onLogout})=>{
  const nav=role==="admin"?[{id:"dashboard",icon:"⬡",label:"Home"},{id:"trainings",icon:"📋",label:"Sessions"},{id:"trainers",icon:"👥",label:"Trainers"},{id:"dropdowns",icon:"⚙",label:"Settings"},{id:"reports",icon:"📈",label:"Reports"}]:[{id:"dashboard",icon:"⬡",label:"Home"},{id:"trainings",icon:"📋",label:"Sessions"}];
  return (
    <div className="bottomnav-mobile" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:900,background:"#fff",borderTop:`1px solid ${B.border}`,padding:"6px 0 10px",justifyContent:"space-around",alignItems:"center",boxShadow:"0 -2px 12px rgba(0,174,239,0.1)"}}>
      {nav.map(item=>{const on=active===item.id;return(<button key={item.id} onClick={()=>setActive(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",padding:"4px 6px",color:on?B.blue:B.textMuted,minWidth:44}}><span style={{fontSize:17}}>{item.icon}</span><span style={{fontSize:9,fontWeight:on?700:500}}>{item.label}</span>{on&&<div style={{width:4,height:4,borderRadius:2,background:B.blue}}/>}</button>);})}
      <button onClick={onLogout} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",padding:"4px 6px",color:B.red,minWidth:44}}><span style={{fontSize:17}}>←</span><span style={{fontSize:9}}>Out</span></button>
    </div>
  );
};
const Sidebar=({role,active,setActive,onLogout,user})=>{
  const adminNav=[{id:"dashboard",icon:"⬡",label:"Dashboard"},{id:"trainings",icon:"📋",label:"Trainings"},{id:"trainers",icon:"👥",label:"Trainer Management"},{id:"dropdowns",icon:"⚙",label:"Dropdown Settings"},{id:"reports",icon:"📈",label:"Reports"}];
  const trainerNav=[{id:"dashboard",icon:"⬡",label:"Dashboard"},{id:"trainings",icon:"📋",label:"My Trainings"}];
  const nav=role==="admin"?adminNav:trainerNav;
  return (
    <div className="sidebar-desktop" style={{width:224,flexShrink:0,background:"#fff",borderRight:`1px solid ${B.border}`,flexDirection:"column",height:"100vh",position:"sticky",top:0,boxShadow:"2px 0 12px rgba(0,174,239,0.06)"}}>
      <div style={{padding:"16px 16px 12px",borderBottom:`1px solid ${B.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{background:B.blue,borderRadius:9,padding:"5px 10px"}}><span className="lex" style={{color:"#fff",fontSize:13,fontWeight:800}}>niva</span></div>
          <div style={{background:B.orange,borderRadius:7,padding:"4px 8px"}}><span className="lex" style={{color:"#fff",fontSize:11,fontWeight:700}}>Bupa</span></div>
        </div>
        <div style={{fontSize:10,color:B.textMuted,letterSpacing:".5px",marginTop:5}}>TRAINING MANAGEMENT</div>
      </div>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,background:B.blueLight}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,borderRadius:9,background:`linear-gradient(135deg,${B.blue},${B.orange})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{user.avatar}</div>
          <div style={{overflow:"hidden"}}>
            <div style={{fontSize:12,fontWeight:700,color:B.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".5px",color:role==="admin"?B.orange:B.blue,textTransform:"uppercase"}}>{role}</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
        {nav.map(item=>{const on=active===item.id;return(<button key={item.id} onClick={()=>setActive(item.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,border:"none",background:on?B.blueLight:"transparent",color:on?B.blue:B.textSec,fontSize:13,fontWeight:on?700:500,transition:"all .15s",textAlign:"left",width:"100%",borderLeft:on?`3px solid ${B.blue}`:"3px solid transparent"}}><span style={{fontSize:14}}>{item.icon}</span><span>{item.label}</span></button>);})}
      </nav>
      <div style={{padding:8,borderTop:`1px solid ${B.border}`}}><button onClick={onLogout} style={{width:"100%",padding:"8px",borderRadius:8,background:B.redLight,border:`1px solid #FECACA`,color:B.red,fontSize:13,fontWeight:600}}>← Sign Out</button></div>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const Login=({onLogin,users})=>{
  const [email,setEmail]=useState("admin@nivabupa.com");
  const [pwd,setPwd]=useState("admin123");
  const [err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const quick=[{label:"Admin",e:"admin@nivabupa.com",p:"admin123"},{label:"Priya",e:"priya@nivabupa.com",p:"pass123"},{label:"Arjun",e:"arjun@nivabupa.com",p:"pass123"}];
  const submit=()=>{
    setLoading(true);setErr("");
    setTimeout(()=>{
      const u=users.find(u=>u.email.toLowerCase()===email.toLowerCase().trim()&&u.password===pwd&&u.active!==false);
      if(u)onLogin(u);
      else{setErr("Invalid credentials. Check email and password.");setLoading(false);}
    },500);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,${B.blueLight} 0%,#fff 60%,${B.orangeLight} 100%)`,padding:16}}>
      <div className="fu" style={{textAlign:"center",marginBottom:24}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{background:B.blue,borderRadius:12,padding:"8px 14px"}}><span className="lex" style={{color:"#fff",fontSize:22,fontWeight:800}}>niva</span></div>
          <div style={{background:B.orange,borderRadius:10,padding:"6px 12px"}}><span className="lex" style={{color:"#fff",fontSize:16,fontWeight:700}}>Bupa</span></div>
        </div>
        <div className="lex" style={{fontSize:13,color:B.textSec}}>Training Management System</div>
      </div>
      <Card className="fu fu1" style={{width:"100%",maxWidth:380,padding:24}}>
        <div className="lex" style={{fontSize:20,fontWeight:800,marginBottom:4,color:B.text}}>Sign In</div>
        <div style={{fontSize:12,color:B.textSec,marginBottom:18}}>Access your TMS account</div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@nivabupa.com" required />
          <Inp label="Password" value={pwd} onChange={e=>setPwd(e.target.value)} type="password" placeholder="••••••••" required />
          {err&&<div style={{fontSize:12,color:B.red,background:B.redLight,borderRadius:8,padding:"8px 12px",border:`1px solid #FECACA`}}>⚠ {err}</div>}
          <Btn onClick={submit} disabled={loading} full style={{padding:12,fontSize:14}}>{loading?"Signing in…":"Sign In →"}</Btn>
        </div>
        <div style={{marginTop:18}}>
          <div style={{fontSize:10,color:B.textMuted,textAlign:"center",marginBottom:8,letterSpacing:".4px"}}>QUICK DEMO</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center"}}>
            {quick.map(q=><button key={q.label} onClick={()=>{setEmail(q.e);setPwd(q.p);}} style={{background:B.bg,border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",fontSize:11,color:B.textSec}}>{q.label}</button>)}
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── TRAINING FORM ────────────────────────────────────────────────────────────
const TrainingForm=({initial,trainers,dropdowns,onSave,onClose,currentUser})=>{
  const isTrainer=currentUser?.role==="trainer";
  const lockedId=isTrainer?String(currentUser.trainerId):"";
  const blank={mode:"Physical",audienceType:"",channel:"",courseName:"",topic:"",trainerId:lockedId,date:"",time:"",meetLink:"",plannedParticipants:"",notes:""};
  const [f,setF]=useState(initial?{...initial,date:initial.date?.slice(0,10),trainerId:String(initial.trainerId)}:blank);
  const [errs,setErrs]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const chanList=f.mode==="Physical"
    ?dropdowns.channels.filter(c=>!["Teams","Zoom","Google Meet","WebEx","Skype"].includes(c))
    :dropdowns.channels.filter(c=>!["In-Person (Classroom)","In-Person (Branch)","In-Person (Head Office)"].includes(c));
  const validate=()=>{
    const e={};
    if(!f.audienceType)e.audienceType="Required";
    if(!f.channel)e.channel="Required";
    if(!f.courseName)e.courseName="Required";
    if(!f.topic)e.topic="Required";
    if(!f.trainerId)e.trainerId="Required";
    if(!f.date)e.date="Required";
    if(!f.time)e.time="Required";
    if(!f.plannedParticipants||isNaN(+f.plannedParticipants)||+f.plannedParticipants<1)e.plannedParticipants="Required";
    if(f.mode==="Virtual"&&!f.meetLink)e.meetLink="Required for virtual";
    setErrs(e);return!Object.keys(e).length;
  };
  const submit=()=>{
    if(!validate())return;
    const dt=new Date(`${f.date}T${f.time}`);
    onSave({...f,trainerId:parseInt(f.trainerId),plannedParticipants:parseInt(f.plannedParticipants),date:dt.toISOString()});
  };
  const trainerOptions=isTrainer?trainers.filter(t=>t.id===currentUser.trainerId):trainers.filter(t=>t.active);
  const myTrainer=trainers.find(t=>t.id===currentUser?.trainerId);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {isTrainer&&!initial&&(
        <div style={{background:B.violetLight,border:"1.5px solid #DDD6FE",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🎓</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:B.violet}}>Creating as Trainer</div>
            <div style={{fontSize:11,color:B.textSec}}>Automatically assigned to you. Syncs to Admin dashboard instantly.</div>
          </div>
        </div>
      )}
      <Field label="Training For" required error={errs.audienceType}>
        <div style={{display:"flex",gap:8}}>
          {AUDIENCE_TYPES.map(a=>(
            <button key={a} onClick={()=>set("audienceType",a)} style={{flex:1,padding:"9px 10px",borderRadius:9,border:"1.5px solid "+(f.audienceType===a?(a==="Internal Employee"?B.teal:B.violet):B.border),background:f.audienceType===a?(a==="Internal Employee"?B.tealLight:B.violetLight):"#fff",color:f.audienceType===a?(a==="Internal Employee"?B.teal:B.violet):B.textSec,fontWeight:700,fontSize:12,transition:"all .2s"}}>
              {a==="Internal Employee"?"🏛 Internal Employee":"🤝 Partner / Agent"}
            </button>
          ))}
        </div>
      </Field>
      <ModeToggle value={f.mode} onChange={v=>{set("mode",v);set("channel","");set("meetLink","");}} />
      <div className="form-g2">
        <Sel label="Channel" value={f.channel} onChange={e=>set("channel",e.target.value)} options={chanList.length?chanList:dropdowns.channels} required error={errs.channel} />
        <Sel label="Course Name" value={f.courseName} onChange={e=>set("courseName",e.target.value)} options={dropdowns.courses} required error={errs.courseName} />
        <Sel label="Topic / Domain" value={f.topic} onChange={e=>set("topic",e.target.value)} options={dropdowns.topics} required error={errs.topic} />
        {isTrainer?(
          <Field label="Trainer (You)">
            <div style={{...iBase(),background:B.bg,color:B.textSec,display:"flex",alignItems:"center",gap:8,cursor:"default"}}>
              <span>🎓</span><span>{myTrainer?.name||"You"}</span>
            </div>
          </Field>
        ):(
          <Sel label="Assign Trainer" value={f.trainerId} onChange={e=>set("trainerId",e.target.value)} options={trainerOptions.map(t=>({value:t.id,label:t.name}))} required error={errs.trainerId} />
        )}
        <Inp label="Date" value={f.date} onChange={e=>set("date",e.target.value)} type="date" required error={errs.date} />
        <Inp label="Time" value={f.time} onChange={e=>set("time",e.target.value)} type="time" required error={errs.time} />
        <Inp label="Planned Participants" value={f.plannedParticipants} onChange={e=>set("plannedParticipants",e.target.value)} type="number" required error={errs.plannedParticipants} />
        {f.mode==="Virtual"&&<Inp label="Meeting Link" value={f.meetLink} onChange={e=>set("meetLink",e.target.value)} placeholder="https://..." required error={errs.meetLink} />}
      </div>
      <Txt label="Notes" value={f.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Any additional notes..." />
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <Btn variant="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn>
        <Btn onClick={submit} style={{flex:1}}>{initial?"Save Changes":"Create Training"}</Btn>
      </div>
    </div>
  );
};

// ─── BULK CODE ENTRY ──────────────────────────────────────────────────────────
const BulkCodeEntry=({codes,onChange,audienceType})=>{
  const [mode,setMode]=useState("paste");
  const [pasteText,setPasteText]=useState(codes.join("\n"));
  const [manualCodes,setManualCodes]=useState(codes.length?codes:[""]);
  const parse=useCallback(text=>text.split(/[\n\r,\t]+/).map(s=>s.trim()).filter(Boolean),[]);
  useEffect(()=>{if(mode==="paste")onChange(parse(pasteText));else onChange(manualCodes.filter(c=>c.trim()));},[pasteText,manualCodes,mode]);
  const parsed=parse(pasteText);
  const label=audienceType==="Partner / Agent"?"Agent / Partner Codes":"Employee Codes";
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:12,color:B.textSec,fontWeight:600}}>{label} <span style={{color:B.red}}>*</span></div>
        <div style={{display:"flex",background:B.bg,border:`1px solid ${B.border}`,borderRadius:8,overflow:"hidden"}}>
          {[{id:"paste",label:"📋 Bulk Paste"},{id:"manual",label:"✍ Manual"}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"5px 12px",border:"none",fontSize:11,fontWeight:mode===m.id?700:500,background:mode===m.id?B.blue:"transparent",color:mode===m.id?"#fff":B.textSec,transition:"all .15s"}}>{m.label}</button>
          ))}
        </div>
      </div>
      {mode==="paste"?(
        <div>
          <div style={{background:B.blueLight,borderRadius:10,padding:"10px 13px",fontSize:12,color:B.blue,border:`1px solid ${B.blueMid}`,marginBottom:8,lineHeight:1.6}}>
            💡 <strong>Paste from Excel:</strong> Copy a column of codes and paste below. Handles newlines, commas, tabs — all formats.
          </div>
          <div style={{position:"relative"}}>
            <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)}
              onPaste={e=>{const text=e.clipboardData.getData("text");setPasteText(p=>p?p+"\n"+text:text);e.preventDefault();}}
              placeholder={"Paste codes here...\nEMP001\nEMP002\n\nOr paste directly from Excel"} rows={7}
              style={{...iBase(),resize:"vertical",fontFamily:"monospace",fontSize:12,lineHeight:1.7}} />
            <button onClick={()=>setPasteText("")} style={{position:"absolute",top:8,right:10,background:B.redLight,border:"none",borderRadius:6,color:B.red,padding:"3px 8px",fontSize:10,fontWeight:600}}>Clear</button>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:parsed.length>0?B.green:B.textMuted,marginTop:5}}>
            {parsed.length>0?`✓ ${parsed.length} code${parsed.length!==1?"s":""} detected — Preview: ${parsed.slice(0,3).join(", ")}${parsed.length>3?` +${parsed.length-3} more`:""}`: "No codes detected yet — paste codes above"}
          </div>
        </div>
      ):(
        <div>
          <div style={{maxHeight:200,overflow:"auto",display:"flex",flexDirection:"column",gap:5}}>
            {manualCodes.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:10,color:B.textMuted,minWidth:22,textAlign:"right"}}>{i+1}.</span>
                <input value={c} onChange={e=>{const a=[...manualCodes];a[i]=e.target.value;setManualCodes(a);}} placeholder={`Code ${i+1}`} style={{...iBase(),flex:1,padding:"7px 11px",fontSize:12,fontFamily:"monospace"}} />
                {manualCodes.length>1&&<button onClick={()=>setManualCodes(manualCodes.filter((_,j)=>j!==i))} style={{background:B.redLight,border:"none",borderRadius:6,color:B.red,padding:"4px 8px",fontSize:13}}>×</button>}
              </div>
            ))}
          </div>
          <Btn small variant="outline" onClick={()=>setManualCodes(p=>[...p,""])} style={{marginTop:8}}>+ Add Code</Btn>
          <div style={{fontSize:11,color:B.textMuted,marginTop:5}}>{manualCodes.filter(c=>c.trim()).length} code{manualCodes.filter(c=>c.trim()).length!==1?"s":""} entered</div>
        </div>
      )}
    </div>
  );
};

// ─── COMPLETE MODAL ───────────────────────────────────────────────────────────
const CompleteModal=({training,onSave,onClose})=>{
  const [count,setCount]=useState(training.actualParticipants>0?String(training.actualParticipants):"");
  const [codes,setCodes]=useState(training.attendeeCodes?.length?training.attendeeCodes:[]);
  const [errs,setErrs]=useState({});
  const validate=()=>{
    const e={};const n=parseInt(count);
    if(!count||isNaN(n)||n<1)e.count="Enter actual number of attendees";
    else if(codes.length!==n)e.codes=`${codes.length} codes detected but count is ${n}. They must match exactly.`;
    setErrs(e);return!Object.keys(e).length;
  };
  const submit=()=>{if(!validate())return;onSave({...training,status:"Completed",actualParticipants:parseInt(count),attendeeCodes:codes});};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:B.blueLight,borderRadius:10,padding:"10px 14px",fontSize:13}}><strong>{training.courseName}</strong> · {training.audienceType} · Planned: {training.plannedParticipants}</div>
      <Inp label="Actual Attendees" value={count} onChange={e=>setCount(e.target.value)} type="number" required error={errs.count} />
      <BulkCodeEntry codes={codes} onChange={setCodes} audienceType={training.audienceType} />
      {errs.codes&&<div style={{fontSize:12,color:B.red,background:B.redLight,borderRadius:8,padding:"9px 12px",border:`1px solid #FECACA`}}>⚠ {errs.codes}</div>}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <Btn variant="ghost" onClick={onClose} style={{flex:1}}>Cancel</Btn>
        <Btn variant="success" onClick={submit} style={{flex:1}}>✓ Mark Completed</Btn>
      </div>
    </div>
  );
};

// ─── TRAINING CARD ────────────────────────────────────────────────────────────
const TrainingCard=({training,trainers,currentUser,onAction})=>{
  const trainer=trainers.find(t=>t.id===training.trainerId);
  const canAct=currentUser.role==="trainer"&&currentUser.trainerId===training.trainerId;
  const isAdmin=currentUser.role==="admin";
  const pct=training.plannedParticipants?Math.round((training.actualParticipants/training.plannedParticipants)*100):0;
  return (
    <Card className="fu" style={{padding:15}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5,flexWrap:"wrap"}}>
            <span style={{fontSize:9,color:B.textMuted,fontFamily:"monospace",background:B.blueMid,borderRadius:5,padding:"2px 6px",flexShrink:0}}>{training.id}</span>
            <ModeBadge mode={training.mode} />
            <AudBadge type={training.audienceType} />
            {training.createdBy==="trainer"
              ?<span style={{display:"inline-flex",alignItems:"center",gap:3,background:"#FFF7ED",color:"#9A3412",border:"1px solid #FED7AA",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>🎓 Trainer Created</span>
              :<span style={{display:"inline-flex",alignItems:"center",gap:3,background:B.blueLight,color:B.blueDark,border:`1px solid ${B.blueMid}`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>🛡 Admin Created</span>
            }
          </div>
          <div className="lex" style={{fontSize:14,fontWeight:700,color:B.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{training.courseName}</div>
          <div style={{fontSize:11,color:B.textSec,marginTop:2}}>{training.topic} · {training.channel}</div>
        </div>
        <Badge status={training.status} small />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
        {[{label:"📅 Date",value:fmtDate(training.date)},{label:"🕐 Time",value:training.time||"—"},{label:"👤 Trainer",value:trainer?.name||"—"},{label:"👥 Planned / Actual",value:`${training.plannedParticipants} / ${training.actualParticipants||"—"}`}].map(({label,value})=>(
          <div key={label} style={{background:B.bg,borderRadius:8,padding:"7px 10px",border:`1px solid ${B.borderLight}`}}>
            <div style={{fontSize:10,color:B.textMuted}}>{label}</div>
            <div style={{fontSize:12,fontWeight:600,color:B.text,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>
          </div>
        ))}
      </div>
      {training.status==="Completed"&&training.plannedParticipants>0&&(
        <div style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:B.textMuted,marginBottom:3}}><span>Attendance</span><span style={{fontWeight:700,color:pct>=80?B.green:pct>=60?B.yellow:B.red}}>{pct}%</span></div>
          <div style={{height:4,background:B.borderLight,borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:pct>=80?B.green:pct>=60?B.yellow:B.red,borderRadius:2}}/></div>
        </div>
      )}
      {training.meetLink&&training.mode==="Virtual"&&<a href={training.meetLink} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:B.blue,background:B.blueLight,padding:"5px 11px",borderRadius:20,border:`1px solid ${B.blueMid}`,textDecoration:"none",marginBottom:10}}>🔗 Join Meeting</a>}
      {(canAct||isAdmin)&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingTop:10,borderTop:`1px solid ${B.borderLight}`}}>
          {["Assigned","Rescheduled"].includes(training.status)&&canAct&&<Btn small variant="success" onClick={()=>onAction("start",training)}>▶ Start</Btn>}
          {training.status==="In Progress"&&canAct&&training.meetLink&&<Btn small variant="primary" onClick={()=>window.open(training.meetLink,"_blank")}>🔗 Open</Btn>}
          {["In Progress","Assigned"].includes(training.status)&&canAct&&<Btn small variant="success" onClick={()=>onAction("complete",training)}>✓ Complete</Btn>}
          {["Assigned","In Progress","Rescheduled"].includes(training.status)&&canAct&&<><Btn small variant="amber" onClick={()=>onAction("reschedule",training)}>↺</Btn><Btn small variant="cyan" onClick={()=>onAction("transfer",training)}>→</Btn><Btn small variant="danger" onClick={()=>onAction("cancel",training)}>✕</Btn></>}
          {(isAdmin||(canAct&&training.createdBy==="trainer"))&&<Btn small variant="outline" onClick={()=>onAction("edit",training)}>✏ Edit</Btn>}
        </div>
      )}
      {training.status==="Cancelled"&&training.cancelReason&&<div style={{background:B.redLight,borderRadius:8,padding:"7px 11px",fontSize:11,color:B.red,marginTop:8,border:`1px solid #FECACA`}}><strong>Cancel:</strong> {training.cancelReason}</div>}
      {training.status==="Rescheduled"&&training.rescheduleReason&&<div style={{background:B.violetLight,borderRadius:8,padding:"7px 11px",fontSize:11,color:B.violet,marginTop:8,border:`1px solid #DDD6FE`}}><strong>Rescheduled:</strong> {training.rescheduleReason}</div>}
      {training.notes&&<div style={{background:B.bg,borderRadius:8,padding:"7px 11px",fontSize:11,color:B.textSec,marginTop:8,border:`1px solid ${B.borderLight}`}}>📝 {training.notes}</div>}
    </Card>
  );
};

// ─── TRAININGS PAGE ───────────────────────────────────────────────────────────
const TrainingsPage=({trainings,trainers,currentUser,dropdowns,onUpdate,onAdd})=>{
  const [filters,setFilters]=useState({status:"All",mode:"All",audience:"All",createdBy:"All"});
  const [search,setSearch]=useState("");const[modal,setModal]=useState(null);const[form,setForm]=useState({});const[errs,setErrs]=useState({});
  const [showAdd,setShowAdd]=useState(false);const[editT,setEditT]=useState(null);
  const setF=(k,v)=>setFilters(p=>({...p,[k]:v}));
  let visible=trainings;
  if(currentUser.role==="trainer")visible=visible.filter(t=>t.trainerId===currentUser.trainerId);
  if(filters.status!=="All")visible=visible.filter(t=>t.status===filters.status);
  if(filters.mode!=="All")visible=visible.filter(t=>t.mode===filters.mode);
  if(filters.audience!=="All")visible=visible.filter(t=>t.audienceType===filters.audience);
  if(filters.createdBy!=="All")visible=visible.filter(t=>t.createdBy===filters.createdBy);
  if(search)visible=visible.filter(t=>[t.courseName,t.id,t.channel,t.topic,t.audienceType].some(v=>v?.toLowerCase().includes(search.toLowerCase())));
  const openAction=(type,training)=>{
    if(type==="start"){if(training.meetLink)window.open(training.meetLink,"_blank");onUpdate({...training,status:"In Progress"});return;}
    if(type==="edit"){setEditT(training);return;}
    setModal({type,training});setForm({});setErrs({});
  };
  const validateAction=()=>{
    const e={};const{type}=modal;
    if(type==="cancel"&&!form.reason?.trim())e.reason="Required";
    if(type==="reschedule"){if(!form.newDate)e.newDate="Required";if(!form.newTime)e.newTime="Required";if(!form.reason?.trim())e.reason="Required";}
    if(type==="transfer"){if(!form.toTrainerId)e.toTrainerId="Select trainer";if(!form.reason?.trim())e.reason="Required";}
    setErrs(e);return!Object.keys(e).length;
  };
  const submitAction=()=>{
    if(!validateAction())return;const{type,training}=modal;let u={...training};
    if(type==="cancel"){u.status="Cancelled";u.cancelReason=form.reason;}
    if(type==="reschedule"){u.status="Rescheduled";u.date=new Date(`${form.newDate}T${form.newTime}`).toISOString();u.time=form.newTime;u.rescheduleReason=form.reason;}
    if(type==="transfer"){u.status="Transferred";u.trainerId=parseInt(form.toTrainerId);u.transferReason=form.reason;}
    onUpdate(u);setModal(null);
  };
  const otherTrainers=modal?trainers.filter(t=>t.active&&t.id!==modal.training?.trainerId):[];
  const filterOpts=[
    {key:"mode",label:"MODE",type:"chips",activeColor:B.orange,activeBg:B.orangeLight,options:["All","Physical","Virtual"]},
    {key:"audience",label:"AUDIENCE",type:"chips",activeColor:B.teal,activeBg:B.tealLight,options:[{value:"All",label:"All"},{value:"Internal Employee",label:"🏛 Internal"},{value:"Partner / Agent",label:"🤝 Partner"}]},
    {key:"createdBy",label:"CREATED BY",type:"chips",activeColor:"#9A3412",activeBg:"#FFF7ED",options:[{value:"All",label:"All"},{value:"admin",label:"🛡 Admin"},{value:"trainer",label:"🎓 Trainer"}]},
    {key:"status",label:"STATUS",type:"chips",activeColor:B.blue,activeBg:B.blueLight,options:["All",...ALL_STATUSES]},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="page-h fu">
        <div>
          <h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>{currentUser.role==="admin"?"All Trainings":"My Trainings"}</h1>
          <div style={{fontSize:12,color:B.textSec,marginTop:2}}>{visible.length} session{visible.length!==1?"s":""}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn small variant="excel" onClick={()=>exportAllTrainings(visible,trainers,"NivaBupa_Trainings_Export")}>⬇ Export</Btn>
          <Btn onClick={()=>setShowAdd(true)} small>+ New Training</Btn>
        </div>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search course, channel, topic, audience…" style={{...iBase(),maxWidth:380}} />
      <FilterBar filters={filters} onChange={setF} onClear={()=>setFilters({status:"All",mode:"All",audience:"All",createdBy:"All"})} options={filterOpts} showCount filteredCount={visible.length} totalCount={trainings.filter(t=>currentUser.role==="trainer"?t.trainerId===currentUser.trainerId:true).length} />
      <div className="g-cards">
        {visible.map(tr=><TrainingCard key={tr.id} training={tr} trainers={trainers} currentUser={currentUser} onAction={openAction} />)}
        {visible.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:50,color:B.textMuted,fontSize:14}}>No trainings found</div>}
      </div>
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Create New Training" width={580}>
        <TrainingForm trainers={trainers} dropdowns={dropdowns} currentUser={currentUser} onSave={data=>{onAdd({...data,id:genId(),actualParticipants:0,attendeeCodes:[],status:"Assigned",cancelReason:"",rescheduleReason:"",transferReason:"",createdAt:new Date().toISOString(),createdBy:currentUser.role});setShowAdd(false);}} onClose={()=>setShowAdd(false)} />
      </Modal>
      <Modal open={!!editT} onClose={()=>setEditT(null)} title="Edit Training" width={580}>
        {editT&&<TrainingForm initial={editT} trainers={trainers} dropdowns={dropdowns} currentUser={currentUser} onSave={data=>{onUpdate({...editT,...data});setEditT(null);}} onClose={()=>setEditT(null)} />}
      </Modal>
      <Modal open={modal?.type==="complete"} onClose={()=>setModal(null)} title="Complete Training — Submit Attendance" width={560}>
        {modal?.type==="complete"&&<CompleteModal training={modal.training} onSave={u=>{onUpdate(u);setModal(null);}} onClose={()=>setModal(null)} />}
      </Modal>
      <Modal open={modal?.type==="cancel"} onClose={()=>setModal(null)} title="Cancel Training">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Txt label="Cancellation Reason" value={form.reason||""} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} required />
          {errs.reason&&<div style={{fontSize:12,color:B.red,background:B.redLight,borderRadius:8,padding:"9px 12px"}}>⚠ {errs.reason}</div>}
          <div style={{display:"flex",gap:10}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>Back</Btn><Btn variant="danger" onClick={submitAction} style={{flex:1}}>Confirm</Btn></div>
        </div>
      </Modal>
      <Modal open={modal?.type==="reschedule"} onClose={()=>setModal(null)} title="Reschedule Training">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="form-g2"><Inp label="New Date" value={form.newDate||""} onChange={e=>setForm(p=>({...p,newDate:e.target.value}))} type="date" required error={errs.newDate} /><Inp label="New Time" value={form.newTime||""} onChange={e=>setForm(p=>({...p,newTime:e.target.value}))} type="time" required error={errs.newTime} /></div>
          <Txt label="Reason" value={form.reason||""} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} required />
          {errs.reason&&<div style={{fontSize:12,color:B.red,background:B.redLight,borderRadius:8,padding:"9px 12px"}}>⚠ {errs.reason}</div>}
          <div style={{display:"flex",gap:10}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>Back</Btn><Btn variant="violet" onClick={submitAction} style={{flex:1}}>↺ Reschedule</Btn></div>
        </div>
      </Modal>
      <Modal open={modal?.type==="transfer"} onClose={()=>setModal(null)} title="Transfer Training">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Sel label="Transfer To" value={form.toTrainerId||""} onChange={e=>setForm(p=>({...p,toTrainerId:e.target.value}))} options={otherTrainers.map(t=>({value:t.id,label:t.name}))} required error={errs.toTrainerId} />
          <Txt label="Reason" value={form.reason||""} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} required />
          {errs.reason&&<div style={{fontSize:12,color:B.red,background:B.redLight,borderRadius:8,padding:"9px 12px"}}>⚠ {errs.reason}</div>}
          <div style={{display:"flex",gap:10}}><Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1}}>Back</Btn><Btn variant="cyan" onClick={submitAction} style={{flex:1}}>→ Transfer</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDash=({trainings,trainers})=>{
  const [live,setLive]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setLive(new Date()),1000);return()=>clearInterval(t);},[]);

  // ── DASHBOARD FILTERS ──
  const [filters,setFilters]=useState({dateRange:"all",channel:"All",mode:"All",audience:"All",trainer:"All",status:"All",createdBy:"All"});
  const setF=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const hasActive=Object.values(filters).some(v=>v!=="All"&&v!=="all");

  const now=new Date();
  const applyDate=t=>{
    if(filters.dateRange==="all")return true;
    const dt=new Date(t.date);
    if(filters.dateRange==="thisMonth")return dt.getMonth()===now.getMonth()&&dt.getFullYear()===now.getFullYear();
    if(filters.dateRange==="last3"){const x=new Date(now);x.setMonth(x.getMonth()-3);return dt>=x;}
    if(filters.dateRange==="last6"){const x=new Date(now);x.setMonth(x.getMonth()-6);return dt>=x;}
    return true;
  };
  let filtered=trainings.filter(applyDate);
  if(filters.channel!=="All")filtered=filtered.filter(t=>t.channel===filters.channel);
  if(filters.mode!=="All")filtered=filtered.filter(t=>t.mode===filters.mode);
  if(filters.audience!=="All")filtered=filtered.filter(t=>t.audienceType===filters.audience);
  if(filters.trainer!=="All")filtered=filtered.filter(t=>t.trainerId===parseInt(filters.trainer));
  if(filters.status!=="All")filtered=filtered.filter(t=>t.status===filters.status);
  if(filters.createdBy!=="All")filtered=filtered.filter(t=>t.createdBy===filters.createdBy);

  const total=filtered.length,done=filtered.filter(t=>t.status==="Completed").length,
    inProg=filtered.filter(t=>t.status==="In Progress").length,cancelled=filtered.filter(t=>t.status==="Cancelled").length,
    assigned=filtered.filter(t=>t.status==="Assigned").length,physical=filtered.filter(t=>t.mode==="Physical").length,
    virtual=filtered.filter(t=>t.mode==="Virtual").length,internal=filtered.filter(t=>t.audienceType==="Internal Employee").length,
    partner=filtered.filter(t=>t.audienceType==="Partner / Agent").length;

  const trainerPerf=trainers.map(tr=>({name:tr.name.split(" ")[0],total:filtered.filter(t=>t.trainerId===tr.id).length,done:filtered.filter(t=>t.trainerId===tr.id&&t.status==="Completed").length}));
  const statusData=[{name:"Assigned",v:assigned},{name:"In Progress",v:inProg},{name:"Completed",v:done},{name:"Cancelled",v:cancelled}];
  const modeData=[{name:"Physical",value:physical},{name:"Virtual",value:virtual}];
  const audData=[{name:"Internal",value:internal},{name:"Partner",value:partner}];
  const chanData=DEFAULT_CHANNELS.map(ch=>({name:ch,c:filtered.filter(t=>t.channel===ch).length})).filter(x=>x.c>0);

  // Monthly trend based on filtered data (last 6 months)
  const monthTrend=Array.from({length:6},(_,i)=>{
    const dt=new Date(now);dt.setMonth(dt.getMonth()-5+i);
    const m=dt.toLocaleDateString("en-IN",{month:"short"});
    const mT=filtered.filter(t=>{const td=new Date(t.date);return td.getMonth()===dt.getMonth()&&td.getFullYear()===dt.getFullYear();});
    const mD=mT.filter(t=>t.status==="Completed");
    return{m,planned:mT.reduce((s,t)=>s+(t.plannedParticipants||0),0),actual:mD.reduce((s,t)=>s+(t.actualParticipants||0),0),sessions:mT.length};
  });

  const tt=()=>({contentStyle:{background:"#fff",border:`1px solid ${B.border}`,borderRadius:10,fontSize:11}});
  const recent=[...filtered].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);

  const filterOpts=[
    {key:"dateRange",label:"DATE RANGE",type:"chips",activeColor:B.blue,activeBg:B.blueLight,options:[{value:"all",label:"All Time"},{value:"thisMonth",label:"This Month"},{value:"last3",label:"Last 3M"},{value:"last6",label:"Last 6M"}]},
    {key:"mode",label:"MODE",type:"chips",activeColor:B.orange,activeBg:B.orangeLight,options:["All","Physical","Virtual"]},
    {key:"audience",label:"AUDIENCE",type:"chips",activeColor:B.teal,activeBg:B.tealLight,options:[{value:"All",label:"All"},{value:"Internal Employee",label:"🏛 Internal"},{value:"Partner / Agent",label:"🤝 Partner"}]},
    {key:"channel",label:"CHANNEL",type:"select",minWidth:110,options:[{value:"All",label:"All Channels"},...DEFAULT_CHANNELS.map(c=>({value:c,label:c}))]},
    {key:"trainer",label:"TRAINER",type:"select",minWidth:120,options:[{value:"All",label:"All Trainers"},...trainers.map(t=>({value:t.id,label:t.name.split(" ")[0]}))]},
    {key:"status",label:"STATUS",type:"select",minWidth:120,options:[{value:"All",label:"All Statuses"},...ALL_STATUSES.map(s=>({value:s,label:s}))]},
    {key:"createdBy",label:"CREATED BY",type:"chips",activeColor:"#9A3412",activeBg:"#FFF7ED",options:[{value:"All",label:"All"},{value:"admin",label:"🛡 Admin"},{value:"trainer",label:"🎓 Trainer"}]},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {/* Header */}
      <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>Admin Dashboard</h1>
          <div style={{fontSize:12,color:B.textSec,marginTop:2}}><span style={{color:B.green,fontWeight:700}}>● LIVE</span>{"  "}{live.toLocaleTimeString("en-IN")}{hasActive&&<span style={{marginLeft:8,color:B.orange,fontWeight:600}}>· Filtered view</span>}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn small variant="excel" onClick={()=>exportAllTrainings(filtered,trainers,"NivaBupa_Dashboard_Export")}>⬇ Export View</Btn>
          <Btn small variant="excel" onClick={()=>exportTrainerSummary(trainers,trainings)}>⬇ Trainer Summary</Btn>
        </div>
      </div>

      {/* FILTER BAR */}
      <FilterBar className="fu" filters={filters} onChange={setF} onClear={()=>setFilters({dateRange:"all",channel:"All",mode:"All",audience:"All",trainer:"All",status:"All",createdBy:"All"})} options={filterOpts} showCount filteredCount={filtered.length} totalCount={trainings.length} />

      {/* Stats */}
      <div className="g-stat fu">
        <Stat label="TOTAL" value={total} icon="📋" color={B.blue} bg={B.blueLight} className="fu1" />
        <Stat label="COMPLETED" value={done} icon="✅" color={B.green} bg={B.greenLight} sub={`${total?Math.round(done/total*100):0}%`} className="fu2" />
        <Stat label="IN PROGRESS" value={inProg} icon="▶" color={B.orange} bg={B.orangeLight} className="fu3" />
        <Stat label="ASSIGNED" value={assigned} icon="○" color={B.blue} bg={B.blueLight} className="fu3" />
        <Stat label="PHYSICAL" value={physical} icon="🏢" color={B.orange} bg={B.orangeLight} className="fu4" />
        <Stat label="VIRTUAL" value={virtual} icon="💻" color={B.blue} bg={B.blueLight} className="fu4" />
        <Stat label="INTERNAL" value={internal} icon="🏛" color={B.teal} bg={B.tealLight} className="fu5" />
        <Stat label="PARTNER" value={partner} icon="🤝" color={B.violet} bg={B.violetLight} className="fu5" />
      </div>

      {/* Charts row 1 */}
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Monthly Trend (Sessions &amp; Attendance)</div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={monthTrend}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} />
              <XAxis dataKey="m" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} />
              <Line type="monotone" dataKey="sessions" stroke={B.blue} strokeWidth={2.5} dot={{fill:B.blue,r:3}} name="Sessions" />
              <Line type="monotone" dataKey="planned" stroke={B.blueMid} strokeWidth={2} dot={{fill:B.blueMid,r:3}} name="Planned" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="actual" stroke={B.green} strokeWidth={2.5} dot={{fill:B.green,r:3}} name="Actual Att." />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Trainer Performance</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={trainerPerf}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} />
              <XAxis dataKey="name" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} />
              <Bar dataKey="total" name="Total" fill={B.blue} radius={[4,4,0,0]} />
              <Bar dataKey="done" name="Completed" fill={B.green} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Sessions by Channel</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chanData}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} />
              <XAxis dataKey="name" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} />
              <Bar dataKey="c" name="Sessions" radius={[4,4,0,0]}>{chanData.map((_,i)=><Cell key={i} fill={PIE_COLS[i%8]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Status Distribution</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={statusData} dataKey="v" nameKey="name" cx="50%" cy="50%" innerRadius={36} outerRadius={60} paddingAngle={3}>
              {statusData.map((_,i)=><Cell key={i} fill={[B.blue,B.orange,B.green,B.red][i]} />)}
            </Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 3 */}
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Physical vs Virtual</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={modeData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value">
              <Cell fill={B.orange}/><Cell fill={B.blue}/>
            </Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Internal vs Partner</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={audData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value">
              <Cell fill={B.teal}/><Cell fill={B.violet}/>
            </Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="fu" style={{padding:16}}>
        <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Recent Activity {hasActive&&<span style={{fontSize:10,color:B.textMuted,fontWeight:400}}>(filtered)</span>}</div>
        {recent.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:B.textMuted,fontSize:13}}>No sessions match current filters</div>}
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {recent.map(tr=>{const trainer=trainers.find(t=>t.id===tr.trainerId);return(
            <div key={tr.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:9,background:B.bg,border:`1px solid ${B.borderLight}`,gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                <span style={{fontSize:9,color:B.textMuted,fontFamily:"monospace",background:B.blueMid,borderRadius:5,padding:"2px 6px",flexShrink:0}}>{tr.id}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tr.courseName}</div>
                  <div style={{fontSize:10,color:B.textSec,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{trainer?.name} · <ModeBadge mode={tr.mode} /> · {tr.createdBy==="trainer"?<span style={{color:"#9A3412",fontWeight:700,fontSize:10}}>🎓 Trainer</span>:<span style={{color:B.blueDark,fontWeight:700,fontSize:10}}>🛡 Admin</span>}</div>
                </div>
              </div>
              <Badge status={tr.status} small />
            </div>
          );})}
        </div>
      </Card>
    </div>
  );
};

// ─── TRAINER DASHBOARD ────────────────────────────────────────────────────────
const TrainerDash=({trainings,trainerObj,trainers})=>{
  const [filters,setFilters]=useState({dateRange:"all",channel:"All",mode:"All",audience:"All",course:"All",status:"All",createdBy:"All"});
  const setF=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const now=new Date();
  const applyDate=t=>{
    if(filters.dateRange==="all")return true;
    const dt=new Date(t.date);
    if(filters.dateRange==="thisMonth")return dt.getMonth()===now.getMonth()&&dt.getFullYear()===now.getFullYear();
    if(filters.dateRange==="last3"){const x=new Date(now);x.setMonth(x.getMonth()-3);return dt>=x;}
    if(filters.dateRange==="last6"){const x=new Date(now);x.setMonth(x.getMonth()-6);return dt>=x;}
    return true;
  };
  const all=trainings.filter(t=>t.trainerId===trainerObj?.id);
  let filtered=all.filter(applyDate);
  if(filters.channel!=="All")filtered=filtered.filter(t=>t.channel===filters.channel);
  if(filters.mode!=="All")filtered=filtered.filter(t=>t.mode===filters.mode);
  if(filters.audience!=="All")filtered=filtered.filter(t=>t.audienceType===filters.audience);
  if(filters.course!=="All")filtered=filtered.filter(t=>t.courseName===filters.course);
  if(filters.status!=="All")filtered=filtered.filter(t=>t.status===filters.status);
  if(filters.createdBy!=="All")filtered=filtered.filter(t=>t.createdBy===filters.createdBy);

  const done=filtered.filter(t=>t.status==="Completed");
  const upcoming=filtered.filter(t=>["Assigned","Rescheduled"].includes(t.status));
  const inProg=filtered.filter(t=>t.status==="In Progress");
  const totalPlanned=done.reduce((s,t)=>s+(t.plannedParticipants||0),0);
  const totalActual=done.reduce((s,t)=>s+(t.actualParticipants||0),0);
  const avgAtt=totalPlanned?Math.round(totalActual/totalPlanned*100):0;

  const byChannel=DEFAULT_CHANNELS.map(ch=>({name:ch,value:filtered.filter(t=>t.channel===ch).length})).filter(x=>x.value>0);
  const byAud=[{name:"Internal",value:filtered.filter(t=>t.audienceType==="Internal Employee").length},{name:"Partner",value:filtered.filter(t=>t.audienceType==="Partner / Agent").length}];
  const byCourse=filtered.reduce((a,t)=>{const ex=a.find(x=>x.name===t.courseName);if(ex)ex.c++;else a.push({name:t.courseName?.slice(0,16)||"?",c:1});return a;},[]).sort((a,b)=>b.c-a.c).slice(0,6);
  const monthTrend=Array.from({length:6},(_,i)=>{
    const dt=new Date(now);dt.setMonth(dt.getMonth()-5+i);
    const m=dt.toLocaleDateString("en-IN",{month:"short"});
    const mT=all.filter(t=>{const td=new Date(t.date);return td.getMonth()===dt.getMonth()&&td.getFullYear()===dt.getFullYear();});
    const mD=mT.filter(t=>t.status==="Completed");
    return{m,sessions:mT.length,completed:mD.length,attendees:mD.reduce((s,t)=>s+(t.actualParticipants||0),0)};
  });

  const uniqueChannels=["All",...new Set(all.map(t=>t.channel).filter(Boolean))];
  const uniqueCourses=["All",...new Set(all.map(t=>t.courseName).filter(Boolean))];
  const tt=()=>({contentStyle:{background:"#fff",border:`1px solid ${B.border}`,borderRadius:10,fontSize:11}});

  const filterOpts=[
    {key:"dateRange",label:"DATE RANGE",type:"chips",activeColor:B.blue,activeBg:B.blueLight,options:[{value:"all",label:"All Time"},{value:"thisMonth",label:"This Month"},{value:"last3",label:"Last 3M"},{value:"last6",label:"Last 6M"}]},
    {key:"mode",label:"MODE",type:"chips",activeColor:B.orange,activeBg:B.orangeLight,options:["All","Physical","Virtual"]},
    {key:"audience",label:"AUDIENCE",type:"chips",activeColor:B.teal,activeBg:B.tealLight,options:[{value:"All",label:"All"},{value:"Internal Employee",label:"🏛 Internal"},{value:"Partner / Agent",label:"🤝 Partner"}]},
    {key:"channel",label:"CHANNEL",type:"select",minWidth:110,options:uniqueChannels.map(c=>({value:c,label:c}))},
    {key:"course",label:"COURSE",type:"select",minWidth:130,options:uniqueCourses.map(c=>({value:c,label:c}))},
    {key:"status",label:"STATUS",type:"select",minWidth:120,options:["All",...ALL_STATUSES].map(s=>({value:s,label:s}))},
    {key:"createdBy",label:"CREATED BY",type:"chips",activeColor:"#9A3412",activeBg:"#FFF7ED",options:[{value:"All",label:"All"},{value:"admin",label:"🛡 Admin"},{value:"trainer",label:"🎓 Self-Created"}]},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="page-h fu">
        <div>
          <h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>My Dashboard</h1>
          <div style={{fontSize:12,color:B.textSec,marginTop:2}}>Welcome back, {trainerObj?.name?.split(" ")[0]||"Trainer"} 👋</div>
        </div>
        <Btn small variant="excel" onClick={()=>exportAllTrainings(trainings.filter(t=>t.trainerId===trainerObj?.id),trainers,"NivaBupa_My_Trainings")}>⬇ Export My Data</Btn>
      </div>
      <FilterBar filters={filters} onChange={setF} onClear={()=>setFilters({dateRange:"all",channel:"All",mode:"All",audience:"All",course:"All",status:"All",createdBy:"All"})} options={filterOpts} showCount filteredCount={filtered.length} totalCount={all.length} />
      <div className="g-stat fu">
        <Stat label="TOTAL" value={filtered.length} icon="📋" color={B.blue} bg={B.blueLight} className="fu1" />
        <Stat label="COMPLETED" value={done.length} icon="✅" color={B.green} bg={B.greenLight} sub={filtered.length?`${Math.round(done.length/filtered.length*100)}%`:"—"} className="fu2" />
        <Stat label="UPCOMING" value={upcoming.length} icon="📅" color={B.violet} bg={B.violetLight} className="fu3" />
        <Stat label="IN PROGRESS" value={inProg.length} icon="▶" color={B.orange} bg={B.orangeLight} className="fu3" />
        <Stat label="PLANNED" value={totalPlanned} icon="👤" color={B.blue} bg={B.blueLight} className="fu4" />
        <Stat label="ACTUAL" value={totalActual} icon="👥" color={B.teal} bg={B.tealLight} sub={`${avgAtt}% avg`} className="fu4" />
      </div>
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Monthly Trend</div>
          <ResponsiveContainer width="100%" height={165}>
            <LineChart data={monthTrend}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} />
              <XAxis dataKey="m" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} />
              <Line type="monotone" dataKey="sessions" stroke={B.blue} strokeWidth={2.5} dot={{fill:B.blue,r:3}} name="Sessions" />
              <Line type="monotone" dataKey="completed" stroke={B.green} strokeWidth={2.5} dot={{fill:B.green,r:3}} name="Completed" />
              <Line type="monotone" dataKey="attendees" stroke={B.orange} strokeWidth={2} dot={{fill:B.orange,r:3}} name="Attendees" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>By Channel</div>
          <ResponsiveContainer width="100%" height={165}>
            <PieChart><Pie data={byChannel.length?byChannel:[{name:"No data",value:1}]} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
              {byChannel.map((_,i)=><Cell key={i} fill={PIE_COLS[i%8]} />)}
            </Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Courses Delivered</div>
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={byCourse} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} horizontal={false} />
              <XAxis type="number" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={100} />
              <Tooltip {...tt()} />
              <Bar dataKey="c" name="Sessions" fill={B.orange} radius={[0,4,4,0]}>{byCourse.map((_,i)=><Cell key={i} fill={PIE_COLS[i%8]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Internal vs Partner</div>
          <ResponsiveContainer width="100%" height={165}>
            <PieChart><Pie data={byAud} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={4} dataKey="value">
              <Cell fill={B.teal}/><Cell fill={B.violet}/>
            </Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="fu" style={{padding:16}}>
        <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Attendance Rate — Completed Sessions</div>
        {done.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:B.textMuted,fontSize:13}}>No completed sessions in this filter</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {done.slice(0,8).map(t=>{const rate=t.plannedParticipants?Math.round(t.actualParticipants/t.plannedParticipants*100):0;return(
            <div key={t.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.courseName}</div><div style={{fontSize:10,color:B.textMuted}}>{fmtDate(t.date)} · {t.channel}</div></div>
              <div style={{width:100,height:5,background:B.borderLight,borderRadius:3}}><div style={{width:`${Math.min(rate,100)}%`,height:"100%",background:rate>=80?B.green:rate>=60?B.yellow:B.red,borderRadius:3}}/></div>
              <span style={{fontSize:11,fontWeight:700,color:rate>=80?B.green:rate>=60?B.yellow:B.red,minWidth:34,textAlign:"right"}}>{rate}%</span>
            </div>
          );})}
        </div>
      </Card>
      <Card className="fu" style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div className="lex" style={{fontSize:12,fontWeight:700,color:B.text}}>Upcoming Sessions</div><span style={{fontSize:11,color:B.textSec}}>{upcoming.length} session{upcoming.length!==1?"s":""}</span></div>
        {upcoming.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:B.textMuted,fontSize:13}}>No upcoming sessions</div>}
        {upcoming.slice(0,5).map(tr=>(
          <div key={tr.id} style={{padding:"9px 12px",borderRadius:9,background:B.bg,border:`1px solid ${B.borderLight}`,marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
            <div><div style={{fontSize:12,fontWeight:600}}>{tr.courseName}</div><div style={{fontSize:10,color:B.textSec,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginTop:2}}>{fmtDate(tr.date)} · {tr.time} · <ModeBadge mode={tr.mode} /> · <AudBadge type={tr.audienceType} /></div></div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:10,color:B.textMuted}}>👥 {tr.plannedParticipants}</span><Badge status={tr.status} small /></div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── TRAINER MANAGEMENT ───────────────────────────────────────────────────────
const TrainerMgmt=({trainers,setTrainers,trainings,users,setUsers})=>{
  const [showAdd,setShowAdd]=useState(false);const[editT,setEditT]=useState(null);
  const [f,setF]=useState({name:"",email:"",dept:"",phone:""});const[errs,setErrs]=useState({});
  const [search,setSearch]=useState("");const[filter,setFilter]=useState("All");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const validate=()=>{const e={};if(!f.name?.trim())e.name="Required";if(!f.email?.trim()||!f.email.includes("@"))e.email="Valid email required";if(!f.dept)e.dept="Required";setErrs(e);return!Object.keys(e).length;};
  const saveTrainer=()=>{
    if(!validate())return;
    if(editT){
      // Update trainer profile
      setTrainers(prev=>prev.map(t=>t.id===editT.id?{...t,...f}:t));
      // Sync name/email in users too
      setUsers(prev=>prev.map(u=>u.trainerId===editT.id?{...u,name:f.name,email:f.email}:u));
    }else{
      const nid=genTId(trainers);
      const init=f.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
      const newTrainer={id:nid,...f,active:true,avatar:init,createdAt:new Date().toISOString().slice(0,10)};
      setTrainers(prev=>[...prev,newTrainer]);
      // Create matching login user with default password
      const newUser={id:nid,email:f.email,password:"pass123",role:"trainer",name:f.name,avatar:init,trainerId:nid,active:true};
      setUsers(prev=>[...prev,newUser]);
    }
    setShowAdd(false);setEditT(null);setF({name:"",email:"",dept:"",phone:""});
  };
  const toggleActive=id=>{
    setTrainers(prev=>prev.map(t=>t.id===id?{...t,active:!t.active}:t));
    setUsers(prev=>prev.map(u=>u.trainerId===id?{...u,active:!u.active}:u));
  };
  const openEdit=t=>{setEditT(t);setF({name:t.name,email:t.email,dept:t.dept,phone:t.phone||""});setErrs({});setShowAdd(true);};
  let visible=trainers;
  if(filter==="Active")visible=visible.filter(t=>t.active);
  if(filter==="Inactive")visible=visible.filter(t=>!t.active);
  if(search)visible=visible.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.email.toLowerCase().includes(search.toLowerCase()));
  const GRADS=[`${B.blue},${B.blueDark}`,`${B.orange},#D97706`,`${B.green},#16A34A`,`${B.violet},#7C3AED`,`${B.cyan},#0891B2`];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="page-h fu">
        <div><h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>Trainer Management</h1><div style={{fontSize:12,color:B.textSec,marginTop:2}}>{trainers.filter(t=>t.active).length} active · {trainers.filter(t=>!t.active).length} inactive</div></div>
        <div style={{display:"flex",gap:8}}><Btn small variant="excel" onClick={()=>exportTrainerSummary(trainers,trainings)}>⬇ Export</Btn><Btn onClick={()=>{setEditT(null);setF({name:"",email:"",dept:"",phone:""});setErrs({});setShowAdd(true);}} small>+ Create ID</Btn></div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search…" style={{...iBase(),maxWidth:220}} />
        {["All","Active","Inactive"].map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"5px 13px",borderRadius:20,border:`1.5px solid ${filter===s?B.blue:B.border}`,background:filter===s?B.blueLight:"#fff",color:filter===s?B.blue:B.textSec,fontSize:11,fontWeight:filter===s?700:500,cursor:"pointer"}}>{s}</button>)}
      </div>
      <div className="g-cards">
        {visible.map((tr,i)=>{
          const myT=trainings.filter(t=>t.trainerId===tr.id),dnT=myT.filter(t=>t.status==="Completed"),rate=myT.length?Math.round(dnT.length/myT.length*100):0;
          return(
            <Card key={tr.id} className={`fu fu${i%4+1}`} style={{padding:15,opacity:tr.active?1:.75}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:11}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:11,background:`linear-gradient(135deg,${GRADS[i%5]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>{tr.avatar}</div>
                  <div><div className="lex" style={{fontWeight:700,fontSize:13,color:B.text}}>{tr.name}</div><div style={{fontSize:11,color:B.textSec}}>{tr.email}</div><div style={{fontSize:10,color:B.textMuted}}>{tr.dept}{tr.phone?` · ${tr.phone}`:""}</div></div>
                </div>
                <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:20,background:tr.active?B.greenLight:B.redLight,color:tr.active?B.green:B.red,border:`1px solid ${tr.active?"#BBF7D0":"#FECACA"}`,whiteSpace:"nowrap"}}>{tr.active?"● Active":"○ Off"}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:11}}>
                {[{l:"Total",v:myT.length,c:B.blue},{l:"Done",v:dnT.length,c:B.green},{l:"Rate",v:`${rate}%`,c:rate>=70?B.green:B.yellow}].map(({l,v,c})=>(
                  <div key={l} style={{background:B.bg,borderRadius:7,padding:"7px 8px",textAlign:"center",border:`1px solid ${B.borderLight}`}}>
                    <div className="lex" style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:9,color:B.textMuted,marginTop:1}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:6,borderTop:`1px solid ${B.borderLight}`,paddingTop:10,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:9,color:B.textMuted,flex:1}}>TRN-{String(tr.id).padStart(3,"0")} · Since {tr.createdAt?.slice(0,10)}</span>
                <Btn small variant="outline" onClick={()=>openEdit(tr)}>✏</Btn>
                <Btn small variant={tr.active?"danger":"success"} onClick={()=>toggleActive(tr.id)}>{tr.active?"Deactivate":"Activate"}</Btn>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setEditT(null);}} title={editT?"Edit Trainer":"Create Trainer ID"} width={460}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="form-g2">
            <Inp label="Full Name" value={f.name} onChange={e=>set("name",e.target.value)} required error={errs.name} placeholder="Riya Singh" />
            <Inp label="Email (Login ID)" value={f.email} onChange={e=>set("email",e.target.value)} type="email" required error={errs.email} placeholder="riya@nivabupa.com" />
            <Sel label="Department" value={f.dept} onChange={e=>set("dept",e.target.value)} options={DEFAULT_DEPTS} required error={errs.dept} />
            <Inp label="Phone (optional)" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="98XXXXXXXX" />
          </div>
          {!editT&&(
            <div style={{background:"#F0FFF4",border:"1.5px solid #BBF7D0",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:12,fontWeight:700,color:B.green,marginBottom:6}}>✓ Login credentials will be created automatically</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{background:"#fff",borderRadius:8,padding:"8px 12px",border:"1px solid #BBF7D0"}}>
                  <div style={{fontSize:10,color:B.textMuted,marginBottom:2}}>LOGIN EMAIL</div>
                  <div style={{fontSize:12,fontWeight:700,color:B.text}}>{f.email||"(email above)"}</div>
                </div>
                <div style={{background:"#fff",borderRadius:8,padding:"8px 12px",border:"1px solid #BBF7D0"}}>
                  <div style={{fontSize:10,color:B.textMuted,marginBottom:2}}>DEFAULT PASSWORD</div>
                  <div style={{fontSize:12,fontWeight:700,color:B.text,fontFamily:"monospace"}}>pass123</div>
                </div>
              </div>
              <div style={{fontSize:11,color:B.textSec,marginTop:8}}>ℹ The trainer can log in immediately after creation using these credentials.</div>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:4}}><Btn variant="ghost" onClick={()=>{setShowAdd(false);setEditT(null);}} style={{flex:1}}>Cancel</Btn><Btn onClick={saveTrainer} style={{flex:1}}>{editT?"Save Changes":"Create Trainer ID"}</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ─── DROPDOWN SETTINGS ────────────────────────────────────────────────────────
const DropdownSettings=({dropdowns,setDropdowns})=>{
  const [tab,setTab]=useState("channels");const[newVal,setNewVal]=useState("");const[editIdx,setEditIdx]=useState(null);const[editVal,setEditVal]=useState("");
  const tabs=[{key:"channels",label:"Channels",icon:"📡"},{key:"courses",label:"Courses",icon:"📚"},{key:"topics",label:"Topics",icon:"🏷"}];
  const list=dropdowns[tab]||[];
  const add=()=>{if(!newVal.trim())return;setDropdowns(p=>({...p,[tab]:[...p[tab],newVal.trim()]}));setNewVal("");};
  const remove=i=>setDropdowns(p=>({...p,[tab]:p[tab].filter((_,j)=>j!==i)}));
  const saveEdit=i=>{if(!editVal.trim())return;setDropdowns(p=>({...p,[tab]:p[tab].map((v,j)=>j===i?editVal.trim():v)}));setEditIdx(null);setEditVal("");};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="fu"><h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>Dropdown Settings</h1><div style={{fontSize:12,color:B.textSec,marginTop:2}}>Manage options across all forms</div></div>
      <Card className="fu" style={{padding:4}}><div style={{display:"flex",gap:2,padding:4}}>{tabs.map(t=><button key={t.key} onClick={()=>{setTab(t.key);setEditIdx(null);setNewVal("");}} style={{flex:1,padding:"9px 8px",borderRadius:8,border:"none",background:tab===t.key?B.blueLight:"transparent",color:tab===t.key?B.blue:B.textSec,fontWeight:tab===t.key?700:500,fontSize:12,borderBottom:tab===t.key?`2px solid ${B.blue}`:"2px solid transparent"}}>{t.icon} {t.label}</button>)}</div></Card>
      <div className="g2 fu">
        <Card style={{padding:16}}>
          <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12,color:B.text}}>Current Options ({list.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {list.map((val,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 11px",borderRadius:8,background:B.bg,border:`1px solid ${B.borderLight}`}}>
                {editIdx===i?<><input value={editVal} onChange={e=>setEditVal(e.target.value)} style={{...iBase(),flex:1,padding:"5px 9px",fontSize:12}} autoFocus onKeyDown={e=>e.key==="Enter"&&saveEdit(i)} /><Btn small variant="success" onClick={()=>saveEdit(i)}>✓</Btn><Btn small variant="ghost" onClick={()=>setEditIdx(null)}>×</Btn></>
                :<><span style={{fontSize:13,flex:1,color:B.text}}>{val}</span><Btn small variant="outline" onClick={()=>{setEditIdx(i);setEditVal(val);}}>✏</Btn><Btn small variant="danger" onClick={()=>remove(i)}>🗑</Btn></>}
              </div>
            ))}
            {list.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:B.textMuted,fontSize:13}}>No options yet</div>}
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card style={{padding:16}}>
            <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:10}}>Add New Option</div>
            <div style={{display:"flex",gap:8}}><input value={newVal} onChange={e=>setNewVal(e.target.value)} placeholder="New option…" onKeyDown={e=>e.key==="Enter"&&add()} style={{...iBase(),flex:1}} /><Btn onClick={add} disabled={!newVal.trim()}>Add</Btn></div>
          </Card>
          <Card style={{padding:16}}>
            <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:8}}>Live Preview</div>
            <select style={{width:"100%",background:"#fff",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 13px",color:B.text,fontSize:13,outline:"none"}}><option>Select...</option>{list.map((v,i)=><option key={i}>{v}</option>)}</select>
            <div style={{fontSize:10,color:B.textMuted,marginTop:5}}>↑ As it appears in forms</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── REPORTS ──────────────────────────────────────────────────────────────────
const Reports=({trainings,trainers})=>{
  const [msg,setMsg]=useState("");
  const doExport=(fn,label)=>{fn();setMsg(`✓ ${label} — click Download or Copy in the window that opened`);setTimeout(()=>setMsg(""),4000);};
  const courseData=trainings.reduce((a,t)=>{const ex=a.find(x=>x.name===t.courseName);if(ex)ex.c++;else a.push({name:t.courseName?.slice(0,16)||"?",c:1});return a;},[]).slice(0,8);
  const modeData=[{name:"Physical",value:trainings.filter(t=>t.mode==="Physical").length},{name:"Virtual",value:trainings.filter(t=>t.mode==="Virtual").length}];
  const audData=[{name:"Internal",value:trainings.filter(t=>t.audienceType==="Internal Employee").length},{name:"Partner",value:trainings.filter(t=>t.audienceType==="Partner / Agent").length}];
  const chanData=DEFAULT_CHANNELS.map(ch=>({name:ch,c:trainings.filter(t=>t.channel===ch).length})).filter(x=>x.c>0);
  const trend=[{m:"Oct",p:180,a:142},{m:"Nov",p:220,a:198},{m:"Dec",p:100,a:89},{m:"Jan",p:290,a:267},{m:"Feb",p:200,a:183},{m:"Mar",p:175,a:157}];
  const trainerTable=trainers.map(tr=>{const all=trainings.filter(t=>t.trainerId===tr.id);const dn=all.filter(t=>t.status==="Completed");const att=dn.reduce((s,t)=>s+(t.actualParticipants||0),0);const plan=dn.reduce((s,t)=>s+(t.plannedParticipants||0),0);return{name:tr.name,dept:tr.dept,total:all.length,done:dn.length,rate:all.length?Math.round(dn.length/all.length*100):0,att,plan,active:tr.active};});
  const tt=()=>({contentStyle:{background:"#fff",border:`1px solid ${B.border}`,borderRadius:10,fontSize:11}});
  const exports=[
    {label:"📋 All Trainings",        desc:"Complete list with all fields",                fn:()=>doExport(()=>exportAllTrainings(trainings,trainers),"All Trainings")},
    {label:"👥 Trainer Summary",      desc:"Per-trainer performance stats",                fn:()=>doExport(()=>exportTrainerSummary(trainers,trainings),"Trainer Summary")},
    {label:"✅ Attendance Sheet",     desc:"Employee/agent codes per session",             fn:()=>doExport(()=>exportAttendanceSheet(trainings,trainers),"Attendance Sheet")},
    {label:"🏢 Physical Only",        desc:"All physical mode trainings",                  fn:()=>doExport(()=>exportAllTrainings(trainings.filter(t=>t.mode==="Physical"),trainers,"NivaBupa_Physical"),"Physical")},
    {label:"💻 Virtual Only",         desc:"All virtual mode trainings",                   fn:()=>doExport(()=>exportAllTrainings(trainings.filter(t=>t.mode==="Virtual"),trainers,"NivaBupa_Virtual"),"Virtual")},
    {label:"🏛 Internal Employees",   desc:"Internal employee trainings only",             fn:()=>doExport(()=>exportAllTrainings(trainings.filter(t=>t.audienceType==="Internal Employee"),trainers,"NivaBupa_Internal"),"Internal")},
    {label:"🤝 Partner / Agent",      desc:"Partner and agent trainings only",             fn:()=>doExport(()=>exportAllTrainings(trainings.filter(t=>t.audienceType==="Partner / Agent"),trainers,"NivaBupa_Partner"),"Partner")},
    {label:"✓ Completed Only",        desc:"Only completed sessions",                      fn:()=>doExport(()=>exportAllTrainings(trainings.filter(t=>t.status==="Completed"),trainers,"NivaBupa_Completed"),"Completed")},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="fu"><h1 className="lex" style={{fontSize:22,fontWeight:800,color:B.text}}>Reports & Analytics</h1><div style={{fontSize:12,color:B.textSec,marginTop:2}}>Niva Bupa Health Insurance · Training Performance</div></div>
      <Card className="fu" style={{padding:16,border:`1.5px solid #BBF7D0`,background:"#F0FAF4"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16}}>📊</span><div className="lex" style={{fontSize:13,fontWeight:700,color:"#1D6F42"}}>Export Reports to Excel / CSV</div></div>
        {msg&&<div style={{background:"#DCFCE7",border:`1px solid #BBF7D0`,borderRadius:8,padding:"8px 12px",fontSize:12,color:B.green,marginBottom:10,fontWeight:600}}>{msg}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:10}}>
          {exports.map(({label,desc,fn})=>(
            <button key={label} onClick={fn} style={{display:"flex",flexDirection:"column",gap:3,background:"#fff",border:`1.5px solid #BBF7D0`,borderRadius:10,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
              <span style={{fontSize:12,fontWeight:700,color:"#1D6F42"}}>{label}</span>
              <span style={{fontSize:10,color:B.textSec}}>{desc}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:10,color:B.textMuted}}>Files open in a popup — click Download or Copy to Clipboard, then paste into Excel / Google Sheets</div>
      </Card>
      <div className="g2 fu">
        <Card style={{padding:16}}><div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12}}>Planned vs Actual</div>
          <ResponsiveContainer width="100%" height={170}><BarChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} /><XAxis dataKey="m" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} /><YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} /><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /><Bar dataKey="p" name="Planned" fill={B.blueMid} radius={[4,4,0,0]} /><Bar dataKey="a" name="Actual" fill={B.blue} radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}><div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12}}>Internal vs Partner</div>
          <ResponsiveContainer width="100%" height={170}><PieChart><Pie data={audData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value"><Cell fill={B.teal}/><Cell fill={B.violet}/></Pie><Tooltip {...tt()} /><Legend wrapperStyle={{fontSize:10}} /></PieChart></ResponsiveContainer>
        </Card>
      </div>
      <div className="g2 fu">
        <Card style={{padding:16}}><div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12}}>Sessions by Course</div>
          <ResponsiveContainer width="100%" height={200}><BarChart data={courseData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} horizontal={false} /><XAxis type="number" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} width={110} /><Tooltip {...tt()} /><Bar dataKey="c" name="Sessions" fill={B.orange} radius={[0,4,4,0]} /></BarChart></ResponsiveContainer>
        </Card>
        <Card style={{padding:16}}><div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:12}}>Sessions by Channel</div>
          <ResponsiveContainer width="100%" height={200}><BarChart data={chanData}><CartesianGrid strokeDasharray="3 3" stroke={B.borderLight} /><XAxis dataKey="name" tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} /><YAxis tick={{fill:B.textMuted,fontSize:10}} axisLine={false} tickLine={false} /><Tooltip {...tt()} /><Bar dataKey="c" name="Sessions" radius={[4,4,0,0]}>{chanData.map((_,i)=><Cell key={i} fill={PIE_COLS[i%8]} />)}</Bar></BarChart></ResponsiveContainer>
        </Card>
      </div>
      <Card className="fu" style={{padding:16}}>
        <div className="lex" style={{fontSize:12,fontWeight:700,marginBottom:14}}>Trainer Performance Summary</div>
        <div style={{overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:B.bg}}>{["Trainer","Dept","Status","Total","Done","Rate","Planned","Actual"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 10px",color:B.textMuted,fontSize:10,fontWeight:700,borderBottom:`1px solid ${B.border}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
            <tbody>{trainerTable.map((row,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${B.borderLight}`}}>
                <td style={{padding:"10px",fontWeight:600,color:B.text,whiteSpace:"nowrap"}}>{row.name}</td>
                <td style={{padding:"10px",color:B.textSec}}>{row.dept}</td>
                <td style={{padding:"10px"}}><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:row.active?B.greenLight:B.redLight,color:row.active?B.green:B.red}}>{row.active?"Active":"Off"}</span></td>
                <td style={{padding:"10px",color:B.blue,fontWeight:700}}>{row.total}</td>
                <td style={{padding:"10px",color:B.green,fontWeight:700}}>{row.done}</td>
                <td style={{padding:"10px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:4,background:B.borderLight,borderRadius:2,minWidth:36}}><div style={{width:`${row.rate}%`,height:"100%",background:row.rate>=70?B.green:B.yellow,borderRadius:2}}/></div><span style={{fontSize:11,color:row.rate>=70?B.green:B.yellow,fontWeight:700,minWidth:30}}>{row.rate}%</span></div></td>
                <td style={{padding:"10px",color:B.textSec}}>{row.plan}</td>
                <td style={{padding:"10px",color:B.orange,fontWeight:700}}>{row.att}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);const[page,setPage]=useState("dashboard");
  const [trainings,setTrainings]=useState(INIT_TRAININGS);const[trainers,setTrainers]=useState(INIT_TRAINERS);
  const [users,setUsers]=useState(INIT_USERS); // lifted so new trainers sync to login
  const [dropdowns,setDropdowns]=useState({channels:[...DEFAULT_CHANNELS],courses:[...DEFAULT_COURSES],topics:[...DEFAULT_TOPICS]});
  const [exportData,setExportData]=useState(null);

  // Wire up export modal
  _showExportModal=(csv,filename)=>setExportData({csv,filename});

  const trainerObj=user?.role==="trainer"?trainers.find(t=>t.id===user.trainerId):null;
  const onUpdate=u=>setTrainings(p=>p.map(t=>t.id===u.id?u:t));
  const onAdd=t=>setTrainings(p=>[t,...p]);
  const logout=()=>{setUser(null);setPage("dashboard");};

  const renderPage=()=>{
    if(page==="dashboard")return user.role==="admin"?<AdminDash trainings={trainings} trainers={trainers} />:<TrainerDash trainings={trainings} trainerObj={trainerObj} trainers={trainers} />;
    if(page==="trainings")return <TrainingsPage trainings={trainings} trainers={trainers} currentUser={user} dropdowns={dropdowns} onUpdate={onUpdate} onAdd={onAdd} />;
    if(page==="trainers") return <TrainerMgmt trainers={trainers} setTrainers={setTrainers} trainings={trainings} users={users} setUsers={setUsers} />;
    if(page==="dropdowns")return <DropdownSettings dropdowns={dropdowns} setDropdowns={setDropdowns} />;
    if(page==="reports")  return <Reports trainings={trainings} trainers={trainers} />;
  };

  if(!user)return <><G /><Login onLogin={u=>{setUser(u);setPage("dashboard");}} users={users}/></>;

  return (
    <>
      <G />
      <MobileTopBar user={user} />
      <MobileBottomNav role={user.role} active={page} setActive={setPage} onLogout={logout} />
      <div style={{display:"flex",minHeight:"100vh"}}>
        <Sidebar role={user.role} active={page} setActive={setPage} onLogout={logout} user={user} />
        <main className="main-pad" style={{flex:1,overflow:"auto",background:B.bg}}>
          <div style={{maxWidth:1160,margin:"0 auto"}}>{renderPage()}</div>
        </main>
      </div>
      <ExportModal data={exportData} onClose={()=>setExportData(null)} />
    </>
  );
}
