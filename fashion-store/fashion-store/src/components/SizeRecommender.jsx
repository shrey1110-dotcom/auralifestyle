import { useState } from "react";
export default function SizeRecommender({ sizes = [], onPick }) {
  const [height, setHeight] = useState(""); const [weight, setWeight] = useState(""); const [fit, setFit] = useState("regular"); const [rec, setRec] = useState("");
  const calc = () => {
    const h = +height, w = +weight; if (!h || !w) return setRec("Enter height & weight.");
    let idx = Math.min(Math.max(Math.round((w - 50) / 8), 0), sizes.length - 1);
    if (fit==="oversized") idx = Math.min(idx+1, sizes.length-1);
    if (fit==="slim") idx = Math.max(idx-1, 0);
    setRec(sizes[idx]); onPick?.(sizes[idx]);
  };
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">AI Size Recommendation</div>
      <div className="grid grid-cols-3 gap-2">
        <input className="border rounded px-2 py-1 bg-transparent" placeholder="Height (cm)" value={height} onChange={e=>setHeight(e.target.value)} />
        <input className="border rounded px-2 py-1 bg-transparent" placeholder="Weight (kg)" value={weight} onChange={e=>setWeight(e.target.value)} />
        <select className="border rounded px-2 py-1 bg-transparent" value={fit} onChange={e=>setFit(e.target.value)}>
          <option value="regular">Regular</option><option value="oversized">Oversized</option><option value="slim">Slim</option>
        </select>
      </div>
      <button onClick={calc} className="text-sm px-3 py-2 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Recommend</button>
      {rec && <div className="text-sm">Suggested size: <span className="font-semibold">{rec}</span></div>}
    </div>
  );
}
