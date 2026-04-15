const DEFAULT_SOURCES = [
    { name: "⚡ 如意资源", api: "https://cj.rycjapi.com/api.php/provide/vod" },
    { name: "🌪️ 暴风资源", api: "https://bfzyapi.com/api.php/provide/vod" },
    { name: "🕊️ 天涯资源", api: "https://tyyszy.com/api.php/provide/vod" },
    { name: "🚀 非凡影视", api: "http://ffzy5.tv/api.php/provide/vod" },
    { name: "🌐 360资源", api: "https://360zy.com/api.php/provide/vod" }
];

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequest({ request, env }) {
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    if (request.method === "POST") {
        await env.SOURCES.put("sources", JSON.stringify(DEFAULT_SOURCES));
        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
    
    return new Response("Method not allowed", { status: 405 });
}
