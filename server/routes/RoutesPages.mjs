

export default async (fastify) => {

    
    fastify.post("/parse", async (request) => {
        const body = request.body;
        console.log(body);

        let html, answer;
        try {
            const response = await fetch(request.body.url); 
        } catch(error) {
            console.log(error);
        }

        // From SVT

        // Default
    })
}