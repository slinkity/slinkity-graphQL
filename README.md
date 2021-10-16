# slinkity-graphQL

`slinkity-graphQL` is a Slinkity starter project with GraphQL Yoga deployed as a serverless GraphQL API. The server is deployed on a Lambda handler via Netlify Functions.

Slinkity is a framework that uses Vite to bring dynamic, client side interactions to your static 11ty sites. It enables turning existing `.html` or `.liquid` files into `.jsx` files. Shortcodes can be used to insert components into existing pages such as, `{% react './path/to/component.jsx' %}`. Because component-driven pages are hydrated on the client, dynamic state management works in both development and production.

> *Slinkity is in early alpha and not recommended for production use. You can report issues or log bugs [here](https://github.com/Holben888/slinkity/issues).*

### Start development server

Start the [11ty dev server in `--watch` mode](https://www.11ty.dev/docs/usage/#re-run-eleventy-when-you-save) to listen for file changes and [a Vite server](https://vitejs.dev/guide/#index-html-and-project-root) pointed at your 11ty build.

```bash
npx slinkity --serve
```

Vite enables processing a range of file types including SASS and React.

```
[Info] Now serving on port 3000 🚀
[Info] Visit http://localhost:3000 in your favorite browser (that isn't IE 😉)

[11ty] Writing _site/index.html from ./index.md (liquid)
[11ty] Wrote 1 file in 0.07 seconds (v1.0.0-beta.2)
[11ty] Watching…
```

Open [localhost:3000](http://localhost:3000/) to view your site.

![01-slinkity-graphQL-with-react-shortcode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4hxoibk5wytll8fr24s9.png)

### Build for production

To create a production build, run the following command:

```bash
npx slinkity
```

Your new site will appear in the `_site` folder or [wherever you tell 11ty to build your site](https://www.11ty.dev/docs/config/#output-directory).

### `hello.jsx`

Your components will be included in a directory called `components` inside 11ty's [`_includes`](https://www.11ty.dev/docs/config/#directory-for-includes) directory.

```jsx
// _includes/components/hello.jsx

import React from "react"

const hello = () => {
  return (
    <>
      <span>hello darkness my old friend, I've come to talk with you again</span>
    </>
  )
}

export default hello
```

### `index.html`

```html
<h1>slinkity-graphQL</h1>

{% react 'components/hello' %}
```

### `netlify/functions/index.js`

```js
// netlify/functions/index.js

const { GraphQLServerLambda } = require('graphql-yoga')

const typeDefs = `type Query { hello: String }`
const resolvers = {
  Query: { hello: () => 'Hello from GraphQL Yoga (with a slinky) on Netlify!' }
}

const lambda = new GraphQLServerLambda({ typeDefs, resolvers })

exports.handler = lambda.handler
```

### Run test queries on GraphQL Yoga Netlify Locally

Start the development server with `netlify dev`.

```bash
netlify dev
```

Open [localhost:8888/.netlify/functions/index](http://localhost:8888/.netlify/functions/index/) and run the `hello` query.

```graphql
query HELLO_QUERY { hello }
```

![03-slinkity-graphQL-netlify-localhost-8888](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t4wi3r2h940v59dd8otj.png)

```bash
curl --request POST \
  --url http://localhost:8888/.netlify/functions/index \
  --header 'content-type: application/json' \
  --data '{"query":"{ hello }"}'
```

## TODO

### Deploy site to Netlify

Include `npx slinkity` for the build command and `_site` for the publish directory. The functions directory will be set automatically due to the `netlify/functions` directory structure.

```toml
[build]
  command = "npx slinkity"
  publish = "_site"
```

Connect repo to Netlify and create a custom domain name, [slinkity-graphQL.netlify.app](https://slinkity-graphQL.netlify.app/).

### Potential Query with Fetch API

```js
fetch('https://slinkity-graphQL.netlify.com/.netlify/functions/index', {
  method: 'POST',

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    query: `
      query HELLO_QUERY { hello }
    `
  })
})
.then(res => res.json())
.then(data => console.log(data.data))
```

### Potential Query with React and graphql-request

```jsx
import React from "react"
import { render } from "react-dom"
import { GraphQLClient, gql } from 'graphql-request'

async function main() {
  const endpoint = 'https://slinkity-graphQL.netlify.com/.netlify/functions/index'
  const graphQLClient = new GraphQLClient(endpoint)

  const HELLO_QUERY = gql`{ hello }`

  const data = await graphQLClient.request(HELLO_QUERY)
  console.log(JSON.stringify(data, undefined, 2))
}

main()

render(
  <React.StrictMode>
    <h1>graphql-request</h1>
  </React.StrictMode>,
  document.getElementById("root")
)
```
