const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function withId(item) {
  if (!item || typeof item !== "object") return item;
  return {
    ...item,
    id: item.id || item._id
  };
}

function normalizeUser(user) {
  const normalized = withId(user);
  if (!normalized) return normalized;
  return {
    ...normalized,
    name: normalized.name || normalized.displayName || normalized.email
  };
}

function normalizeDailyEntry(entry) {
  const normalized = withId(entry);
  if (!normalized) return normalized;
  return {
    ...normalized,
    date: normalized.date || normalized.localDate
  };
}

function normalizeReality(reality) {
  const normalized = withId(reality);
  if (!normalized) return normalized;
  return {
    ...normalized,
    dailyEntryId: normalized.dailyEntryId || normalized.dailyEntryId,
    facts: (normalized.facts || []).map((fact) => (typeof fact === "string" ? fact : fact.text)).filter(Boolean)
  };
}

function normalizeVerification(verification) {
  return withId(verification);
}

function normalizeTrace(trace) {
  return withId(trace);
}

function normalizeTheme(theme) {
  return withId(theme);
}

function normalizeAuthResult(result) {
  return {
    ...result,
    user: normalizeUser(result.user)
  };
}

async function request(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Không thể kết nối tới máy chủ");
  }

  return data;
}

export const api = {
  register: async (payload) => {
    const result = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        displayName: payload.name,
        email: payload.email,
        password: payload.password
      })
    });
    return normalizeAuthResult(result);
  },
  login: async (payload) => {
    const result = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return normalizeAuthResult(result);
  },
  getToday: async (token) => {
    const result = await request("/daily/today", { token });
    return { dailyEntry: normalizeDailyEntry(result.dailyEntry || result.entry) };
  },
  saveDaily: async (token, payload) => {
    const result = await request("/daily", {
      token,
      method: "POST",
      body: JSON.stringify({
        localDate: payload.date,
        rawContent: payload.rawContent,
        status: payload.status
      })
    });
    return { dailyEntry: normalizeDailyEntry(result.dailyEntry || result.entry) };
  },
  updateDaily: async (token, id, payload) => {
    const result = await request(`/daily/${id}`, {
      token,
      method: "PUT",
      body: JSON.stringify({
        rawContent: payload.rawContent,
        status: payload.status
      })
    });
    return { dailyEntry: normalizeDailyEntry(result.dailyEntry || result.entry) };
  },
  saveReality: async (token, dailyId, payload) => {
    const result = await request(`/daily/${dailyId}/reality`, {
      token,
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { realityCheck: normalizeReality(result.realityCheck || result.reality) };
  },
  getReality: async (token, dailyId) => {
    const result = await request(`/daily/${dailyId}/reality`, { token });
    return { realityCheck: normalizeReality(result.realityCheck || result.reality) };
  },
  saveVerification: async (token, dailyId, payload) => {
    const result = await request(`/daily/${dailyId}/verification`, {
      token,
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { verification: normalizeVerification(result.verification) };
  },
  getVerification: async (token, dailyId) => {
    const result = await request(`/daily/${dailyId}/verification`, { token });
    const verification = result.verification || result.verifications?.[0] || null;
    return { verification: normalizeVerification(verification) };
  },
  saveAwarenessTrace: async (token, dailyId, payload) => {
    const result = await request(`/daily/${dailyId}/awareness-trace`, {
      token,
      method: "POST",
      body: JSON.stringify(payload)
    });
    return { awarenessTrace: normalizeTrace(result.awarenessTrace || result.trace) };
  },
  getTraces: async (token) => {
    const result = await request("/awareness-traces", { token });
    return { awarenessTraces: (result.awarenessTraces || result.items || []).map(normalizeTrace) };
  },
  getMap: async (token) => {
    const result = await request("/awareness-map", { token });
    return {
      themes: (result.themes || result.topThemes || []).map(normalizeTheme),
      timeline: (result.timeline || result.recentTraces || []).map(normalizeTrace)
    };
  },
  getTheme: async (token, themeId) => {
    const result = await request(`/themes/${themeId}`, { token });
    return {
      ...result,
      theme: normalizeTheme(result.theme),
      traces: (result.traces || []).map(normalizeTrace),
      dailyEntries: result.dailyEntries || [],
      verifications: result.verifications || []
    };
  }
};
