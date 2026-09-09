# Bazar do Bié — protótipo em HTML, CSS e JavaScript

Marketplace móvel do Bié: dezoito ecrãs numa só página, sem servidor nem dependências.
Abra `index.html` com duplo clique. Em ecrãs largos aparece dentro de uma moldura de
telemóvel; em telemóveis ocupa o ecrã todo.

```
bazar-do-bie/
├── index.html        os 18 ecrãs + sprite de ícones SVG
├── css/estilos.css   paleta, componentes e cada ecrã
└── js/app.js         dados de demonstração, navegação, carrinho, favoritos, formulários
```

## O que funciona
- Splash → boas-vindas → início (toque no splash para saltar)
- Categorias com pesquisa; listas com filtros; pesquisa no início (Enter)
- Detalhe do produto, favoritos (coração), carrinho com quantidades e remoção
- Finalizar compra: método de entrega altera o total; "Pagar agora" abre o acompanhamento
- Painel do comerciante, meus produtos (ativar/desativar, filtros), adicionar produto com validação
- Minha loja (seguir), perfil, notificações (marcar como lidas), criar conta, promoção, sobre

Os dados estão em `js/app.js` (`CATEGORIAS`, `PRODUTOS`, `NOTIFICACOES`) e podem ser
trocados por chamadas a uma API sem mexer no HTML.
# Bazar-do-BIE
