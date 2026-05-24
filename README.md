# RTS Motorsport - Console de Telemetria de Alta Performance

Desenvolvido exclusivamente na plataforma **Google AI Studio Build** (https://ai.studio/build), o **RTS Motorsport** é um console de engenharia e telemetria de pista em tempo real de nível profissional, projetado para monitorar, simular e ajustar dinamicamente o comportamento de superesportivos e carros de corrida icônicos em circuitos de alta velocidade. 

Com uma interface inspirada nos sistemas de telemetria da Fórmula 1 e do WEC (FIA World Endurance Championship), a aplicação combina ferramentas de análise gráfica de última geração com simulações interativas de dinâmica veicular diretamente no navegador.

---

## 🏎️ Principais Funcionalidades

### 1. Sistema Integrado de Telemetria (`#telemetry-charts-panel`)
* **Gráficos em Tempo Real com Recharts**: Curvas dinâmicas e precisas para Velocidade (km/h), Ângulo de Esterço (Steering Angle), Aceleração G-Force (Lateral/Longitudinal), Rotação do Motor (RPM) e Temperatura Geral.
* **Transições Fluídas**: Animações de atualização dos eixos, grades e linhas calculadas dinamicamente para maior legibilidade visual.
* **Responsividade Avançada**: Inteligência de margens e fontes autoadaptáveis para visualização límpida em smartphones, tablets e desktops de alta definição.
* **Filtros e Tabs Rápidas**: Alternância veloz entre parâmetros com recálculo inteligente e renderização isolada através de `React.useMemo` e `React.memo`.

### 2. Mapa Térmico e Contato dos Pneus (Eixos FR e RR)
* **Sensores de Temperatura por Camadas (TPMS)**: Divisão de contato banda fria, interna (inner), do meio (middle) e externa (outer), permitindo análise exata de desgaste sob calor agressivo de frenagem.
* **Controle Dinâmico Dianteiro (FR)**: Ajuste em tempo real do ângulo de convergência/camber dianteiro e definição de alvos de pressão para os pneus do eixo frontal.
* **Controle Dinâmico Traseiro (RR)**: Ajuste fino de camber e compensação de torque mecânico no eixo de tração traseiro.

### 3. Gerenciamento de Frota de Elite
* **Suporte a 8 Supereportivos Icônicos**: Escolha instantânea de bólidos lendários como:
  * RTS 911 GT3 RS, RTS 911 RSR Scuderia GTE, RTS 918 Spyder Hybrid Hypercar, RTS Taycan Turbo GT Evolution, e outros ícones da engenharia automobilística de competição.
* **Especificações Técnicas Milimétricas**: Exibição detalhada de potência ativa, aceleração (0-100), faixa útil de torque e tipo de propulsão.

### 4. Cabine Multimídia e Sequenciador de Áudio (`#cockpit-multimedia-hub`)
* **Música Digital Interativa**: Sintetizador de cabine com comutador de estilos (Synthwave, Techno, Cyberpunk, Brazilian Bass) para manter os pilotos focados na linha do traçado ideal.
* **Controles Rápidos**: Mapeamento rápido de volume, troca de faixas e indicadores visuais estéticos de pulso rítmico.

---

## 🛠️ Tecnologias Utilizadas

* **React 18** com **Vite** para desenvolvimento ultraveloz.
* **TypeScript** garantindo segurança contra bugs em tempo real.
* **Tailwind CSS** para estilização personalizada profissional com foco em estética industrial esportiva.
* **Recharts** para renderização inteligente de vetores SVG na tela de telemetria.
* **Lucide React** para iconografia técnica oficial de cockpit de corrida.

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
* **Node.js** (versão 18 ou superior recomendada)
* **npm** ou **yarn**

### Instalação de Dependências
Na raiz do projeto, instale as dependências executando:
```bash
npm install
```

### Modo de Desenvolvimento (Local)
Inicie o servidor de desenvolvimento local:
```bash
npm run dev
```
O console estará disponível por padrão no endereço http://localhost:3000.

### Compilação de Produção
Para gerar os arquivos otimizados e minificados para distribuição:
```bash
npm run build
```
Os arquivos finais estáticos serão criados no diretório `/dist`.

---

## 📐 Filosofia de Design e Engenharia

1. **Eficiência de Renderização**: Uso agressivo de memoização (`useMemo`, `useCallback` e `React.memo`) para evitar gargalos de re-render com simulações rodando a mais de 60 atualizações por segundo.
2. **Estética Industrial**: Combinação cuidadosa de tons de ardósia, azul cósmico e detalhes em carmim (#e01931) com fontes monoespaçadas legíveis que emulam o visual dos computadores de box de pista das equipes de fábrica.
