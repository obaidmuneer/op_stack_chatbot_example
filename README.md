
# OP Stack (Open AI + Pinecone) 

chat with your pdf
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`OPENAI_API_KEY`

`PINECONE_API_KEY`

`PINECONE_ENVIRONMENT`

`PINECONE_INDEX`

`PINECONE_NAMESPACE`
## Usage

Ingest your pdf

```javascript
    await ingest_pdf('obaidmuneer.pdf',1000,200) 
    // place your file in data folder , chunk_size, chunk_overlap

```
## Run Locally

Clone the project

```bash
  git clone https://github.com/obaidmuneer/op_stack_chatbot_example.git
```

Go to the project directory

```bash
  cd op_stack_chatbot_example
```

Install dependencies

```bash
  npm install
```

Start the app

```bash
  node app.mjs
```

