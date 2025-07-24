import '../../ui/BikeCardControls.css';

export default function RotationSliders({ rotation, setRotation }) {
  return (
    <div className="bikecard-slider-group bikecard-rotation-group">
      <div className="bikecard-slider-group-label">Rotation (radians)</div>
      {["X", "Y", "Z"].map((axis, i) => (
        <div key={axis} className="bikecard-slider-row">
          <span className="bikecard-slider-axis">{axis}:</span>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={rotation[i]}
            onChange={e => setRotation(i, Number(e.target.value))}
            className="bikecard-slider"
          />
          <span className="bikecard-slider-value">{rotation[i].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
