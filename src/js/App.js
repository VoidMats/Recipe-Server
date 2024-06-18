"use strict";

import { Client } from "./Client";

let client;
try {
    client = new Client();
    client.init();
} catch(e) {
    console.log(e);
    throw e;
}