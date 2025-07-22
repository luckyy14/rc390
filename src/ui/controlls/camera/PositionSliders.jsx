import '../../BikeCardControls.css';

export default function PositionSliders({ position, setPosition }) {
  return (
    <div className="bikecard-slider-group bikecard-position-group">
      <div className="bikecard-slider-group-label">Position</div>
      {["X", "Y", "Z"].map((axis, i) => (
        <div key={axis} className="bikecard-slider-row">
          <span className="bikecard-slider-axis">{axis}:</span>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.01}
            value={position[i]}
            onChange={e => setPosition(i, Number(e.target.value))}
            className="bikecard-slider"
          />
          <span className="bikecard-slider-value">{position[i].toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
} 