export default function RotationSliders({ rotation, setRotation }) {
  return (
    <div className="shadcn-card mb-4">
      <div className="font-bold text-lg mb-2">Rotation (radians)</div>
      {["X", "Y", "Z"].map((axis, i) => (
        <div key={axis} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-orange-400 w-6">{axis}:</span>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={rotation[i]}
            onChange={e => setRotation(i, Number(e.target.value))}
            className="w-32 accent-orange-600 rounded h-2"
          />
          <span className="font-mono text-white ml-2">{rotation[i].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
