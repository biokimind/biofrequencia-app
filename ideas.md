# Brainstorm de Design - App de Biofrequências

## Três Abordagens Estilísticas

### 1. **Minimalismo Científico**
**Intro Breve:** Uma interface limpa e futurista que equilibra tecnologia com espiritualidade. Foco em dados, precisão e clareza.
**Probabilidade:** 0.08

### 2. **Wellness Orgânico**
**Intro Breve:** Design suave com curvas, cores naturais (azuis, verdes, violetas) e uma sensação acolhedora. Parece um aplicativo de meditação premium.
**Probabilidade:** 0.05

### 3. **Cyberpunk Vibracional**
**Intro Breve:** Interface ousada com gradientes neon, tipografia bold e animações dinâmicas. Transmite poder e transformação.
**Probabilidade:** 0.07

---

## Design Escolhido: **Wellness Orgânico**

### Design Movement
**Neomorphism + Soft Minimalism** — Uma evolução do design plano com sutileza, profundidade suave e formas arredondadas. Inspirado em aplicativos de bem-estar como Calm e Headspace.

### Core Principles
1. **Acessibilidade Emocional:** Cada elemento deve transmitir paz e confiança, nunca frieza ou complexidade.
2. **Hierarquia Intuitiva:** O fluxo principal (digitar frequência → gerar → ouvir) deve ser óbvio sem instruções.
3. **Feedback Imediato:** Cada ação do usuário recebe uma resposta visual/sonora para confirmar que funcionou.
4. **Espaço Respirável:** Muito whitespace, sem poluição visual. Cada elemento tem seu espaço.

### Color Philosophy
- **Primária:** Violeta suave (`#8B7FD8` ou `oklch(0.65 0.15 280)`) — Chakra Coronário, transmutação, espiritualidade.
- **Secundária:** Azul Turquesa (`#4ECDC4` ou `oklch(0.70 0.15 200)`) — Calma, comunicação, fluxo.
- **Acentos:** Dourado suave (`#D4AF37` ou `oklch(0.75 0.12 60)`) — Elevação, energia positiva.
- **Fundo:** Branco quase puro com um toque de azul muito claro (`oklch(0.99 0.001 220)`) — Limpo mas não frio.
- **Texto:** Cinza escuro profundo (`oklch(0.3 0.02 220)`) — Legível mas suave.

### Layout Paradigm
**Vertical Flow com Centralização Assimétrica:**
- Topo: Logo + Título ("Biofrequência Generator")
- Centro: Painel Principal (Input de frequência, Botões de Preset)
- Meio-Baixo: Visualizador de Onda (animado)
- Rodapé: Controles de Reprodução + Timer + Versão (Gratuita/Premium)

**Não é um grid centralizado chato** — o painel principal fica ligeiramente deslocado para a esquerda em telas grandes, criando assimetria visual.

### Signature Elements
1. **Onda Animada:** Uma representação visual da frequência sendo gerada, pulsando em tempo real.
2. **Botões Arredondados com Sombra Suave:** Neumorfismo — parecem "pressionáveis" mas elegantes.
3. **Gradiente Violeta-Azul:** Usado em fundos de cards e destaques, criando uma identidade visual única.

### Interaction Philosophy
- **Hover:** Botões ganham uma sombra mais profunda e mudam de cor levemente (mais vibrante).
- **Click:** Escala reduz para 0.95 (feedback tátil visual).
- **Feedback Sonoro:** Um "ping" suave quando a frequência é gerada (opcional, pode ser desativado).
- **Transições:** Todas as mudanças usam `ease-out` de 200-300ms para suavidade.

### Animation
- **Onda Geradora:** Oscila suavemente enquanto o áudio está tocando. Amplitude aumenta/diminui com o volume.
- **Entrada de Elementos:** Fade-in + slide-up de 400ms quando a página carrega.
- **Transição de Presets:** Quando o usuário clica em um preset, o número da frequência "flutua" para o campo de input.
- **Timer:** Conta regressiva com um efeito de "pulso" suave quando está próximo do fim (últimos 5 segundos).

### Typography System
- **Display (Títulos):** `Poppins Bold` (700) — Moderna, amigável, com personalidade.
- **Body (Descrições):** `Inter Regular` (400) — Legível, neutra, profissional.
- **Números (Frequência):** `IBM Plex Mono` (600) — Técnica, precisa, transmite confiança.
- **Hierarquia:**
  - H1: 32px, Poppins 700, Violeta primária
  - H2: 24px, Poppins 600, Violeta primária
  - Body: 16px, Inter 400, Cinza escuro
  - Label: 12px, Inter 500, Cinza médio

### Brand Essence
**"Harmonia na Palma da Mão"** — Um gerador de frequências que torna a terapia vibracional acessível, intuitiva e elegante para qualquer pessoa, em qualquer lugar.

**Personality Adjectives:** Sereno, Inovador, Confiável.

### Brand Voice
- **Headlines:** Diretas, inspiradoras, sem jargão técnico.
  - ✅ "Crie sua frequência perfeita"
  - ❌ "Sintetizador de Ondas Senoidais"
- **CTAs:** Convite suave, não agressivo.
  - ✅ "Gerar Frequência"
  - ❌ "Clique Aqui Agora!"
- **Microcopy:** Educativa, amigável.
  - ✅ "Deixe em branco para usar a sugestão"
  - ❌ "Campo obrigatório"

### Wordmark & Logo
**Conceito:** Um símbolo de **onda sinusoidal estilizada** que também parece uma **folha ou chama** — representando movimento, transformação e energia. Sem texto, apenas o símbolo em violeta gradiente para azul turquesa.

### Signature Brand Color
**Violeta Suave (`#8B7FD8`)** — Imediatamente reconhecível, ligada à espiritualidade e à transformação. Nenhum outro app de biofrequências usa essa cor de forma tão consistente.

---

## Resumo Visual
- **Paleta:** Violeta + Azul Turquesa + Dourado + Branco
- **Tipografia:** Poppins (títulos) + Inter (corpo) + IBM Plex Mono (números)
- **Formas:** Arredondadas, suaves, neumórficas
- **Espaço:** Amplo, respirável, não congestionado
- **Animações:** Suaves, propositais, nunca frenéticas
- **Tom:** Sereno, confiável, inovador
