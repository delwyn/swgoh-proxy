const Koa = require('koa')
const proxy = require('koa-proxy')
const router = require('./router')
const app = new Koa()
const PORT = process.env.PORT || 3000

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(
    proxy({
      host: 'https://swgoh.gg',
    }),
  )

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
