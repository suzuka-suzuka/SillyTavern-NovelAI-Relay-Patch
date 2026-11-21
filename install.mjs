import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const releaseUrl = new URL('https://raw.githubusercontent.com/suzuka-suzuka/SillyTavern-NovelAI-Relay-Patch/main/');
const fullPatchName = 'sillytavern-1.19.1.patch';
const upgradePatchName = 'sillytavern-1.19.1-v5-upgrade.patch';

async function loadPatch(name) {
    const result = await fetch(new URL(name, releaseUrl), { signal: AbortSignal.timeout(20000) });
    if (!result.ok) throw new Error('下载 ' + name + ' 失败（HTTP ' + result.status + '）。');
    return result.text();
}

function gitApply(patch, ...flags) {
    const result = spawnSync('git', ['apply', ...flags, '-'], { input: patch, encoding: 'utf8' });
    if (result.error?.code === 'ENOENT') throw new Error('找不到 Git。请安装 Git 后重试。');
    if (result.error) throw result.error;
    return result;
}

function apply(patch, ...flags) {
    const result = gitApply(patch, ...flags);
    if (result.status !== 0) throw new Error(result.stderr.trim() || '应用补丁失败。');
}

async function run() {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length === 1 && args[0] !== '--remove')) {
        throw new Error('用法：node .nai-relay-install.mjs [--remove]');
    }

    const pkg = await readFile('package.json', 'utf8').catch(() => '');
    if (!pkg || JSON.parse(pkg).name !== 'sillytavern') {
        throw new Error('请在酒馆根目录（包含 server.js 的文件夹）运行此脚本。');
    }

    const full = await loadPatch(fullPatchName);
    const latestInstalled = gitApply(full, '--reverse', '--check').status === 0;
    if (args[0] === '--remove') {
        if (!latestInstalled) throw new Error('未找到可撤销的新版补丁，或酒馆源码与补丁不匹配。');
        apply(full, '--reverse');
        console.log('补丁已撤销。请重启酒馆。');
        return;
    }

    if (latestInstalled) {
        console.log('已经是最新版补丁。');
        return;
    }

    if (gitApply(full, '--check').status === 0) {
        apply(full);
    } else {
        const upgrade = await loadPatch(upgradePatchName);
        if (gitApply(upgrade, '--check').status !== 0) {
            throw new Error('补丁与当前酒馆源码不匹配。请确认使用的是 SillyTavern 1.19.1。');
        }
        apply(upgrade);
    }
    console.log('补丁已安装或更新。请重启酒馆并刷新浏览器。');
}

run().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
