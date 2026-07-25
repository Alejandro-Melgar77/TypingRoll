import './VirtualKeyboard.css';

interface Props {
  onKeyPress: (key: string) => void;
  showControls?: boolean;
}

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function VirtualKeyboard({ onKeyPress, showControls = false }: Props) {
  return (
    <div className="virtual-keyboard" aria-label="Teclado virtual">
      {rows.map((row) => (
        <div key={row.join('')} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className="keyboard-key" onClick={() => onKeyPress(key)}>{key}</button>
          ))}
        </div>
      ))}
      {showControls && (
        <div className="keyboard-row keyboard-controls">
          <button className="keyboard-key keyboard-key-wide" onClick={() => onKeyPress('Backspace')} aria-label="Borrar">⌫ Borrar</button>
          <button className="keyboard-key keyboard-key-wide is-enter" onClick={() => onKeyPress('Enter')}>Enter ↵</button>
        </div>
      )}
    </div>
  );
}
