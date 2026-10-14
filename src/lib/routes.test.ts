import { describe, expect, it } from "vitest";
import { depthOf, normalizePath, parentOf, returnTargetSelector, transitionKind } from "./routes";

describe("routes", () => {
  it("normalizes trailing slashes, queries and hashes", () => {
    expect(normalizePath("/projects/")).toBe("/projects");
    expect(normalizePath("/projects/dirvana?x=1#a")).toBe("/projects/dirvana");
    expect(normalizePath("")).toBe("/");
  });

  it.each([
    ["/", 0],
    ["/projects", 1],
    ["/about", 1],
    ["/projects/dirvana", 2],
    ["/projects/dirvana/decisions/2", 3],
  ] as const)("depth of %s is %d", (path, depth) => {
    expect(depthOf(path)).toBe(depth);
  });

  it("walks up one level at a time", () => {
    expect(parentOf("/projects/nexo/decisions/1")).toBe("/projects/nexo");
    expect(parentOf("/projects/nexo")).toBe("/projects");
    expect(parentOf("/projects")).toBe("/");
    expect(parentOf("/about")).toBe("/");
  });

  it("picks the transition from the depth change", () => {
    expect(transitionKind("/", "/projects/wilson")).toBe("in");
    expect(transitionKind("/projects/wilson", "/projects")).toBe("out");
    expect(transitionKind("/projects/wilson", "/projects/nexo")).toBe("lateral");
    expect(transitionKind("/projects", "/about")).toBe("lateral");
  });

  it("finds the element to zoom back into", () => {
    expect(returnTargetSelector("/projects/dirvana", "/")).toBe('[data-plate="dirvana"]');
    expect(returnTargetSelector("/projects/dirvana", "/projects")).toBe('[data-row="dirvana"]');
    expect(returnTargetSelector("/projects/dirvana/decisions/3", "/projects/dirvana")).toBe('[data-dec="3"]');
    expect(returnTargetSelector("/projects/dirvana/decisions/3", "/projects/nexo")).toBeNull();
    expect(returnTargetSelector("/about", "/")).toBeNull();
  });
});
