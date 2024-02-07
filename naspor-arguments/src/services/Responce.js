const responses = new Map()

responses.set("404en", '{"ok":false,"msg":"Not Found"}')
responses.set("403en", '{"ok":false,"msg":"Forbidden"}')
responses.set("402en", '{"ok":false,"msg":"Payment Required"}')
responses.set("401en", '{"ok":false,"msg":"Unauthorized"}')
responses.set("400en", '{"ok":false,"msg":"Bad Request"}')

const Response = (ctx, code, body = null, lang = "en") => {
    ctx.status = code
    if (!body) ctx.body = responses.get(code + lang) || '{"ok":false,"msg":"Error ' + code + '"}'
    else {
        if (typeof body !== "object") body = { ok: code < 300, msg: body }

        ctx.body = body
    }
    return 0
}

module.exports = Response
