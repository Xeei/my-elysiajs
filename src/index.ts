import { Elysia } from 'elysia'
import { cron, Patterns } from '@elysiajs/cron'
import { Stream } from '@elysiajs/stream'
import { swagger } from '@elysiajs/swagger'
import { todo } from './routes/todo'
import { staticPlugin } from '@elysiajs/static'
const { API_VERSION } = Bun.env

const API_PORT = 3000

new Elysia({ prefix: `/${API_VERSION}` })
    // .use(
    //     cron({
    //         name: 'heartbeat',
    //         pattern: Patterns.everySenconds(5),
    //         run() {
    //             const time = new Date().toLocaleString('en-US', {
    //                 timeZone: 'Asia/Bangkok',
    //             })
    //             console.log('Heartbeat at', time)
    //         },
    //     })
    // )
    .use(staticPlugin({ assets: 'web', prefix: '' }))
    .use(
        swagger({
            documentation: {
                tags: [{ name: 'Test', description: 'testtetstet' }],
            },
        })
    )
    .onError(({ code, error, set }) => {
        return {
            code: code,
            message: error.message,
        }
        // if (code === 'NOT_FOUND')
        //     return new Response('Not Found :(', {
        //         status: 404,
        //     })
    })
    .use(todo)
    .get('/test_error', ({ set }) => {
        set.status = 500
        throw new Error('This is test error')
    })
    // .get('/', () => {
    //     return {
    //         message: 'Hello Elysia',
    //     }
    // })

    .get('/mapgis', () => Bun.file('web/index.html'))
    .get('/three-d', () => Bun.file('web/three-d.html'))

    // app.get(
    //     '/stop',
    //     ({
    //         store: {
    //             cron: { heartbeat },
    //         },
    //     }) => {
    //         heartbeat.stop()

    //         return {
    //             status: heartbeat.isRunning(),
    //         }
    //     }
    // )

    .get(
        '/stream',
        () =>
            new Stream(async (stream) => {
                stream.send('hello')

                await stream.wait(1000)
                stream.send('world')

                stream.close()
            })
    )
    .ws('/ws', {
        message(ws, message) {
            console.log(ws, message)
            ws.send(message + ' eieie')
        },
    })
    .listen(API_PORT, () => {
        console.log(
            `🦊 Elysia is running at http://localhost:${API_PORT}/${API_VERSION}`
        )
    })
