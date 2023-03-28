## Seus usuários devem ser capazes de:

- [] Veja o layout ideal para o aplicativo, dependendo do tamanho da tela do dispositivo
- [] Veja os estados de foco para todos os elementos interativos na página
- [] Criar, ler, atualizar e excluir quadros e tarefas
- [] Receba validações de formulário ao tentar criar/editar quadros e tarefas
- [] Marcar subtarefas como concluídas e mover tarefas entre colunas
- [] Ocultar/mostrar a barra lateral do quadro
- [] Alternar o tema entre os modos claro/escuro
- [] **Bônus**: permitir que os usuários arrastem e soltem tarefas para alterar seu status e reordená-las em uma coluna
- [] **Bônus**: Acompanhe todas as alterações, mesmo depois de atualizar o navegador (`localStorage` pode ser usado para isso se você não estiver criando um aplicativo full-stack)
- [] **Bônus**: crie este projeto como um aplicativo full-stack

Quer algum apoio no desafio? [Junte-se à nossa comunidade Slack](https://www.frontendmentor.io/slack) e faça perguntas no canal **#help**.

## Comportamento esperado

- Pranchas(Boards)
   - [] Clicar em diferentes quadros na barra lateral mudará para o quadro selecionado.
   - [] Clicar em "Criar novo quadro" na barra lateral abre o modal "Adicionar novo quadro".
   - [] Clicar no menu suspenso "Editar quadro" abre o modal "Editar quadro" onde os detalhes podem ser alterados.
   - [] As colunas são adicionadas e removidas para os modais Add/Edit Board.
   - [] Excluir um quadro exclui todas as colunas e tarefas e requer confirmação.
- Colunas
   - [] Um quadro precisa de pelo menos uma coluna antes que as tarefas possam ser adicionadas. Se não houver colunas, o botão "Adicionar nova tarefa" no cabeçalho será desativado.
   - [] Clicar em "Adicionar nova coluna" abre o modal "Editar quadro" onde as colunas são adicionadas.
- Tarefas
   - [] Adicionar uma nova tarefa a adiciona ao final da coluna relevante.
   - [] A atualização do status de uma tarefa moverá a tarefa para a coluna relevante. Se você estiver usando o bônus de arrastar e soltar, arrastar uma tarefa para uma coluna diferente também atualizará o status.