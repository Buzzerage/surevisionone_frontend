// src/components/ui/BankControl.tsx
import React from "react";

const BankControl = ({ bank, setBank }: { bank: number; setBank: (value: number) => void }) => (
    <div className="bank-control fade-in">
        <div className="bank-row">
            <div className="bank-label">
                <span aria-hidden>💰</span>
                <span>Capital (Bank):</span>
            </div>
            <div className="bank-wrapper" style={{ marginLeft: "auto" }}>
                <input
                    id="bankInput"
                    type="number"
                    min={0}
                    step={10}
                    value={bank}
                    onChange={(e) => setBank(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="bank-input"
                    aria-label="Capital disponible para apuestas"
                />
                <span className="bank-currency">€</span>
            </div>
        </div>
    </div>
);

export default BankControl;