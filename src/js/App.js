"use strict";

import { Client } from "./Client";

try {
    const client = new Client();
    client.init();
    window.client = client;
} catch(e) {
    console.log(e);
    throw e;
}