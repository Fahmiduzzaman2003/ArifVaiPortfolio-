import type { PublicationVisualStyle } from "@/types/content";

const labels: Record<PublicationVisualStyle, { eyebrow: string; title: string; code: string }> = {
  "cnn-pipeline": { eyebrow: "Convolutional inference", title: "Feature extraction pipeline", code: "CNN / 01" },
  "attention-fusion": { eyebrow: "Multi-stream architecture", title: "Attention-guided fusion", code: "FUSION / 02" },
  "vision-detection": { eyebrow: "Computer vision", title: "Detection and confidence field", code: "VISION / 03" },
};

function BannerHeader({ variant }: { variant: PublicationVisualStyle }) {
  const label = labels[variant];
  return <div className="research-banner-header"><div><span className="research-banner-signal" />{label.eyebrow}</div><span>{label.code}</span></div>;
}

function CnnPipeline() {
  return <div className="cnn-visual" aria-hidden="true">
    <div className="cnn-stage cnn-stage-input"><span className="cnn-stage-label">Input / RGB</span><div className="cnn-input-grid">{Array.from({ length: 36 }).map((_, index) => <i key={index} className={[7, 8, 13, 14, 15, 20, 21, 26, 27].includes(index) ? "hot" : ""} />)}</div><small>224 Ã— 224 Ã— 3</small></div>
    <div className="cnn-flow cnn-flow-one"><i /><i /><i /></div>
    <div className="cnn-stage cnn-stage-kernel"><span className="cnn-stage-label">Conv / 3Ã—3</span><div className="cnn-kernel-grid">{Array.from({ length: 9 }).map((_, index) => <i key={index} className={index === 4 ? "hot" : ""} />)}</div><small>ReLU + BN</small></div>
    <div className="cnn-flow cnn-flow-two"><i /><i /><i /></div>
    <div className="cnn-feature-stack"><span /><span /><span /><span /><b>64</b></div>
    <div className="cnn-classifier"><div className="cnn-node-column">{Array.from({ length: 5 }).map((_, index) => <i key={index} />)}</div><div className="cnn-node-column is-output">{Array.from({ length: 3 }).map((_, index) => <i key={index} />)}</div><span>Softmax</span></div>
    <div className="cnn-readout"><span>Feature depth</span><b>Ã—64</b><span>Confidence</span><b>98.4%</b></div>
  </div>;
}

function AttentionFusion() {
  const branches = [{ label: "Texture", values: [38, 72, 51, 84, 62] }, { label: "Shape", values: [70, 42, 88, 58, 76] }, { label: "Colour", values: [52, 81, 64, 45, 90] }];
  return <div className="fusion-visual" aria-hidden="true">
    <div className="fusion-branches">{branches.map((branch, branchIndex) => <div className="fusion-branch" key={branch.label}><span>0{branchIndex + 1}</span><div><strong>{branch.label}</strong><div className="fusion-wave">{branch.values.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div><b /></div>)}</div>
    <div className="fusion-routes"><i /><i /><i /></div>
    <div className="attention-core"><span className="attention-orbit orbit-one" /><span className="attention-orbit orbit-two" /><span className="attention-orbit orbit-three" /><div><small>Î±</small><strong>ATTN</strong><em>0.87</em></div></div>
    <div className="fusion-output"><span>Weighted features</span>{[86, 62, 74, 48].map((width, index) => <i key={index}><b style={{ width: `${width}%` }} /></i>)}<small>FUSED / 512-D</small></div>
    <div className="fusion-equation"><span>Q</span><b>Ã—</b><span>K</span><b>â†’</b><span>V</span></div>
  </div>;
}

function VisionDetection() {
  return <div className="vision-visual" aria-hidden="true">
    <div className="vision-frame"><div className="vision-object object-one"><span /></div><div className="vision-object object-two"><span /></div><div className="vision-object object-three"><span /></div><div className="vision-scanline" /><div className="vision-box box-one"><span>CLASS 07</span><b>.984</b></div><div className="vision-box box-two"><span>ROI 02</span><b>.916</b></div><div className="vision-crosshair"><i /><i /></div></div>
    <div className="vision-heatmap">{Array.from({ length: 48 }).map((_, index) => <i key={index} className={[10, 11, 17, 18, 19, 25, 26, 34].includes(index) ? "hot" : ""} />)}</div>
    <div className="vision-readout"><div><span>Objects</span><b>03</b></div><div><span>IoU</span><b>.92</b></div><div><span>FPS</span><b>48</b></div></div>
  </div>;
}

export function PublicationVisualBanner({ variant = "cnn-pipeline" }: { variant?: PublicationVisualStyle }) {
  const label = labels[variant];
  return <figure className={`publication-research-banner is-${variant}`} aria-label={label.title}>
    <BannerHeader variant={variant} />
    <div className="research-banner-body">{variant === "cnn-pipeline" ? <CnnPipeline /> : variant === "attention-fusion" ? <AttentionFusion /> : <VisionDetection />}</div>
    <figcaption><span>{label.title}</span><span>Live research schematic</span></figcaption>
  </figure>;
}

