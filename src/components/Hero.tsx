import type { CSSProperties } from "react";
import { HEADLINE, profile } from "@/content/profile";
import { Emph, plain } from "./Emph";

/** 메인 첫 장면: 금속 이름 + 대문장 + 한 줄 소개. 움직임은 IndexStage가 붙인다. */
export function Hero() {
  const lines = HEADLINE.split("\n");
  return (
    <div className="hero">
      <div className="hero-in">
        <div className="idx-meta mono" data-boot>
          <span>INDEX / 00</span>
          <span>{profile.role.toUpperCase()}</span>
        </div>
        <div className="hair" data-hair aria-hidden="true" />
        <h1
          className="name"
          aria-label={profile.name}
          tabIndex={-1}
          style={{ "--n": Array.from(profile.name).length } as CSSProperties}
        >
          {Array.from(profile.name).map((ch, i) => (
            <span key={i} className="ch" aria-hidden="true" style={{ "--i": i } as CSSProperties}>
              {ch}
            </span>
          ))}
        </h1>
        <h2 className="headline" aria-label={plain(lines.join(" "))}>
          {lines.map((line, i) => (
            <span key={i} className="hl" aria-hidden="true">
              <span className="hl-in">
                <Emph text={line} />
              </span>
            </span>
          ))}
        </h2>
        <div className="lede-row">
          <p className="lede" data-boot>
            {profile.lede}
          </p>
          <span className="en" data-boot>
            {profile.nameEn}
          </span>
        </div>
        <div className="cue" data-boot>
          <button type="button" data-cue>
            <span className="tick" aria-hidden="true" />
            SCROLL ↓
          </button>
        </div>
      </div>
    </div>
  );
}
