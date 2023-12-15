import { Storage } from "@plasmohq/storage"
import _ from 'lodash';
import toast from "react-hot-toast"

const storage = new Storage()

export const defaultConfig = {
    rsshubDomain: 'https://rsshub.app',
    rsshubAccessControl: {
        enabled: false,
        accessKey: '',
        useCode: true,
    },
    notice: {
        badge: true,
    },
    submitto: {
        ttrss: false,
        ttrssDomain: '',
        checkchan: false,
        checkchanBase: '',
        miniflux: false,
        minifluxDomain: '',
        freshrss: false,
        freshrssDomain: '',
        nextcloudnews: false,
        nextcloudnewsDomain: '',
        feedly: false,
        inoreader: true,
        inoreaderDomain: 'https://www.inoreader.com',
        feedbin: false,
        feedbinDomain: 'https://feedbin.com',
        theoldreader: false,
        feedspub: false,
        bazqux: false,
        local: true,
    },
    refreshTimeout: 2 * 60 * 60,
    // typical UA:
    //   Firefox: Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0
    //   Chromium/Chrome: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36
    //   Some Chromium: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/80.0.3987.87 Chrome/80.0.3987.87 Safari/537.36
    //   Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 12_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15
    //   Edge: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/99.0.1150.36
    enableRemoteRules: navigator.userAgent.match(/firefox/i) || !(navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i)),
};

export async function getConfig() {
    return _.merge({}, defaultConfig, await storage.get("config")) as typeof defaultConfig;
}

export async function setConfig(config: Partial<typeof defaultConfig>) {
    config = _.merge({}, await getConfig(), config);
    if (!config.rsshubDomain) {
        config.rsshubDomain = defaultConfig.rsshubDomain;
    }
    config.rsshubDomain = config.rsshubDomain.replace(/\/$/, '');
    if (config.rsshubDomain === defaultConfig.rsshubDomain) {
        config.rsshubAccessControl.enabled = defaultConfig.rsshubAccessControl.enabled;
    }
    await storage.set("config", config)
    toast.success("Saved")
    return config;
}
