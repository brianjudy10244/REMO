import type { Item } from "@/lib/types";

type ProjectDetail = {
  slug: string;
  name: string;
  introduction: string | null;
  activities: string[];
  images: { src: string; alt: string; caption: string }[];
};

// Add confirmed project descriptions and images here as the team supplies them.
export const projectDetails: ProjectDetail[] = [
  { slug: "moodism", name: "무디즘", introduction: null, activities: [], images: [] },
  { slug: "pln", name: "PLN", introduction: null, activities: [], images: [] },
  { slug: "dataflow", name: "데이터플로우", introduction: null, activities: [], images: [] },
  { slug: "nowesa", name: "노웨사", introduction: null, activities: [], images: [] },
];

export function getProjectSlug(project: Item) {
  return projectDetails.find((detail) => detail.name === project.name)?.slug ?? project.id;
}

export function getProjectDetail(project: Item) {
  return projectDetails.find((detail) => detail.name === project.name);
}

export function getProjectHref(project: Item) {
  return `/projects/${encodeURIComponent(getProjectSlug(project))}`;
}
