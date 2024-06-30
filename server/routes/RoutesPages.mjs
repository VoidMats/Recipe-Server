

export default async (fastify) => {

    fastify.post("/", async (request) => {
        const body = request.body;
        console.log(body);

        let html, doc, answer;
        try {
            const html = await fetch(request.body.url); 
        } catch(error) {
            console.log(error);
        }

        const parser = new DOMParser();
	    doc = parser.parseFromString(html, 'text/html');
        // From SVT

        // Default
    });

    // Private methods
    const _get = () => {

    }
}