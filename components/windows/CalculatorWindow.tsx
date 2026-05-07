"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import { WindowFrame } from "@/components/desktop/WindowFrame";
import type { NovaSystemActions, NovaSystemState } from "@/lib/nova-system";

type CalculatorWindowProps = {
  system: NovaSystemState;
  systemActions: NovaSystemActions;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
};

const keys = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

function calculate(left: number, right: number, op: string) {
  if (op === "+") return left + right;
  if (op === "-") return left - right;
  if (op === "×") return left * right;
  if (op === "÷") return right === 0 ? left : left / right;
  return right;
}

export function CalculatorWindow({ system, systemActions, onClose, onMinimize, onFocus }: CalculatorWindowProps) {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  function press(key: string) {
    if (/^\d$/.test(key)) {
      setDisplay((current) => (waiting || current === "0" ? key : current + key));
      setWaiting(false);
      return;
    }

    if (key === ".") {
      setDisplay((current) => (current.includes(".") ? current : `${current}.`));
      setWaiting(false);
      return;
    }

    if (key === "C") {
      setDisplay("0");
      setStored(null);
      setOperator(null);
      setWaiting(false);
      return;
    }

    if (key === "±") {
      setDisplay((current) => String(Number(current) * -1));
      return;
    }

    if (key === "%") {
      setDisplay((current) => String(Number(current) / 100));
      return;
    }

    if (["+", "-", "×", "÷"].includes(key)) {
      setStored(Number(display));
      setOperator(key);
      setWaiting(true);
      return;
    }

    if (key === "=" && operator && stored !== null) {
      const result = calculate(stored, Number(display), operator);
      const formatted = Number.isInteger(result) ? String(result) : result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
      setDisplay(formatted);
      setStored(null);
      setOperator(null);
      setWaiting(true);
      systemActions.recordCommand("Calculator result", `${stored} ${operator} ${display} = ${formatted}`);
    }
  }

  return (
    <WindowFrame
      title="Calculator"
      subtitle="Quick math"
      icon={<Calculator size={18} />}
      className="window--calculator"
      tone="dark"
      windowKey="calculator"
      windowSize={system.windowSizes.calculator}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      onResizeEnd={(size) => systemActions.setWindowSize("calculator", size)}
    >
      <div className="calculator-app">
        <div className="calculator-display" aria-label="Calculator display">
          <small>{operator && stored !== null ? `${stored} ${operator}` : "Nova Calculator"}</small>
          <strong>{display}</strong>
        </div>
        <div className="calculator-grid">
          {keys.map((key) => (
            <button className={key === "=" ? "equals" : ["+", "-", "×", "÷"].includes(key) ? "operator" : undefined} type="button" key={key} onClick={() => press(key)}>
              {key}
            </button>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
}
