// Cloudflare Worker for WebNotes
// 使用 GitHub OAuth 和 GitHub API 存储笔记

export default {
    async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 获取请求来源
    const origin = request.headers.get('Origin');
    const referer = request.headers.get('Referer');
    
    // 允许的前端域名（GitHub Pages 的 Origin 只包含域名，不包含路径）
    const allowedDomain = 'https://buyuliang.github.io';
    const webNotesPath = '/webNotes';
    
    // 检查来源是否允许
    // GitHub Pages 的 Origin header 只包含域名，不包含路径
    // 所以我们需要检查 Origin 是否是 buyuliang.github.io
    // 同时可以通过 Referer 来确认是否来自 webNotes 路径
    let allowedOrigin = null;
    
    if (origin) {
      // 如果 Origin 是允许的域名
      if (origin === allowedDomain || origin === `${allowedDomain}${webNotesPath}`) {
        allowedOrigin = origin;
      } else if (origin.includes('webnotes.pages.dev')) {
        // 允许 Cloudflare Pages
        allowedOrigin = origin;
      } else if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
        // 允许环境变量配置的域名
        allowedOrigin = origin;
      }
    }
    
    // 如果没找到匹配的 Origin，但有 Referer 且来自 webNotes，也允许
    if (!allowedOrigin && referer && referer.includes('/webNotes')) {
      allowedOrigin = allowedDomain;
    }
    
    // 如果还是没有，使用默认值（但不用 *，因为需要 credentials）
    if (!allowedOrigin) {
      allowedOrigin = allowedDomain; // 默认使用允许的域名
    }

    // CORS 处理
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 认证相关路由
      if (path.startsWith('/auth/')) {
        return handleAuth(request, env, path, corsHeaders);
      }

      // API 路由
      if (path.startsWith('/api/')) {
        return handleAPI(request, env, path, corsHeaders);
      }

      // 默认响应
      return new Response('WebNotes API', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// 认证处理
async function handleAuth(request, env, path, corsHeaders) {
  const url = new URL(request.url);

  // 检查认证状态
  if (path === '/auth/check') {
    const session = await getSession(request, env);
    if (session && session.access_token) {
      const user = await getGitHubUser(session.access_token);
      return jsonResponse({ authenticated: true, user }, corsHeaders);
    }
    return jsonResponse({ authenticated: false }, corsHeaders);
  }

  // GitHub OAuth 登录
  if (path === '/auth/login') {
    const clientId = env.GITHUB_CLIENT_ID;
    const redirectUri = `${url.origin}/auth/callback`;
    const state = generateRandomString();
    
    // 保存 state 到 KV
    await env.SESSIONS.put(`state:${state}`, 'valid', { expirationTtl: 600 });
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state}`;
    return Response.redirect(authUrl);
  }

  // OAuth 回调
  if (path === '/auth/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // 获取前端 URL（用于重定向）
    // 优先使用环境变量配置的前端 URL，否则从 Referer 获取，最后使用 Worker 的 origin
    const frontendUrl = env.FRONTEND_URL || 
                       request.headers.get('Referer')?.split('?')[0] || 
                       url.origin;

    if (!code || !state) {
      return Response.redirect(`${frontendUrl}?error=invalid_callback`);
    }

    // 验证 state
    const validState = await env.SESSIONS.get(`state:${state}`);
    if (!validState) {
      return Response.redirect(`${frontendUrl}?error=invalid_state`);
    }

    // 删除 state
    await env.SESSIONS.delete(`state:${state}`);

    // 交换 access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return Response.redirect(`${frontendUrl}?error=token_error`);
    }

    const accessToken = tokenData.access_token;
    const user = await getGitHubUser(accessToken);

    // 创建 session
    const sessionId = generateRandomString();
    await env.SESSIONS.put(`session:${sessionId}`, JSON.stringify({
      access_token: accessToken,
      user: user,
      created_at: Date.now(),
    }), { expirationTtl: 86400 * 7 }); // 7 天过期

    // 设置 cookie 并重定向到前端网站
    const redirectUrl = `${frontendUrl}?session=${sessionId}`;
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${86400 * 7}`,
      },
    });
  }

  // 退出登录
  if (path === '/auth/logout' && request.method === 'POST') {
    const session = await getSession(request, env);
    if (session) {
      const sessionId = getSessionId(request);
      if (sessionId) {
        await env.SESSIONS.delete(`session:${sessionId}`);
      }
    }
    return jsonResponse({ success: true }, corsHeaders);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// API 处理
async function handleAPI(request, env, path, corsHeaders) {
  const session = await getSession(request, env);
  
  if (!session || !session.access_token) {
    return jsonResponse({ error: 'Unauthorized' }, corsHeaders, 401);
  }

  const accessToken = session.access_token;
  const repo = env.GITHUB_REPO || 'webNotes';
  const owner = session.user?.login || env.GITHUB_USERNAME;

  // 保存文档
  if (path === '/api/save-doc' && request.method === 'POST') {
    const { path: docPath, content } = await request.json();
    const filePath = docPath || 'docs/index.json';
    
    const fileContent = JSON.stringify({
      content: content,
      updated_at: new Date().toISOString(),
    }, null, 2);

    const result = await saveFileToGitHub(owner, repo, filePath, fileContent, accessToken);
    return jsonResponse(result, corsHeaders);
  }

  // 获取文档
  if (path === '/api/get-doc' && request.method === 'GET') {
    const url = new URL(request.url);
    const docPath = url.searchParams.get('path') || 'docs/index.json';
    
    const result = await getFileFromGitHub(owner, repo, docPath, accessToken);
    return jsonResponse(result, corsHeaders);
  }

  // 上传文件
  if (path === '/api/upload' && request.method === 'POST') {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return jsonResponse({ error: 'No file provided' }, corsHeaders, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    const fileName = `uploads/${Date.now()}-${file.name}`;
    const result = await saveFileToGitHub(owner, repo, fileName, base64Content, accessToken, true);
    
    // 构建文件 URL（使用 GitHub raw 链接）
    const fileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${fileName}`;
    
    return jsonResponse({ url: fileUrl, path: fileName }, corsHeaders);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// GitHub API 辅助函数
async function getGitHubUser(accessToken) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${accessToken}`,
      'User-Agent': 'WebNotes',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get GitHub user');
  }

  return await response.json();
}

async function getFileFromGitHub(owner, repo, path, accessToken) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'WebNotes',
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.encoding === 'base64' 
      ? JSON.parse(atob(data.content.replace(/\s/g, '')))
      : JSON.parse(data.content);

    return content;
  } catch (error) {
    console.error('Get file error:', error);
    return null;
  }
}

async function saveFileToGitHub(owner, repo, path, content, accessToken, isBase64 = false) {
  // 先获取文件 SHA（如果存在）
  let sha = null;
  try {
    const existingFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'WebNotes',
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (existingFile.ok) {
      const data = await existingFile.json();
      sha = data.sha;
    }
  } catch (error) {
    // 文件不存在，继续创建
  }

  // 准备内容
  const body = {
    message: `Update ${path}`,
    content: isBase64 ? content : btoa(unescape(encodeURIComponent(content))),
    branch: 'main',
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'WebNotes',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save file: ${error}`);
  }

  return await response.json();
}

// Session 管理
async function getSession(request, env) {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return null;
  }

  const sessionData = await env.SESSIONS.get(`session:${sessionId}`);
  if (!sessionData) {
    return null;
  }

  return JSON.parse(sessionData);
}

function getSessionId(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('session='));
  
  if (!sessionCookie) {
    return null;
  }

  return sessionCookie.split('=')[1];
}

// 工具函数
function generateRandomString() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function jsonResponse(data, corsHeaders, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
