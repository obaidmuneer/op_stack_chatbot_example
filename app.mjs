import { chain, create_embedding, text_generator } from "./helper/openai.mjs";
import {
    query_vector,
    insert_single_vector,
    inser_multi_vectors,
    delete_vectors
} from "./helper/pinecone.mjs";
import inquirer from 'inquirer';

const askMan = () => {
    const ask = (query) => {
        inquirer
            .prompt([
                {
                    name: 'query',
                    message: query ?? "What you want to ask? to exit prompt enter 0 \n"
                }
            ])
            .then(async (answers) => {
                // console.log(answers.query);
                const msgs = await chain(answers.query)
                const ans = msgs.reverse()[0].content

                if (answers.query != 0) {
                    ask(`${ans} \n `)
                }
            })
    }
    ask()
}
(async () => {
    // https://github.com/mInzamamMalik/vector-database-hello-world/tree/main
    askMan()

    // ========= user's question
    // const text = "How do I book a flight" 

    // ========= create embedding
    // const res = await create_embedding(text)

    // ========= user's data embedding
    // const vectors = res.data.data[0].embedding 
    // console.log(vectors);

    // ========= user's orignal text
    // const userData = JSON.parse(res.config.data).input
    // console.log(userData); // parse user's data after embedding

    // ========= insert single vector
    // await insert_single_vector(vectors, text)

    // ========= ask your question 
    // const data = await query_vector(vectors, 2)
    // const context = data.map(d => d.metadata.text).join(" ")
    // console.log(context);
    // const res2 = await text_generator(context, text)
    // console.log(res2); // arr of msgs
    // ========= 

    // ========= insert multiple vectors to pinecone
    // await inser_multi_vectors()

    // =========  delete all vector or by ids pass ids in arr
    // await delete_vectors()
})()

