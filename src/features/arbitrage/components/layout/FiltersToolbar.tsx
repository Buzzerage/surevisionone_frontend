"use client";

import React from "react";
import {
    FiFilter,
    FiRotateCw,
    FiChevronUp,
    FiChevronDown,
    FiArrowLeftRight,
} from "react-icons/fi";

interface SelectOption {
    value: string;
    label: string;
}

interface FiltersToolbarProps {
    bookmakerOptions: SelectOption[];
    selectedBookmaker: string;
    onBookmakerChange: (value: string) => void;
    minProfit: string;
    onMinProfitChange: (value: string) => void;
    betType: string;
    betTypeOptions: SelectOption[];
    onBetTypeChange: (value: string) => void;
    sortOption: string;
    sortOptions: SelectOption[];
    onSortOptionChange: (value: string) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
    bank: number;
    onBankChange: React.Dispatch<React.SetStateAction<number>>;
}

const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
    bookmakerOptions,
    selectedBookmaker,
    onBookmakerChange,
    minProfit,
    onMinProfitChange,
    betType,
    betTypeOptions,
    onBetTypeChange,
    sortOption,
    sortOptions,
    onSortOptionChange,
    onReset,
    hasActiveFilters,
    bank,
    onBankChange,
}) => {
    const handleStep = (direction: "up" | "down") => {
        const current = Number.parseFloat(minProfit.replace(",", "."));
        const baseValue = Number.isNaN(current) ? 0 : current;
        const delta = direction === "up" ? 0.1 : -0.1;
        const next = Math.min(100, Math.max(0, Number((baseValue + delta).toFixed(1))));
        onMinProfitChange(next.toFixed(1));
    };

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
        if (!event.shiftKey) {
            return;
        }
        event.preventDefault();
        handleStep(event.deltaY < 0 ? "up" : "down");
    };

    return (
        <section className="filters-toolbar" aria-label="Filtros avanzados">
            <header className="filters-toolbar__header">
                <div className="filters-toolbar__title">
                    <FiFilter aria-hidden="true" />
                    <span>Refinar resultados</span>
                </div>
                <button
                    type="button"
                    className="filters-toolbar__reset"
                    onClick={onReset}
                    disabled={!hasActiveFilters}
                >
                    <FiRotateCw aria-hidden="true" />
                    <span>Reiniciar filtros</span>
                </button>
            </header>

            <div className="filters-toolbar__body">
                <div className="filters-toolbar__grid">
                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-bookmaker" className="filters-toolbar__label">
                            Casa de apuesta
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-bookmaker"
                                value={selectedBookmaker}
                                onChange={(event) => onBookmakerChange(event.target.value)}
                            >
                                {bookmakerOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-profit" className="filters-toolbar__label">
                            Rentabilidad mínima (%)
                        </label>
                        <div className="filters-toolbar__control filters-toolbar__control--number">
                            <input
                                id="filter-profit"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="Ej. 2.5"
                                value={minProfit}
                                onChange={(event) => onMinProfitChange(event.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="filters-toolbar__steppers" role="group" aria-label="Ajustar rentabilidad mínima">
                                <button
                                    type="button"
                                    className="filters-toolbar__stepper-button"
                                    onClick={() => handleStep("up")}
                                    aria-label="Incrementar rentabilidad mínima"
                                >
                                    <FiChevronUp aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="filters-toolbar__stepper-button"
                                    onClick={() => handleStep("down")}
                                    aria-label="Reducir rentabilidad mínima"
                                >
                                    <FiChevronDown aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-bet-type" className="filters-toolbar__label">
                            Tipo de arbitraje
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-bet-type"
                                value={betType}
                                onChange={(event) => onBetTypeChange(event.target.value)}
                            >
                                {betTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-sort" className="filters-toolbar__label">
                            Ordenar por
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-sort"
                                value={sortOption}
                                onChange={(event) => onSortOptionChange(event.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="filters-toolbar__divider" aria-hidden="true" />

                <aside className="filters-toolbar__aside" aria-label="Gestión de capital">
                    <div className="filters-toolbar__aside-header">
                        <span className="filters-toolbar__aside-icon" aria-hidden>
                            💰
                        </span>
                        <div>
                            <h3>Capital disponible</h3>
                            <p>Usamos tu bank para calcular las apuestas sugeridas.</p>
                        </div>
                    </div>
                    <div className="filters-toolbar__bank-group">
                        <label htmlFor="filter-bank" className="filters-toolbar__label">
                            Capital (Bank)
                        </label>
                        <div className="filters-toolbar__bank-control">
                            <input
                                id="filter-bank"
                                type="number"
                                min={0}
                                step={10}
                                value={bank}
                                onChange={(event) =>
                                    onBankChange(
                                        Math.max(0, Number.parseFloat(event.target.value) || 0)
                                    )
                                }
                            />
                            <span aria-hidden>€</span>
                        </div>
                        <p className="filters-toolbar__bank-helper">
                            Ajusta este valor para adaptar el stake recomendado a tu capital.
                        </p>
                        <div className="filters-toolbar__bank-actions" role="group" aria-label="Ajustar capital">
                            <button
                                type="button"
                                onClick={() => onBankChange(Math.max(0, bank - 10))}
                                className="filters-toolbar__bank-button"
                            >
                                -10€
                            </button>
                            <button
                                type="button"
                                onClick={() => onBankChange(bank + 10)}
                                className="filters-toolbar__bank-button"
                            >
                                +10€
                            </button>
                            <button
                                type="button"
                                onClick={() => onBankChange(bank + 50)}
                                className="filters-toolbar__bank-button"
                            >
                                +50€
                            </button>
                            <button
                                type="button"
                                onClick={() => onBankChange(bank + 100)}
                                className="filters-toolbar__bank-button"
                            >
                                +100€
                            </button>
                        </div>
                        <div className="filters-toolbar__bank-summary">
                            <FiArrowLeftRight aria-hidden />
                            <span>
                                Combina los atajos rápidos con un valor manual para simular distintos escenarios de stake.
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default FiltersToolbar;
