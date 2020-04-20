import * as core from '@actions/core';
import { Dropbox, sharing } from 'dropbox';
import fetch from 'node-fetch';
import {v1 as uuidv1} from 'uuid';

// names of the input parameters
const INPUT_DROPBOX_API_KEY = 'dropbox-api-key';
const INPUT_DROPBOX_FILE_PATH = 'dropbox-file-path';
const OUTPUT_DROPBOX_LINK_PASSWORD = 'dropbox-link-password';
const OUTPUT_DROPBOX_LINK = 'dropbox-link';

async function run() {
    try {
        const dropboxAPIKey = core.getInput(INPUT_DROPBOX_API_KEY);
        let dropboxFilePath = core.getInput(INPUT_DROPBOX_FILE_PATH);
        let dropbox = new Dropbox({ accessToken: dropboxAPIKey, fetch });

        let requested_visibility: sharing.RequestedVisibility = {'.tag': 'password'};
        let link_password = uuidv1();
        let item = await dropbox.sharingCreateSharedLinkWithSettings({
            path: dropboxFilePath,
            settings: {
                link_password,
                requested_visibility
            }
        });
        
        core.setOutput(OUTPUT_DROPBOX_LINK, item.url);
        core.setOutput(OUTPUT_DROPBOX_LINK_PASSWORD, link_password);
    } catch(exception) {
        core.setFailed(exception);
    }
}

await run();