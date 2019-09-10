/* eslint-disable camelcase */ // github API convention
/* eslint-env node */
const exitWithError = err => {
		console.error('Error', err.stack);
		if (err.data) {
			console.error(err.data);
		}
		process.exit(1);
	},
	{ GITHUB_SHA, GITHUB_EVENT_PATH, GITHUB_TOKEN, GITHUB_WORKSPACE } = process.env;

if (GITHUB_TOKEN == null) {
	exitWithError(new Error('Missing Github token'));
}

const https = require('https'),
	request = (url, options) =>
		new Promise((resolve, reject) => {
			const req = https
				.request(url, options, res => {
					let data = '';
					res.on('data', chunk => {
						data += chunk;
					});
					res.on('end', () => {
						if (res.statusCode >= 400) {
							const err = new Error(`Received status code ${ res.statusCode }`);
							err.response = res;
							err.data = data;
							reject(err);
						} else {
							resolve({ res, data: JSON.parse(data) });
						}
					});
				})
				.on('error', reject);
			if (options.body) {
				req.end(JSON.stringify(options.body));
			} else {
				req.end();
			}
		}),
	event = require(GITHUB_EVENT_PATH),
	{ repository } = event,
	{ owner: { login: owner } } = repository,
	{ name: repo } = repository,
	checkName = 'ESLint check',
	headers = {
		'Content-Type': 'application/json',
		Accept: 'application/vnd.github.antiope-preview+json',
		Authorization: `Bearer ${ GITHUB_TOKEN }`,
		'User-Agent': 'eslint-action'
	},
	createCheck = async () => {
		const { data } = await request(`https://api.github.com/repos/${ owner }/${ repo }/check-runs`, {
			method: 'POST',
			headers,
			body: {
				name: checkName,
				head_sha: GITHUB_SHA,
				status: 'in_progress',
				started_at: (new Date()).toISOString()
			}
		});
		console.log('check create', data);
		return data.id;
	},
	eslint = () => {
		const eslint = require('eslint'),
			cli = new eslint.CLIEngine(),
			report = cli.executeOnFiles(['.']),
			// fixableErrorCount, fixableWarningCount are available too
			{ results, errorCount, warningCount } = report,
			levels = ['notice', 'warning', 'failure'];

		console.log('results', results);

		const annotations = results.reduce((annoList, result) => {
			const { filePath, messages } = result,
				path = filePath.substring(GITHUB_WORKSPACE.length + 1);
			return annoList.concat(messages.map(m => {
				console.log('msg', m);
				const singleLine = m.line === m.endLine;
				return {
					path,
					start_column: singleLine && m.column,
					end_column: singleLine && m.endColumn,
					start_line: m.line,
					end_line: m.endLine,
					annotation_level: levels[m.severity],
					// title: `${ path }#L${ m.line }`,
					message: `${ m.ruleId }: ${ m.message }`,
					raw_details: 'Nothing much'
				};
			}));
		}, []);

		return {
			conclusion: errorCount > 0 ? 'failure' : 'success',
			output: {
				title: checkName,
				summary: `${ errorCount } error(s), ${ warningCount } warning(s) found`,
				text: 'A little bit of text',
				annotations
			}
		};
	},
	updateCheck = async (id, conclusion, output) =>
		await request(`https://api.github.com/repos/${ owner }/${ repo }/check-runs/${ id }`, {
			method: 'PATCH',
			headers,
			body: {
				name: checkName,
				head_sha: GITHUB_SHA,
				status: 'completed',
				completed_at: (new Date()).toISOString(),
				conclusion,
				output
			}
		}),
	run = async () => {
		const id = await createCheck();
		try {
			const { conclusion, output } = eslint();
			console.log(conclusion, output);
			await updateCheck(id, conclusion, output);
			if (conclusion === 'failure') {
				process.exit(78);
			}
		} catch (err) {
			await updateCheck(id, 'failure');
			exitWithError(err);
		}
	};

console.log(event);

run().catch(exitWithError);
