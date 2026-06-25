import { useState, useMemo } from "react";

const LEVELS = ["100", "200", "300", "400", "500"];
const DEPARTMENTS = [
  "Computer Science","Mathematics","Physics","Chemistry",
  "Biology","Engineering","Economics","Accounting",
  "Business Admin","Law",
];

const initialForm = {
  firstName:"",lastName:"",matric:"",department:"",
  level:"",email:"",phone:"",gender:"",
};

function Avatar({ student, size = 44 }) {
  const initials = `${student.firstName[0]||""}${student.lastName[0]||""}`.toUpperCase();
  const colors = ["#6C63FF","#4F46E5","#7C3AED","#2563EB","#0891B2","#059669","#D97706","#DC2626"];
  const color = colors[(student.matric.charCodeAt(0)||0) % colors.length];
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:color,
      display:"flex",alignItems:"center",justifyContent:"center",
      color:"#fff",fontSize:size*0.35,fontWeight:700,flexShrink:0}}>
      {initials||"?"}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      zIndex:1000,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",
        width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",
        padding:"24px 20px 40px"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:"#1e1b4b"}}>{title}</h2>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",
            borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",
        marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</label>
      <input {...props} style={{width:"100%",padding:"10px 12px",borderRadius:10,
        border:"1.5px solid #e5e7eb",fontSize:15,outline:"none",
        boxSizing:"border-box",background:"#fafafa",...props.style}}
        onFocus={e=>e.target.style.borderColor="#6C63FF"}
        onBlur={e=>e.target.style.borderColor="#e5e7eb"}/>
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:"#6b7280",
        marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</label>
      <select {...props} style={{width:"100%",padding:"10px 12px",borderRadius:10,
        border:"1.5px solid #e5e7eb",fontSize:15,outline:"none",
        boxSizing:"border-box",background:"#fafafa",appearance:"none"}}>
        <option value="">Select {label}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StudentForm({ initial=initialForm, onSave, onCancel, submitLabel="Add Student" }) {
  const [form,setForm] = useState(initial);
  const [errors,setErrors] = useState({});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const validate = () => {
    const e={};
    if(!form.firstName.trim()) e.firstName="Required";
    if(!form.lastName.trim()) e.lastName="Required";
    if(!form.matric.trim()) e.matric="Required";
    if(!form.department) e.department="Required";
    if(!form.level) e.level="Required";
    setErrors(e);
    return Object.keys(e).length===0;
  };
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <div>
          <Input label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="e.g. Chukwudi"/>
          {errors.firstName&&<p style={{color:"red",fontSize:11,margin:"-10px 0 10px"}}>{errors.firstName}</p>}
        </div>
        <div>
          <Input label="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="e.g. Okafor"/>
          {errors.lastName&&<p style={{color:"red",fontSize:11,margin:"-10px 0 10px"}}>{errors.lastName}</p>}
        </div>
      </div>
      <Input label="Matric Number" value={form.matric} onChange={set("matric")} placeholder="e.g. CSC/2021/001"/>
      {errors.matric&&<p style={{color:"red",fontSize:11,margin:"-10px 0 10px"}}>{errors.matric}</p>}
      <Select label="Department" options={DEPARTMENTS} value={form.department} onChange={set("department")}/>
      {errors.department&&<p style={{color:"red",fontSize:11,margin:"-10px 0 10px"}}>{errors.department}</p>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
        <div>
          <Select label="Level" options={LEVELS} value={form.level} onChange={set("level")}/>
          {errors.level&&<p style={{color:"red",fontSize:11,margin:"-10px 0 10px"}}>{errors.level}</p>}
        </div>
        <Select label="Gender" options={["Male","Female"]} value={form.gender} onChange={set("gender")}/>
      </div>
      <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="e.g. student@delsu.edu.ng"/>
      <Input label="Phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="e.g. 08012345678"/>
      <button onClick={()=>{if(validate())onSave(form);}} style={{width:"100%",padding:"14px",borderRadius:12,
        background:"linear-gradient(135deg,#4F46E5,#6C63FF)",color:"#fff",border:"none",
        fontSize:16,fontWeight:700,cursor:"pointer",marginTop:8}}>{submitLabel}</button>
      <button onClick={onCancel} style={{width:"100%",padding:"12px",borderRadius:12,
        background:"transparent",color:"#6b7280",border:"1.5px solid #e5e7eb",
        fontSize:15,fontWeight:600,cursor:"pointer",marginTop:8}}>Cancel</button>
    </div>
  );
}

