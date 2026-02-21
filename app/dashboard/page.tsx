import { getAllProjectData, getGitLastCommitDate, type ProjectData } from '@/lib/projects';
import DashboardClient from './DashboardClient';

export default async function Dashboard() {
  const projects = getAllProjectData();

  const projectsWithDate = projects.map((p: ProjectData) => ({
    ...p,
    lastCommitDate: getGitLastCommitDate(p.repo),
  }));

  return (
    <DashboardClient
      projects={projectsWithDate}
      projectCount={projects.length}
    />
  );
}
