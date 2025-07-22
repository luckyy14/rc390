import '../../BikeCardControls.css';

export default function CameraSlider({ cameraZ, setCameraZ }) {
  return (
    <>
      <input
        type="range"
        min="2"
        max="30"
        step="0.1"
        value={cameraZ}
        onChange={e => setCameraZ(Number(e.target.value))}
        className="bikecard-slider bikecard-slider-camera"
      />
      <div className="bikecard-slider-label">Camera Z: {cameraZ.toFixed(2)}</div>
    </>
  );
} 