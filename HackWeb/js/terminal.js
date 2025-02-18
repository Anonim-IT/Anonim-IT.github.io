  // Инициализация терминала с помощью xterm.js
  const terminalContainer = document.getElementById('terminal');
  const terminal = new Terminal({
    cols: 80,   // Количество колонок
    rows: 24,   // Количество строк
    theme: {
      background: '#1e1e1e', // Темный фон
      foreground: '#f1f1f1'   // Светлый текст
    },
    cursorBlink: true, // П мигающий курсор
  });

  // Подключение к контейнеру и запуск терминала
  terminal.open(terminalContainer);
  terminal.write('Welcome to HackWeb Console!\r\n');

  // Функция для обработки команд
  function handleCommand(command) {
    switch (command.trim()) {
      case 'help':
        terminal.writeln('Available commands:');
        terminal.writeln('  help    - Show this help message');
        terminal.writeln('  clear   - Clear the console');
        terminal.writeln('  echo    - Repeat the input');
        break;
      case 'clear':
        terminal.clear();
        break;
      case 'echo':
        terminal.write('Enter a message after "echo": ');
        break;
      default:
        terminal.writeln('Unknown command: ' + command);
        break;
    }
  }

  // Обработка ввода команд
  terminal.onData(data => {
    if (data === '\r') { // Если нажата клавиша Enter
      const input = terminal.buffer.active.getLine(terminal.buffer.active.cursorY).translateToString().trim();
      terminal.write('\r\n');
      handleCommand(input);
    } else if (data === '\u0003') { // CTRL+C
      terminal.write('Use Ctrl+Q to quit.\r\n');
    } else {
      terminal.write(data);  // Эхо команды
    }
  });