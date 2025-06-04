import { Elysia } from 'elysia'

const todo = new Elysia({ prefix: '/todo', detail: { tags: ['Test'] } }).get(
    '/',
    () => {
        return ['1', '2']
    }
)

export { todo }
