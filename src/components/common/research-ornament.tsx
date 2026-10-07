type Variant = "neural" | "vision" | "fusion";

export type ResearchOrnamentVariant = Variant;

const labels: Record<Variant, { title: string; code: string; footer: string }> = {
  neural: { title: "Representation learning", code: "NN / 04", footer: "Input → latent features → evidence" },
  vision: { title: "Visual inference field", code: "CV / 07", footer: "Pixels → regions → prediction" },
  fusion: { title: "Attention fusion", code: "DL / 12", footer: "Parallel streams → weighted context" },
};

function NeuralNetwork() {
  const layers = [[70, 65, 105, 145, 185], [225, 48, 82, 116, 150, 184, 218], [385, 78, 128, 178, 218], [505, 105, 155, 205]] as const;
  return <svg viewBox="0 0 575 265" role="img" aria-label="A neural network transforming inputs into evidence">
    <g className="ornament-links">{layers.slice(0, -1).flatMap((layer, layerIndex) => { const next = layers[layerIndex + 1]; return layer.slice(1).flatMap((y, index) => next.slice(1).map((nextY, nextIndex) => <line key={`${layerIndex}-${index}-${nextIndex}`} x1={layer[0]} y1={y} x2={next[0]} y2={nextY} />)); })}</g>
    <path className="ornament-flow" d="M70 105 C165 105 135 150 225 150 S310 128 385 128 S450 155 505 155" />
    {layers.flatMap((layer, layerIndex) => layer.slice(1).map((y, index) => <circle key={`${layerIndex}-${index}`} className={(layerIndex + index) % 4 === 0 ? "ornament-node ornament-node-hot" : "ornament-node"} cx={layer[0]} cy={y} r={layerIndex === 1 ? 5 : 4} />))}
    <g className="ornament-axis"><text x="48" y="248">INPUT</text><text x="193" y="248">FEATURES</text><text x="355" y="248">LATENT</text><text x="476" y="248">EVIDENCE</text></g>
  </svg>;
}

function VisionField() {
  return <svg viewBox="0 0 575 265" role="img" aria-label="A computer vision field extracting regions and features">
    <defs><linearGradient id="vision-field-gradient" x1="0" x2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".03" /><stop offset="1" stopColor="currentColor" stopOpacity=".16" /></linearGradient></defs>
    <g className="ornament-patches">{Array.from({ length: 54 }).map((_, index) => { const col = index % 9; const row = Math.floor(index / 9); return <rect key={index} className={[12, 13, 21, 30, 31, 39].includes(index) ? "is-active" : ""} x={34 + col * 34} y={32 + row * 32} width="27" height="25" />; })}</g>
    <rect className="ornament-bbox" x="102" y="57" width="128" height="111" rx="3" />
    <path className="ornament-corner" d="M102 78V57h21M209 57h21v21M102 147v21h21M209 168h21v-21" />
    <path className="ornament-flow" d="M335 82 H395 C420 82 420 132 445 132 H522" />
    <circle className="ornament-ring" cx="395" cy="132" r="49" /><circle className="ornament-ring is-inner" cx="395" cy="132" r="27" /><circle className="ornament-node ornament-node-hot" cx="395" cy="132" r="5" />
    <path className="ornament-crosshair" d="M395 58v25M395 181v25M321 132h25M444 132h25" />
    <rect className="ornament-confidence" x="471" y="105" width="66" height="54" rx="3" /><text className="ornament-confidence-text" x="484" y="128">CLASS</text><text className="ornament-confidence-value" x="484" y="147">98.4</text>
    <line className="ornament-scan" x1="24" y1="28" x2="329" y2="28" />
  </svg>;
}

function AttentionFusion() {
  return <svg viewBox="0 0 575 265" role="img" aria-label="Multiple deep learning streams merging through attention">
    <g className="ornament-streams"><path d="M42 57 C155 57 170 117 282 132" /><path d="M42 132 H282" /><path d="M42 207 C155 207 170 147 282 132" /></g>
    {[57, 132, 207].map((y, index) => <g key={y}><rect className="ornament-stream-box" x="42" y={y - 17} width="92" height="34" rx="4" /><text className="ornament-stream-label" x="60" y={y + 4}>STREAM {String(index + 1).padStart(2, "0")}</text></g>)}
    <circle className="ornament-ring" cx="302" cy="132" r="66" /><circle className="ornament-ring is-inner" cx="302" cy="132" r="43" /><circle className="ornament-ring is-core" cx="302" cy="132" r="20" /><circle className="ornament-node ornament-node-hot" cx="302" cy="132" r="6" />
    <path className="ornament-flow" d="M308 132 C380 132 388 82 454 82 S500 132 538 132" />
    <g className="ornament-output"><rect x="441" y="61" width="88" height="43" rx="4" /><text x="461" y="79">ATTENTION</text><text x="461" y="94">WEIGHTED</text><rect x="461" y="151" width="68" height="5" rx="2" /><rect x="461" y="166" width="51" height="5" rx="2" /><rect x="461" y="181" width="36" height="5" rx="2" /></g>
  </svg>;
}

export function ResearchOrnament({ variant = "neural", compact = false, className = "" }: { variant?: Variant; compact?: boolean; className?: string }) {
  const content = variant === "vision" ? <VisionField /> : variant === "fusion" ? <AttentionFusion /> : <NeuralNetwork />;
  const copy = labels[variant];
  return <figure className={`research-ornament is-${variant} ${compact ? "is-compact" : ""} ${className}`} aria-label={copy.title}>
    {!compact && <div className="research-ornament-header"><span><i />{copy.title}</span><b>{copy.code}</b></div>}
    <div className="research-ornament-canvas" aria-hidden="true">{content}</div>
    {!compact && <figcaption><span>{copy.footer}</span><span>Research system trace</span></figcaption>}
  </figure>;
}
