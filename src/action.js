require('dotenv').config();
const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const message = core.getInput('message') || 'Thank you!';

  if ( typeof GITHUB_TOKEN !== 'string' ) {
    throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
  }

  const { context = {} } = github;
  const { pull_request } = context.payload;

  if ( !pull_request ) {
    throw new Error('Could not find pull request!')
  };

  console.log(`Found pull request: ${pull_request.number}`);

  const octokit = github.getOctokit(GITHUB_TOKEN)
    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_request.number,
      body: `${message}`
    });


}

run().catch(e => core.setFailed(e.message));
