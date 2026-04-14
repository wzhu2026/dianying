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

function parsePlay(raw) {
    if (!raw) return [];
    const eps = [];
    String(raw).split("$$$").forEach(line => {
        line.split("#").forEach(part => {
            const arr = part.split("$");
            if (arr.length >= 2 && arr[1]) eps.push({ name: arr[0] || "播放", url: arr[1] });
        });
    });
    return eps;
}

export async function onRequest({ request, env }) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }
    
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    
    try {
        const { keyword } = await request.json();
        if (!keyword) {
            return new Response(JSON.stringify({ results: [] }), {
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
        
        // 从 KV 读取源配置
        let sources = DEFAULT_SOURCES;
        try {
            const kvSources = await env.SOURCES.get("sources", "json");
            if (kvSources && Array.isArray(kvSources) && kvSources.length > 0) {
                sources = kvSources;
            }
        } catch(e) {}
        
        const results = [];
        
        // 并行请求所有影视源
        const promises = sources.map(async (src) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                const resp = await fetch(src.api + "?ac=detail&wd=" + encodeURIComponent(keyword), {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                const data = await resp.json();
                if (data.list && Array.isArray(data.list)) {
                    return data.list.map(m => ({
                        title: m.vod_name,
                        cover: m.vod_pic,
                        sourceName: src.name,
                        episodes: parsePlay(m.vod_play_url)
                    }));
                }
                return [];
            } catch(e) {
                console.error(`搜索源 ${src.name} 失败:`, e.message);
                return [];
            }
        });
        
        const allResults = await Promise.all(promises);
        allResults.forEach(r => results.push(...r));
        
        return new Response(JSON.stringify({ results }), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    } catch(e) {
        return new Response(JSON.stringify({ results: [], error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
}
