"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, GraduationCap, Scale, TrendingUp } from "lucide-react";
import styles from "./education-trajectory.module.css";

type StageKey = "ssc" | "hsc" | "bsc";

type EducationStage = {
  key: StageKey;
  shortLabel: string;
  fullLabel: string;
  record: Record<string, unknown> | null;
  result: number | null;
  scale: number | null;
  ratio: number | null;
  x: number;
  y: number;
};

type StairSegment = {
  id: string;
  kind: "plateau" | "connector";
  tone: StageKey;
  recorded: boolean;
  order: number;
  path: string;
};

type ChartScale = {
  min: number;
  max: number;
  ticks: number[];
};

const stageDefinitions: Array<Pick<EducationStage, "key" | "shortLabel" | "fullLabel">> = [
  { key: "ssc", shortLabel: "SSC", fullLabel: "Secondary School Certificate" },
  { key: "hsc", shortLabel: "HSC", fullLabel: "Higher Secondary Certificate" },
  { key: "bsc", shortLabel: "BSc", fullLabel: "Bachelor's degree" },
];

const chart = {
  width: 300,
  height: 130,
  top: 18,
  bottom: 84,
  missing: 101,
};

const motionEase = [0.22, 1, 0.36, 1] as const;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
}

function list(value: unknown) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function numberFrom(value: unknown) {
  const match = text(value).replace(/,/g, ".").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function keyForDegree(value: unknown): StageKey | null {
  const degree = text(value).toLowerCase().replace(/[._-]+/g, " ");
  if (/\bssc\b|secondary school|school certificate/.test(degree)) return "ssc";
  if (/\bhsc\b|higher secondary|intermediate/.test(degree)) return "hsc";
  if (/\bbsc\b|\bb sc\b|bachelor|undergraduate/.test(degree)) return "bsc";
  return null;
}

export function buildChartScale(stages: Array<Pick<EducationStage, "ratio">>): ChartScale {
  const values = stages.flatMap((stage) => stage.ratio === null ? [] : [stage.ratio * 100]);
  if (!values.length) return { min: 0, max: 100, ticks: [100, 75, 50, 25, 0] };

  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  let min = Math.max(0, Math.floor((lowest - 5) / 5) * 5);
  let max = Math.min(100, Math.ceil((highest + 2.5) / 5) * 5);

  if (max - min < 15) {
    min = Math.max(0, max - 15);
    if (max - min < 15) max = Math.min(100, min + 15);
  }

  const span = max - min;
  const step = span <= 20 ? 5 : span <= 40 ? 10 : 25;
  const ticks: number[] = [];
  for (let value = max; value >= min; value -= step) ticks.push(value);
  if (ticks.at(-1) !== min) ticks.push(min);
  return { min, max, ticks };
}

function yForRatio(ratio: number | null, scale: ChartScale) {
  if (ratio === null) return chart.missing;
  const percentage = ratio * 100;
  const position = (percentage - scale.min) / (scale.max - scale.min);
  return chart.bottom - position * (chart.bottom - chart.top);
}

export function buildEducationStages(records: Array<Record<string, unknown>>): EducationStage[] {
  const indexed = new Map<StageKey, Record<string, unknown>>();
  for (const record of records) {
    const key = keyForDegree(record.degree);
    if (key && !indexed.has(key)) indexed.set(key, record);
  }

  const bandWidth = chart.width / stageDefinitions.length;
  const stages = stageDefinitions.map((definition, index) => {
    const record = indexed.get(definition.key) ?? null;
    const result = numberFrom(record?.cgpa);
    const scale = numberFrom(record?.cgpaScale);
    const ratio = result !== null && scale !== null && scale > 0
      ? Math.min(1, Math.max(0, result / scale))
      : null;
    const x = bandWidth * (index + 0.5);
    return { ...definition, record, result, scale, ratio, x, y: chart.missing };
  });

  const scale = buildChartScale(stages);
  return stages.map((stage) => ({ ...stage, y: yForRatio(stage.ratio, scale) }));
}

export function buildStairSegments(stages: EducationStage[]): StairSegment[] {
  const bandWidth = chart.width / stages.length;
  const segments: StairSegment[] = [];

  stages.forEach((stage, index) => {
    const start = index === 0 ? 2 : index * bandWidth;
    const end = index === stages.length - 1 ? chart.width - 2 : (index + 1) * bandWidth;
    segments.push({
      id: `${stage.key}-plateau`,
      kind: "plateau",
      tone: stage.key,
      recorded: stage.ratio !== null,
      order: index * 2,
      path: `M ${start} ${stage.y} H ${end}`,
    });

    const next = stages[index + 1];
    if (next) {
      const boundary = (index + 1) * bandWidth;
      segments.push({
        id: `${stage.key}-${next.key}-connector`,
        kind: "connector",
        tone: next.key,
        recorded: stage.ratio !== null && next.ratio !== null,
        order: index * 2 + 1,
        path: `M ${boundary} ${stage.y} V ${next.y}`,
      });
    }
  });

  return segments;
}

function year(value: unknown) {
  const raw = text(value);
  if (!raw) return "";
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw.match(/\b\d{4}\b/)?.[0] ?? "" : String(parsed.getUTCFullYear());
}

function dateRange(record: Record<string, unknown>) {
  const start = year(record.startDate);
  const end = record.current ? "Present" : year(record.expectedCompletionDate);
  return [start, end].filter(Boolean).join(" - ") || "Dates not published";
}

function rawResult(stage: EducationStage) {
  if (!stage.record) return "Not published";
  const result = text(stage.record.cgpa);
  const scale = text(stage.record.cgpaScale);
  if (!result) return "Result not set";
  return scale ? `${result} / ${scale}` : result;
}

function scorePercent(stage: EducationStage) {
  return stage.ratio === null ? null : Math.round(stage.ratio * 1000) / 10;
}

function formattedPercent(stage: EducationStage) {
  const percentage = scorePercent(stage);
  if (percentage === null) return "N/P";
  return `${Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(1)}%`;
}

function resultParts(stage: EducationStage) {
  const raw = text(stage.record?.cgpa);
  const match = raw.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return { value: raw || "-", qualifier: "" };
  const qualifier = raw.slice((match.index ?? 0) + match[0].length).replace(/^[\s:/-]+/, "").trim();
  return { value: match[0], qualifier };
}

function changeBetween(from: EducationStage, to: EducationStage) {
  if (from.ratio === null || to.ratio === null) return null;
  return Math.round((to.ratio - from.ratio) * 1000) / 10;
}

function ResultChart({ stages, reducedMotion }: { stages: EducationStage[]; reducedMotion: boolean }) {
  const segments = buildStairSegments(stages);
  const scale = buildChartScale(stages);
  const changes = stages.slice(1).map((stage, index) => ({
    from: stages[index],
    to: stage,
    value: changeBetween(stages[index], stage),
    x: ((index + 1) * chart.width) / stages.length,
    y: (stages[index].y + stage.y) / 2,
  }));
  const description = [
    ...stages.map((stage) => `${stage.shortLabel}: ${rawResult(stage)}, normalized to ${formattedPercent(stage)}.`),
    ...changes.flatMap((change) => change.value === null ? [] : [`${change.from.shortLabel} to ${change.to.shortLabel}: ${change.value >= 0 ? "plus" : "minus"} ${Math.abs(change.value)} percentage points.`]),
  ].join(" ");

  return <div className={styles.plotShell}>
    <div className={styles.plotGuide} aria-hidden="true">
      <span>Zoomed Y-axis <b>{scale.min}% - {scale.max}%</b></span>
      <span>Higher normalized result <b>up</b></span>
    </div>
    <div
      className={styles.plotCanvas}
      role="img"
      aria-labelledby="education-plot-title education-plot-description"
    >
      <span id="education-plot-title" className={styles.srOnly}>SSC, HSC, and BSc result stair plot</span>
      <span id="education-plot-description" className={styles.srOnly}>
        {description} Vertical position represents each result divided by its grading scale.
      </span>

      <div className={styles.axisLabels} aria-hidden="true">
        {scale.ticks.map((value) => {
          const y = yForRatio(value / 100, scale);
          return <span key={value} style={{ top: `${(y / chart.height) * 100}%` }}>{value}%</span>;
        })}
        <span className={styles.unpublishedLabel} style={{ top: `${(chart.missing / chart.height) * 100}%` }}>N/P</span>
      </div>

      <svg
        className={styles.stairSvg}
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className={styles.stageAreas}>
          {stages.map((stage, index) => stage.ratio === null ? null : <rect
            key={stage.key}
            data-tone={stage.key}
            x={index * (chart.width / stages.length)}
            y={stage.y}
            width={chart.width / stages.length}
            height={Math.max(0, chart.bottom - stage.y)}
          />)}
        </g>
        <g className={styles.grid}>
          {scale.ticks.map((value) => {
            const y = yForRatio(value / 100, scale);
            return <line key={value} x1="0" y1={y} x2={chart.width} y2={y} />;
          })}
          {[100, 200].map((x) => <line key={x} className={styles.verticalGuide} x1={x} y1={chart.top} x2={x} y2={chart.missing} />)}
          <line className={styles.missingRail} x1="0" y1={chart.missing} x2={chart.width} y2={chart.missing} />
        </g>

        {segments.map((segment) => <g key={segment.id}>
          <path
            className={`${styles.stairSegment} ${segment.kind === "connector" ? styles.stairConnector : styles.stairPlateau}`}
            data-recorded={segment.recorded}
            data-tone={segment.tone}
            data-stair-segment={segment.kind}
            d={segment.path}
          />
          {!reducedMotion && segment.recorded && <motion.path
            className={styles.stairTrace}
            d={segment.path}
            initial={{ pathLength: 0, opacity: 0.9 }}
            whileInView={{ pathLength: 1, opacity: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.7, delay: segment.order * 0.1, ease: motionEase }}
          />}
        </g>)}
      </svg>

      {stages.map((stage, index) => {
        const recorded = stage.ratio !== null;
        return <div
          key={stage.key}
          className={styles.stageMarker}
          data-recorded={recorded}
          data-tone={stage.key}
          style={{ left: `${(stage.x / chart.width) * 100}%`, top: `${(stage.y / chart.height) * 100}%` }}
          aria-hidden="true"
        >
          <motion.div
            className={styles.markerMotion}
            initial={reducedMotion ? false : { scale: 0.76, y: 5 }}
            whileInView={{ scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : 0.18 + index * 0.2, ease: motionEase }}
          >
            <span className={styles.markerValue}>
              <b>{recorded ? formattedPercent(stage) : "N/P"}</b>
              <small>{recorded ? `${resultParts(stage).value} / ${text(stage.record?.cgpaScale)}` : "Not published"}</small>
            </span>
            <span className={styles.markerDot}><i /></span>
          </motion.div>
        </div>;
      })}

      {changes.map((change, index) => change.value === null ? null : <motion.div
        key={`${change.from.key}-${change.to.key}`}
        className={styles.deltaBadge}
        data-direction={change.value > 0 ? "up" : change.value < 0 ? "down" : "flat"}
        data-tone={change.to.key}
        style={{ left: `${(change.x / chart.width) * 100}%`, top: `${(change.y / chart.height) * 100}%` }}
        initial={reducedMotion ? false : { scale: 0.8, opacity: 0.35 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.34 + index * 0.2, ease: motionEase }}
        aria-hidden="true"
      >
        <b>{change.value > 0 ? "\u2191" : change.value < 0 ? "\u2193" : "\u2192"}</b>
        <span>{change.value > 0 ? "+" : ""}{change.value.toFixed(1)} pp</span>
      </motion.div>)}

      <div className={styles.stageAxis} aria-hidden="true">
        {stages.map((stage, index) => <span key={stage.key}><i>{String(index + 1).padStart(2, "0")}</i>{stage.shortLabel}</span>)}
      </div>
    </div>
  </div>;
}

function StageCard({ stage, index }: { stage: EducationStage; index: number }) {
  const record = stage.record;
  const percentage = scorePercent(stage);
  const result = resultParts(stage);
  const department = text(record?.department);
  const thesis = text(record?.thesisTitle);
  const affiliation = text(record?.affiliatedUniversity);
  const evidence = [...list(record?.academicHighlights), ...list(record?.relevantCoursework)].slice(0, 2);

  return <li className={`${styles.stageCard} ${record ? styles.hasRecord : styles.isMissing}`} data-stage={stage.key}>
    <div className={styles.cardRail}><span>{String(index + 1).padStart(2, "0")}</span><i /><b>{stage.shortLabel}</b></div>
    <div className={styles.cardStatus}>{record ? (record.current ? "Current" : "Published") : "Awaiting record"}</div>
    <div className={styles.score} aria-label={`${stage.shortLabel} result: ${rawResult(stage)}`}>
      <strong>{record ? result.value : "-"}</strong>
      <span>{record && text(record.cgpaScale) ? `/ ${text(record.cgpaScale)}` : "Result"}</span>
    </div>
    {result.qualifier && <p className={styles.resultQualifier}>{result.qualifier}</p>}
    <p className={styles.normalized}>{percentage === null ? "No numeric scale available" : `${percentage}% of grading scale`}</p>
    <div className={styles.cardCopy}>
      <h3>{record ? text(record.degree) || stage.fullLabel : stage.fullLabel}</h3>
      <p>{record ? text(record.institution) || "Institution not published" : "This stage has not been published yet."}</p>
    </div>
    <dl className={styles.facts}>
      <div><dt><CalendarDays size={13} /> Period</dt><dd>{record ? dateRange(record) : "-"}</dd></div>
      <div><dt><GraduationCap size={13} /> Focus</dt><dd>{department || affiliation || "-"}</dd></div>
      {thesis && <div><dt><TrendingUp size={13} /> Thesis</dt><dd>{thesis}</dd></div>}
      {evidence.map((item, evidenceIndex) => <div key={`${item}-${evidenceIndex}`}><dt><Scale size={13} /> {evidenceIndex ? "Coursework" : "Highlight"}</dt><dd>{item}</dd></div>)}
    </dl>
  </li>;
}

export function EducationTrajectory({ records }: { records: Array<Record<string, unknown>> }) {
  const reducedMotion = Boolean(useReducedMotion());
  const stages = buildEducationStages(records);
  const publishedCount = stages.filter((stage) => stage.record).length;

  return <figure className={styles.figure} aria-labelledby="education-chart-heading">
    <header className={styles.figureHeader}>
      <div><p>Academic results / normalized progress</p><h2 id="education-chart-heading">{"SSC \u2192 HSC \u2192 BSc"}</h2></div>
      <div className={styles.figureMeta}><span><i /> {publishedCount} / 3 records published</span><span>Result / scale</span></div>
    </header>
    <ResultChart stages={stages} reducedMotion={reducedMotion} />
    <ol className={styles.stageList}>{stages.map((stage, index) => <StageCard key={stage.key} stage={stage} index={index} />)}</ol>
    <figcaption>The focused Y-axis makes small differences readable without changing the data. Each score is divided by its own grading scale; connector labels show the change in percentage points.</figcaption>
  </figure>;
}
