import { featuredProjects, featuredNumber } from "@/content/projects";
import { profile } from "@/content/profile";
import { Hero } from "@/components/Hero";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { IndexStage } from "@/components/IndexStage";
import { introScript } from "@/lib/intro";
import { InlineScript } from "@/components/InlineScript";
import { ProjectPlate } from "@/components/ProjectPlate";

export default function Home() {
  const total = featuredProjects.length;
  return (
    <section className="layer" aria-label="개요">
      <InlineScript html={introScript} />
      <IndexStage>
        <Hero />
        <ActivityTimeline />
        <div className="idx-rest">
          <div className="rest-head">
            <p className="eyebrow">SELECTED WORK · {String(total).padStart(2, "0")}</p>
            <h2 className="scene-title">Featured Projects</h2>
          </div>
          <div className="plates">
            {featuredProjects.map((p) => (
              <ProjectPlate key={p.slug} project={p} no={featuredNumber(p)!} total={total} />
            ))}
          </div>
          <div className="idx-foot" data-boot>
            <a className="mail" href={`mailto:${profile.contact.email}`}>
              {profile.contact.email}
            </a>
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a href={profile.contact.blog} target="_blank" rel="noopener noreferrer">
              velog ↗
            </a>
            <span>{profile.footNote}</span>
          </div>
        </div>
      </IndexStage>
    </section>
  );
}
