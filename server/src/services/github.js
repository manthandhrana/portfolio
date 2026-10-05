import { env } from '../config/env.js';
import { HttpError } from '../middleware/error.js';
import Project from '../models/Project.js';

const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

const prettify = (name) =>
  name
    .replace(/[-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

async function fetchRepos(username) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-github-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (env.githubToken) headers.Authorization = `Bearer ${env.githubToken}`;

  const repos = [];
  for (let page = 1; page <= 5; page++) {
    const url = `https://api.github.com/users/${username}/repos?type=owner&sort=pushed&per_page=100&page=${page}`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (res.status === 404) throw new HttpError(404, `GitHub user "${username}" was not found.`);
    if (res.status === 403 || res.status === 429) {
      throw new HttpError(429, 'GitHub rate limit reached. Add GITHUB_TOKEN to server/.env or try again later.');
    }
    if (!res.ok) throw new HttpError(502, `GitHub API error (${res.status}).`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

/**
 * Imports public repos as projects. New repos are created; existing ones only get their
 * GitHub stats refreshed, so anything you edited in the admin panel is kept.
 */
export async function syncGithubProjects(username, { includeForks = false } = {}) {
  if (!USERNAME_RE.test(username || '')) throw new HttpError(400, 'Enter a valid GitHub username.');

  const repos = (await fetchRepos(username)).filter((repo) => includeForks || !repo.fork);
  let created = 0;
  let updated = 0;

  for (const repo of repos) {
    const github = {
      id: repo.id,
      fullName: repo.full_name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || '',
      topics: repo.topics || [],
      pushedAt: repo.pushed_at,
    };

    const existing =
      (await Project.findOne({ 'github.id': repo.id })) || (await Project.findOne({ githubUrl: repo.html_url }));

    if (existing) {
      existing.github = github;
      if (!existing.githubUrl) existing.githubUrl = repo.html_url;
      if (!existing.liveUrl && repo.homepage) existing.liveUrl = repo.homepage;
      if (!existing.summary && repo.description) existing.summary = repo.description.slice(0, 400);
      await existing.save();
      updated++;
    } else {
      await Project.create({
        title: prettify(repo.name),
        summary: (repo.description || '').slice(0, 400),
        category: 'Open Source',
        tech: [...new Set([repo.language, ...(repo.topics || [])].filter(Boolean))].slice(0, 8),
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || '',
        date: repo.created_at?.slice(0, 7) || '',
        source: 'github',
        github,
        visible: !repo.archived,
        featured: false,
        showInResume: false,
        order: 100,
      });
      created++;
    }
  }

  return { total: repos.length, created, updated };
}
