---

# README.md

```markdown
# SensorWatch 🌡⊙💧

SensorWatch é uma aplicação web de monitoramento, análise estatística e gerenciamento de alertas de telemetria industrial em tempo real. O sistema é capaz de processar dados vindos de sensores de **Temperatura**, **Pressão** e **Umidade**, avaliando dinamicamente o estado de conformidade operacional de cada dispositivo e gerando indicadores analíticos (médias industriais) através de gráficos interativos.

Este projeto foi desenvolvido com foco em arquitetura limpa, utilizando os paradigmas de **Programação Orientada a Objetos (POO)** e **Programação Funcional** nativos do JavaScript moderno (ES6+).

---

## 🚀 Funcionalidades Chave

- **Cadastro de Sensores:** Adição dinâmica de dispositivos com validação em tempo real e geração de ID alfanumérico único.
- **Gerenciamento de Status Autônomo:** Regras de negócio encapsuladas diretamente nos objetos para determinar estados de conformidade (`NORMAL` vs `CRÍTICO`).
- **Persistência de Dados Transparente:** Sincronização automática do estado da aplicação com o navegador do usuário, garantindo resiliência contra fechamentos acidentais.
- **Painel Analítico Industrial:** Agregação estatística de médias operacionais por categoria, renderizadas em um gráfico de barras dinâmico.
- **Interface Reativa:** Alertas visuais instantâneos baseados nas métricas de segurança industrial à medida que o usuário interage com o formulário.

---

## 🛠 Arquitetura e Engenharia de Software

### 1. Modelagem Baseada em Classes (POO)
O núcleo do sistema baseia-se na classe `Sensor`, que encapsula todos os dados e inteligência do dispositivo. 
- **Gerenciamento de Identidade:** Cada instância computa seu próprio ID único em tempo de execução através da combinação de carimbos de data/hora e aleatoriedade hexadecimal:
  ```js
  this.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

```

* **Validação por Getters:** O estado de severidade é exposto através do método reativo `get status()`, centralizando as seguintes regras de negócio industriais:

| Grandeza | Intervalo de Conformidade | Estado Crítico |
| --- | --- | --- |
| **Temperatura** | Valor $\le$ 50 °C | Valor > 50 °C |
| **Pressão** | Valor $\le$ 100 Bar | Valor > 100 Bar |
| **Umidade** | 30% $\le$ Valor $\le$ 80% | Valor < 30% ou Valor > 80% |

### 2. Estratégia de Persistência Local e Hidratação de Objetos

Para garantir que os dados sobrevivam a recarregamentos de página, a aplicação implementa um pipeline na **Web Storage API (LocalStorage)** sob a chave `"sensorwatch_dados"`:

* **Serialização (Escrita):** O estado atual é reduzido a uma string linear JSON via `JSON.stringify()` sempre que um elemento é inserido ou removido.
* **Desserialização com Hidratação (Leitura):** Como o `localStorage` descarta o protótipo e os métodos da classe ao salvar o dado como texto plano, o ciclo de inicialização (`DOMContentLoaded`) reidrata os dados utilizando a função funcional `.map()`. Isso reconstrói instâncias legítimas de `Sensor` preservando o ID e o carimbo de data/hora originais.

### 3. Otimização Estatística com `.reduce()` e `.filter()`

O cálculo de médias operacionais abandona os laços imperativos de alta verbosidade (`for`, `while`) e evita o uso de variáveis mutáveis globais de controle. A operação é processada em tempo de execução linear $O(n)$ através da composição de métodos declarativos encadeados:

```js
const filtrados = sensores.filter(s => s.tipo === cat);
const soma = filtrados.reduce((acc, s) => acc + s.valor, 0);
return parseFloat((soma / filtrados.length).toFixed(2));

```

O método `.filter()` realiza uma redução dimensional na massa de dados isolando a categoria desejada, enquanto o `.reduce()` atua como um acumulador numérico puro, minimizando o consumo de memória do navegador e blindando o escopo contra efeitos colaterais.

---

## 📦 Tecnologias Utilizadas

* **JavaScript (ES6+):** Lógica de negócios, manipulação avançada de arrays e controle de fluxo do DOM.
* **Chart.js:** Biblioteca externa para renderização rica do gráfico de médias industriais em elemento `<canvas>`.
* **HTML5 & CSS3:** Estruturação semântica e estilização modular (incluindo estados visuais dinâmicos para componentes em modo crítico).

---

## 📂 Estrutura do Projeto

```text
├── index.html          # Interface do usuário (UI) e estrutura do dashboard
├── css/
│   └── style.css       # Estilização conceitual, cards e componentes responsivos
└── js/
    └── app.js          # O código-fonte principal contendo a classe Sensor e lógica

```

---

## 🔧 Como Executar o Projeto

Como o projeto foi concebido utilizando JavaScript Vanilla (puro) e módulos nativos, ele **não necessita de compiladores ou gerenciadores de pacotes** (como npm ou yarn).

1. Clone este repositório para sua máquina local:
```bash
git clone [https://github.com/seu-usuario/sensorwatch.git](https://github.com/seu-usuario/sensorwatch.git)

```


2. Acesse o diretório do projeto:
```bash
cd sensorwatch

```

3. Abra o arquivo `index.html` diretamente em seu navegador de preferência ou utilize a extensão **Live Server** no VS Code para uma melhor experiência de desenvolvimento.

---

## 📝 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para obter mais detalhes.

```

```
