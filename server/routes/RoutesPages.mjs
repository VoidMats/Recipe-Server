import jsdom from "jsdom";
import fetch from "node-fetch";

export default async (fastify) => {

    fastify.post("/", async (request) => {
        const body = request.body;
        console.log(body);

        let html, doc, answer;
        try {
            const response = await fetch(request.body.url); 
            if (response.ok) {
                html = await response.text();
            }
        } catch(error) {
            console.log(error);
        }

        const dom = new jsdom.JSDOM(html);
        doc = dom.window.document;

        // From SVT

        // Default
    });

    // Private methods
    const _get = () => {

    }
}