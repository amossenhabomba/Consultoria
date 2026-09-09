# Notas de arquitetura — AMS Consultoria

Este documento explica o que foi implementado agora, o que ficou como
placeholder honesto (sem dados inventados) e como evoluir o site no futuro
sem ter de o reescrever do zero.

## Estrutura atual dos ficheiros

```
ams-website/
  index.html   → toda a estrutura e conteúdo do site
  script.js    → toda a lógica interativa (diagnóstico, serviços, formulários, FAQ...)
  images/      → fotografias reais da AMS, como ficheiros separados (sem base64)
```

Um único ficheiro HTML + um ficheiro JS + uma pasta de imagens — fácil de
hospedar em qualquer servidor estático (Netlify, Vercel, GitHub Pages, ou o
próprio Hostgator/cPanel da AMS).

## O que está implementado e a funcionar

- Diagnóstico empresarial (4 etapas) com recomendação gerada por regras
  simples e explícitas (ver `mapNecessidadeParaServico` em `script.js`) —
  não usa IA nem inventa resultados, apenas cruza as respostas dadas.
- Serviços em formato Problema → Solução → Como funciona → Resultado.
- "Página" de detalhe para cada serviço (etapas, documentos, benefícios,
  FAQ, CTA) — implementada como navegação por JavaScript dentro da mesma
  página (não precisa de servidor/routing), mas com URL própria (`#servico-detalhe-...`).
- Agendamento de consulta (tipo, modalidade, data, hora, dados de contacto).
- Formulário de contacto em 4 etapas com resumo final e duas formas de
  envio (WhatsApp ou "Enviar pedido").
- FAQ em accordion, com respostas propositadamente genéricas onde não havia
  informação confirmada (prazos, preços) — fácil de editar no array `FAQS`
  em `script.js`.
- Recursos/Conhecimento com conteúdo informativo geral (não é aconselhamento
  jurídico) — array `RESOURCES` em `script.js`.
- Melhorias técnicas: meta description, Open Graph, favicon, `skip link`,
  `aria-expanded`/`aria-controls` no FAQ, foco visível em todos os
  elementos interativos, `alt` em todas as imagens, imagens carregadas como
  ficheiros (não base64).

## O que ficou marcado como placeholder (sem inventar dados)

- **Casos de sucesso**: estrutura pronta (Cliente → Problema → Serviço →
  Solução → Resultado), mas com texto "a publicar em breve", porque não
  recebi casos reais para incluir.
- **Testemunhos**: mesma lógica — cartões prontos, conteúdo real por
  adicionar.

Quando tiver estes conteúdos reais, basta substituir os `placeholder-card`
correspondentes em `index.html` por cartões com o conteúdo verdadeiro.

## Área do Cliente — arquitetura preparada, não implementada

Não implementei autenticação real (seria arriscado simular um login sem
um backend real por trás — pareceria funcional sem ser seguro). O que
existe hoje é uma secção "Área do Cliente (brevemente)" honesta, com um
botão desativado.

Quando quiser avançar, a evolução recomendada é:

1. **Backend/BD**: Supabase (Postgres + Auth + Storage prontos a usar).
2. **Tabela `pedidos`**: id, nome, empresa, telefone, email, serviço,
   necessidade, urgência, estado, criado_em.
3. **Estados do pedido** (já usados como referência no formulário):
   `Pedido recebido → Em análise → Documentos pendentes → Em processamento → Concluído`.
4. **Auth Supabase** (email/password ou OTP por telefone) para o cliente
   iniciar sessão e consultar apenas os seus próprios pedidos (Row Level
   Security por `user_id`).
5. As funções `submitLead()` e `scheduleAppointment()` em `script.js` já
   estão isoladas propositadamente — são o único sítio a alterar para
   passar de "simulação local" para uma chamada real à API do Supabase.

## Painel administrativo — arquitetura preparada, não implementada

Um painel administrativo é uma ferramenta interna, separada do site
público — não faz sentido construí-lo dentro do site institucional.
Recomendação: uma segunda aplicação (pode ser a mesma base React/Next.js)
ligada à mesma base de dados Supabase, mostrando:

- novos pedidos (tabela `pedidos`, ordenados por `criado_em`);
- filtros por serviço, prioridade e estado;
- origem do lead (formulário, diagnóstico ou agendamento — já é possível
  guardar esta origem como um campo extra ao gravar o pedido);
- reuniões agendadas (tabela `agendamentos`);
- métricas simples (pedidos por mês, por serviço).

## Evolução para React/Next.js

O HTML atual está organizado por secções e os dados (serviços, FAQ,
recursos) já estão isolados em arrays de JavaScript no topo de
`script.js` — isto foi propositado, para que a migração futura seja
sobretudo "copiar estes arrays para um ficheiro `data.ts`" e transformar
cada secção num componente. Não há nada nesta versão que dependa de
truques exclusivos de HTML estático (exceto o `location.hash` usado nas
"páginas" de serviço, que passaria a ser rotas reais do Next.js).

## O que não foi alterado

Mantive a identidade visual pedida: verde como cor principal, fundo
branco/verde-claro, cantos arredondados, sombras suaves, tipografia atual
e o logótipo da AMS. Não inventei preços, prazos legais, estatísticas,
nomes de clientes fictícios ou testemunhos.
