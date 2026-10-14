import type { Metadata } from "next";
import { aboutActivities, type DatedItem } from "@/content/activities";
import { awards, education, stack, talks } from "@/content/about";
import { profile } from "@/content/profile";
import { DepthScene } from "@/components/DepthScene";

export const metadata: Metadata = {
  title: "About",
  description: "학력, 활동, 발표, 수상, 기술, 연락처.",
};

function Items({ items }: { items: DatedItem[] }) {
  return (
    <ul>
      {items.map((i) => (
        <li key={`${i.when}-${i.what}`}>
          <span className="when">{i.when}</span>
          <span className="what">
            {i.what}
            {i.sub && <span className="sub">{i.sub}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ablock" data-in>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <section className="layer" aria-label="소개">
      <DepthScene>
        <p className="eyebrow" data-in>
          ABOUT
        </p>
        <h1 className="lhead metal" data-in tabIndex={-1}>
          About
        </h1>
        <div className="ablocks">
          <Block title="학력">
            <Items items={education} />
          </Block>
          <Block title="활동">
            <Items items={aboutActivities} />
          </Block>
          <Block title="발표">
            <Items items={talks} />
          </Block>
          <Block title="수상">
            <Items items={awards} />
          </Block>
          <Block title="기술">
            <dl className="stack">
              {stack.map((s) => (
                <div key={s.level}>
                  <dt>{s.level}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
          </Block>
          <Block title="연락">
            <ul>
              <li>
                <span className="when">Email</span>
                <span className="what">
                  <a className="contact-mail" href={`mailto:${profile.contact.email}`}>
                    {profile.contact.email}
                  </a>
                </span>
              </li>
              <li>
                <span className="when">GitHub</span>
                <span className="what">
                  <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
                    github.com/hairyung2002 ↗
                  </a>
                </span>
              </li>
              <li>
                <span className="when">Blog</span>
                <span className="what">
                  <a href={profile.contact.blog} target="_blank" rel="noopener noreferrer">
                    velog.io/@hairyung2002 ↗
                  </a>
                </span>
              </li>
            </ul>
          </Block>
        </div>
      </DepthScene>
    </section>
  );
}
