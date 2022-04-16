import { getConfig } from './config';
import { defaultRules } from './radar-rules';

export function refreshRules(success) {
    getConfig((config) => {
        if (config.enableRemoteRules) {
            const done = (response) => {
                response.text().then((text) => {
                    chrome.storage.local.set({
                        rules: text,
                        rulesDate: +new Date(),
                    });
                    success && success();
                });
            };
            fetch('https://rsshub.js.org/build/radar-rules.js')
                .then((response) => {
                    done(response);
                })
                .catch(() => {
                    fetch('https://cdn.jsdelivr.net/gh/DIYgod/RSSHub@gh-pages/build/radar-rules.js').then((response) => {
                        done(response);
                    });
                });
        } else {
            success && success();
        }
    });
}

export function getRules(success) {
    getConfig((config) => {
        chrome.storage.local.get('rules', (result) => {
            if (result && result.rules) {
                success(result.rules);
            } else if (config.enableRemoteRules) {
                refreshRules(() => {
                    getRules(success);
                });
            } else {
                success(defaultRules);
            }
        });
    });
}

export function getRulesDate(success) {
    chrome.storage.local.get('rulesDate', (result) => {
        if (result && result.rulesDate) {
            success(result.rulesDate);
        } else {
            success(null);
        }
    });
}

export function updateRules(text, success) {
    chrome.storage.local.set({
        rules: text,
    });
    success && success();
}
