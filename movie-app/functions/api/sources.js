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
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequest({ request, env }) {
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    const getSources = async () => {
        try {
            const stored = await env.SOURCES.get("sources", "json");
            if (stored && Array.isArray(stored) && stored.length > 0) {
                return stored;
            }
        } catch(e) {}
        return [...DEFAULT_SOURCES];
    };
    
    const saveSources = async (sources) => {
        await env.SOURCES.put("sources", JSON.stringify(sources));
    };
    
    if (request.method === "GET") {
        const sources = await getSources();
        return new Response(JSON.stringify(sources), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
    
    if (request.method === "POST") {
        try {
            const { name, api } = await request.json();
            if (!name || !api || !api.startsWith("http")) {
                return new Response(JSON.stringify({ success: false, error: "参数错误" }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }
            const current = await getSources();
            if (current.some(s => s.name === name)) {
                return new Response(JSON.stringify({ success: false, error: "名称已存在" }), {
                    headers: { "Content-Type": "application/json", ...corsHeaders }
                });
            }
            current.push({ name, api });
            await saveSources(current);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        } catch(e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
    }
    
    if (request.method === "DELETE") {
        try {
            const { name } = await request.json();
            const current = await getSources();
            const filtered = current.filter(s => s.name !== name);
            await saveSources(filtered);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        } catch(e) {
            return new Response(JSON.stringify({ success: false, error: e.message }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
    }
    
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
}
