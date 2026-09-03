import http from 'http'

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`GET ${url} -> Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}`)
      resolve(res.statusCode)
    }).on('error', (err) => {
      console.log(`GET ${url} -> Error: ${err.message}`)
      resolve(null)
    })
  })
}

async function run() {
  await checkUrl('http://127.0.0.1:5173/skins%20copo/rotulo_aurora_cafe_quadrado.jpg')
  await checkUrl('http://127.0.0.1:5173/skin.jpg')
  await checkUrl('http://127.0.0.1:5173/skin.png')
}

run()
