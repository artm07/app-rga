// Envia a conversa para a IA. Tenta, nesta ordem:
// 1) o Claude do próprio claude.ai, quando o app roda como link publicado (capacidade "sample");
// 2) o servidor do projeto (server/server.mjs), se EXPO_PUBLIC_API_URL estiver definida.
// Sem nenhum dos dois, rejeita com { code: 'unavailable' }.
import { RULES, petContext } from './rules';

import { API_URL } from '../backend/remote';
const MAX_TURNS = 20; // só as últimas mensagens vão para a IA

let samplePromise;
function getSample() {
  if (!samplePromise) {
    const use = globalThis.claude?.use;
    samplePromise = typeof use === 'function' ? use('sample').catch(() => null) : Promise.resolve(null);
  }
  return samplePromise;
}

export async function isAiAvailable() {
  return Boolean(API_URL) || Boolean(await getSample());
}

// history: [{ de: 'eu' | 'bot', texto }] — termina na pergunta nova do usuário
export async function askAI(history, data, { onText, signal, token } = {}) {
  const turns = history.slice(-MAX_TURNS).map((m) => ({
    role: m.de === 'eu' ? 'user' : 'assistant',
    content: m.texto,
  }));
  // a lista precisa começar em "user": o turno de regras vem primeiro
  while (turns.length && turns[0].role !== 'user') turns.shift();

  const sample = await getSample();
  if (sample) {
    const rules = `${RULES}\n\nDados do pet do usuário:\n${petContext(data)}\n\nA conversa começa abaixo.`;
    const { text } = await sample([{ role: 'user', content: rules }, ...turns], {
      cache: false,
      modelTier: 'default',
      effort: 'low',
      signal,
      onText: onText ? ({ text: t }) => onText(t) : undefined,
    });
    return text;
  }

  if (API_URL) {
    let res;
    try {
      res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ messages: turns, context: petContext(data) }),
        signal,
      });
    } catch (e) {
      throw { code: signal?.aborted ? 'cancelled' : 'network' };
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.text) throw { code: body.code || 'upstream_error' };
    onText?.(body.text);
    return body.text;
  }

  throw { code: 'unavailable' };
}

// Mensagem amigável para cada erro
export function errorMessage(code) {
  switch (code) {
    case 'not_granted':
      return 'Preciso da sua permissão para usar a IA. Abra o menu de permissões do link e libere o uso do Claude.';
    case 'rate_limited':
      return 'Muitas perguntas seguidas! Espere um pouquinho e tente de novo.';
    case 'refused':
      return 'Não posso ajudar com isso. Pergunte algo sobre os cuidados com o seu pet!';
    case 'session_expired':
      return 'Sua sessão expirou. Entre de novo no claude.ai e tente outra vez.';
    case 'network':
      return 'Não consegui me conectar. Verifique a internet e tente de novo.';
    case 'unauthorized':
      return 'Sua sessão expirou. Saia e entre de novo para usar o assistente.';
    case 'unavailable':
      return 'A IA ainda não está ligada nesta versão do app. (Veja "Assistente com IA" no README.)';
    default:
      return 'Tive um probleminha para responder agora. Tente de novo em instantes.';
  }
}
