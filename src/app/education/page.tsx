import type { Metadata } from "next";
import { EducationTrajectory } from "@/components/education/education-trajectory";
import styles from "@/components/education/education-trajectory.module.css";
import { getEducation } from "@/services/public-content";

export const metadata: Metadata = { title: "Education" };

export default async function EducationPage() {
  const records = await getEducation();

  return <main className={`${styles.page} lab-section`}>
    <section className={styles.intro}>
      <div>
        <p className="lab-kicker">Academic foundation</p>
        <h1>Education,<br /><span>measured in context.</span></h1>
      </div>
      <aside className={styles.introNote}>
        <p>Three milestones, one comparable view. Each result is plotted against its own grading scale so SSC, HSC, and BSc can be read honestly side by side.</p>
        <div className={styles.legend} aria-label="Chart legend">
          <span><i /> Published numeric result</span>
          <span><i /> Record not yet published</span>
        </div>
      </aside>
    </section>
    <section className={styles.chartSection} aria-label="Education results">
      <div className={styles.chartInner}><EducationTrajectory records={records} /></div>
    </section>
  </main>;
}
