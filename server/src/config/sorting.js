// Display order for each content type — shared by the public site, the admin lists and the PDF resume.
// Timelines (experience, education, research, certifications) follow dates; `order` only breaks ties.
export const SORT = {
  services: { order: 1, createdAt: 1 },
  skills: { order: 1, createdAt: 1 },
  testimonials: { order: 1, createdAt: 1 },
  projects: { featured: -1, order: 1, date: -1, createdAt: -1 },
  experience: { current: -1, startDate: -1, order: 1 },
  education: { current: -1, startDate: -1, order: 1 },
  research: { date: -1, order: 1 },
  certifications: { date: -1, order: 1 },
  resumes: { isDefault: -1, order: 1, createdAt: 1 },
};
