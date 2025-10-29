"use client";

import React from "react";
import { FiFilter, FiRotateCw } from "react-icons/fi";

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
}) => {
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
                        />
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
        </section>
    );
};

export default FiltersToolbar;
