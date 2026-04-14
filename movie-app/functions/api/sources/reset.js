const DEFAULT_SOURCES = [
      { name: "⚡ 如意资源", api: "https://cj.rycjapi.com/api.php/provide/vod" },
      { name: "🌪️ 暴风资源", api: "https://bfzyapi.com/api.php/provide/vod" },
      { name: "🕊️ 天涯资源", api: "https://tyyszy.com/api.php/provide/vod" },
      { name: "🚀 非凡影视", api: "http://ffzy5.tv/api.php/provide/vod" },
      { name: "🌐 360资源", api: "https://360zy.com/api.php/provide/vod" }, 
      { name: "🥡 iqiyi资源", api: "https://www.iqiyizyapi.com/api.php/provide/vod" }, 
      { name: "🐉 卧龙资源", api: "https://wolongzyw.com/api.php/provide/vod" },
      { name: "⏱️ 极速资源", api: "https://jszyapi.com/api.php/provide/vod" },
      { name: "🌸 豆瓣资源", api: "https://dbzy.tv/api.php/provide/vod" }, 
      { name: "🌆 魔都资源", api: "https://www.mdzyapi.com/api.php/provide/vod" }, 
      { name: "📦 最大资源", api: "https://api.zuidapi.com/api.php/provide/vod" },
      { name: "8K影视", api: "https://www.8kvod.com/api.php/provide/vod" },
      { name: "飞速资源", api: "https://www.feisuzyapi.com/api.php/provide/vod" },
      { name: "量子资源", api: "https://cj.lziapi.com/api.php/provide/vod" },
      { name: "红牛资源", api: "https://www.hongniuzy.com/api.php/provide/vod" },
      { name: "光速资源", api: "https://api.guangsuapi.com/api.php/provide/vod" },
      { name: "快车资源", api: "https://caiji.kczyapi.com/api.php/provide/vod" },
      { name: "无尽资源", api: "https://api.wujinapi.me/api.php/provide/vod" }
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