function StudentDetail({ student, onClose, onEdit, onDelete }) {
  const [confirmDelete,setConfirmDelete] = useState(false);
  return (
    <Modal title="Student Profile" onClose={onClose}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,
        padding:"16px",background:"#f5f3ff",borderRadius:14}}>
        <Avatar student={student} size={60}/>
        <div>
          <div style={{fontWeight:700,fontSize:18,color:"#1e1b4b"}}>{student.firstName} {student.lastName}</div>
          <div style={{fontSize:13,color:"#6C63FF",fontWeight:600}}>{student.matric}</div>
        </div>
      </div>
      {[["Department",student.department],["Level",student.level+" Level"],
        ["Gender",student.gender||"—"],["Email",student.email||"—"],["Phone",student.phone||"—"]]
        .map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",
            padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
            <span style={{fontSize:13,color:"#9ca3af",fontWeight:600}}>{k}</span>
            <span style={{fontSize:14,color:"#1e1b4b",fontWeight:500}}>{v}</span>
          </div>
        ))}
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button onClick={onEdit} style={{flex:1,padding:"12px",borderRadius:12,
          background:"linear-gradient(135deg,#4F46E5,#6C63FF)",color:"#fff",
          border:"none",fontSize:15,fontWeight:700,cursor:"pointer"}}>Edit</button>
        <button onClick={()=>setConfirmDelete(true)} style={{flex:1,padding:"12px",borderRadius:12,
          background:"#fff1f2",color:"#e11d48",border:"1.5px solid #fecdd3",
          fontSize:15,fontWeight:700,cursor:"pointer"}}>Delete</button>
      </div>
      {confirmDelete&&(
        <div style={{marginTop:16,padding:16,background:"#fff1f2",borderRadius:12,border:"1px solid #fecdd3"}}>
          <p style={{margin:"0 0 12px",fontSize:14,color:"#be123c",fontWeight:600}}>
            Delete {student.firstName} {student.lastName}? This cannot be undone.
          </p>
          <div style={{display:"flex",gap:8}}>
            <button onClick={onDelete} style={{flex:1,padding:"10px",borderRadius:10,
              background:"#e11d48",color:"#fff",border:"none",fontWeight:700,cursor:"pointer"}}>Yes, Delete</button>
            <button onClick={()=>setConfirmDelete(false)} style={{flex:1,padding:"10px",borderRadius:10,
              background:"#fff",color:"#6b7280",border:"1.5px solid #e5e7eb",fontWeight:700,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function App() {
  const [students,setStudents] = useState([]);
  const [search,setSearch] = useState("");
  const [modal,setModal] = useState(null);
  const [selected,setSelected] = useState(null);

  const filtered = useMemo(()=>{
    const q=search.toLowerCase();
    return students.filter(s=>
      s.firstName.toLowerCase().includes(q)||
      s.lastName.toLowerCase().includes(q)||
      s.matric.toLowerCase().includes(q)||
      s.department.toLowerCase().includes(q));
  },[students,search]);

  const depts = useMemo(()=>new Set(students.map(s=>s.department).filter(Boolean)).size,[students]);
  const levels = useMemo(()=>new Set(students.map(s=>s.level).filter(Boolean)).size,[students]);

  const addStudent = form=>{setStudents(p=>[...p,{...form,id:Date.now().toString()}]);setModal(null);};
  const updateStudent = form=>{
    setStudents(p=>p.map(s=>s.id===selected.id?{...form,id:s.id}:s));
    setModal(null);setSelected(null);
  };
  const deleteStudent = ()=>{
    setStudents(p=>p.filter(s=>s.id!==selected.id));
    setModal(null);setSelected(null);
  };

  return (
    <div style={{minHeight:"100vh",background:"#f1f0f7",
      fontFamily:"'Inter',-apple-system,sans-serif",maxWidth:480,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(160deg,#3730a3 0%,#4338ca 40%,#6d28d9 100%)",
        borderRadius:"0 0 28px 28px",padding:"48px 20px 28px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.6)",
          letterSpacing:"0.12em",marginBottom:6}}>CSC 413 · DELSU</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <h1 style={{margin:0,fontSize:36,fontWeight:800,color:"#fff",lineHeight:1.15}}>
            Student<br/>Profiles</h1>
          <button onClick={()=>setModal("add")} style={{width:52,height:52,borderRadius:16,
            background:"rgba(255,255,255,0.25)",border:"none",color:"#fff",fontSize:28,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            backdropFilter:"blur(8px)"}}>+</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:24}}>
          {[[students.length,"STUDENTS"],[depts,"DEPTS"],[levels,"LEVELS"]].map(([val,label])=>(
            <div key={label} style={{background:"rgba(255,255,255,0.12)",borderRadius:14,
              padding:"14px 10px",textAlign:"center",backdropFilter:"blur(6px)"}}>
              <div style={{fontSize:26,fontWeight:800,color:"#fff"}}>{val}</div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",
                letterSpacing:"0.1em",marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:16,position:"relative"}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",
            fontSize:16,color:"#9ca3af"}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name, matric, department..."
            style={{width:"100%",padding:"13px 14px 13px 40px",borderRadius:14,border:"none",
              background:"rgba(255,255,255,0.18)",color:"#fff",fontSize:14,outline:"none",
              boxSizing:"border-box",backdropFilter:"blur(8px)"}}/>
        </div>
      </div>

      <div style={{padding:"20px 16px"}}>
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:56,marginBottom:12}}>🎓</div>
            <div style={{fontSize:17,fontWeight:700,color:"#374151"}}>
              {search?"No students found":"No students yet"}</div>
            <div style={{fontSize:14,color:"#9ca3af",marginTop:6}}>
              {search?"Try a different search term":"Tap + to add the first student"}</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map(student=>(
              <div key={student.id} onClick={()=>{setSelected(student);setModal("detail");}}
                style={{background:"#fff",borderRadius:16,padding:"14px 16px",
                  display:"flex",alignItems:"center",gap:14,cursor:"pointer",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <Avatar student={student}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:15,color:"#111827",
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {student.firstName} {student.lastName}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{student.matric}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{background:"#ede9fe",color:"#6d28d9",fontSize:11,fontWeight:700,
                    padding:"3px 8px",borderRadius:20,marginBottom:4}}>{student.level}L</div>
                  <div style={{fontSize:11,color:"#9ca3af",maxWidth:90,textAlign:"right",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {student.department.split(" ")[0]}</div>
                </div>
                <span style={{color:"#d1d5db",fontSize:18}}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal==="add"&&(
        <Modal title="Add Student" onClose={()=>setModal(null)}>
          <StudentForm onSave={addStudent} onCancel={()=>setModal(null)} submitLabel="Add Student"/>
        </Modal>
      )}
      {modal==="detail"&&selected&&(
        <StudentDetail student={selected}
          onClose={()=>{setModal(null);setSelected(null);}}
          onEdit={()=>setModal("edit")} onDelete={deleteStudent}/>
      )}
      {modal==="edit"&&selected&&(
        <Modal title="Edit Student" onClose={()=>{setModal(null);setSelected(null);}}>
          <StudentForm initial={selected} onSave={updateStudent}
            onCancel={()=>{setModal(null);setSelected(null);}} submitLabel="Save Changes"/>
        </Modal>
      )}
    </div>
  );
    }
